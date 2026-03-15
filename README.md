# Ushanagalla Shashank — Personal Portfolio

A full-stack personal portfolio website showcasing work, projects, and skills. Features an AI-powered chatbot, admin panel, GitHub integration, and contact system.

**Live Site:** [Coming Soon]
**Author:** Ushanagalla Shashank — [ushanagallashashank@gmail.com](mailto:ushanagallashashank@gmail.com)
**LinkedIn:** [ushanagallashashank](https://www.linkedin.com/in/ushanagallashashank/)
**GitHub:** [UshanagallaShashank](https://github.com/UshanagallaShashank)

---

## Architecture

```
portfolio-shashank/
├── client/          React 18 + TypeScript + Vite (frontend)
├── backend/         FastAPI (Python) (backend API)
└── README.md
```

```
Visitor Browser
      │
      ▼
 React Frontend  ──── REST ────▶  FastAPI Backend
      │                                  │
      │                         ┌────────┼────────┐
      │                         ▼        ▼        ▼
      │                     Supabase  GitHub   Google
      │                     (DB/Auth/  API      ADK
      │                      Storage)        (Gemini)
      │                         │
      │                         ▼
      │                        n8n
      │                    (Workflows)
      └── Admin only ──▶  Supabase Auth (JWT) ──▶ FastAPI Admin Routes
```

> All AI calls, database access, and authentication go through the FastAPI backend. The frontend never calls Supabase, GitHub, or Google directly.

---

## Tech Stack

### Frontend (`/client`)
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite | Build tool |
| MUI v6 (Material UI) | Component library |
| Ant Design v5 | Additional components |
| Framer Motion | Animations |
| animate-ui | Animated dialog/UI primitives |
| React Router v6 | Multi-page navigation |
| Axios | HTTP client (→ FastAPI) |

### Backend (`/backend`)
| Technology | Purpose |
|---|---|
| FastAPI | REST API framework |
| Supabase | PostgreSQL DB, Auth, Storage |
| Google ADK (gemini-2.5-flash-lite) | AI chatbot |
| n8n | Workflow automation (email, syncs) |
| pydantic-settings | Config management |
| python-jose | Supabase JWT verification |
| aiosmtplib | Async email (contact form) |
| slowapi | Rate limiting |

---

## Features

- **Multi-page portfolio** — Home, About, Experience, Projects, Achievements, Collaboration, Contact
- **AI Chatbot** — Portfolio-aware chatbot powered by Google ADK (gemini-2.5-flash-lite); knows about Shashank's skills, projects, and experience
- **GitHub Integration** — Fetches top repositories dynamically via GitHub API (cached)
- **Admin Panel** — Secure login for Shashank only; upload/update resume, manage projects and messages
- **Resume Management** — Upload to Supabase Storage; visitors download the active version
- **Contact Form** — With opt-in email checkbox; triggers n8n workflow for notifications
- **Dark/Light Mode** — Default dark theme with Electric Blue accent; persisted to localStorage
- **Freelance / Collab section** — Showcases freelancing work and collaboration opportunities

---

## Local Development Setup

### Prerequisites
- Node.js 20+
- Python 3.11+
- A Supabase project (URL + keys)
- Google AI Studio API key (for chatbot)

### 1. Clone the repo

```bash
git clone https://github.com/UshanagallaShashank/portfolio_shashank.git
cd portfolio-shashank
```

### 2. Frontend setup

```bash
cd client
npm install
cp .env.example .env
# Fill in VITE_API_BASE_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
npm run dev
```

### 3. Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Fill in all env vars (see below)
uvicorn app.main:app --reload --port 8000
```

---

## Environment Variables

### Backend (`backend/.env`)

```env
# App
APP_ENV=development
FRONTEND_ORIGIN=http://localhost:5173

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# GitHub
GITHUB_TOKEN=ghp_your_token
GITHUB_USERNAME=UshanagallaShashank

# Google AI / ADK
GOOGLE_API_KEY=your-google-ai-api-key
GOOGLE_ADK_MODEL=gemini-2.5-flash-lite

# Email (Gmail SMTP with App Password)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=ushanagallashashank@gmail.com
SMTP_PASSWORD=your-app-password
NOTIFY_EMAIL=ushanagallashashank@gmail.com

# n8n (optional)
N8N_CONTACT_WEBHOOK_URL=https://your-n8n/webhook/contact-form
N8N_GITHUB_SYNC_WEBHOOK_URL=https://your-n8n/webhook/github-sync

# Rate limiting
RATE_LIMIT_CHATBOT=10/minute
RATE_LIMIT_CONTACT=5/minute
```

### Frontend (`client/.env`)

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Supabase Database Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- Profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  location TEXT,
  email TEXT,
  phone TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  leetcode_url TEXT,
  resume_url TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  tech_stack TEXT[],
  github_url TEXT,
  live_url TEXT,
  thumbnail_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_github_repo BOOLEAN DEFAULT false,
  github_repo_name TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Skills
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  icon_url TEXT,
  proficiency INT DEFAULT 80,
  display_order INT DEFAULT 0
);

-- Messages (contact form)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  allow_email BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Resume versions
CREATE TABLE resume_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Chatbot sessions
CREATE TABLE chatbot_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  messages JSONB DEFAULT '[]',
  ip_address TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Certifications
CREATE TABLE certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  issuer TEXT,
  issued_date DATE,
  cert_url TEXT,
  image_url TEXT,
  display_order INT DEFAULT 0
);

-- RLS Policies
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit message" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin reads messages" ON messages FOR SELECT USING (auth.role() = 'authenticated');

ALTER TABLE resume_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads active resume" ON resume_versions FOR SELECT USING (is_active = true);
CREATE POLICY "Admin manages resumes" ON resume_versions FOR ALL USING (auth.role() = 'authenticated');
```

Also create a Supabase Storage bucket named **`resumes`** (public read).

---

## n8n Workflows

Workflow JSON files are in `backend/n8n/workflows/`. Import them in your n8n instance:

| File | Trigger | Action |
|---|---|---|
| `contact_form_email.json` | Webhook (POST from backend) | Send email to Shashank + optional ack to sender |
| `github_stats_sync.json` | Cron (every 6h) | Sync top GitHub repos to Supabase |
| `new_message_slack_notify.json` | Supabase realtime INSERT | Notify via Discord/Telegram |

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/health` | Public | Health check |
| GET | `/api/projects` | Public | List projects |
| GET | `/api/projects/featured` | Public | Featured projects |
| GET | `/api/github/repos` | Public | Top GitHub repos (cached) |
| GET | `/api/github/stats` | Public | GitHub stats |
| GET | `/api/skills` | Public | Skills by category |
| POST | `/api/messages` | Public | Submit contact form |
| GET | `/api/resume/download` | Public | Download active resume |
| POST | `/api/chatbot/chat` | Public | Chat with AI assistant |
| POST | `/api/admin/login` | Public | Admin login |
| GET | `/api/admin/dashboard` | Admin | Dashboard stats |
| POST | `/api/resume/upload` | Admin | Upload new resume |
| GET | `/api/messages` | Admin | Read all messages |

---

## Project Structure

```
client/
├── src/
│   ├── api/          Axios calls to FastAPI
│   ├── components/   Reusable UI components
│   │   ├── chatbot/  AI chatbot widget
│   │   ├── layout/   Navbar, Footer, PageWrapper
│   │   ├── sections/ Page-specific section components
│   │   └── ui/       Shared UI primitives
│   ├── constants/    Static data (personal info, skills, nav)
│   ├── context/      React context (theme, auth, chatbot)
│   ├── hooks/        Custom hooks
│   ├── pages/        Page components + admin pages
│   ├── router/       React Router setup + ProtectedRoute
│   ├── theme/        MUI theme + Ant Design tokens
│   ├── types/        TypeScript interfaces
│   └── utils/        Helpers, animation variants

backend/
├── app/
│   ├── main.py       FastAPI app entry point
│   ├── config.py     Environment config (pydantic-settings)
│   ├── dependencies.py Shared FastAPI dependencies
│   ├── middleware/   Auth + rate limiting
│   ├── models/       Pydantic request/response models
│   ├── routers/      API route handlers
│   └── services/     Business logic (Supabase, GitHub, ADK, email)
├── n8n/workflows/    n8n workflow JSON files
└── tests/            Pytest test suite
```

---

## License

MIT — feel free to fork and adapt for your own portfolio.
