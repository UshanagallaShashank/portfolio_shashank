-- ============================================================
-- Portfolio Backend — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------
-- Drop existing tables (cascade removes dependent triggers/policies)
-- ----------------------------------------------------------------
drop table if exists public.chatbot_sessions cascade;
drop table if exists public.resume_versions  cascade;
drop table if exists public.messages         cascade;
drop table if exists public.skills           cascade;
drop table if exists public.projects         cascade;

-- ----------------------------------------------------------------
-- 1. projects
-- ----------------------------------------------------------------
create table public.projects (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  description      text,
  tech_stack       text[]    not null default '{}',
  github_url       text,
  live_url         text,
  thumbnail_url    text,
  is_featured      boolean   not null default false,
  is_github_repo   boolean   not null default false,
  github_repo_name text,
  display_order    int       not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- auto-update updated_at
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
  name          text not null,
  category      text,
  icon_url      text,
  proficiency   int  not null default 80 check (proficiency between 0 and 100),
  display_order int  not null default 0
);

-- ----------------------------------------------------------------
-- 3. messages  (contact form submissions)
-- ----------------------------------------------------------------
create table public.messages (
  id            uuid primary key default gen_random_uuid(),
  sender_name   text not null,
  sender_email  text not null,
  subject       text,
  body          text not null,
  allow_email   boolean not null default false,
  is_read       boolean not null default false,
  created_at    timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- 4. resume_versions
-- ----------------------------------------------------------------
create table public.resume_versions (
  id           uuid primary key default gen_random_uuid(),
  file_name    text not null,
  storage_path text not null,
  public_url   text not null,
  is_active    boolean not null default false,
  uploaded_at  timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- 5. chatbot_sessions
-- ----------------------------------------------------------------
create table public.chatbot_sessions (
  id         uuid primary key default gen_random_uuid(),
  session_id text unique not null,
  messages   jsonb not null default '[]',
  ip_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists chatbot_sessions_updated_at on public.chatbot_sessions;
create trigger chatbot_sessions_updated_at
  before update on public.chatbot_sessions
  for each row execute procedure public.set_updated_at();

-- ----------------------------------------------------------------
-- Row Level Security (RLS)
-- Public can read projects and skills; everything else is service-role only
-- ----------------------------------------------------------------
-- projects & skills: RLS on so only SELECT is allowed publicly
alter table public.projects        enable row level security;
alter table public.skills          enable row level security;

-- messages, resume_versions, chatbot_sessions: backend-only via service_role,
-- no direct client access — RLS disabled for simplicity
alter table public.messages         disable row level security;
alter table public.resume_versions  disable row level security;
alter table public.chatbot_sessions disable row level security;

-- projects: anyone can read
create policy "public read projects"
  on public.projects for select using (true);

-- skills: anyone can read
create policy "public read skills"
  on public.skills for select using (true);

-- resume_versions: anyone can read (to serve the download link)
create policy "public read resume"
  on public.resume_versions for select using (true);

-- All admin read/write goes through the service-role key which bypasses RLS.

-- ----------------------------------------------------------------
-- Table-level grants  (RLS policies alone are not enough)
-- ----------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select, insert        on public.messages         to anon, authenticated;
grant select                on public.projects         to anon, authenticated;
grant select                on public.skills           to anon, authenticated;
grant select                on public.resume_versions  to anon, authenticated;
grant select, insert, update on public.chatbot_sessions to anon, authenticated;
