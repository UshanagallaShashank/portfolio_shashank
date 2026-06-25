export const PERSONAL = {
  name: 'Ushanagalla Shashank',
  firstName: 'Shashank',
  title: 'AI Engineer',
  company: 'RealPage Inc',
  taglines: [
    'AI Engineer & GenAI Specialist',
    'Multimodal RAG & Agentic Systems Builder',
    'FastAPI + React Full-Stack Developer',
    'WebRTC & Real-Time Voice AI Engineer',
    'MLOps & CI/CD Practitioner',
  ],
  bio: `AI Engineer with 2 years of experience building production-grade AI systems at enterprise scale — multimodal pipelines, RAG, real-time WebRTC voice, and agentic automation. Work featured by OpenAI for Business on LinkedIn. Owns the full stack: architecture, LLM fine-tuning, and CI/CD-driven MLOps deployment.`,
  email: 'ushanagallashashank@gmail.com',
  phone: '+91 85230 60395',
  location: 'Hyderabad, Telangana, India',
  linkedin: 'https://www.linkedin.com/in/ushanagallashashank/',
  github: 'https://github.com/UshanagallaShashank',
  githubUsername: 'UshanagallaShashank',
  leetcode: 'https://leetcode.com/u/UshanagallaShashank/',
  freelancing: 'https://giftedict.com/',
  website: 'https://ushanagalla-shashank.vercel.app',
  avatarUrl: 'https://github.com/UshanagallaShashank.png',
  resumeDownloadPath: '/api/resume/download',
}

export const EXPERIENCE = [
  {
    role: 'AI Engineer',
    company: 'RealPage Inc',
    location: 'Hyderabad',
    period: 'April 2025 – Present',
    type: 'Full-time',
    highlights: [
      'Lumina AI Screen Share (featured by OpenAI for Business on LinkedIn): sole architect and developer of an AI-powered screen-share voice bot delivering autonomous real-time guidance for complex SaaS workflows with zero human agent intervention',
      'Built a multimodal pipeline — OpenAI vision + RAG knowledge base + WebRTC — that interprets the live screen, retrieves contextual help, and responds with adaptive voice guidance under 2s latency',
      'Automated step-by-step workflow guidance and error recovery, directly reducing support ticket volume and agent escalation rate',
      'Improved new-user onboarding accuracy through mid-session context-tracking that adapts guidance to real-time state changes',
      'Genesis — Salesforce Transcript Summariser & Ticket Mapper: built an LLM pipeline to ingest and summarise support transcripts, automating ticket classification and cutting agent triage time by ~30%',
      'Added real-time question generation, automated summaries, and sentiment categorisation to Genesis with a modular design for shipping new analytics without touching the core pipeline',
      'PDF Masker: built a Python utility to detect and mask PII and financial data across 100s of invoice PDFs per run, keeping the company compliant with data-privacy regulations',
      'Integrated PDF Masker into existing data pipelines via CI/CD, eliminating 100% of manual redaction effort and cutting invoice processing time for the finance team',
    ],
    tech: ['Python', 'OpenAI Vision', 'RAG', 'WebRTC', 'LangChain', 'FastAPI', 'Salesforce', 'CI/CD'],
  },
  {
    role: 'AI Engineer Intern',
    company: 'RealPage Inc',
    location: 'Hyderabad',
    period: 'July 2024 – April 2025',
    type: 'Internship',
    highlights: [
      'Built an LLM-enhanced web scraper (LangChain) that processed 50,000+ websites, achieving 80% data accuracy and cutting manual data-cleaning effort by 90%',
      'Added a semantic similarity search and categorisation layer to organise and retrieve large datasets, improving retrieval precision across internal tools',
      'Identified and proposed a data pipeline improvement adopted by the team, reducing repeated manual processing steps',
    ],
    tech: ['LangChain', 'Python', 'Semantic Search', 'Web Scraping'],
  },
  {
    role: 'Teaching Assistant — MERN Stack',
    company: 'Iconnect NFS',
    location: 'Hyderabad',
    period: 'Feb 2024 – Apr 2024',
    type: 'Part-time',
    highlights: [
      'Ran hands-on MERN stack workshops for 100+ working professionals; led Q&A sessions and gave 1:1 technical support',
      'Created reference materials and exercises used by participants to keep building independently post-workshop',
    ],
    tech: ['React', 'Node.js', 'MongoDB', 'Express.js'],
  },
]

export const FEATURED_PROJECTS = [
  {
    title: 'RAGForge',
    description: 'Multi-tenant RAG SaaS platform (FastAPI + LangChain + pgvector + Redis) with BYOK support, tenant data isolation, and streamed responses with source citations. Async job queues handle the full ingestion-to-response pipeline end-to-end.',
    tech: ['FastAPI', 'LangChain', 'pgvector', 'Redis', 'React'],
    github: 'https://github.com/UshanagallaShashank/RAGForge',
    featured: true,
  },
  {
    title: 'Project Orbit',
    description: 'Voice-first multi-agent AI OS: a Google ADK orchestrator routes tasks across 8 specialised agents over the Gemini Live API at under 500ms latency, with hybrid Redis + PostgreSQL/pgvector memory.',
    tech: ['Google ADK', 'Gemini Live API', 'Redis', 'PostgreSQL', 'pgvector', 'React'],
    github: 'https://github.com/UshanagallaShashank/Project-Orbit',
    featured: true,
  },
  {
    title: 'PatchSense PRGuard',
    description: 'AI-powered PR reviewer that analyses diffs and automatically flags bugs, style violations, and security risks before code is merged.',
    tech: ['AI', 'Python', 'GitHub Actions'],
    github: 'https://github.com/UshanagallaShashank/PatchSense-PRGuard',
    featured: true,
  },
  {
    title: 'ai_news_mcp',
    description: 'Open-source MCP (Model Context Protocol) server that streams curated AI news into Claude — a practical reference implementation of MCP for the developer community.',
    tech: ['MCP', 'Python', 'Claude'],
    github: 'https://github.com/UshanagallaShashank/ai_news_mcp',
    featured: true,
  },
]

export const CERTIFICATIONS = [
  {
    title: 'HackerRank Problem Solving',
    issuer: 'HackerRank',
    url: 'https://www.hackerrank.com/certificates/23e555754a76',
  },
  {
    title: 'HackerRank React',
    issuer: 'HackerRank',
    url: 'https://www.hackerrank.com/certificates/42023ae7fa0d',
  },
  {
    title: 'HackerRank Java',
    issuer: 'HackerRank',
    url: 'https://drive.google.com/file/d/1c1akMioczAAE-fdktf0_DrOjIAGIo0b5/view',
  },
]

export const ACHIEVEMENTS = [
  { label: 'Featured by OpenAI', detail: 'Lumina AI Screen Share spotlighted by OpenAI for Business on LinkedIn', icon: '🚀' },
  { label: '350+', detail: 'Problems solved on GeeksforGeeks', icon: '🧠' },
  { label: 'Top 9.5%', detail: 'LeetCode global ranking', icon: '🏆' },
  { label: 'Rank 350', detail: 'TCS CodeVita worldwide', icon: '🌍' },
  { label: '3rd Place', detail: 'KMIT Code Sangram 2023 (200+ participants)', icon: '🥉' },
  { label: '4-Star', detail: 'CodeChef rating (Max: 1850)', icon: '⭐' },
]
