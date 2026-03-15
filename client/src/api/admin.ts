import apiClient from './client'

export interface DashboardStats {
  total_messages: number
  unread_messages: number
  total_projects: number
  active_resume: string | null
}

export interface Message {
  id: string
  sender_name: string
  sender_email: string
  subject: string | null
  body: string
  allow_email: boolean
  is_read: boolean
  created_at: string
}

export const adminLogin = (email: string, password: string) =>
  apiClient.post<{ access_token: string; token_type: string }>('/api/admin/login', { email, password }).then((r) => r.data)

export const fetchDashboardStats = () =>
  apiClient.get<DashboardStats>('/api/admin/dashboard').then((r) => r.data)

export const fetchMessages = () =>
  apiClient.get<Message[]>('/api/messages').then((r) => r.data)

export const markMessageRead = (id: string) =>
  apiClient.patch(`/api/messages/${id}/read`).then((r) => r.data)

export const deleteMessage = (id: string) =>
  apiClient.delete(`/api/messages/${id}`)
