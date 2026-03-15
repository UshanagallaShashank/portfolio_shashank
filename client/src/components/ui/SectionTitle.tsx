import { Box, Typography } from '@mui/material'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

interface Props {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  accent?: string
}

export default function SectionTitle({ title, subtitle, align = 'center', accent }: Props) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const [first, ...rest] = title.split(' ')

  return (
    <Box
      ref={ref}
      component={motion.div}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      sx={{ textAlign: align, mb: 6 }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: 800,
          fontSize: { xs: '2rem', md: '2.75rem' },
          letterSpacing: '-0.02em',
          mb: 1,
        }}
      >
        <Box component="span" sx={{ color: accent || '#00B4D8' }}>{first} </Box>
        {rest.join(' ')}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ maxWidth: 560, mx: align === 'center' ? 'auto' : undefined, lineHeight: 1.7 }}
        >
          {subtitle}
        </Typography>
      )}
      <Box
        component={motion.div}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        sx={{
          mt: 2,
          height: 3,
          width: 60,
          background: 'linear-gradient(90deg, #00B4D8, #7C3AED)',
          borderRadius: 2,
          mx: align === 'center' ? 'auto' : undefined,
          transformOrigin: align === 'center' ? 'center' : 'left',
        }}
      />
    </Box>
  )
}
