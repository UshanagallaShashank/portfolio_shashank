import { useState, useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, IconButton, Divider } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import MessageIcon from '@mui/icons-material/Message'
import LogoutIcon from '@mui/icons-material/Logout'
import { motion } from 'framer-motion'
import { getDashboardStats, DashboardStats } from '../../api/admin'
import AdminResumeManager from './AdminResumeManager'
import AdminMessagesViewer from './AdminMessagesViewer'
import GlassCard from '../../components/ui/GlassCard'
import { useAuth } from '../../hooks/useAuth'

const DRAWER_WIDTH = 240

function DashboardHome({ stats }: { stats: DashboardStats | null }) {
  const cards = [
    { label: 'Total Messages', value: stats?.total_messages ?? '-', color: '#00B4D8' },
    { label: 'Unread Messages', value: stats?.unread_messages ?? '-', color: '#EF4444' },
    { label: 'Projects', value: stats?.total_projects ?? '-', color: '#7C3AED' },
    { label: 'Active Resume', value: stats?.active_resume ? 'Set' : 'None', color: '#10B981' },
  ]
  return (
    <Box>
      <Typography variant="h5" fontWeight={700} sx={{ color: '#E2E8F0', mb: 4 }}>Dashboard Overview</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4,1fr)' }, gap: 3 }}>
        {cards.map((c) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={800} sx={{ color: c.color }}>{c.value}</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{c.label}</Typography>
            </GlassCard>
          </motion.div>
        ))}
      </Box>
    </Box>
  )
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    getDashboardStats().then(setStats).catch(() => {})
  }, [])

  const handleLogout = () => { logout(); navigate('/admin/login') }

  const navItems = [
    { label: 'Overview', path: '/admin', icon: <DashboardIcon /> },
    { label: 'Resume', path: '/admin/resume', icon: <UploadFileIcon /> },
    { label: 'Messages', path: '/admin/messages', icon: <MessageIcon /> },
  ]

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#0A0E1A' }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            background: '#0F1629',
            borderRight: '1px solid rgba(0,180,216,0.15)',
            pt: 2,
          },
        }}
      >
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography fontWeight={800} sx={{ background: 'linear-gradient(135deg,#00B4D8,#7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Admin Panel
          </Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(0,180,216,0.15)', mb: 1 }} />
        <List>
          {navItems.map((item) => (
            <ListItem disablePadding key={item.label}>
              <NavLink to={item.path} end={item.path === '/admin'} style={{ textDecoration: 'none', width: '100%' }}>
                {({ isActive }) => (
                  <ListItemButton sx={{
                    mx: 1, borderRadius: 2, mb: 0.5,
                    background: isActive ? 'rgba(0,180,216,0.12)' : 'transparent',
                    color: isActive ? '#00B4D8' : '#94A3B8',
                  }}>
                    <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 400 }} />
                  </ListItemButton>
                )}
              </NavLink>
            </ListItem>
          ))}
        </List>
        <Box sx={{ mt: 'auto', p: 2 }}>
          <Divider sx={{ borderColor: 'rgba(0,180,216,0.15)', mb: 1 }} />
          <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, color: '#EF4444' }}>
            <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}><LogoutIcon /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.875rem' }} />
          </ListItemButton>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4, pt: 10 }}>
        <Routes>
          <Route index element={<DashboardHome stats={stats} />} />
          <Route path="resume" element={<AdminResumeManager />} />
          <Route path="messages" element={<AdminMessagesViewer />} />
        </Routes>
      </Box>
    </Box>
  )
}
