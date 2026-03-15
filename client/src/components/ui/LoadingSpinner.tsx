import { Box, CircularProgress } from '@mui/material'

export default function LoadingSpinner() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <CircularProgress sx={{ color: '#00B4D8' }} />
    </Box>
  )
}
