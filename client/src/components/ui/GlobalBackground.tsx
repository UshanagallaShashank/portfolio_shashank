import { Box } from '@mui/material'
import { useTheme } from '../../context/ThemeContext'

/**
 * Full-screen fixed background layer with ambient gradient orbs and grid.
 * Renders behind all page content via z-index ordering.
 * Used in AppRouter so it covers both public and admin layouts.
 */
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
          : 'linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 55%, #F3F0FF 100%)',
      }}
    >
      {/* ── Orb 1 · top-right · primary cyan ── */}
      <Box sx={{
        position: 'absolute',
        top: '-18%',
        right: '-8%',
        width: 700,
        height: 700,
        borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(0,180,216,0.22) 0%, rgba(0,180,216,0.06) 45%, transparent 70%)'
          : 'radial-gradient(circle, rgba(0,180,216,0.25) 0%, rgba(0,180,216,0.08) 45%, transparent 70%)',
        filter: 'blur(55px)',
      }} />

      {/* ── Orb 2 · bottom-left · accent purple ── */}
      <Box sx={{
        position: 'absolute',
        bottom: '-15%',
        left: '-8%',
        width: 620,
        height: 620,
        borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(124,58,237,0.18) 0%, rgba(124,58,237,0.05) 45%, transparent 70%)'
          : 'radial-gradient(circle, rgba(124,58,237,0.14) 0%, rgba(124,58,237,0.04) 45%, transparent 70%)',
        filter: 'blur(55px)',
      }} />

      {/* ── Orb 3 · center-bottom · secondary cyan ── */}
      <Box sx={{
        position: 'absolute',
        bottom: '5%',
        right: '20%',
        width: 480,
        height: 480,
        borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)'
          : 'radial-gradient(circle, rgba(0,180,216,0.1) 0%, transparent 70%)',
        filter: 'blur(60px)',
      }} />

      {/* ── Orb 4 · top-left · accent warm (dark only) ── */}
      {isDark && (
        <Box sx={{
          position: 'absolute',
          top: '15%',
          left: '-5%',
          width: 380,
          height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />
      )}

      {/* ── Orb 5 · light mode only · warm peach highlight ── */}
      {!isDark && (
        <Box sx={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 500,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(0,180,216,0.1) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }} />
      )}

      {/* ── Center ambient haze ── */}
      <Box sx={{
        position: 'absolute',
        top: '35%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 1000,
        height: 500,
        borderRadius: '50%',
        background: isDark
          ? 'radial-gradient(ellipse, rgba(0,180,216,0.04) 0%, transparent 65%)'
          : 'radial-gradient(ellipse, rgba(0,180,216,0.06) 0%, transparent 65%)',
        filter: 'blur(80px)',
      }} />

      {/* ── Dot grid ── */}
      <Box sx={{
        position: 'absolute',
        inset: 0,
        backgroundImage: isDark
          ? 'radial-gradient(rgba(0,180,216,0.2) 1px, transparent 1px)'
          : 'radial-gradient(rgba(0,150,183,0.18) 1px, transparent 1px)',
        backgroundSize: '28px 28px',
        opacity: isDark ? 0.45 : 0.55,
      }} />

      {/* ── Top spotlight sweep (dark mode) ── */}
      {isDark && (
        <Box sx={{
          position: 'absolute',
          top: -300,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 1400,
          height: 700,
          background: 'radial-gradient(ellipse, rgba(0,180,216,0.06) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }} />
      )}
    </Box>
  )
}
