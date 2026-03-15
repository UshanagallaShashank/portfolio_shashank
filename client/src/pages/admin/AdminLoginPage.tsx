import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Container, TextField, Button, Typography, Alert, CircularProgress } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import GlassCard from '../../components/ui/GlassCard'
import { adminLogin } from '../../api/admin'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { access_token } = await adminLogin(email, password)
      localStorage.setItem('admin_token', access_token)
      navigate('/admin/dashboard')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#0A0F1E' }}>
      <Container maxWidth="xs">
        <GlassCard hover={false} sx={{ p: 5 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box sx={{
              width: 52, height: 52, borderRadius: '50%', mb: 2,
              background: 'linear-gradient(135deg, #00B4D8, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <LockOutlinedIcon sx={{ color: '#fff' }} />
            </Box>
            <Typography variant="h5" fontWeight={700} color="#E2E8F0">Admin Login</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
              autoFocus
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              sx={{ mt: 1, py: 1.3, background: 'linear-gradient(135deg, #00B4D8, #7C3AED)', fontWeight: 700 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
        </GlassCard>
      </Container>
    </Box>
  )
}
