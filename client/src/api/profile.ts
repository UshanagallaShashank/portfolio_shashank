import apiClient from './client'

export interface ProfileSettings {
  avatar_url?: string
  [key: string]: string | undefined
}

export const fetchProfile = () =>
  apiClient.get<ProfileSettings>('/api/profile').then((r) => r.data)

export const uploadAvatar = (file: File) => {
  const form = new FormData()
  form.append('file', file)
  return apiClient
    .post<{ avatar_url: string }>('/api/profile/avatar/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data)
}

export const updateProfile = (data: Partial<ProfileSettings>) =>
  apiClient.patch<ProfileSettings>('/api/profile', data).then((r) => r.data)
