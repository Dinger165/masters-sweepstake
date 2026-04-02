-- Run this in your Supabase SQL editor to set up the database

-- Entrants table: stores each person's name and chosen golfer
create table if not exists entrants (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  golfer text not null unique,
  entered_at timestamptz default now()
);

-- Scores table: admin updates golfer positions here
create table if not exists scores (
  id uuid default gen_random_uuid() primary key,
  golfer text not null unique,
  position integer,
  score_vs_par integer,
  updated_at timestamptz default now()
);

-- Enable realtime on both tables
alter publication supabase_realtime add table entrants;
alter publication supabase_realtime add table scores;

-- Allow public read and insert on entrants (no auth needed for demo)
alter table entrants enable row level security;
create policy "Anyone can read entrants" on entrants for select using (true);
create policy "Anyone can insert entrants" on entrants for insert with check (true);

-- Allow public read on scores, only admin writes (handle via anon key for demo)
alter table scores enable row level security;
create policy "Anyone can read scores" on scores for select using (true);
create policy "Anyone can upsert scores" on scores for insert with check (true);
create policy "Anyone can update scores" on scores for update using (true);
