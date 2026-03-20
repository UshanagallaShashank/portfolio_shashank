import { Box, Container, Typography, IconButton, Tooltip, Divider } from '@mui/material'
import { motion } from 'framer-motion'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import EmailIcon from '@mui/icons-material/Email'
import { NavLink } from 'react-router-dom'
import { PERSONAL } from '../../constants/personal'
import { NAV_LINKS } from '../../constants/navigation'
import { useTheme } from '../../context/ThemeContext'

export default function Footer() {
  const { isDark } = useTheme()
  const year = new Date().getFullYear()

  const socials = [
    { icon: <GitHubIcon />, href: PERSONAL.github, label: 'GitHub' },
    { icon: <LinkedInIcon />, href: PERSONAL.linkedin, label: 'LinkedIn' },
    { icon: <EmailIcon />, href: `mailto:${PERSONAL.email}`, label: 'Email' },
  ]

  return (
    <Box
      component="footer"
      sx={{
        background: isDark ? 'rgba(10,14,26,0.9)' : 'rgba(240,247,255,0.9)',
        borderTop: '1px solid rgba(0,180,216,0.15)',
        backdropFilter: 'blur(20px)',
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, justifyContent: 'space-between' }}>
          {/* Brand */}
          <Box sx={{ maxWidth: 300 }}>
            <Box sx={{ mb: 1 }}>
              <Typography
                variant="caption"
                sx={{
                  fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'text.secondary', opacity: 0.7, fontSize: '0.65rem', display: 'block',
                }}
              >
                Ushanagalla
              </Typography>
              <Typography
                sx={{
                  fontWeight: 800, fontSize: '1.4rem',
                  background: 'linear-gradient(135deg, #00B4D8, #7C3AED)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1,
                }}
              >
                {PERSONAL.firstName}.
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Developer at RealPage Inc. Building AI-powered products that matter.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {socials.map((s) => (
                <Tooltip key={s.label} title={s.label}>
                  <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.9 }}>
                    <IconButton
                      component="a" href={s.href} target="_blank" rel="noopener noreferrer"
                      size="small"
                      sx={{
                        color: '#00B4D8',
                        border: '1px solid rgba(0,180,216,0.3)',
                        borderRadius: '8px',
                        '&:hover': { background: 'rgba(0,180,216,0.1)', borderColor: '#00B4D8' },
                      }}
                    >
                      {s.icon}
                    </IconButton>
                  </motion.div>
                </Tooltip>
              ))}
            </Box>
          </Box>

          {/* Nav links */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem' }}>
              Navigation
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
              {NAV_LINKS.map((link) => (
                <NavLink key={link.path} to={link.path} style={{ textDecoration: 'none' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      '&:hover': { color: '#00B4D8' },
                      transition: 'color 0.2s',
                    }}
                  >
                    {link.label}
                  </Typography>
                </NavLink>
              ))}
            </Box>
          </Box>

          {/* Contact */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 1, fontSize: '0.75rem' }}>
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {PERSONAL.email}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              {PERSONAL.phone}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {PERSONAL.location}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: 'rgba(0,180,216,0.15)' }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            © {year} {PERSONAL.name}. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Hyderabad, Telangana, India
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
