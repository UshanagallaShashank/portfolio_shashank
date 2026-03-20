import { useState } from 'react'
import { Container, Box, Typography, TextField, Button, Checkbox, FormControlLabel, Grid, Alert, CircularProgress } from '@mui/material'
import { motion } from 'framer-motion'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import SendIcon from '@mui/icons-material/Send'
import SectionTitle from '../components/ui/SectionTitle'
import GlassCard from '../components/ui/GlassCard'
import PageWrapper from '../components/layout/PageWrapper'
import { submitContactForm } from '../api/contact'
import { PERSONAL } from '../constants/personal'

export default function ContactPage() {
  const [form, setForm] = useState({ sender_name: '', sender_email: '', subject: '', body: '', allow_email: false })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await submitContactForm(form)
      setSuccess(true)
      setForm({ sender_name: '', sender_email: '', subject: '', body: '', allow_email: false })
    } catch {
      setError('Failed to send message. Please try again or email me directly.')
    } finally {
      setLoading(false)
    }
  }

  const contactInfo = [
    { icon: <EmailIcon sx={{ color: '#00B4D8' }} />, label: 'Email', value: PERSONAL.email, href: `mailto:${PERSONAL.email}` },
    { icon: <PhoneIcon sx={{ color: '#00B4D8' }} />, label: 'Phone', value: PERSONAL.phone, href: `tel:${PERSONAL.phone}` },
    { icon: <LocationOnIcon sx={{ color: '#00B4D8' }} />, label: 'Location', value: PERSONAL.location },
  ]

  return (
    <PageWrapper>
      <Container maxWidth="lg" sx={{ pt: '80px', pb: 8 }}>
        <SectionTitle
          title="Get In Touch"
          subtitle="Have a project in mind or just want to say hi? Fill out the form below."
        />

        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {contactInfo.map((info) => (
                <motion.div key={info.label} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                  <GlassCard sx={{ p: 3, display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                    <Box sx={{ mt: 0.3 }}>{info.icon}</Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                        {info.label}
                      </Typography>
                      {info.href ? (
                        <Typography
                          component="a" href={info.href}
                          sx={{ display: 'block', color: 'text.primary', fontWeight: 500, textDecoration: 'none', '&:hover': { color: '#00B4D8' } }}
                        >
                          {info.value}
                        </Typography>
                      ) : (
                        <Typography sx={{ color: 'text.primary', fontWeight: 500 }}>{info.value}</Typography>
                      )}
                    </Box>
                  </GlassCard>
                </motion.div>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <GlassCard sx={{ p: 4 }}>
                {success ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h5" fontWeight={700} sx={{ color: '#10B981', mb: 2 }}>Message Sent!</Typography>
                    <Typography color="text.secondary">
                      Thank you for reaching out. I will get back to you shortly.
                    </Typography>
                    <Button sx={{ mt: 3, color: '#00B4D8' }} onClick={() => setSuccess(false)}>Send Another</Button>
                  </Box>
                ) : (
                  <Box component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth label="Your Name" required
                          value={form.sender_name}
                          onChange={(e) => setForm({ ...form, sender_name: e.target.value })}
                          variant="outlined" size="small"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth label="Your Email" type="email" required
                          value={form.sender_email}
                          onChange={(e) => setForm({ ...form, sender_email: e.target.value })}
                          variant="outlined" size="small"
                        />
                      </Grid>
                      <Grid size={12}>
                        <TextField
                          fullWidth label="Subject"
                          value={form.subject}
                          onChange={(e) => setForm({ ...form, subject: e.target.value })}
                          variant="outlined" size="small"
                        />
                      </Grid>
                      <Grid size={12}>
                        <TextField
                          fullWidth label="Message" required multiline rows={5}
                          value={form.body}
                          onChange={(e) => setForm({ ...form, body: e.target.value })}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid size={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={form.allow_email}
                              onChange={(e) => setForm({ ...form, allow_email: e.target.checked })}
                              sx={{ color: '#00B4D8', '&.Mui-checked': { color: '#00B4D8' } }}
                            />
                          }
                          label={
                            <Typography variant="body2" color="text.secondary">
                              You may email me with updates, opportunities, or follow-ups
                            </Typography>
                          }
                        />
                      </Grid>
                      {error && (
                        <Grid size={12}>
                          <Alert severity="error" sx={{ background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>{error}</Alert>
                        </Grid>
                      )}
                      <Grid size={12}>
                        <Button
                          type="submit" variant="contained" fullWidth disabled={loading}
                          endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />}
                          sx={{
                            background: 'linear-gradient(135deg, #00B4D8, #0096B7)',
                            py: 1.5, fontWeight: 700, fontSize: '1rem',
                            boxShadow: '0 0 20px rgba(0,180,216,0.3)',
                            '&:hover': { boxShadow: '0 0 35px rgba(0,180,216,0.5)' },
                          }}
                        >
                          {loading ? 'Sending...' : 'Send Message'}
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </GlassCard>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </PageWrapper>
  )
}
