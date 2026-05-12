import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from './supabase.js';
import { DOC, DOC_ID } from './docContent.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const VOTES = [
  { score: 100,  emoji: '💯', label: '100',  title: 'Fully agree' },
  { score: 75,   emoji: '✅', label: '75',   title: 'Mostly agree' },
  { score: 50,   emoji: '😐', label: '50',   title: 'Mixed' },
  { score: 25,   emoji: '❓', label: '25',   title: 'Doubtful' },
  { score: 0,    emoji: '👎', label: '0',    title: 'Disagree' },
  { score: -100, emoji: '🚫', label: '-100', title: 'Strongly object' },
];

function scoreColor(avg) {
  if (avg === null || avg === undefined) return 'var(--text-dim)';
  if (avg >= 75) return 'var(--green)';
  if (avg >= 50) return 'var(--gold)';
  if (avg >= 25) return 'var(--amber)';
  return 'var(--red)';
}

function scoreBg(avg) {
  if (avg === null || avg === undefined) return 'transparent';
  if (avg >= 75) return 'var(--green-dim)';
  if (avg >= 50) return 'var(--gold-dim)';
  if (avg >= 25) return 'var(--amber-dim)';
  return 'var(--red-dim)';
}

function VotePill({ voteData }) {
  if (!voteData || voteData.count === 0) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 12, fontFamily: 'monospace',
      background: scoreBg(voteData.avg),
      color: scoreColor(voteData.avg),
      border: `1px solid ${scoreColor(voteData.avg)}44`,
      borderRadius: 99, padding: '1px 8px', marginLeft: 6,
      verticalAlign: 'middle', transition: 'all 0.2s',
    }}>
      {voteData.avg} <span style={{ opacity: 0.6 }}>({voteData.count})</span>
    </span>
  );
}

function SuggestionModal({ targetKey, targetText, score, onSubmit, onClose }) {
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const ta = useRef(null);

  useEffect(() => { ta.current?.focus(); }, []);

  const scoreInfo = VOTES.find(v => v.score === score);

  async function submit() {
    if (text.trim().length < 3) return;
    setSending(true);
    await onSubmit(targetKey, targetText, score, text.trim());
    setDone(true);
    setTimeout(onClose, 1200);
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border-bright)',
        borderRadius: 12, padding: '28px 28px 24px',
        maxWidth: 520, width: '100%',
        animation: 'fadeUp 0.2s ease',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 4 }}>
              You rated this {scoreInfo?.emoji} {scoreInfo?.label}
            </div>
            <h3 style={{ fontFamily: 'Cinzel', fontSize: 16, color: 'var(--gold-light)', fontWeight: 400 }}>
              What would you change?
            </h3>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: 'var(--text-dim)',
            fontSize: 20, cursor: 'pointer', lineHeight: 1, padding: '0 4px',
          }}>×</button>
        </div>

        <div style={{
          fontSize: 13, color: 'var(--text-dim)', fontStyle: 'italic',
          background: 'var(--bg3)', borderRadius: 6, padding: '8px 12px', marginBottom: 16,
          borderLeft: '2px solid var(--border-bright)',
        }}>
          "{targetText.length > 120 ? targetText.slice(0, 120) + '…' : targetText}"
        </div>

        {done ? (
          <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--green)', fontSize: 15 }}>
            ✓ Suggestion sent to the Den — thank you!
          </div>
        ) : (
          <>
            <textarea
              ref={ta}
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Describe what's incorrect or how it could be improved..."
              rows={4}
              style={{
                width: '100%', resize: 'vertical',
                background: 'var(--bg3)', color: 'var(--text)',
                border: '1px solid var(--border)',
                borderRadius: 6, padding: '10px 12px',
                fontFamily: 'Crimson Pro, serif', fontSize: 15,
                outline: 'none', lineHeight: 1.6,
              }}
              onFocus={e => e.target.style.borderColor = 'var(--border-bright)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                Posted anonymously to the Beastlord's Den Discord
              </span>
              <button
                onClick={submit}
                disabled={text.trim().length < 3 || sending}
                style={{
                  background: text.trim().length >= 3 ? 'var(--gold-dim)' : 'transparent',
                  color: text.trim().length >= 3 ? 'var(--gold-light)' : 'var(--text-dim)',
                  border: '1px solid var(--border-bright)',
                  borderRadius: 6, padding: '7px 20px',
                  fontFamily: 'Cinzel', fontSize: 13, cursor: text.trim().length >= 3 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s',
                }}
              >
                {sending ? 'Sending…' : 'Submit'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function VotePopup({ targetKey, targetText, targetType, position, voteData, onVote, onClose }) {
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const myVote = voteData?.myVote;

  return (
    <div ref={ref} style={{
      position: 'fixed',
      top: position.y,
      left: Math.min(position.x, window.innerWidth - 360),
      zIndex: 900,
      background: 'var(--bg2)',
      border: '1px solid var(--border-bright)',
      borderRadius: 10, padding: '10px 12px',
      animation: 'fadeUp 0.15s ease',
      minWidth: 320,
    }}>
      <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 8 }}>
        Rate this {targetType}
        {voteData?.count > 0 && (
          <span style={{ marginLeft: 8, color: scoreColor(voteData.avg) }}>
            avg {voteData.avg} · {voteData.count} vote{voteData.count !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {VOTES.map(v => (
          <button
            key={v.score}
            onClick={() => onVote(targetKey, targetText, v.score)}
            title={v.title}
            style={{
              flex: 1, cursor: 'pointer',
              border: myVote === v.score
                ? `1px solid ${scoreColor(v.score)}`
                : '1px solid var(--border)',
              background: myVote === v.score ? scoreBg(v.score) : 'var(--bg3)',
              borderRadius: 8, padding: '6px 4px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
              transition: 'all 0.12s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = scoreBg(v.score); e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => {
              e.currentTarget.style.background = myVote === v.score ? scoreBg(v.score) : 'var(--bg3)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>{v.emoji}</span>
            <span style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'monospace' }}>{v.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = loading
  const [votes, setVotes] = useState({});
  const [mode, setMode] = useState('sentence');
  const [popup, setPopup] = useState(null); // { key, text, type, pos }
  const [modal, setModal] = useState(null); // { key, text, score }

  // ── Auth ──────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${API}/auth/me`, { credentials: 'include' })
      .then(r => r.json())
      .then(d => setUser(d.user || null))
      .catch(() => setUser(null));

    // Handle redirect params
    const params = new URLSearchParams(window.location.search);
    if (params.has('login') || params.has('error')) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // ── Load votes ────────────────────────────────────────────────────────
  const loadVotes = useCallback(async () => {
    const res = await fetch(`${API}/votes/${DOC_ID}`, { credentials: 'include' });
    const data = await res.json();
    setVotes(data);
  }, []);

  useEffect(() => { if (user !== undefined) loadVotes(); }, [user, loadVotes]);

  // ── Realtime via Supabase ─────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel('votes-realtime')
      .on('postgres_changes', {
        event: '*', schema: 'public', table: 'votes',
        filter: `doc_id=eq.${DOC_ID}`,
      }, () => { loadVotes(); })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [loadVotes]);

  // ── Cast vote ─────────────────────────────────────────────────────────
  async function castVote(targetKey, targetText, score) {
    setPopup(null);
    if (!user) { window.location.href = `${API}/auth/discord`; return; }

    // Optimistic update
    setVotes(prev => {
      const existing = prev[targetKey] || { count: 0, scores: [], myVote: null };
      const hadVote = existing.myVote !== null && existing.myVote !== undefined;
      const newCount = hadVote ? existing.count : existing.count + 1;
      // Rough avg recalc
      return {
        ...prev,
        [targetKey]: { ...existing, count: newCount, myVote: score, avg: score },
      };
    });

    await fetch(`${API}/votes`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docId: DOC_ID, targetKey, score }),
    });

    // Trigger suggestion modal for non-100 scores
    if (score !== 100) {
      setModal({ key: targetKey, text: targetText, score });
    }

    loadVotes(); // refresh accurate data
  }

  // ── Submit suggestion ─────────────────────────────────────────────────
  async function submitSuggestion(targetKey, targetText, score, suggestion) {
    await fetch(`${API}/suggestions`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docId: DOC_ID, targetKey, targetText, score, suggestion }),
    });
  }

  async function logout() {
    await fetch(`${API}/auth/logout`, { method: 'POST', credentials: 'include' });
    setUser(null);
  }

  // ── Stats ─────────────────────────────────────────────────────────────
  const allVoteData = Object.values(votes);
  const totalVotes = allVoteData.reduce((a, v) => a + v.count, 0);
  const overallAvg = allVoteData.length > 0
    ? Math.round(allVoteData.reduce((a, v) => a + v.avg * v.count, 0) / (totalVotes || 1))
    : null;

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg2)',
        padding: '14px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 800,
      }}>
        <div>
          <h1 style={{ fontFamily: 'Cinzel', fontSize: 18, color: 'var(--gold-light)', fontWeight: 600, letterSpacing: '0.05em' }}>
            ⚔ Beastlord's Compendium
          </h1>
          <div style={{ fontSize: 12, color: 'var(--text-dim)', marginTop: 2 }}>
            Community review — EverQuest
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {totalVotes > 0 && (
            <div style={{ fontSize: 13, color: 'var(--text-dim)', textAlign: 'right' }}>
              <span style={{ color: scoreColor(overallAvg), fontFamily: 'monospace' }}>{overallAvg}</span> avg
              &nbsp;·&nbsp;{totalVotes} votes
            </div>
          )}
          {user === undefined ? (
            <div style={{ width: 80, height: 32, background: 'var(--bg3)', borderRadius: 6, animation: 'pulse 1.5s infinite' }} />
          ) : user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {user.avatar && <img src={user.avatar} style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--border)' }} />}
              <span style={{ fontSize: 13, color: 'var(--text)' }}>{user.username}</span>
              <button onClick={logout} style={{
                background: 'none', border: '1px solid var(--border)', borderRadius: 5,
                color: 'var(--text-dim)', fontSize: 12, padding: '4px 10px', cursor: 'pointer',
              }}>Sign out</button>
            </div>
          ) : (
            <a href={`${API}/auth/discord`} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--discord)', color: '#fff',
              border: 'none', borderRadius: 6, padding: '7px 16px',
              fontFamily: 'Crimson Pro, serif', fontSize: 14, textDecoration: 'none',
              transition: 'opacity 0.15s',
            }} onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
              <svg width="18" height="14" viewBox="0 0 71 55" fill="white" xmlns="http://www.w3.org/2000/svg">
                <path d="M60.1 4.9A58.6 58.6 0 0 0 45.8.8a40 40 0 0 0-1.8 3.7 54.2 54.2 0 0 0-16.2 0A39.7 39.7 0 0 0 26 .8 58.5 58.5 0 0 0 11.6 5C1.7 19.6-1 33.8.3 47.9a59 59 0 0 0 17.9 9 42.7 42.7 0 0 0 3.7-6 38.3 38.3 0 0 1-5.8-2.8l1.4-1.1a42 42 0 0 0 35.8 0l1.4 1.1a38.4 38.4 0 0 1-5.8 2.8 42.4 42.4 0 0 0 3.7 6 58.8 58.8 0 0 0 17.9-9C72 31.6 68.6 17.5 60.1 4.9ZM23.7 39.4c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2 6.5 3.2 6.4 7.2c0 4-2.8 7.2-6.4 7.2Zm23.6 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2 6.5 3.2 6.4 7.2c0 4-2.8 7.2-6.4 7.2Z"/>
              </svg>
              Sign in with Discord
            </a>
          )}
        </div>
      </header>

      {/* Mode toggle */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '20px 32px 0' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['sentence', 'section'].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              fontFamily: 'Cinzel', fontSize: 12, letterSpacing: '0.08em',
              padding: '5px 16px', borderRadius: 99, cursor: 'pointer',
              border: '1px solid var(--border)',
              background: mode === m ? 'var(--gold-dim)' : 'transparent',
              color: mode === m ? 'var(--gold-light)' : 'var(--text-dim)',
              transition: 'all 0.15s',
            }}>
              {m === 'sentence' ? 'Sentence mode' : 'Section mode'}
            </button>
          ))}
          <span style={{ fontSize: 12, color: 'var(--text-dim)', alignSelf: 'center', marginLeft: 4 }}>
            — hover any {mode} to rate it
          </span>
        </div>

        {/* Document */}
        <article style={{ paddingBottom: 80, animation: 'fadeUp 0.3s ease' }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: 'Cinzel', fontSize: 26, color: 'var(--text-bright)', fontWeight: 600, letterSpacing: '0.04em', lineHeight: 1.3 }}>
              {DOC.title}
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: 14, marginTop: 6, fontStyle: 'italic' }}>{DOC.subtitle}</p>
            <div style={{ height: 1, background: 'linear-gradient(to right, var(--border-bright), transparent)', marginTop: 20 }} />
          </div>

          {DOC.sections.map((sec) => {
            const secKey = `sec_${sec.id}`;
            const secText = sec.sentences.join(' ');
            const secVote = votes[secKey];

            return (
              <section key={sec.id} style={{ marginBottom: 36 }}>
                <h2 style={{
                  fontFamily: 'Cinzel', fontSize: 16, fontWeight: 400,
                  color: 'var(--gold)', letterSpacing: '0.06em',
                  marginBottom: 12, paddingBottom: 6,
                  borderBottom: '1px solid var(--border)',
                }}>
                  {sec.heading}
                </h2>

                {mode === 'section' ? (
                  <div
                    style={{
                      cursor: 'pointer', borderRadius: 6, padding: '6px 10px',
                      transition: 'background 0.15s',
                      border: '1px solid transparent',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(200,151,31,0.06)';
                      e.currentTarget.style.borderColor = 'var(--border)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.borderColor = 'transparent';
                      if (!popup || popup.key !== secKey) {}
                    }}
                    onClick={e => {
                      setPopup({ key: secKey, text: secText, type: 'section', pos: { x: e.clientX, y: e.clientY + 10 } });
                    }}
                  >
                    <p style={{ color: 'var(--text)' }}>
                      {secText}
                      <VotePill voteData={secVote} />
                    </p>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text)' }}>
                    {sec.sentences.map((sent, si) => {
                      const key = `sent_${sec.id}_${si}`;
                      const vd = votes[key];
                      return (
                        <span
                          key={key}
                          style={{
                            cursor: 'pointer', borderRadius: 3,
                            padding: '1px 2px', transition: 'background 0.12s',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(200,151,31,0.1)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                          onClick={e => {
                            setPopup({ key, text: sent, type: 'sentence', pos: { x: e.clientX, y: e.clientY + 10 } });
                          }}
                        >
                          {sent}{' '}<VotePill voteData={vd} />
                        </span>
                      );
                    })}
                  </p>
                )}
              </section>
            );
          })}
        </article>
      </div>

      {/* Vote popup */}
      {popup && (
        <VotePopup
          targetKey={popup.key}
          targetText={popup.text}
          targetType={popup.type}
          position={popup.pos}
          voteData={votes[popup.key]}
          onVote={castVote}
          onClose={() => setPopup(null)}
        />
      )}

      {/* Suggestion modal */}
      {modal && (
        <SuggestionModal
          targetKey={modal.key}
          targetText={modal.text}
          score={modal.score}
          onSubmit={submitSuggestion}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
