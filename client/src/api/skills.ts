import apiClient from './client'

export interface Skill {
  id: string
  name: string
  category: string | null
  icon_url: string | null
  proficiency: number
  display_order: number
  is_visible: boolean
}

export const fetchSkills = () =>
  apiClient.get<Skill[]>('/api/skills').then((r) => r.data)

export const fetchAllSkills = () =>
  apiClient.get<Skill[]>('/api/skills/all').then((r) => r.data)

export const toggleSkillVisibility = (id: string, is_visible: boolean) =>
  apiClient.patch(`/api/skills/${id}`, { is_visible }).then((r) => r.data)
