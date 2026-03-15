import apiClient from './client'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface ChatResponse {
  session_id: string
  reply: string
  messages: ChatMessage[]
}

export const sendChatMessage = (session_id: string, message: string) =>
  apiClient.post<ChatResponse>('/api/chatbot/chat', { session_id, message }).then((r) => r.data)

export const clearChatSession = (session_id: string) =>
  apiClient.delete(`/api/chatbot/chat/${session_id}`)
