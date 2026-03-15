import { motion } from 'framer-motion'
import { Box } from '@mui/material'
import type { ReactNode } from 'react'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

interface Props {
  children: ReactNode
  pt?: number | string
}

export default function PageWrapper({ children, pt = '70px' }: Props) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Box sx={{ pt }}>{children}</Box>
    </motion.div>
  )
}
