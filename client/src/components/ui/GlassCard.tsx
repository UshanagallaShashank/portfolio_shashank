import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import { useTheme } from '../../context/ThemeContext'
import type { ComponentProps } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MotionBox = motion(Box as any)

interface Props extends Omit<ComponentProps<typeof Box>, 'component'> {
  hover?: boolean
  glow?: boolean
}

export default function GlassCard({ children, hover = true, glow = false, sx, ...rest }: Props) {
  const { isDark } = useTheme()

  return (
    <MotionBox
      whileHover={hover ? { y: -4, scale: 1.01 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      sx={{
        background: isDark
          ? 'rgba(15, 22, 42, 0.75)'
          : 'rgba(255, 255, 255, 0.72)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: isDark
          ? '1px solid rgba(0,180,216,0.15)'
          : '1px solid rgba(0,150,183,0.22)',
        borderRadius: 3,
        boxShadow: isDark
          ? (glow ? '0 0 24px rgba(0,180,216,0.14)' : '0 2px 16px rgba(0,0,0,0.35)')
          : (glow
            ? '0 0 28px rgba(0,150,183,0.2), 0 4px 20px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.85)'
            : '0 4px 20px rgba(0,150,183,0.1), 0 1px 4px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.85)'),
        transition: 'all 0.3s ease',
        '&:hover': hover ? {
          borderColor: isDark ? 'rgba(0,180,216,0.4)' : 'rgba(0,180,216,0.5)',
          boxShadow: isDark
            ? '0 8px 32px rgba(0,180,216,0.18)'
            : '0 8px 36px rgba(0,150,183,0.22), 0 2px 8px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
        } : {},
        ...sx,
      }}
      {...rest}
    >
      {children}
    </MotionBox>
  )
}
