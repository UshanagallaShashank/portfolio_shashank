import { Chip } from '@mui/material'
import type { ChipProps } from '@mui/material'
import { motion } from 'framer-motion'

interface Props extends ChipProps {
  delay?: number
}

export default function SkillChip({ label, delay = 0, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ scale: 1.08 }}
    >
      <Chip
        label={label}
        size="small"
        sx={{
          background: 'rgba(0,180,216,0.1)',
          color: '#00B4D8',
          border: '1px solid rgba(0,180,216,0.3)',
          fontWeight: 500,
          fontSize: '0.78rem',
          '&:hover': {
            background: 'rgba(0,180,216,0.2)',
          },
        }}
        {...rest}
      />
    </motion.div>
  )
}
