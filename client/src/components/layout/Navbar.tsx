import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  AppBar, Toolbar, Box, IconButton, Drawer, List,
  ListItem, ListItemButton, ListItemText, useMediaQuery, useTheme as useMuiTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import { motion, AnimatePresence } from 'framer-motion'
import { NAV_LINKS } from '../../constants/navigation'
import { PERSONAL } from '../../constants/personal'
import ThemeToggle from '../ui/ThemeToggle'
import { useTheme } from '../../context/ThemeContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const muiTheme = useMuiTheme()
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'))
  const location = useLocation()
  const { isDark } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setDrawerOpen(false)
  }, [location])

  const navBg = scrolled
    ? isDark ? 'rgba(10,14,26,0.95)' : 'rgba(240,247,255,0.95)'
    : 'transparent'

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: navBg,
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,180,216,0.15)' : 'none',
          transition: 'all 0.3s ease',
          zIndex: 1300,
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%', px: { xs: 2, md: 4 }, height: 70 }}>
          <NavLink to="/" style={{ textDecoration: 'none', flexGrow: 0 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Box sx={{ lineHeight: 1.1 }}>
                <Box sx={{
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'text.secondary',
                  opacity: 0.7,
                }}>
                  Ushanagalla
                </Box>
                <Box sx={{
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  background: 'linear-gradient(135deg, #00B4D8, #7C3AED)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}>
                  {PERSONAL.firstName}
                  <Box component="span" sx={{ color: '#00B4D8', WebkitTextFillColor: '#00B4D8' }}>.</Box>
                </Box>
              </Box>
            </motion.div>
          </NavLink>

          <Box sx={{ flexGrow: 1 }} />

          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {NAV_LINKS.map((link) => (
                <NavLink key={link.path} to={link.path} style={{ textDecoration: 'none' }}>
                  {({ isActive }) => (
                    <Box
                      component={motion.div}
                      whileHover={{ y: -1 }}
                      sx={{
                        px: 1.5, py: 0.75, borderRadius: 2,
                        fontSize: '0.875rem',
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? '#00B4D8' : 'text.secondary',
                        background: isActive ? 'rgba(0,180,216,0.1)' : 'transparent',
                        border: isActive ? '1px solid rgba(0,180,216,0.3)' : '1px solid transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': { color: '#00B4D8', background: 'rgba(0,180,216,0.08)' },
                      }}
                    >
                      {link.label}
                    </Box>
                  )}
                </NavLink>
              ))}
              <Box sx={{ ml: 1 }}>
                <ThemeToggle />
              </Box>
            </Box>
          )}

          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ThemeToggle />
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#00B4D8' }}>
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: isDark ? '#0F1629' : '#F0F7FF',
            borderLeft: '1px solid rgba(0,180,216,0.2)',
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#00B4D8' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          <AnimatePresence>
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ListItem disablePadding>
                  <NavLink to={link.path} style={{ textDecoration: 'none', width: '100%' }}>
                    {({ isActive }) => (
                      <ListItemButton
                        sx={{
                          mx: 1, borderRadius: 2,
                          color: isActive ? '#00B4D8' : 'text.secondary',
                          background: isActive ? 'rgba(0,180,216,0.1)' : 'transparent',
                        }}
                      >
                        <ListItemText
                          primary={link.label}
                          primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }}
                        />
                      </ListItemButton>
                    )}
                  </NavLink>
                </ListItem>
              </motion.div>
            ))}
          </AnimatePresence>
        </List>
      </Drawer>
    </>
  )
}
