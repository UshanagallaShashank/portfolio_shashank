import apiClient from './client'

export interface Achievement {
  id: string
  label: string
  detail: string
  icon: string
  display_order: number
  is_visible: boolean
}

export interface Certification {
  id: string
  title: string
  issuer: string
  url: string
  display_order: number
  is_visible: boolean
}

export const fetchAchievements = () =>
  apiClient.get<Achievement[]>('/api/achievements').then((r) => r.data)

export const fetchCertifications = () =>
  apiClient.get<Certification[]>('/api/achievements/certifications').then((r) => r.data)
