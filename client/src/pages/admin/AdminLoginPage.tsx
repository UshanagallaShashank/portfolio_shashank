import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material'
import { motion } from 'framer-motion'
import LockIcon from '@mui/icons-material/Lock'
import GlassCard from '../../components/ui/GlassCard'
import { adminLogin } from '../../api/admin'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { access_token } = await adminLogin(email, password)
      localStorage.setItem('admin_token', access_token)
      navigate('/admin')
    } catch {
      setError('Invalid credentials. This area is restricted.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      background: 'linear-gradient(135deg, #0A0E1A 0%, #0F1629 100%)',
    }}>
      <Container maxWidth="xs">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <GlassCard sx={{ p: 5 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #00B4D8, #7C3AED)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                mx: 'auto', mb: 2,
              }}>
                <LockIcon sx={{ color: '#fff' }} />
              </Box>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#E2E8F0' }}>Admin Access</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Restricted to authorized users only</Typography>
            </Box>

            <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                fullWidth label="Email" type="email" required size="small"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                fullWidth label="Password" type="password" required size="small"
                value={password} onChange={(e) => setPassword(e.target.value)}
              />
              {error && <Alert severity="error" sx={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>{error}</Alert>}
              <Button
                type="submit" variant="contained" fullWidth disabled={loading}
                sx={{ background: 'linear-gradient(135deg, #00B4D8, #7C3AED)', py: 1.5, fontWeight: 700 }}
              >
                {loading ? <CircularProgress size={20} color="inherit" /> : 'Sign In'}
              </Button>
            </Box>
          </GlassCard>
        </motion.div>
      </Container>
    </Box>
  )
}
