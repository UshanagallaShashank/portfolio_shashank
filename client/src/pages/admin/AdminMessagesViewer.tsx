import { useState, useEffect } from 'react'
import {
  Box, Typography, Chip, IconButton, Tooltip,
  Table, TableBody, TableCell, TableHead, TableRow, CircularProgress,
} from '@mui/material'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import GlassCard from '../../components/ui/GlassCard'
import { getMessages, markMessageRead, deleteMessage } from '../../api/admin'

interface Message {
  id: string
  sender_name: string
  sender_email: string
  subject: string
  body: string
  allow_email: boolean
  is_read: boolean
  created_at: string
}

export default function AdminMessagesViewer() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    getMessages().then(setMessages).catch(() => {}).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleRead = async (id: string) => {
    await markMessageRead(id).catch(() => {})
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, is_read: true } : m))
  }

  const handleDelete = async (id: string) => {
    await deleteMessage(id).catch(() => {})
    setMessages((prev) => prev.filter((m) => m.id !== id))
  }

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ color: '#E2E8F0', mb: 4 }}>
        Messages
        {messages.filter((m) => !m.is_read).length > 0 && (
          <Chip
            label={`${messages.filter((m) => !m.is_read).length} unread`}
            size="small"
            sx={{ ml: 2, background: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}
          />
        )}
      </Typography>

      <GlassCard sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress sx={{ color: '#00B4D8' }} />
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                {['From', 'Subject', 'Email Opt-in', 'Date', 'Actions'].map((h) => (
                  <TableCell key={h} sx={{ color: '#64748B', borderBottom: '1px solid rgba(0,180,216,0.15)', fontWeight: 600 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {messages.map((msg) => (
                <TableRow key={msg.id} sx={{ background: msg.is_read ? 'transparent' : 'rgba(0,180,216,0.04)' }}>
                  <TableCell sx={{ borderBottom: '1px solid rgba(0,180,216,0.08)' }}>
                    <Box>
                      <Typography variant="body2" fontWeight={msg.is_read ? 400 : 700} sx={{ color: '#E2E8F0' }}>{msg.sender_name}</Typography>
                      <Typography variant="caption" color="text.secondary">{msg.sender_email}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: '#94A3B8', borderBottom: '1px solid rgba(0,180,216,0.08)', maxWidth: 200 }}>
                    <Box>
                      <Typography variant="body2" sx={{ color: '#E2E8F0' }} noWrap>{msg.subject || '(No subject)'}</Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>{msg.body}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(0,180,216,0.08)' }}>
                    {msg.allow_email ? (
                      <Chip icon={<EmailIcon />} label="Yes" size="small" sx={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', fontSize: '0.7rem' }} />
                    ) : (
                      <Chip label="No" size="small" sx={{ background: 'rgba(100,116,139,0.1)', color: '#64748B', fontSize: '0.7rem' }} />
                    )}
                  </TableCell>
                  <TableCell sx={{ color: '#64748B', borderBottom: '1px solid rgba(0,180,216,0.08)', fontSize: '0.75rem', whiteSpace: 'nowrap' }}>
                    {new Date(msg.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell sx={{ borderBottom: '1px solid rgba(0,180,216,0.08)' }}>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {!msg.is_read && (
                        <Tooltip title="Mark as read">
                          <IconButton size="small" onClick={() => handleRead(msg.id)} sx={{ color: '#00B4D8' }}>
                            <MarkEmailReadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      <Tooltip title="Delete">
                        <IconButton size="small" onClick={() => handleDelete(msg.id)} sx={{ color: '#64748B', '&:hover': { color: '#EF4444' } }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {messages.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 6, color: '#64748B' }}>No messages yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </GlassCard>
    </Box>
  )
}
