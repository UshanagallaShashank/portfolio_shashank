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
  ('RAG Pipelines','AI/GenAI',  '🧠', 88, 13),
  ('Gemini API',   'AI/GenAI',  '💎', 82, 14),
  -- Databases
  ('PostgreSQL',   'Databases', '🐘', 82, 15),
  ('MongoDB',      'Databases', '🍃', 85, 16),
  ('Supabase',     'Databases', '⚡', 80, 17),
  ('MySQL',        'Databases', '🐬', 78, 18),
  -- Tools
  ('WebRTC',       'Tools',     '📡', 80, 19),
  ('n8n',          'Tools',     '🔄', 78, 20),
  ('WebSocket',    'Tools',     '🔌', 82, 21),
  ('REST APIs',    'Tools',     '🌐', 90, 22),
  ('Playwright',   'Tools',     '🎭', 78, 23),
  ('Git',          'Tools',     '📝', 88, 24);

insert into public.experience (role, company, location, period, type, highlights, tech, display_order) values
  (
    'Developer 1', 'RealPage Inc', 'Hyderabad', 'April 2025 – Present', 'Full-time',
    array[
      'Designed and developed a screen-share voice bot using AI, RAG, and WebRTC for autonomous real-time user support in complex workflows',
      'Built adaptive voice guidance and context-sensitive error handling, reducing ticket volume through reliable autonomous workflow support',
      'Developed Genesis Salesforce Transcript Summarizer — real-time question generation and automated summary features for agent productivity',
      'Built PDF Masker Tool: Python utility for detecting and masking sensitive invoice data with pipeline integration'
    ],
    array['Python', 'RAG', 'WebRTC', 'LangGraph', 'FastAPI', 'Salesforce'],
    1
  ),
  (
    'Developer Intern', 'RealPage Inc', 'Hyderabad', 'July 2024 – April 2025', 'Internship',
    array[
      'Developed a web scraper achieving 80% data accuracy by integrating LangChain for enhanced data extraction',
      'Enhanced data with AI-driven insights, reducing manual work by 90%',
      'Implemented a categorizer to organize data efficiently, improving data retrieval processes',
      'Integrated similarity search functionality to enhance data matching and retrieval accuracy'
    ],
    array['LangChain', 'Python', 'Similarity Search', 'Web Scraping'],
    2
  ),
  (
    'Teaching Assistant', 'Iconnect NFS', 'Hyderabad', 'Feb 2024 – Apr 2024', 'Part-time',
    array[
      'Facilitated MERN stack workshops for 100+ professionals, ensuring hands-on learning experience',
      'Provided mentoring and technical support to enhance participants'' understanding',
      'Developed supplementary materials and resources to support workshop content',
      'Organized and led Q&A sessions to address participant queries'
    ],
    array['React', 'Node.js', 'MongoDB', 'Express.js'],
    3
  );

insert into public.projects (title, description, tech_stack, category, github_url, live_url, is_featured, display_order) values
  (
    'SkillEdge AI',
    'AI-powered LeetCode assistant generating personalized study paths. Integrated automated reminders that reduced overall study time by 20%.',
    array['React', 'AI', 'LeetCode API', 'Node.js'],
    'AI/ML',
    'https://github.com/UshanagallaShashank',
    'https://problem-suggestor-frontend.vercel.app/',
    true,
    1
  ),
  (
    'Code-Renderer',
    'Competitive programming platform featuring real-time code execution and live leaderboard updates using WebSocket.',
    array['React', 'Node.js', 'WebSocket', 'Code Execution'],
    'Full-Stack',
    'https://github.com/UshanagallaShashank',
    null,
    true,
    2
  ),
  (
    'Place-in',
    'MERN stack placement portal for KMIT college, enabling seamless interaction between students and recruiters.',
    array['React', 'Node.js', 'MongoDB', 'Express.js'],
    'Full-Stack',
    'https://github.com/UshanagallaShashank',
    null,
    true,
    3
  );

insert into public.settings (key, value) values
  ('avatar_url', 'https://github.com/UshanagallaShashank.png');

insert into public.collaborations (title, description, link, link_label, color, icon, display_order) values
  ('AI Integration',         'RAG pipelines, LLM chatbots, Google ADK agents, LangGraph workflows for your product.',          null,                    null,           '#00B4D8', 'SmartToy',   1),
  ('Full-Stack Development', 'FastAPI + React applications, REST APIs, real-time features, and database design.',               null,                    null,           '#7C3AED', 'Code',       2),
  ('Consulting',             'Code reviews, architecture consulting, and AI strategy for startups and indie devs.',             null,                    null,           '#10B981', 'Handshake',  3),
  ('Giftedict',              'A gifting recommendation platform built as a freelance project.',                                 'https://giftedict.com/', 'View Project', '#F59E0B', 'OpenInNew',  4);
