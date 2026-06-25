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

Run [`backend/supabase_schema.sql`](backend/supabase_schema.sql) in the Supabase Dashboard → SQL Editor → New Query. It is the single source of truth for the schema and creates, in order:

- All 12 tables (`projects`, `skills`, `messages`, `resume_versions`, `chatbot_sessions`, `stats`, `achievements`, `certifications`, `experience`, `collaborations`, `settings`, `profile_photos`)
- `updated_at` triggers on `projects` and `chatbot_sessions`
- The `resumes` and `avatars` **Storage buckets** (public read) with their access policies
- RLS disabled on every table — the FastAPI backend (JWT-protected admin routes) is the auth gatekeeper, not Postgres RLS
- Seed data for stats/achievements/certifications/skills/experience/projects/collaborations — edit the seed `insert` statements at the bottom to match your own details before running

Re-running the script is safe — it starts with `drop table ... cascade` and `on conflict` upserts for the buckets.

Also create one user in **Supabase Dashboard → Authentication → Users** (your own email) — `POST /api/admin/login` authenticates against Supabase Auth, and any authenticated user is treated as admin (see `require_admin` in `backend/app/middleware/auth.py`).

---

## Deploying

Two separate Vercel projects, same GitHub repo:

### Backend (`backend/`)
1. New Vercel project → Root Directory: `backend`. `vercel.json` already targets `api/index.py` with `@vercel/python`.
2. Run `backend/supabase_schema.sql` against your Supabase project (see above) and create the two storage buckets + your admin user if you haven't already.
3. Set these env vars in the Vercel project (values from `backend/.env.example`):
   - `APP_ENV=production`
   - `FRONTEND_ORIGIN` — your deployed frontend URL (CORS)
   - `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`
   - `GITHUB_TOKEN`, `GITHUB_USERNAME`
   - `GOOGLE_API_KEY`, `GOOGLE_ADK_MODEL`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `NOTIFY_EMAIL`
   - `N8N_CONTACT_WEBHOOK_URL`, `N8N_GITHUB_SYNC_WEBHOOK_URL` (optional)
   - `RATE_LIMIT_CHATBOT`, `RATE_LIMIT_CONTACT`
4. Deploy, then note the resulting URL (e.g. `https://your-backend.vercel.app`).

### Frontend (`client/`)
1. New Vercel project → Root Directory: `client`. `vercel.json` already rewrites all routes to `index.html` for the SPA.
2. Set env vars (from `client/.env.example`):
   - `VITE_API_BASE_URL` — the backend URL from step 4 above
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
3. Deploy.
4. Go back to the backend project and update `FRONTEND_ORIGIN` to this frontend URL, then redeploy the backend.

### n8n (optional)
Import the workflow JSON files below if you want contact-form emails and GitHub sync; otherwise leave `N8N_*_WEBHOOK_URL` unset and those features just no-op.

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
