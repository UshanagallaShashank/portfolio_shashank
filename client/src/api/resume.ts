import apiClient from './client'

export interface ResumeVersion {
  id: string
  file_name: string
  storage_path: string
  public_url: string
  is_active: boolean
  uploaded_at: string
}

export const fetchResumeVersions = () =>
  apiClient.get<ResumeVersion[]>('/api/resume').then((r) => r.data)

export const activateResume = (resumeId: string) =>
  apiClient.post<ResumeVersion>(`/api/resume/${resumeId}/activate`).then((r) => r.data)

export const uploadResume = (file: File) => {
  const form = new FormData()
  form.append('file', file)
  return apiClient.post<ResumeVersion>('/api/resume/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data)
}

export const deleteResume = (resumeId: string) =>
  apiClient.delete(`/api/resume/${resumeId}`)
