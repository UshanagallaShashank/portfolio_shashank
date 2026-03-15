import { Container, Box, Typography, Button, Grid, Divider } from '@mui/material'
import { motion } from 'framer-motion'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import EmailIcon from '@mui/icons-material/Email'
import HandshakeIcon from '@mui/icons-material/Handshake'
import CodeIcon from '@mui/icons-material/Code'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import SectionTitle from '../components/ui/SectionTitle'
import GlassCard from '../components/ui/GlassCard'
import PageWrapper from '../components/layout/PageWrapper'
import { PERSONAL } from '../constants/personal'
import { staggerContainer, fadeInUp } from '../utils/animationVariants'

export default function CollaborationPage() {
  const services = [
    { icon: <SmartToyIcon sx={{ color: '#00B4D8', fontSize: 28 }} />, title: 'AI Integration', desc: 'RAG pipelines, LLM chatbots, Google ADK agents, LangGraph workflows for your product.' },
    { icon: <CodeIcon sx={{ color: '#7C3AED', fontSize: 28 }} />, title: 'Full-Stack Development', desc: 'FastAPI + React applications, REST APIs, real-time features, and database design.' },
    { icon: <HandshakeIcon sx={{ color: '#10B981', fontSize: 28 }} />, title: 'Consulting', desc: 'Code reviews, architecture consulting, and AI strategy for startups and indie devs.' },
  ]

  return (
    <PageWrapper>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <SectionTitle
          title="Collaboration"
          subtitle="Open to freelance projects, consulting, and exciting collaborations."
        />

        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          sx={{
            mb: 8, p: { xs: 3, md: 6 }, borderRadius: 4,
            background: 'linear-gradient(135deg, rgba(0,180,216,0.1), rgba(124,58,237,0.1))',
            border: '1px solid rgba(0,180,216,0.2)',
            textAlign: 'center',
          }}
        >
          <Typography variant="h3" fontWeight={800} sx={{ color: '#E2E8F0', mb: 2, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
            Available for Freelance Work
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4, maxWidth: 560, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.7 }}>
            I take on select freelance projects. DM for collab or email me directly.
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              component="a"
              href={`mailto:${PERSONAL.email}?subject=Freelance Inquiry`}
              variant="contained"
              startIcon={<EmailIcon />}
              sx={{ background: 'linear-gradient(135deg, #00B4D8, #0096B7)', fontWeight: 700, px: 4, py: 1.5 }}
            >
              Email Me
            </Button>
            <Button
              component="a"
              href={PERSONAL.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              endIcon={<OpenInNewIcon />}
              sx={{ borderColor: 'rgba(0,180,216,0.5)', color: '#00B4D8', fontWeight: 700, px: 4, py: 1.5 }}
            >
              LinkedIn DM
            </Button>
          </Box>
        </Box>

        <Box
          component={motion.div}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mb: 8 }}
        >
          {services.map((s) => (
            <motion.div key={s.title} variants={fadeInUp}>
              <GlassCard sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>{s.icon}</Box>
                <Typography fontWeight={700} sx={{ color: '#E2E8F0', mb: 1 }}>{s.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>{s.desc}</Typography>
              </GlassCard>
            </motion.div>
          ))}
        </Box>

        <Divider sx={{ borderColor: 'rgba(0,180,216,0.15)', mb: 6 }} />

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <GlassCard sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={700} sx={{ color: '#E2E8F0', mb: 1 }}>Giftedict</Typography>
              <Typography color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
                A gifting recommendation platform built as a freelance project.
              </Typography>
              <Button
                component="a" href={PERSONAL.freelancing} target="_blank" rel="noopener noreferrer"
                variant="outlined" endIcon={<OpenInNewIcon />}
                sx={{ borderColor: 'rgba(0,180,216,0.5)', color: '#00B4D8', textTransform: 'none' }}
              >
                View Project
              </Button>
            </GlassCard>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <GlassCard sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 1, color: '#E2E8F0' }}>More Projects</Typography>
              <Typography color="text.secondary" sx={{ mb: 2 }}>
                Looking for a freelancer? Send me a message.
              </Typography>
              <Typography sx={{ color: '#00B4D8', fontWeight: 600 }}>{PERSONAL.email}</Typography>
            </GlassCard>
          </Grid>
        </Grid>
      </Container>
    </PageWrapper>
  )
}
