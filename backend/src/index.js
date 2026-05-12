import express from 'express';
import cors from 'cors';
import session from 'express-session';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }
}));

// ─── Auth middleware ───────────────────────────────────────────────────
function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
  next();
}

// ─── Discord OAuth ─────────────────────────────────────────────────────

// Step 1: redirect user to Discord
app.get('/auth/discord', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.DISCORD_CLIENT_ID,
    redirect_uri: process.env.DISCORD_REDIRECT_URI,
    response_type: 'code',
    scope: 'identify',
  });
  res.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
});

// Step 2: Discord redirects back here with a code
app.get('/auth/discord/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect(`${process.env.FRONTEND_URL}?error=no_code`);

  try {
    // Exchange code for access token
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.DISCORD_REDIRECT_URI,
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error('No access token');

    // Fetch Discord user info
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const discordUser = await userRes.json();

    // Upsert user into Supabase
    const { data: user } = await supabase
      .from('users')
      .upsert({
        discord_id: discordUser.id,
        username: discordUser.username,
        avatar: discordUser.avatar
          ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
          : null,
      }, { onConflict: 'discord_id' })
      .select()
      .single();

    req.session.user = { id: user.id, username: user.username, avatar: user.avatar };
    res.redirect(`${process.env.FRONTEND_URL}?login=success`);
  } catch (err) {
    console.error('OAuth error:', err);
    res.redirect(`${process.env.FRONTEND_URL}?error=oauth_failed`);
  }
});

app.get('/auth/me', (req, res) => {
  if (!req.session.user) return res.json({ user: null });
  res.json({ user: req.session.user });
});

app.post('/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

// ─── Votes ─────────────────────────────────────────────────────────────

// Get all votes for a document
app.get('/votes/:docId', async (req, res) => {
  const { docId } = req.params;
  const { data, error } = await supabase
    .from('votes')
    .select('target_key, score, user_id')
    .eq('doc_id', docId);

  if (error) return res.status(500).json({ error: error.message });

  // Group by target_key: return counts + averages, and current user's vote
  const grouped = {};
  for (const v of data) {
    if (!grouped[v.target_key]) grouped[v.target_key] = { scores: [], myVote: null };
    grouped[v.target_key].scores.push(v.score);
    if (req.session.user && v.user_id === req.session.user.id) {
      grouped[v.target_key].myVote = v.score;
    }
  }

  const result = {};
  for (const [key, val] of Object.entries(grouped)) {
    const avg = val.scores.reduce((a, b) => a + b, 0) / val.scores.length;
    result[key] = {
      count: val.scores.length,
      avg: Math.round(avg),
      myVote: val.myVote,
    };
  }
  res.json(result);
});

// Cast or update a vote
app.post('/votes', requireAuth, async (req, res) => {
  const { docId, targetKey, score } = req.body;
  const userId = req.session.user.id;

  if (![-100, 0, 25, 50, 75, 100].includes(score)) {
    return res.status(400).json({ error: 'Invalid score' });
  }

  const { error } = await supabase
    .from('votes')
    .upsert({
      doc_id: docId,
      target_key: targetKey,
      user_id: userId,
      score,
    }, { onConflict: 'doc_id,target_key,user_id' });

  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ─── Suggestions ───────────────────────────────────────────────────────

app.post('/suggestions', requireAuth, async (req, res) => {
  const { docId, targetKey, targetText, score, suggestion } = req.body;

  if (!suggestion || suggestion.trim().length < 3) {
    return res.status(400).json({ error: 'Suggestion too short' });
  }

  // Save to DB
  await supabase.from('suggestions').insert({
    doc_id: docId,
    target_key: targetKey,
    user_id: req.session.user.id,
    score,
    suggestion: suggestion.trim(),
  });

  // Post to Discord webhook anonymously
  const scoreEmoji = {
    75: '✅', 50: '😐', 25: '❓', 0: '👎', '-100': '🚫'
  }[String(score)] || '❓';

  const webhookPayload = {
    username: 'Beastlord Guide Feedback',
    avatar_url: 'https://cdn.discordapp.com/embed/avatars/0.png',
    embeds: [{
      title: `${scoreEmoji} New suggestion — score: ${score}`,
      color: score >= 50 ? 0xf0a500 : score >= 0 ? 0xe67e22 : 0xe74c3c,
      fields: [
        {
          name: 'Rated section',
          value: targetText.length > 200 ? targetText.slice(0, 200) + '…' : targetText,
        },
        {
          name: 'Suggestion',
          value: suggestion.trim(),
        },
      ],
      footer: { text: 'Submitted anonymously via the Beastlord Guide' },
      timestamp: new Date().toISOString(),
    }],
  };

  try {
    await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(webhookPayload),
    });
  } catch (err) {
    console.error('Webhook error:', err);
    // Don't fail the request if webhook fails
  }

  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
