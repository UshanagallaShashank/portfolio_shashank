-- ============================================================
-- Portfolio Backend — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------
-- Drop existing tables (cascade removes dependent triggers/policies)
-- ----------------------------------------------------------------
drop table if exists public.chatbot_sessions  cascade;
drop table if exists public.resume_versions   cascade;
drop table if exists public.messages          cascade;
drop table if exists public.skills            cascade;
drop table if exists public.projects          cascade;
drop table if exists public.stats             cascade;
drop table if exists public.achievements      cascade;
drop table if exists public.certifications    cascade;

-- ----------------------------------------------------------------
-- 1. projects
-- ----------------------------------------------------------------
create table public.projects (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  description      text,
  tech_stack       text[]      not null default '{}',
  github_url       text,
  live_url         text,
  thumbnail_url    text,
  is_featured      boolean     not null default false,
  is_github_repo   boolean     not null default false,
  github_repo_name text,
  display_order    int         not null default 0,
  is_visible       boolean     not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at
  before update on public.projects
  for each row execute procedure public.set_updated_at();

-- ----------------------------------------------------------------
-- 2. skills
-- ----------------------------------------------------------------
create table public.skills (
  id            uuid primary key default gen_random_uuid(),
  name          text    not null,
  category      text,
  icon_url      text,
  proficiency   int     not null default 80 check (proficiency between 0 and 100),
  display_order int     not null default 0,
  is_visible    boolean not null default true
);

-- ----------------------------------------------------------------
-- 3. messages  (contact form submissions)
-- ----------------------------------------------------------------
create table public.messages (
  id            uuid primary key default gen_random_uuid(),
  sender_name   text    not null,
  sender_email  text    not null,
  subject       text,
  body          text    not null,
  allow_email   boolean not null default false,
  is_read       boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- 4. resume_versions
-- ----------------------------------------------------------------
create table public.resume_versions (
  id           uuid primary key default gen_random_uuid(),
  file_name    text    not null,
  storage_path text    not null,
  public_url   text    not null,
  is_active    boolean not null default false,
  uploaded_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- 5. chatbot_sessions
-- ----------------------------------------------------------------
create table public.chatbot_sessions (
  id         uuid primary key default gen_random_uuid(),
  session_id text unique not null,
  messages   jsonb       not null default '[]',
  ip_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists chatbot_sessions_updated_at on public.chatbot_sessions;
create trigger chatbot_sessions_updated_at
  before update on public.chatbot_sessions
  for each row execute procedure public.set_updated_at();

-- ----------------------------------------------------------------
-- 6. stats  (homepage highlight numbers)
-- ----------------------------------------------------------------
create table public.stats (
  id            uuid primary key default gen_random_uuid(),
  label         text    not null,
  value         text    not null,
  display_order int     not null default 0,
  is_visible    boolean not null default true
);

-- ----------------------------------------------------------------
-- 7. achievements  (competitive programming)
-- ----------------------------------------------------------------
create table public.achievements (
  id            uuid primary key default gen_random_uuid(),
  label         text    not null,
  detail        text    not null,
  icon          text    not null default '🏆',
  display_order int     not null default 0,
  is_visible    boolean not null default true
);

-- ----------------------------------------------------------------
-- 8. certifications
-- ----------------------------------------------------------------
create table public.certifications (
  id            uuid primary key default gen_random_uuid(),
  title         text    not null,
  issuer        text    not null,
  url           text    not null,
  display_order int     not null default 0,
  is_visible    boolean not null default true
);

-- ----------------------------------------------------------------
-- Row Level Security (RLS)
-- Backend is the auth gatekeeper — RLS disabled on all tables.
-- Admin endpoints are protected by JWT middleware in FastAPI.
-- ----------------------------------------------------------------
alter table public.projects         disable row level security;
alter table public.skills           disable row level security;
alter table public.stats            disable row level security;
alter table public.achievements     disable row level security;
alter table public.certifications   disable row level security;
alter table public.messages         disable row level security;
alter table public.resume_versions  disable row level security;
alter table public.chatbot_sessions disable row level security;

-- ----------------------------------------------------------------
-- Table-level grants (full access — backend enforces auth)
-- ----------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on public.projects        to anon, authenticated;
grant select, insert, update, delete on public.skills          to anon, authenticated;
grant select, insert, update, delete on public.stats           to anon, authenticated;
grant select, insert, update, delete on public.achievements    to anon, authenticated;
grant select, insert, update, delete on public.certifications  to anon, authenticated;
grant select, insert, update, delete on public.resume_versions to anon, authenticated;
grant select, insert, update, delete on public.messages        to anon, authenticated;
grant select, insert, update, delete on public.chatbot_sessions to anon, authenticated;

-- ----------------------------------------------------------------
-- Seed data  (edit to match your actual numbers before running)
-- ----------------------------------------------------------------
insert into public.stats (label, value, display_order) values
  ('Problems Solved', '350+',      1),
  ('LeetCode Global', 'Top 9.5%',  2),
  ('Years at RealPage', '1+',      3),
  ('CodeChef Rating', '4★',        4);

insert into public.achievements (label, detail, icon, display_order) values
  ('350+',     'Problems solved on GeeksforGeeks',            '🧠', 1),
  ('Top 9.5%', 'LeetCode global ranking',                     '🏆', 2),
  ('Rank 350', 'TCS CodeVita worldwide',                      '🌍', 3),
  ('3rd Place','KMIT Code Sangram 2023 (200+ participants)',   '🥉', 4),
  ('4-Star',   'CodeChef rating (Max: 1850)',                  '⭐', 5);

insert into public.certifications (title, issuer, url, display_order) values
  ('HackerRank Problem Solving', 'HackerRank', 'https://www.hackerrank.com/certificates/23e555754a76', 1),
  ('HackerRank React',           'HackerRank', 'https://www.hackerrank.com/certificates/42023ae7fa0d', 2),
  ('HackerRank Java',            'HackerRank', 'https://drive.google.com/file/d/1c1akMioczAAE-fdktf0_DrOjIAGIo0b5/view', 3);
