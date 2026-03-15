import { useState, useRef, useEffect } from 'react'
import {
  Box, IconButton, Typography, TextField, Tooltip, CircularProgress,
  Fab, Divider, Zoom,
} from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import CloseIcon from '@mui/icons-material/Close'
import SendIcon from '@mui/icons-material/Send'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import ChatMessage from './ChatMessage'
import { sendChatMessage, clearChatSession, type ChatMessage as IChatMessage } from '../../api/chatbot'

const SESSION_KEY = 'chatbot_session_id'

function getOrCreateSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

const WELCOME: IChatMessage = {
  role: 'assistant',
  content: "Hi! I'm Shashank's portfolio assistant. Ask me about his skills, experience, projects, or how to get in touch!",
  timestamp: new Date().toISOString(),
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<IChatMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sessionId = useRef(getOrCreateSessionId())

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: IChatMessage = { role: 'user', content: text, timestamp: new Date().toISOString() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await sendChatMessage(sessionId.current, text)
      const botMsg: IChatMessage = {
        role: 'assistant',
        content: res.reply,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, botMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm having trouble connecting right now. Please try again or email Shashank directly.", timestamp: new Date().toISOString() },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleClear = async () => {
    try { await clearChatSession(sessionId.current) } catch {}
    sessionStorage.removeItem(SESSION_KEY)
    sessionId.current = getOrCreateSessionId()
    setMessages([WELCOME])
  }

  return (
    <>
      {/* Floating action button */}
      <Zoom in>
        <Tooltip title="Chat with Shashank's AI" placement="left">
          <Fab
            onClick={() => setOpen((p) => !p)}
            sx={{
              position: 'fixed', bottom: 28, right: 28, zIndex: 1400,
              background: 'linear-gradient(135deg, #00B4D8, #7C3AED)',
              boxShadow: '0 0 25px rgba(0,180,216,0.4)',
              '&:hover': { boxShadow: '0 0 40px rgba(0,180,216,0.6)', transform: 'scale(1.05)' },
              transition: 'all 0.3s ease',
            }}
          >
            <motion.div
              animate={open ? { rotate: 180 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {open ? <CloseIcon sx={{ color: '#fff' }} /> : <SmartToyIcon sx={{ color: '#fff' }} />}
            </motion.div>
          </Fab>
        </Tooltip>
      </Zoom>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{
              position: 'fixed', bottom: 100, right: 28, zIndex: 1400,
              width: 380, maxWidth: 'calc(100vw - 40px)',
            }}
          >
            <Box sx={{
              background: 'rgba(15,22,41,0.97)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(0,180,216,0.25)',
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}>
              {/* Header */}
              <Box sx={{
                px: 2.5, py: 2,
                background: 'linear-gradient(135deg, rgba(0,180,216,0.15), rgba(124,58,237,0.15))',
                borderBottom: '1px solid rgba(0,180,216,0.15)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{
                    width: 34, height: 34, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00B4D8, #7C3AED)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <SmartToyIcon sx={{ fontSize: 18, color: '#fff' }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#E2E8F0', lineHeight: 1.2 }}>
                      Shashank's AI
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }} />
                      <Typography variant="caption" sx={{ color: '#10B981', fontSize: '0.68rem' }}>Online</Typography>
                    </Box>
                  </Box>
                </Box>
                <Tooltip title="Clear chat">
                  <IconButton size="small" onClick={handleClear} sx={{ color: '#64748B', '&:hover': { color: '#EF4444' } }}>
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Messages */}
              <Box sx={{ height: 320, overflowY: 'auto', p: 2, '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { background: 'rgba(0,180,216,0.3)', borderRadius: 2 } }}>
                {messages.map((msg, i) => (
                  <ChatMessage key={i} role={msg.role} content={msg.content} timestamp={msg.timestamp} />
                ))}
                {loading && (
                  <Box sx={{ display: 'flex', gap: 1.5, mb: 2, alignItems: 'center' }}>
                    <Box sx={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #00B4D8, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <SmartToyIcon sx={{ fontSize: 14 }} />
                    </Box>
                    <Box sx={{ px: 2, py: 1.5, borderRadius: '4px 12px 12px 12px', background: 'rgba(0,180,216,0.08)', border: '1px solid rgba(0,180,216,0.2)' }}>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {[0, 0.2, 0.4].map((d) => (
                          <motion.div key={d} animate={{ y: [0, -5, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: d }}
                            style={{ width: 6, height: 6, borderRadius: '50%', background: '#00B4D8' }} />
                        ))}
                      </Box>
                    </Box>
                  </Box>
                )}
                <div ref={messagesEndRef} />
              </Box>

              <Divider sx={{ borderColor: 'rgba(0,180,216,0.1)' }} />

              {/* Input */}
              <Box sx={{ p: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  fullWidth size="small" placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: 2,
                      fontSize: '0.875rem',
                      '& fieldset': { borderColor: 'rgba(0,180,216,0.2)' },
                      '&:hover fieldset': { borderColor: 'rgba(0,180,216,0.4)' },
                      '&.Mui-focused fieldset': { borderColor: '#00B4D8' },
                    },
                    '& .MuiInputBase-input': { color: '#E2E8F0', py: 1 },
                  }}
                />
                <IconButton
                  onClick={handleSend} disabled={!input.trim() || loading}
                  sx={{
                    background: 'linear-gradient(135deg, #00B4D8, #7C3AED)',
                    borderRadius: 2, width: 38, height: 38, flexShrink: 0,
                    '&:disabled': { background: 'rgba(100,116,139,0.3)' },
                    '&:hover': { boxShadow: '0 0 15px rgba(0,180,216,0.4)' },
                  }}
                >
                  {loading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <SendIcon sx={{ fontSize: 18, color: '#fff' }} />}
                </IconButton>
              </Box>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
