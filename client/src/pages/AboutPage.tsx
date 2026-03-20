import { Container, Box, Typography, Avatar, Grid } from '@mui/material'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import SectionTitle from '../components/ui/SectionTitle'
import SkillsGrid from '../components/sections/about/SkillsGrid'
import GlassCard from '../components/ui/GlassCard'
import PageWrapper from '../components/layout/PageWrapper'
import { PERSONAL } from '../constants/personal'
import { fadeInLeft, fadeInRight } from '../utils/animationVariants'
import { useApiCache } from '../hooks/useApiCache'
import { fetchProfile } from '../api/profile'
import type { ProfileSettings } from '../api/profile'

export default function AboutPage() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { data: profile } = useApiCache<ProfileSettings>('profile', fetchProfile)
  const avatarUrl = profile?.about_avatar_url ?? profile?.avatar_url ?? PERSONAL.avatarUrl

  return (
    <PageWrapper>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <SectionTitle
          title="About Me"
          subtitle="Developer, AI enthusiast, and problem-solver from Hyderabad."
        />

        <Grid container spacing={6} alignItems="center" sx={{ mb: 10 }} ref={ref}>
          <Grid size={{ xs: 12, md: 5 }}>
            <motion.div variants={fadeInLeft} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ position: 'relative' }}>
                  <Box sx={{
                    position: 'absolute', inset: -6,
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, rgba(0,180,216,0.3), rgba(124,58,237,0.3))',
                    filter: 'blur(20px)',
                  }} />
                  <Avatar
                    src={avatarUrl}
                    alt={PERSONAL.name}
                    sx={{ width: 280, height: 280, borderRadius: 4, position: 'relative', zIndex: 1 }}
                    variant="rounded"
                  />
                </Box>
              </Box>
            </motion.div>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <motion.div variants={fadeInRight} initial="hidden" animate={inView ? 'visible' : 'hidden'}>
              <Typography variant="h4" fontWeight={700} sx={{ mb: 2, color: '#E2E8F0' }}>
                Full-Stack Developer &{' '}
                <Box component="span" sx={{ background: 'linear-gradient(135deg, #00B4D8, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  AI Engineer
                </Box>
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.85, mb: 3 }}>
                {PERSONAL.bio}
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {[
                  { label: 'Location', value: PERSONAL.location },
                  { label: 'Email', value: PERSONAL.email },
                  { label: 'Company', value: PERSONAL.company },
                  { label: 'Role', value: PERSONAL.title },
                ].map((item) => (
                  <GlassCard key={item.label} hover={false} sx={{ p: 2 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={600} sx={{ color: '#E2E8F0', mt: 0.5, wordBreak: 'break-all' }}>
                      {item.value}
                    </Typography>
                  </GlassCard>
                ))}
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        <SectionTitle
          title="Technical Skills"
          subtitle="Technologies I work with daily — from backend APIs to AI pipelines."
        />
        <SkillsGrid />
      </Container>
    </PageWrapper>
  )
}
