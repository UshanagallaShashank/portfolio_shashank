import { useEffect, useState } from 'react'
import { Box, Typography, CircularProgress, IconButton, Tooltip, Chip, Divider } from '@mui/material'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import DeleteIcon from '@mui/icons-material/Delete'
import GlassCard from '../../components/ui/GlassCard'
import { fetchMessages, markMessageRead, deleteMessage } from '../../api/admin'
import type { Message } from '../../api/admin'

export default function AdminMessagesViewer() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => fetchMessages().then(setMessages).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const handleMarkRead = async (id: string) => {
    await markMessageRead(id)
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_read: true } : m))
  }

  const handleDelete = async (id: string) => {
    await deleteMessage(id)
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress sx={{ color: '#00B4D8' }} /></Box>

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} color="#E2E8F0" sx={{ mb: 4 }}>Messages</Typography>
      {messages.length === 0 && (
        <Typography color="text.secondary">No messages yet.</Typography>
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {messages.map((msg) => (
          <GlassCard key={msg.id} hover={false} sx={{ p: 3, opacity: msg.is_read ? 0.7 : 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box>
                <Typography fontWeight={700} color="#E2E8F0" sx={{ display: 'inline', mr: 1 }}>
                  {msg.sender_name}
                </Typography>
                <Typography component="span" variant="body2" color="text.secondary">
                  &lt;{msg.sender_email}&gt;
                </Typography>
                {!msg.is_read && (
                  <Chip label="Unread" size="small" sx={{ ml: 1, bgcolor: 'rgba(0,180,216,0.15)', color: '#00B4D8', height: 20 }} />
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {!msg.is_read && (
                  <Tooltip title="Mark as read">
                    <IconButton size="small" onClick={() => handleMarkRead(msg.id)} sx={{ color: '#10B981' }}>
                      <MarkEmailReadIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Delete">
                  <IconButton size="small" onClick={() => handleDelete(msg.id)} sx={{ color: '#EF4444' }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            {msg.subject && (
              <Typography variant="body2" fontWeight={600} color="#94A3B8" sx={{ mb: 0.5 }}>
                Re: {msg.subject}
              </Typography>
            )}
            <Divider sx={{ my: 1, borderColor: 'rgba(0,180,216,0.08)' }} />
            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
              {msg.body}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
              {new Date(msg.created_at).toLocaleString()}
              {msg.allow_email && ' · Consented to email'}
            </Typography>
          </GlassCard>
        ))}
      </Box>
    </Box>
  )
}
