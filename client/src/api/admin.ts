import apiClient from './client'

export interface DashboardStats {
  total_messages: number
  unread_messages: number
  total_projects: number
  active_resume: string | null
}

export const adminLogin = (email: string, password: string) =>
  apiClient.post<{ access_token: string }>('/api/admin/login', { email, password }).then((r) => r.data)

export const getDashboardStats = () =>
  apiClient.get<DashboardStats>('/api/admin/dashboard').then((r) => r.data)

export const getMessages = () =>
  apiClient.get('/api/messages').then((r) => r.data)

export const markMessageRead = (id: string) =>
  apiClient.put(`/api/messages/${id}/read`).then((r) => r.data)

export const deleteMessage = (id: string) =>
  apiClient.delete(`/api/messages/${id}`).then((r) => r.data)

export const uploadResume = (file: File) => {
  const fd = new FormData()
  fd.append('file', file)
  return apiClient.post('/api/resume/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data)
}

export const getResumeVersions = () =>
  apiClient.get('/api/resume/versions').then((r) => r.data)

export const activateResume = (id: string) =>
  apiClient.put(`/api/resume/${id}/activate`).then((r) => r.data)
