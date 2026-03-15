import apiClient from './client'

export interface Stat {
  id: string
  label: string
  value: string
  display_order: number
  is_visible: boolean
}

export const fetchStats = () =>
  apiClient.get<Stat[]>('/api/stats').then((r) => r.data)
