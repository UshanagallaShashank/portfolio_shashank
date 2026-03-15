import { useState } from 'react'
import { Box, Typography, LinearProgress, Tabs, Tab } from '@mui/material'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import GlassCard from '../../ui/GlassCard'
import { SKILLS, SKILL_CATEGORIES } from '../../../constants/skills'
import { staggerContainer, fadeInUp } from '../../../utils/animationVariants'

export default function SkillsGrid() {
  const [activeCategory, setActiveCategory] = useState('All')
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 })

  const filtered = activeCategory === 'All'
    ? SKILLS
    : SKILLS.filter((s) => s.category === activeCategory)

  return (
    <Box ref={ref}>
      {/* Category tabs */}
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={activeCategory}
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
              color: '#64748B',
              fontWeight: 500,
              textTransform: 'none',
              '&.Mui-selected': { color: '#00B4D8', fontWeight: 600 },
            },
          }}
        >
          {SKILL_CATEGORIES.map((cat) => (
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
            <motion.div key={skill.name} variants={fadeInUp} custom={i}>
              <GlassCard sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <Box sx={{ fontSize: '1.4rem' }}>{skill.icon}</Box>
                  <Typography variant="body2" fontWeight={600} sx={{ color: '#E2E8F0' }}>
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
    </Box>
  )
}
