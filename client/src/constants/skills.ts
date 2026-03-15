export interface Skill {
  name: string
  category: string
  proficiency: number
  icon?: string
}

export const SKILLS: Skill[] = [
  // Languages
  { name: 'Python', category: 'Languages', proficiency: 90, icon: '🐍' },
  { name: 'TypeScript', category: 'Languages', proficiency: 88, icon: '📘' },
  { name: 'JavaScript', category: 'Languages', proficiency: 90, icon: '💛' },
  { name: 'Java', category: 'Languages', proficiency: 80, icon: '☕' },
  // Frameworks
  { name: 'FastAPI', category: 'Backend', proficiency: 88, icon: '⚡' },
  { name: 'React.js', category: 'Frontend', proficiency: 90, icon: '⚛️' },
  { name: 'Node.js', category: 'Backend', proficiency: 85, icon: '🟢' },
  { name: 'Express.js', category: 'Backend', proficiency: 82, icon: '🚂' },
  // AI / GenAI
  { name: 'Google ADK', category: 'AI/GenAI', proficiency: 85, icon: '🤖' },
  { name: 'LangChain', category: 'AI/GenAI', proficiency: 88, icon: '🔗' },
  { name: 'LangGraph', category: 'AI/GenAI', proficiency: 85, icon: '📊' },
  { name: 'RAG Pipelines', category: 'AI/GenAI', proficiency: 88, icon: '🧠' },
  { name: 'Gemini API', category: 'AI/GenAI', proficiency: 82, icon: '💎' },
  // Databases
  { name: 'PostgreSQL', category: 'Databases', proficiency: 82, icon: '🐘' },
  { name: 'MongoDB', category: 'Databases', proficiency: 85, icon: '🍃' },
  { name: 'Supabase', category: 'Databases', proficiency: 80, icon: '⚡' },
  { name: 'MySQL', category: 'Databases', proficiency: 78, icon: '🐬' },
  // Tools & Other
  { name: 'WebRTC', category: 'Tools', proficiency: 80, icon: '📡' },
  { name: 'n8n', category: 'Tools', proficiency: 78, icon: '🔄' },
  { name: 'WebSocket', category: 'Tools', proficiency: 82, icon: '🔌' },
  { name: 'REST APIs', category: 'Tools', proficiency: 90, icon: '🌐' },
  { name: 'Playwright', category: 'Tools', proficiency: 78, icon: '🎭' },
  { name: 'Git', category: 'Tools', proficiency: 88, icon: '📝' },
  { name: 'TailwindCSS', category: 'Frontend', proficiency: 85, icon: '🎨' },
]

export const SKILL_CATEGORIES = ['All', 'Languages', 'Frontend', 'Backend', 'AI/GenAI', 'Databases', 'Tools']
