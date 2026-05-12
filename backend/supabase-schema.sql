-- Run this in your Supabase SQL editor (https://app.supabase.com → SQL Editor)

-- Users table (populated on first Discord login)
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  discord_id text unique not null,
  username text not null,
  avatar text,
  created_at timestamptz default now()
);

-- Votes table
create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  doc_id text not null,           -- e.g. "beastlord-guide"
  target_key text not null,       -- e.g. "sent_0_2" or "sec_1"
  user_id uuid references users(id) on delete cascade,
  score integer not null check (score in (-100, 0, 25, 50, 75, 100)),
  created_at timestamptz default now(),
  unique (doc_id, target_key, user_id)  -- one vote per user per target
);

-- Suggestions table
create table if not exists suggestions (
  id uuid primary key default gen_random_uuid(),
  doc_id text not null,
  target_key text not null,
  user_id uuid references users(id) on delete cascade,
  score integer not null,
  suggestion text not null,
  created_at timestamptz default now()
);

-- Enable Realtime on the votes table so the frontend gets live updates
-- (Run this separately in Supabase → Database → Replication)
-- alter publication supabase_realtime add table votes;

-- Indexes for fast lookups
create index if not exists votes_doc_id_idx on votes(doc_id);
create index if not exists suggestions_doc_id_idx on suggestions(doc_id);
