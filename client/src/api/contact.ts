import apiClient from './client'

export interface ContactPayload {
  sender_name: string
  sender_email: string
  subject: string
  body: string
  allow_email: boolean
}

export const submitContactForm = (data: ContactPayload) =>
  apiClient.post('/api/messages', data).then((r) => r.data)
