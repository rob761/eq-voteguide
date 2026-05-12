# Beastlord Guide — Community Voting App
## Complete Setup & Deployment Guide

---

## What you're building

A web app where readers of your EverQuest Beastlord guide can:
- Log in with their Discord account
- Hover over any sentence or section and rate it (💯 ✅ 😐 ❓ 👎 🚫)
- See everyone else's votes update in real time
- Leave a suggestion (posted anonymously to your Discord server) when they rate anything below 100

**Stack:** React frontend · Node.js/Express backend · Supabase database · Discord OAuth + webhook

---

## Part 1 — Create a Discord Application (for login)

1. Go to https://discord.com/developers/applications
2. Click **New Application** → name it something like "Beastlord Guide"
3. Go to **OAuth2** in the left sidebar
4. Under **Redirects**, click **Add Redirect** and enter:
   - For local dev: `http://localhost:3001/auth/discord/callback`
   - For production: `https://your-backend-url.com/auth/discord/callback`
   (Add both — you can have multiple)
5. Copy your **Client ID** and **Client Secret** from the OAuth2 page — you'll need these shortly

---

## Part 2 — Create a Discord Webhook (for suggestions)

1. Open your Discord server
2. Go to the channel where suggestions should be posted (e.g. #guide-suggestions)
3. Click the gear icon (Edit Channel) → **Integrations** → **Webhooks**
4. Click **New Webhook** → give it a name like "Guide Feedback"
5. Click **Copy Webhook URL** — save this

---

## Part 3 — Set up Supabase (free database + realtime)

1. Go to https://app.supabase.com and create a free account
2. Click **New Project** — choose a name, set a database password, pick a region
3. Once the project is ready, go to **SQL Editor** (left sidebar)
4. Paste the entire contents of `backend/supabase-schema.sql` and click **Run**
5. Then enable Realtime on the votes table:
   - Go to **Database** → **Replication** in the left sidebar
   - Find the `votes` table and toggle it on
6. Go to **Settings** → **API** and copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon public** key (safe to use in frontend)
   - **service_role** key (keep this secret — backend only)

---

## Part 4 — Configure environment variables

### Backend (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and fill in:

```
DISCORD_CLIENT_ID=         ← from Step 1
DISCORD_CLIENT_SECRET=     ← from Step 1
DISCORD_REDIRECT_URI=http://localhost:3001/auth/discord/callback
DISCORD_WEBHOOK_URL=       ← from Step 2
SUPABASE_URL=              ← from Step 3 (Project URL)
SUPABASE_SERVICE_KEY=      ← from Step 3 (service_role key)
SESSION_SECRET=            ← make up any long random string
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` to `frontend/.env` and fill in:

```
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=         ← from Step 3 (Project URL)
VITE_SUPABASE_ANON_KEY=    ← from Step 3 (anon public key)
```

---

## Part 5 — Run it locally

You need Node.js 18+ installed. Open two terminals.

**Terminal 1 — Backend:**
```bash
cd backend
npm install
npm run dev
```
You should see: `Server running on port 3001`

**Terminal 2 — Frontend:**
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173 in your browser.

Test the flow:
- Click "Sign in with Discord" — you should be redirected and back in seconds
- Hover over a sentence and click a rating
- Open a second browser tab — the vote should appear there in real time
- Rate something below 💯 — a suggestion box should appear
- Check your Discord channel — the suggestion should arrive as an embed

---

## Part 6 — Deploy to the internet (free)

The recommended free stack is **Railway** (backend) + **Vercel** (frontend).

### Deploy the backend to Railway

1. Go to https://railway.app and sign up (free tier available)
2. Click **New Project** → **Deploy from GitHub repo**
   - Push your project to GitHub first if you haven't: `git init && git add . && git commit -m "init"`
3. Select your repo, then select the `backend` folder as the root
4. Railway will detect Node.js automatically
5. Go to **Variables** in Railway and add all your backend `.env` values
   - Change `FRONTEND_URL` to your Vercel URL (you'll get this in the next step — come back)
   - Change `NODE_ENV` to `production`
   - Change `DISCORD_REDIRECT_URI` to `https://your-railway-url.railway.app/auth/discord/callback`
6. Railway gives you a URL like `https://eq-voteguide-backend.up.railway.app`
7. Add this redirect URI in the Discord Developer Portal (Step 1 → OAuth2 → Redirects)

### Deploy the frontend to Vercel

1. Go to https://vercel.com and sign up (free)
2. Click **Add New Project** → import your GitHub repo
3. Set the **Root Directory** to `frontend`
4. Under **Environment Variables**, add:
   - `VITE_API_URL` = your Railway backend URL (e.g. `https://eq-voteguide-backend.up.railway.app`)
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
5. Deploy — Vercel gives you a URL like `https://eq-voteguide.vercel.app`
6. Go back to Railway and update `FRONTEND_URL` to your Vercel URL
7. Also update `FRONTEND_URL` in your Discord app's OAuth2 allowed redirects

---

## Part 7 — Adding your Google Docs content

The guide content lives entirely in `frontend/src/docContent.js`.

To replace the placeholder text with your actual guide:
1. Open that file
2. Update `DOC_ID` to something like `'beastlord-guide-v2'`
3. Replace each section's `heading` and `sentences` array with your actual content
4. Break each paragraph into individual sentences — each becomes its own rateable unit

To add a second guide in future (e.g. a Ranger guide), add a new entry and build a simple route/selector in `App.jsx` to switch between them.

---

## Troubleshooting

**"Not authenticated" errors** — make sure `credentials: 'include'` is on all fetch calls and CORS is set to your exact frontend URL (no trailing slash).

**Votes not updating in real time** — confirm you enabled Realtime on the `votes` table in Supabase (Part 3, step 5).

**Discord webhook not posting** — check the webhook URL is correct and the channel still exists. The server logs any webhook errors without failing the vote.

**OAuth redirect mismatch** — the redirect URI in your `.env` must exactly match what's registered in the Discord Developer Portal, including `http` vs `https`.

---

## File structure reference

```
eq-voteguide/
├── backend/
│   ├── src/index.js          ← Express server (OAuth, votes, webhook)
│   ├── supabase-schema.sql   ← Run this once in Supabase SQL editor
│   ├── package.json
│   └── .env.example          ← Copy to .env and fill in
└── frontend/
    ├── src/
    │   ├── App.jsx            ← Main UI component
    │   ├── docContent.js      ← Your guide text lives here
    │   ├── supabase.js        ← Realtime client
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── .env.example           ← Copy to .env and fill in
```
