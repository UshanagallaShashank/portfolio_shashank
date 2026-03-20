import { Box } from '@mui/material'
import { useTheme } from '../../context/ThemeContext'

export default function GlobalBackground() {
  const { isDark } = useTheme()

  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        background: isDark
          ? 'linear-gradient(135deg, #060A14 0%, #0A0E1A 40%, #0C1120 100%)'
          : 'linear-gradient(160deg, #F0F7FF 0%, #EBF5FF 25%, #F4F0FF 55%, #EBF9FC 100%)',
      }}
    >
      {isDark ? (
        <>
          {/* DARK MODE ORBS */}
          <Box sx={{
            position: 'absolute', top: '-18%', right: '-8%',
            width: 700, height: 700, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,180,216,0.22) 0%, rgba(0,180,216,0.06) 45%, transparent 70%)',
            filter: 'blur(55px)',
          }} />
          <Box sx={{
            position: 'absolute', bottom: '-15%', left: '-8%',
            width: 620, height: 620, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.05) 45%, transparent 70%)',
            filter: 'blur(55px)',
          }} />
          <Box sx={{
            position: 'absolute', top: '15%', left: '-5%',
            width: 380, height: 380, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }} />
          <Box sx={{
            position: 'absolute', bottom: '5%', right: '20%',
            width: 480, height: 480, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }} />
          {/* Top spotlight sweep */}
          <Box sx={{
            position: 'absolute', top: -300, left: '50%',
            transform: 'translateX(-50%)',
            width: 1400, height: 700,
            background: 'radial-gradient(ellipse, rgba(0,180,216,0.06) 0%, transparent 60%)',
            filter: 'blur(40px)',
          }} />
          {/* Center haze */}
          <Box sx={{
            position: 'absolute', top: '35%', left: '50%',
            transform: 'translateX(-50%)',
            width: 1000, height: 500, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(0,180,216,0.04) 0%, transparent 65%)',
            filter: 'blur(80px)',
          }} />
          {/* Dot grid */}
          <Box sx={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(0,180,216,0.2) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.45,
          }} />
        </>
      ) : (
        <>
          {/* LIGHT MODE — vivid color washes */}

          {/* Top-right large cyan wash */}
          <Box sx={{
            position: 'absolute', top: '-20%', right: '-12%',
            width: 800, height: 800, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,180,216,0.38) 0%, rgba(0,180,216,0.12) 40%, transparent 70%)',
            filter: 'blur(45px)',
          }} />

          {/* Bottom-left large purple wash */}
          <Box sx={{
            position: 'absolute', bottom: '-18%', left: '-10%',
            width: 720, height: 720, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.28) 0%, rgba(124,58,237,0.08) 40%, transparent 70%)',
            filter: 'blur(50px)',
          }} />

          {/* Top-left mid-size cyan accent */}
          <Box sx={{
            position: 'absolute', top: '8%', left: '-4%',
            width: 500, height: 400, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(0,180,216,0.2) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />

          {/* Center-right purple accent */}
          <Box sx={{
            position: 'absolute', top: '40%', right: '-5%',
            width: 420, height: 420, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)',
            filter: 'blur(45px)',
          }} />

          {/* Bottom-center soft teal */}
          <Box sx={{
            position: 'absolute', bottom: '8%', left: '35%',
            width: 560, height: 340, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(0,180,216,0.15) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }} />

          {/* Top spotlight — warm white glow */}
          <Box sx={{
            position: 'absolute', top: -200, left: '50%',
            transform: 'translateX(-50%)',
            width: 1200, height: 600,
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, transparent 65%)',
            filter: 'blur(30px)',
          }} />

          {/* Dot grid — more visible in light mode */}
          <Box sx={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(rgba(0,140,175,0.22) 1px, transparent 1px)',
            backgroundSize: '26px 26px',
            opacity: 0.7,
          }} />
        </>
      )}
    </Box>
  )
}
