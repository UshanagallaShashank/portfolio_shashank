import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'

export default function PageLoader() {
  return (
    <Box sx={{
      position: 'fixed',
      inset: 0,
      bgcolor: '#080D1A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      gap: 3,
    }}>
      {/* Logo mark */}
      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Box sx={{
          width: 64,
          height: 64,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #00B4D8, #7C3AED)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 40px rgba(0,180,216,0.3)',
        }}>
          <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: 32, lineHeight: 1 }}>S</Typography>
        </Box>
      </motion.div>

      {/* Animated bar */}
      <Box sx={{ width: 120, height: 3, bgcolor: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '60%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, #00B4D8, #7C3AED, transparent)',
            borderRadius: 2,
          }}
        />
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 2, fontSize: 11, textTransform: 'uppercase' }}>
        Loading
      </Typography>
    </Box>
  )
}
