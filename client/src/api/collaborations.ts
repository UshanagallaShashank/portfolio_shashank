import apiClient from './client'

export interface Collaboration {
  id: string
  title: string
  description: string
  link: string | null
  link_label: string | null
  color: string
  icon: string
  display_order: number
  is_visible: boolean
}

export const fetchCollaborations = () =>
  apiClient.get<Collaboration[]>('/api/collaborations').then((r) => r.data)
