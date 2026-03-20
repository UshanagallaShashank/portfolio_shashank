import apiClient from './client'

export interface ProfileSettings {
  hero_avatar_url?: string
  about_avatar_url?: string
  avatar_url?: string          // legacy fallback
  [key: string]: string | undefined
}

export const fetchProfile = () =>
  apiClient.get<ProfileSettings>('/api/profile').then((r) => r.data)

export const assignPhotoToSection = (photoId: string, section: 'hero' | 'about') =>
  apiClient.post(`/api/profile/photos/${photoId}/assign/${section}`).then((r) => r.data)

export const unsetSection = (section: 'hero' | 'about') =>
  apiClient.delete(`/api/profile/sections/${section}`)

export const updateProfile = (data: Partial<ProfileSettings>) =>
  apiClient.patch<ProfileSettings>('/api/profile', data).then((r) => r.data)
