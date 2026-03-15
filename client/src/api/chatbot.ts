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

export const sendChatMessage = (payload: { session_id: string; message: string }) =>
  apiClient.post<ChatResponse>('/api/chatbot/chat', payload).then((r) => r.data)

export const getChatSession = (sessionId: string) =>
  apiClient.get<{ messages: ChatMessage[] }>(`/api/chatbot/session/${sessionId}`).then((r) => r.data)

export const clearChatSession = (sessionId: string) =>
  apiClient.delete(`/api/chatbot/session/${sessionId}`)
