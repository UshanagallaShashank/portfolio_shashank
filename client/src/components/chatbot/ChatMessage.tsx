import { Box, Typography, Avatar } from '@mui/material'
import { motion } from 'framer-motion'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import PersonIcon from '@mui/icons-material/Person'

interface Props {
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

export default function ChatMessage({ role, content, timestamp }: Props) {
  const isBot = role === 'assistant'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          flexDirection: isBot ? 'row' : 'row-reverse',
          mb: 2,
          alignItems: 'flex-start',
        }}
      >
        <Avatar
          sx={{
            width: 30, height: 30, flexShrink: 0,
            background: isBot ? 'linear-gradient(135deg, #00B4D8, #7C3AED)' : 'rgba(0,180,216,0.2)',
            border: isBot ? 'none' : '1px solid rgba(0,180,216,0.4)',
          }}
        >
          {isBot ? <SmartToyIcon sx={{ fontSize: 16 }} /> : <PersonIcon sx={{ fontSize: 16, color: '#00B4D8' }} />}
        </Avatar>

        <Box sx={{ maxWidth: '80%' }}>
          <Box
            sx={{
              px: 2, py: 1.5, borderRadius: isBot ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
              background: isBot
                ? 'rgba(0,180,216,0.08)'
                : 'linear-gradient(135deg, rgba(0,180,216,0.15), rgba(124,58,237,0.15))',
              border: `1px solid ${isBot ? 'rgba(0,180,216,0.2)' : 'rgba(124,58,237,0.2)'}`,
            }}
          >
            <Typography
              variant="body2"
              sx={{ color: '#E2E8F0', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
            >
              {content}
            </Typography>
          </Box>
          {timestamp && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3, display: 'block', textAlign: isBot ? 'left' : 'right' }}>
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Typography>
          )}
        </Box>
      </Box>
    </motion.div>
  )
}
