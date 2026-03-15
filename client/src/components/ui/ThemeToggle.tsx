import { IconButton, Tooltip } from '@mui/material'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <Tooltip title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <IconButton
        onClick={toggleTheme}
        sx={{
          color: '#00B4D8',
          border: '1px solid rgba(0,180,216,0.3)',
          borderRadius: '8px',
          width: 38,
          height: 38,
          '&:hover': {
            background: 'rgba(0,180,216,0.1)',
            borderColor: '#00B4D8',
          },
        }}
      >
        <motion.span
          key={isDark ? 'moon' : 'sun'}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{ display: 'flex', alignItems: 'center', fontSize: '1.1rem' }}
        >
          {isDark ? '☀️' : '🌙'}
        </motion.span>
      </IconButton>
    </Tooltip>
  )
}
