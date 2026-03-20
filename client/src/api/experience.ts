import apiClient from './client'

export interface Experience {
  id: string
  role: string
  company: string
  location: string
  period: string
  type: string
  highlights: string[]
  tech: string[]
  display_order: number
  is_visible: boolean
}

export const fetchExperience = () =>
  apiClient.get<Experience[]>('/api/experience').then((r) => r.data)
