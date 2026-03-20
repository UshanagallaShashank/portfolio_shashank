import { useEffect, useState } from 'react'
import { Box, Typography, Chip, CircularProgress } from '@mui/material'
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import WorkIcon from '@mui/icons-material/Work'
import SchoolIcon from '@mui/icons-material/School'
import GlassCard from '../../ui/GlassCard'
import { fetchExperience, type Experience } from '../../../api/experience'

export default function ExperienceSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [items, setItems] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExperience().then(setItems).finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#00B4D8' }} />
      </Box>
    )
  }

  return (
    <Box ref={ref}>
      <Timeline position="alternate" sx={{ px: 0 }}>
        {items.map((exp, i) => (
          <TimelineItem key={exp.id}>
            <TimelineOppositeContent sx={{ m: 'auto 0', display: { xs: 'none', md: 'block' } }}>
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  {exp.period}
                </Typography>
                <Chip
                  label={exp.type}
                  size="small"
                  sx={{
                    mt: 0.5,
                    background: exp.type === 'Full-time'
                      ? 'rgba(16,185,129,0.15)'
                      : 'rgba(0,180,216,0.1)',
                    color: exp.type === 'Full-time' ? '#10B981' : '#00B4D8',
                    border: `1px solid ${exp.type === 'Full-time' ? 'rgba(16,185,129,0.3)' : 'rgba(0,180,216,0.3)'}`,
                    fontSize: '0.7rem',
                  }}
                />
              </motion.div>
            </TimelineOppositeContent>

            <TimelineSeparator>
              <TimelineDot
                sx={{
                  background: 'linear-gradient(135deg, #00B4D8, #7C3AED)',
                  boxShadow: '0 0 15px rgba(0,180,216,0.4)',
                  border: 'none',
                }}
              >
                {exp.type === 'Part-time' ? <SchoolIcon sx={{ fontSize: 16 }} /> : <WorkIcon sx={{ fontSize: 16 }} />}
              </TimelineDot>
              {i < items.length - 1 && (
                <TimelineConnector sx={{ background: 'linear-gradient(180deg, #00B4D8, rgba(0,180,216,0.2))' }} />
              )}
            </TimelineSeparator>

            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <motion.div
                initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 + 0.1 }}
              >
                <GlassCard sx={{ p: 3 }}>
                  <Box sx={{ display: { xs: 'block', md: 'none' }, mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">{exp.period}</Typography>
                  </Box>
                  <Typography variant="h6" fontWeight={700} sx={{ color: 'text.primary', mb: 0.5 }}>
                    {exp.role}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      background: 'linear-gradient(135deg, #00B4D8, #7C3AED)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    {exp.company} · {exp.location}
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, m: 0, mb: 2 }}>
                    {exp.highlights.map((h, j) => (
                      <Box
                        key={j}
                        component="li"
                        sx={{ color: 'text.secondary', fontSize: '0.875rem', lineHeight: 1.7, mb: 0.5, textAlign: 'left' }}
                      >
                        {h}
                      </Box>
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {exp.tech.map((t) => (
                      <Chip
                        key={t}
                        label={t}
                        size="small"
                        sx={{
                          background: 'rgba(124,58,237,0.1)',
                          color: '#A855F7',
                          border: '1px solid rgba(124,58,237,0.25)',
                          fontSize: '0.7rem',
                        }}
                      />
                    ))}
                  </Box>
                </GlassCard>
              </motion.div>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>

      {items.length === 0 && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
          No experience entries yet.
        </Typography>
      )}
    </Box>
  )
}
