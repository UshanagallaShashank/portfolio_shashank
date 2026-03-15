import { Box, Typography, Chip, IconButton, Tooltip } from '@mui/material'
import { motion } from 'framer-motion'
import GitHubIcon from '@mui/icons-material/GitHub'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import StarIcon from '@mui/icons-material/Star'
import ForkRightIcon from '@mui/icons-material/ForkRight'
import GlassCard from '../../ui/GlassCard'

interface ProjectCardProps {
  title: string
  description: string
  tech: string[]
  github?: string
  live?: string
  stars?: number
  forks?: number
  language?: string
  featured?: boolean
}

export default function ProjectCard({ title, description, tech, github, live, stars, forks, language, featured }: ProjectCardProps) {
  return (
    <GlassCard sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {featured && (
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', gap: 0.5,
          px: 1.5, py: 0.25, borderRadius: 5, mb: 2,
          background: 'rgba(124,58,237,0.15)',
          border: '1px solid rgba(124,58,237,0.3)',
          width: 'fit-content',
        }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', background: '#A855F7' }} />
          <Typography sx={{ fontSize: '0.7rem', color: '#A855F7', fontWeight: 600 }}>Featured</Typography>
        </Box>
      )}

      <Typography variant="h6" fontWeight={700} sx={{ color: '#E2E8F0', mb: 1 }}>
        {title}
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2, flexGrow: 1 }}>
        {description}
      </Typography>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
        {tech.map((t) => (
          <Chip
            key={t}
            label={t}
            size="small"
            sx={{
              background: 'rgba(0,180,216,0.1)',
              color: '#00B4D8',
              border: '1px solid rgba(0,180,216,0.2)',
              fontSize: '0.68rem',
            }}
          />
        ))}
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {stars !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <StarIcon sx={{ fontSize: 14, color: '#F59E0B' }} />
              <Typography variant="caption" color="text.secondary">{stars}</Typography>
            </Box>
          )}
          {forks !== undefined && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <ForkRightIcon sx={{ fontSize: 14, color: '#94A3B8' }} />
              <Typography variant="caption" color="text.secondary">{forks}</Typography>
            </Box>
          )}
          {language && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: '#00B4D8' }} />
              <Typography variant="caption" color="text.secondary">{language}</Typography>
            </Box>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {github && (
            <Tooltip title="GitHub">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  component="a" href={github} target="_blank" rel="noopener noreferrer"
                  size="small"
                  sx={{ color: '#94A3B8', '&:hover': { color: '#00B4D8' } }}
                >
                  <GitHubIcon fontSize="small" />
                </IconButton>
              </motion.div>
            </Tooltip>
          )}
          {live && (
            <Tooltip title="Live Demo">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  component="a" href={live} target="_blank" rel="noopener noreferrer"
                  size="small"
                  sx={{ color: '#94A3B8', '&:hover': { color: '#00B4D8' } }}
                >
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </motion.div>
            </Tooltip>
          )}
        </Box>
      </Box>
    </GlassCard>
  )
}
