import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import type { ComponentProps } from 'react'

interface Props extends Omit<ComponentProps<typeof Box>, 'component'> {
  hover?: boolean
  glow?: boolean
}

export default function GlassCard({ children, hover = true, glow = false, sx, ...rest }: Props) {
  const { isDark } = useTheme()

  return (
    <Box
      component={motion.div}
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      sx={{
        background: isDark
          ? 'rgba(20, 28, 48, 0.8)'
          : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${isDark ? 'rgba(0,180,216,0.15)' : 'rgba(0,150,183,0.15)'}`,
        borderRadius: 3,
        transition: 'all 0.3s ease',
        ...(glow && {
          boxShadow: '0 0 20px rgba(0,180,216,0.12)',
        }),
        '&:hover': hover ? {
          borderColor: 'rgba(0,180,216,0.4)',
          boxShadow: '0 8px 32px rgba(0,180,216,0.18)',
        } : {},
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Box>
  )
}
