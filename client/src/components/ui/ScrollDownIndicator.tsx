import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'

export default function ScrollDownIndicator() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const check = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      // Show if there's meaningful content below and not near the bottom
      setVisible(total > 80 && scrolled < total - 80)
    }

    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check, { passive: true })
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [])

  const handleClick = () => {
    window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            bottom: 28,
            right: 28,
            zIndex: 1200,
          }}
        >
          <Box
            onClick={handleClick}
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              bgcolor: 'rgba(10,15,30,0.85)',
              border: '1px solid rgba(0,180,216,0.35)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 16px rgba(0,180,216,0.15)',
              transition: 'all 0.2s',
              '&:hover': {
                borderColor: '#00B4D8',
                boxShadow: '0 0 24px rgba(0,180,216,0.35)',
                transform: 'translateY(2px)',
              },
            }}
          >
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <KeyboardArrowDownIcon sx={{ color: '#00B4D8', fontSize: 22, display: 'block' }} />
            </motion.div>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
