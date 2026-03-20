import { useEffect, useState } from 'react'
import { Box, Typography, LinearProgress, Tabs, Tab, CircularProgress } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import GlassCard from '../../ui/GlassCard'
import { fetchSkills, type Skill } from '../../../api/skills'
import { staggerContainer, fadeInUp } from '../../../utils/animationVariants'

export default function SkillsGrid() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  useEffect(() => {
    fetchSkills().then(setSkills).finally(() => setLoading(false))
  }, [])

  // Derive categories in insertion order, deduplicated
  const categories = ['All', ...Array.from(
    new Set(skills.map((s) => s.category ?? 'Other'))
  )]

  const filtered = activeCategory === 'All'
    ? skills
    : skills.filter((s) => (s.category ?? 'Other') === activeCategory)

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress sx={{ color: '#00B4D8' }} />
      </Box>
    )
  }

  return (
    <Box ref={ref}>
      {/* Category tabs — built from live DB data */}
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={categories.includes(activeCategory) ? activeCategory : 'All'}
          onChange={(_, v) => setActiveCategory(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(90deg, #00B4D8, #7C3AED)',
              height: 3,
              borderRadius: 2,
            },
            '& .MuiTab-root': {
              color: 'text.secondary',
              fontWeight: 500,
              textTransform: 'none',
              '&.Mui-selected': { color: '#00B4D8', fontWeight: 600 },
            },
          }}
        >
          {categories.map((cat) => (
            <Tab key={cat} label={cat} value={cat} />
          ))}
        </Tabs>
      </Box>

      {/* Skills grid */}
      <AnimatePresence mode="wait">
        <Box
          key={activeCategory}
          component={motion.div}
          variants={staggerContainer}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2 }}
        >
          {filtered.map((skill, i) => (
            <motion.div key={skill.id} variants={fadeInUp} custom={i}>
              <GlassCard sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  {skill.icon_url && (
                    <Box sx={{ fontSize: '1.4rem', lineHeight: 1 }}>{skill.icon_url}</Box>
                  )}
                  <Typography variant="body2" fontWeight={600} sx={{ color: 'text.primary' }}>
                    {skill.name}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">{skill.category}</Typography>
                  <Typography variant="caption" sx={{ color: '#00B4D8', fontWeight: 600 }}>{skill.proficiency}%</Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={skill.proficiency}
                  sx={{ height: 4, borderRadius: 2 }}
                />
              </GlassCard>
            </motion.div>
          ))}
        </Box>
      </AnimatePresence>

      {filtered.length === 0 && !loading && (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 8 }}>
          No skills yet. Add them from the admin panel.
        </Typography>
      )}
    </Box>
  )
}
