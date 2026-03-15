import { Container, Box, Grid, Typography, Button } from '@mui/material'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import SectionTitle from '../components/ui/SectionTitle'
import GlassCard from '../components/ui/GlassCard'
import PageWrapper from '../components/layout/PageWrapper'
import { ACHIEVEMENTS, CERTIFICATIONS } from '../constants/personal'
import { staggerContainer, fadeInUp, scaleIn } from '../utils/animationVariants'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'

export default function AchievementsPage() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

  return (
    <PageWrapper>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <SectionTitle
          title="Achievements"
          subtitle="Competitive programming milestones and professional certifications."
        />

        {/* Stats */}
        <Box ref={ref}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <EmojiEventsIcon sx={{ color: '#F59E0B' }} />
            <Typography variant="h5" fontWeight={700} sx={{ color: '#E2E8F0' }}>Competitive Programming</Typography>
          </Box>
          <Box
            component={motion.div}
            variants={staggerContainer}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(5, 1fr)' }, gap: 2, mb: 8 }}
          >
            {ACHIEVEMENTS.map((a) => (
              <motion.div key={a.label} variants={scaleIn}>
                <GlassCard sx={{ p: 3, textAlign: 'center' }}>
                  <Box sx={{ fontSize: '2rem', mb: 1 }}>{a.icon}</Box>
                  <Typography
                    sx={{
                      fontSize: '1.4rem', fontWeight: 800,
                      background: 'linear-gradient(135deg, #00B4D8, #7C3AED)',
                      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                      mb: 0.5,
                    }}
                  >
                    {a.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4, display: 'block' }}>
                    {a.detail}
                  </Typography>
                </GlassCard>
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* Certifications */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <WorkspacePremiumIcon sx={{ color: '#00B4D8' }} />
          <Typography variant="h5" fontWeight={700} sx={{ color: '#E2E8F0' }}>Certifications</Typography>
        </Box>
        <Grid container spacing={3}>
          {CERTIFICATIONS.map((cert, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <motion.div
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <GlassCard sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" fontWeight={700} sx={{ color: '#E2E8F0', mb: 0.5 }}>
                        {cert.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#00B4D8', fontWeight: 500 }}>
                        {cert.issuer}
                      </Typography>
                    </Box>
                    <WorkspacePremiumIcon sx={{ color: '#F59E0B', fontSize: 32 }} />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      component="a" href={cert.url} target="_blank" rel="noopener noreferrer"
                      size="small" endIcon={<OpenInNewIcon />}
                      sx={{ color: '#00B4D8', textTransform: 'none', p: 0, '&:hover': { background: 'none', textDecoration: 'underline' } }}
                    >
                      View Certificate
                    </Button>
                  </Box>
                </GlassCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* LeetCode profile link */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <GlassCard sx={{ p: 4, display: 'inline-block' }}>
            <Typography variant="h6" fontWeight={700} sx={{ color: '#E2E8F0', mb: 1 }}>
              LeetCode Profile
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Top 9.5% globally — 350+ problems solved
            </Typography>
            <Button
              component="a"
              href="https://leetcode.com/u/UshanagallaShashank/"
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              endIcon={<OpenInNewIcon />}
              sx={{ borderColor: 'rgba(0,180,216,0.5)', color: '#00B4D8', textTransform: 'none' }}
            >
              View LeetCode Profile
            </Button>
          </GlassCard>
        </Box>
      </Container>
    </PageWrapper>
  )
}
