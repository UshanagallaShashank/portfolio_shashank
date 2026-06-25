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
drop table if exists public.experience        cascade;
drop table if exists public.collaborations    cascade;
drop table if exists public.settings          cascade;
drop table if exists public.profile_photos    cascade;

-- ----------------------------------------------------------------
-- 1. projects
-- ----------------------------------------------------------------
create table public.projects (
  id               uuid primary key default gen_random_uuid(),
  title            text not null,
  description      text,
  tech_stack       text[]      not null default '{}',
  category         text        not null default 'General',
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
  url           text,
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
-- 9. experience  (work timeline)
-- ----------------------------------------------------------------
create table public.experience (
  id            uuid primary key default gen_random_uuid(),
  role          text    not null,
  company       text    not null,
  location      text    not null default '',
  period        text    not null,
  type          text    not null default 'Full-time',
  highlights    text[]  not null default '{}',
  tech          text[]  not null default '{}',
  display_order int     not null default 0,
  is_visible    boolean not null default true
);

-- ----------------------------------------------------------------
-- 10. collaborations  (services / project highlights)
-- ----------------------------------------------------------------
create table public.collaborations (
  id            uuid primary key default gen_random_uuid(),
  title         text    not null,
  description   text    not null default '',
  link          text,
  link_label    text,
  color         text    not null default '#00B4D8',
  icon          text    not null default 'HandshakeIcon',
  display_order int     not null default 0,
  is_visible    boolean not null default true
);

-- ----------------------------------------------------------------
-- 11. settings  (key-value store for profile & site config)
-- ----------------------------------------------------------------
create table public.settings (
  key   text primary key,
  value text
);

-- ----------------------------------------------------------------
-- 12. profile_photos  (versioned avatar images, one active at a time)
-- ----------------------------------------------------------------
create table public.profile_photos (
  id           uuid primary key default gen_random_uuid(),
  storage_path text        not null,
  public_url   text        not null,
  is_active    boolean     not null default false,
  uploaded_at  timestamptz not null default now()
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
alter table public.experience       disable row level security;
alter table public.collaborations   disable row level security;
alter table public.settings         disable row level security;
alter table public.profile_photos   disable row level security;

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
grant select, insert, update, delete on public.experience      to anon, authenticated;
grant select, insert, update, delete on public.collaborations  to anon, authenticated;
grant select, insert, update, delete on public.settings        to anon, authenticated;
grant select, insert, update, delete on public.profile_photos  to anon, authenticated;

-- ----------------------------------------------------------------
-- Storage buckets (public read — used by resume.py and profile.py)
-- ----------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do update set public = true;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

drop policy if exists "Public read resumes" on storage.objects;
create policy "Public read resumes" on storage.objects
  for select using (bucket_id = 'resumes');

drop policy if exists "Public read avatars" on storage.objects;
create policy "Public read avatars" on storage.objects
  for select using (bucket_id = 'avatars');

drop policy if exists "Anon write resumes" on storage.objects;
create policy "Anon write resumes" on storage.objects
  for all using (bucket_id = 'resumes') with check (bucket_id = 'resumes');

drop policy if exists "Anon write avatars" on storage.objects;
create policy "Anon write avatars" on storage.objects
  for all using (bucket_id = 'avatars') with check (bucket_id = 'avatars');

-- ----------------------------------------------------------------
-- Seed data  (edit to match your actual numbers before running)
-- ----------------------------------------------------------------
insert into public.stats (label, value, display_order) values
  ('Years of Experience', '2+',     1),
  ('Problems Solved', '350+',      2),
  ('LeetCode Global', 'Top 9.5%',  3),
  ('CodeChef Rating', '4★',        4);

insert into public.achievements (label, detail, icon, url, display_order) values
  ('Featured by OpenAI', '95% of issues auto-resolved, <5 min average resolution — Lumina AI Screen Share spotlighted by OpenAI for Business on LinkedIn', '🚀', 'https://www.linkedin.com/posts/ushanagallashashank_realpage-openai-luminascreenshare-activity-7447719185545228289-LFcG', 1),
  ('350+',     'Problems solved on GeeksforGeeks',            '🧠', null, 2),
  ('Top 9.5%', 'LeetCode global ranking',                     '🏆', null, 3),
  ('Rank 350', 'TCS CodeVita worldwide',                      '🌍', null, 4),
  ('3rd Place','KMIT Code Sangram 2023 (200+ participants)',   '🥉', null, 5),
  ('4-Star',   'CodeChef rating (Max: 1850)',                  '⭐', null, 6);

insert into public.certifications (title, issuer, url, display_order) values
  ('HackerRank Problem Solving', 'HackerRank', 'https://www.hackerrank.com/certificates/23e555754a76', 1),
  ('HackerRank React',           'HackerRank', 'https://www.hackerrank.com/certificates/42023ae7fa0d', 2),
  ('HackerRank Java',            'HackerRank', 'https://drive.google.com/file/d/1c1akMioczAAE-fdktf0_DrOjIAGIo0b5/view', 3);

insert into public.skills (name, category, icon_url, proficiency, display_order) values
  -- Languages
  ('Python',       'Languages', '🐍', 90, 1),
  ('TypeScript',   'Languages', '📘', 88, 2),
  ('JavaScript',   'Languages', '💛', 90, 3),
  ('Java',         'Languages', '☕', 80, 4),
  -- Frontend
  ('React.js',     'Frontend',  '⚛️', 90, 5),
  ('TailwindCSS',  'Frontend',  '🎨', 85, 6),
  -- Backend
  ('FastAPI',      'Backend',   '⚡', 88, 7),
  ('Node.js',      'Backend',   '🟢', 85, 8),
  ('Express.js',   'Backend',   '🚂', 82, 9),
  -- AI/GenAI
  ('Google ADK',   'AI/GenAI',  '🤖', 85, 10),
  ('LangChain',    'AI/GenAI',  '🔗', 88, 11),
  ('LangGraph',    'AI/GenAI',  '📊', 85, 12),
  ('RAG Pipelines','AI/GenAI',  '🧠', 90, 13),
  ('Gemini API',   'AI/GenAI',  '💎', 82, 14),
  ('OpenAI APIs',  'AI/GenAI',  '🧩', 88, 15),
  ('LLM Fine-tuning','AI/GenAI','🛠️', 80, 16),
  ('Multimodal AI','AI/GenAI',  '🎛️', 82, 17),
  ('MCP',          'AI/GenAI',  '🔌', 80, 18),
  -- Databases
  ('PostgreSQL',   'Databases', '🐘', 85, 19),
  ('MongoDB',      'Databases', '🍃', 85, 20),
  ('Supabase',     'Databases', '⚡', 80, 21),
  ('MySQL',        'Databases', '🐬', 78, 22),
  ('Redis',        'Databases', '🟥', 82, 23),
  ('pgvector',     'Databases', '🧮', 82, 24),
  -- Cloud & MLOps
  ('GCP',          'Cloud & MLOps', '☁️', 80, 25),
  ('Docker',       'Cloud & MLOps', '🐳', 82, 26),
  ('Kubernetes',   'Cloud & MLOps', '☸️', 75, 27),
  ('CI/CD',        'Cloud & MLOps', '🔁', 85, 28),
  -- Tools
  ('WebRTC',       'Tools',     '📡', 85, 29),
  ('n8n',          'Tools',     '🔄', 78, 30),
  ('WebSocket',    'Tools',     '🔌', 82, 31),
  ('REST APIs',    'Tools',     '🌐', 90, 32),
  ('Playwright',   'Tools',     '🎭', 78, 33),
  ('Figma',        'Tools',     '🎨', 70, 34),
  ('Postman',      'Tools',     '📮', 80, 35),
  ('Git',          'Tools',     '📝', 88, 36);

insert into public.experience (role, company, location, period, type, highlights, tech, display_order) values
  (
    'AI Engineer', 'RealPage Inc', 'Hyderabad', 'April 2025 – Present', 'Full-time',
    array[
      'Lumina AI Screen Share (featured by OpenAI for Business on LinkedIn): sole architect and developer of an AI-powered screen-share voice bot delivering autonomous real-time guidance for complex SaaS workflows with zero human agent intervention',
      'Achieved 95% automatic issue resolution among early adopters with under 5 minutes average resolution time, combining voice, vision, and reasoning via the OpenAI Realtime model',
      'Built a multimodal pipeline — OpenAI vision + RAG knowledge base + WebRTC — that interprets the live screen, retrieves contextual help, and responds with adaptive voice guidance under 2s latency',
      'Automated step-by-step workflow guidance and error recovery, directly reducing support ticket volume and agent escalation rate',
      'Improved new-user onboarding accuracy through mid-session context-tracking that adapts guidance to real-time state changes',
      'Genesis — Salesforce Transcript Summariser & Ticket Mapper: built an LLM pipeline to ingest and summarise support transcripts, automating ticket classification and cutting agent triage time by ~30%',
      'Added real-time question generation, automated summaries, and sentiment categorisation to Genesis with a modular design for shipping new analytics without touching the core pipeline',
      'PDF Masker: built a Python utility to detect and mask PII and financial data across 100s of invoice PDFs per run, keeping the company compliant with data-privacy regulations',
      'Integrated PDF Masker into existing data pipelines via CI/CD, eliminating 100% of manual redaction effort and cutting invoice processing time for the finance team'
    ],
    array['Python', 'OpenAI Vision', 'RAG', 'WebRTC', 'LangChain', 'FastAPI', 'Salesforce', 'CI/CD'],
    1
  ),
  (
    'AI Engineer Intern', 'RealPage Inc', 'Hyderabad', 'July 2024 – April 2025', 'Internship',
    array[
      'Built an LLM-enhanced web scraper (LangChain) that processed 50,000+ websites, achieving 80% data accuracy and cutting manual data-cleaning effort by 90%',
      'Added a semantic similarity search and categorisation layer to organise and retrieve large datasets, improving retrieval precision across internal tools',
      'Identified and proposed a data pipeline improvement adopted by the team, reducing repeated manual processing steps'
    ],
    array['LangChain', 'Python', 'Semantic Search', 'Web Scraping'],
    2
  ),
  (
    'Teaching Assistant — MERN Stack', 'Iconnect NFS', 'Hyderabad', 'Feb 2024 – Apr 2024', 'Part-time',
    array[
      'Ran hands-on MERN stack workshops for 100+ working professionals; led Q&A sessions and gave 1:1 technical support',
      'Created reference materials and exercises used by participants to keep building independently post-workshop'
    ],
    array['React', 'Node.js', 'MongoDB', 'Express.js'],
    3
  );

insert into public.projects (title, description, tech_stack, category, github_url, live_url, is_featured, display_order) values
  (
    'RAGForge',
    'Multi-tenant RAG SaaS platform (FastAPI + LangChain + pgvector + Redis) with BYOK support, tenant data isolation, and streamed responses with source citations. Async job queues (ARQ/Redis) handle the full ingestion-to-response pipeline end-to-end.',
    array['FastAPI', 'LangChain', 'pgvector', 'Redis', 'React'],
    'AI/ML',
    'https://github.com/UshanagallaShashank/RAGForge',
    null,
    true,
    1
  ),
  (
    'Project Orbit',
    'Voice-first multi-agent AI OS: a Google ADK orchestrator routes tasks across 8 specialised agents (TaskAgent, MentorAgent, MemoryAgent, JobAgent, MockAgent, and more) over the Gemini Live API at under 500ms latency, with hybrid Redis + PostgreSQL/pgvector memory and a React PWA terminal-style debug dashboard.',
    array['Google ADK', 'Gemini Live API', 'Redis', 'PostgreSQL', 'pgvector', 'React'],
    'AI/ML',
    'https://github.com/UshanagallaShashank/Project-Orbit',
    null,
    true,
    2
  ),
  (
    'PatchSense PRGuard',
    'AI-powered PR reviewer that analyses diffs and automatically flags bugs, style violations, and security risks before code is merged.',
    array['AI', 'Python', 'GitHub Actions'],
    'AI/ML',
    'https://github.com/UshanagallaShashank/PatchSense-PRGuard',
    null,
    true,
    3
  ),
  (
    'ai_news_mcp',
    'Open-source MCP (Model Context Protocol) server that streams curated AI news into Claude — a practical reference implementation of MCP for the developer community.',
    array['MCP', 'Python', 'Claude'],
    'Open Source',
    'https://github.com/UshanagallaShashank/ai_news_mcp',
    null,
    true,
    4
  );

insert into public.settings (key, value) values
  ('avatar_url', 'https://github.com/UshanagallaShashank.png');

insert into public.collaborations (title, description, link, link_label, color, icon, display_order) values
  ('AI Integration',         'RAG pipelines, LLM chatbots, Google ADK agents, LangGraph workflows for your product.',          null,                    null,           '#00B4D8', 'SmartToy',   1),
  ('Full-Stack Development', 'FastAPI + React applications, REST APIs, real-time features, and database design.',               null,                    null,           '#7C3AED', 'Code',       2),
  ('Consulting',             'Code reviews, architecture consulting, and AI strategy for startups and indie devs.',             null,                    null,           '#10B981', 'Handshake',  3),
  ('Giftedict',              'A gifting recommendation platform built as a freelance project.',                                 'https://giftedict.com/', 'View Project', '#F59E0B', 'OpenInNew',  4);
