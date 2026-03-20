import { Box, Container, Typography, Button, Avatar, Stack, Tooltip, IconButton } from '@mui/material'
import { motion } from 'framer-motion'
import DownloadIcon from '@mui/icons-material/Download'
import ChatIcon from '@mui/icons-material/Chat'
import GitHubIcon from '@mui/icons-material/GitHub'
import { useApiCache } from '../../../hooks/useApiCache'
import { fetchStats } from '../../../api/stats'
import type { Stat } from '../../../api/stats'
import { fetchProfile } from '../../../api/profile'
import type { ProfileSettings } from '../../../api/profile'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import TypewriterText from '../../ui/TypewriterText'
import { PERSONAL } from '../../../constants/personal'
import { staggerContainer, fadeInLeft, fadeInRight, fadeInUp } from '../../../utils/animationVariants'

export default function HeroSection() {
  const { data: stats } = useApiCache<Stat[]>('stats', fetchStats)
  const { data: profile } = useApiCache<ProfileSettings>('profile', fetchProfile)
  const avatarUrl = profile?.avatar_url ?? PERSONAL.avatarUrl

  const handleDownload = () => {
    window.open(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${PERSONAL.resumeDownloadPath}`,
      '_blank'
    )
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0A0E1A 0%, #0F1629 50%, #141c30 100%)',
      }}
    >
      {/* Animated background orbs */}
      <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        {[
          { x: '10%', y: '20%', color: 'rgba(0,180,216,0.12)', size: 400 },
          { x: '80%', y: '60%', color: 'rgba(124,58,237,0.1)', size: 350 },
          { x: '50%', y: '80%', color: 'rgba(0,180,216,0.06)', size: 300 },
        ].map((orb, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: orb.x,
              top: orb.y,
              width: orb.size,
              height: orb.size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${orb.color}, transparent)`,
              transform: 'translate(-50%, -50%)',
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 4 + i * 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {/* Grid overlay */}
        <Box sx={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(0,180,216,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,216,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          component={motion.div}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 3, md: 8 },
            flexDirection: { xs: 'column', md: 'row' },
            pt: { xs: 2, md: 0 },
          }}
        >
          {/* Text content */}
          <Box component={motion.div} variants={fadeInLeft} sx={{ flex: 1, maxWidth: { md: 600 }, width: '100%' }}>
            <motion.div variants={fadeInUp} style={{ marginBottom: 20 }}>
            </motion.div>

            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: '2.4rem', sm: '3rem', md: '3.8rem' },
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                color: '#E2E8F0',
                mb: 1,
              }}
            >
              Hi, I'm{' '}
              <Box component="span" sx={{
                background: 'linear-gradient(135deg, #00B4D8, #7C3AED)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {PERSONAL.firstName}
              </Box>
            </Typography>

            <Box sx={{ mb: 3, height: { xs: 40, md: 50 } }}>
              <TypewriterText
                sequences={PERSONAL.taglines}
                fontSize={{ xs: '1.2rem', md: '1.5rem' }}
              />
            </Box>

            <Typography
              variant="body1"
              sx={{ color: '#94A3B8', lineHeight: 1.8, mb: 4, fontSize: { xs: '0.95rem', md: '1.05rem' } }}
            >
              {PERSONAL.bio}
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<DownloadIcon />}
                  onClick={handleDownload}
                  sx={{
                    background: 'linear-gradient(135deg, #00B4D8, #0096B7)',
                    color: '#fff',
                    px: 4, py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    boxShadow: '0 0 20px rgba(0,180,216,0.3)',
                    '&:hover': { boxShadow: '0 0 35px rgba(0,180,216,0.5)' },
                  }}
                >
                  Download Resume
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<ChatIcon />}
                  href="/contact"
                  sx={{
                    borderColor: 'rgba(0,180,216,0.5)',
                    color: '#00B4D8',
                    px: 4, py: 1.5,
                    fontWeight: 700,
                    fontSize: '1rem',
                    '&:hover': {
                      borderColor: '#00B4D8',
                      background: 'rgba(0,180,216,0.08)',
                      boxShadow: '0 0 20px rgba(0,180,216,0.2)',
                    },
                  }}
                >
                  Let's Talk
                </Button>
              </motion.div>
            </Stack>

            <Stack direction="row" spacing={1}>
              {[
                { icon: <GitHubIcon />, href: PERSONAL.github, label: 'GitHub' },
                { icon: <LinkedInIcon />, href: PERSONAL.linkedin, label: 'LinkedIn' },
              ].map((s) => (
                <Tooltip key={s.label} title={s.label}>
                  <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }}>
                    <IconButton
                      component="a" href={s.href} target="_blank" rel="noopener noreferrer"
                      sx={{
                        color: '#94A3B8',
                        border: '1px solid rgba(148,163,184,0.2)',
                        borderRadius: 2,
                        '&:hover': { color: '#00B4D8', borderColor: 'rgba(0,180,216,0.4)', background: 'rgba(0,180,216,0.08)' },
                      }}
                    >
                      {s.icon}
                    </IconButton>
                  </motion.div>
                </Tooltip>
              ))}
            </Stack>
          </Box>

          {/* Avatar side */}
          <Box component={motion.div} variants={fadeInRight} sx={{ flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Box sx={{ position: 'relative' }}>
                {/* Glow ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  style={{
                    position: 'absolute', inset: -4,
                    borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, #00B4D8, #7C3AED, #00B4D8)',
                    zIndex: 0,
                  }}
                />
                <Box sx={{ position: 'relative', zIndex: 1, p: 0.5, borderRadius: '50%', background: '#0A0E1A' }}>
                  <Avatar
                    src={avatarUrl}
                    alt={PERSONAL.name}
                    sx={{
                      width: { xs: 200, md: 280 },
                      height: { xs: 200, md: 280 },
                      border: '4px solid #0A0E1A',
                    }}
                  />
                </Box>
                {/* Status badge */}
                <Box sx={{
                  position: 'absolute', bottom: 8, right: 8, zIndex: 2,
                  background: '#141c30', border: '2px solid rgba(0,180,216,0.4)',
                  borderRadius: 2, px: 1.5, py: 0.5,
                  display: 'flex', alignItems: 'center', gap: 0.5,
                }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
                  <Typography sx={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 500 }}>Open to work</Typography>
                </Box>
              </Box>
            </motion.div>
          </Box>
        </Box>

        {/* Stats row */}
        <Box
          component={motion.div}
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
          sx={{
            mt: 8, display: 'flex', gap: { xs: 3, md: 6 },
            flexWrap: 'wrap', justifyContent: { xs: 'center', md: 'flex-start' },
          }}
        >
          {(stats ?? []).map((stat) => (
            <Box key={stat.label} sx={{ textAlign: 'center' }}>
              <Typography sx={{
                fontSize: { xs: '1.4rem', md: '1.8rem' },
                fontWeight: 800,
                background: 'linear-gradient(135deg, #00B4D8, #7C3AED)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                {stat.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  )
}
