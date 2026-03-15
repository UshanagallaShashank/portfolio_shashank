import { TypeAnimation } from 'react-type-animation'
import { Box } from '@mui/material'

import type { Speed } from 'react-type-animation'

interface Props {
  sequences: string[]
  speed?: Speed
  fontSize?: string | object
}

export default function TypewriterText({ sequences, speed = 50, fontSize = '1.5rem' }: Props) {
  const seq: (string | number)[] = []
  sequences.forEach((s) => {
    seq.push(s)
    seq.push(2000)
  })

  return (
    <Box
      component="span"
      sx={{
        background: 'linear-gradient(135deg, #00B4D8, #7C3AED)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 700,
        fontSize,
        display: 'inline-block',
        minHeight: '1.5em',
      }}
    >
      <TypeAnimation
        sequence={seq}
        speed={speed}
        repeat={Infinity}
        style={{ display: 'inline-block' }}
      />
    </Box>
  )
}
