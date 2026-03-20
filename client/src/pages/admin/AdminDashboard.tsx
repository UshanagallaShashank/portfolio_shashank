import { useEffect, useState } from 'react'
import { useNavigate, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import {
  Box, Typography, Drawer, List, ListItemButton, ListItemIcon,
  ListItemText, Button, CircularProgress, Divider, Avatar, Tooltip,
  IconButton, AppBar, Toolbar, useMediaQuery, useTheme,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import EmailIcon from '@mui/icons-material/Email'
import FolderIcon from '@mui/icons-material/Folder'
import DescriptionIcon from '@mui/icons-material/Description'
import CodeIcon from '@mui/icons-material/Code'
import BarChartIcon from '@mui/icons-material/BarChart'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import WorkIcon from '@mui/icons-material/Work'
import HandshakeIcon from '@mui/icons-material/Handshake'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import MenuIcon from '@mui/icons-material/Menu'
import { useAuth } from '../../hooks/useAuth'
import { fetchDashboardStats } from '../../api/admin'
import type { DashboardStats } from '../../api/admin'
import GlassCard from '../../components/ui/GlassCard'
import ThemeToggle from '../../components/ui/ThemeToggle'
import { useTheme as useAppTheme } from '../../context/ThemeContext'
import AdminMessagesViewer from './AdminMessagesViewer'
import AdminProjectsManager from './AdminProjectsManager'
import AdminSkillsManager from './AdminSkillsManager'
import AdminStatsManager from './AdminStatsManager'
import AdminResumeManager from './AdminResumeManager'
import AdminAchievementsManager from './AdminAchievementsManager'
import AdminExperienceManager from './AdminExperienceManager'
import AdminCollaborationsManager from './AdminCollaborationsManager'
import AdminProfileManager from './AdminProfileManager'

const DRAWER_WIDTH = 240

const navItems = [
  { label: 'Overview',       path: '/admin/dashboard',       icon: <DashboardIcon fontSize="small" />,  end: true },
  { label: 'Profile',        path: '/admin/profile',         icon: <PersonIcon fontSize="small" /> },
  { label: 'Messages',       path: '/admin/messages',        icon: <EmailIcon fontSize="small" /> },
  { label: 'Experience',     path: '/admin/experience',      icon: <WorkIcon fontSize="small" /> },
  { label: 'Projects',       path: '/admin/projects',        icon: <FolderIcon fontSize="small" /> },
  { label: 'Collaborations', path: '/admin/collaborations',  icon: <HandshakeIcon fontSize="small" /> },
  { label: 'Skills',         path: '/admin/skills',          icon: <CodeIcon fontSize="small" /> },
  { label: 'Stats',          path: '/admin/stats',           icon: <BarChartIcon fontSize="small" /> },
  { label: 'Achievements',   path: '/admin/achievements',    icon: <EmojiEventsIcon fontSize="small" /> },
  { label: 'Resume',         path: '/admin/resume',          icon: <DescriptionIcon fontSize="small" /> },
]

function DashboardHome() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats().then(setStats).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
      <CircularProgress sx={{ color: '#00B4D8' }} />
    </Box>
  )

  const cards = [
    { label: 'Total Messages', value: stats?.total_messages ?? 0,    color: '#00B4D8', bg: 'rgba(0,180,216,0.1)' },
    { label: 'Unread',         value: stats?.unread_messages ?? 0,   color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
    { label: 'Projects',       value: stats?.total_projects ?? 0,    color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
    { label: 'Active Resume',  value: stats?.active_resume ?? 'None',color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  ]

  return (
    <Box>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h4" fontWeight={800} color="text.primary">Overview</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Your portfolio at a glance.
        </Typography>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
        {cards.map((c) => (
          <GlassCard key={c.label} hover={false} sx={{ p: 3, border: `1px solid ${c.color}22` }}>
            <Box sx={{
              width: 36, height: 36, borderRadius: 2, mb: 2,
              background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Box sx={{ width: 10, height: 10, borderRadius: '50%', background: c.color }} />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1.2, fontSize: 11 }}>
              {c.label}
            </Typography>
            <Typography variant="h4" fontWeight={800} sx={{ color: c.color, mt: 0.5 }}>
              {c.value}
            </Typography>
          </GlassCard>
        ))}
      </Box>
    </Box>
  )
}

function DrawerContent({ user, onClose, onLogout }: {
  user: { email?: string } | null
  onClose: () => void
  onLogout: () => void
}) {
  const { isDark } = useAppTheme()
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <Box sx={{ p: 2.5, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            width: 36, height: 36, borderRadius: 2, flexShrink: 0,
            background: 'linear-gradient(135deg, #00B4D8, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: 16, lineHeight: 1 }}>S</Typography>
          </Box>
          <Box>
            <Typography fontWeight={800} sx={{
              background: 'linear-gradient(135deg, #00B4D8, #7C3AED)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontSize: 15, lineHeight: 1.2,
            }}>
              Shashank
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>Admin Panel</Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: isDark ? 'rgba(0,180,216,0.08)' : 'rgba(0,150,183,0.12)', mx: 2 }} />

      {/* Nav */}
      <List sx={{ flex: 1, pt: 1.5, px: 1 }}>
        <Typography variant="overline" sx={{ px: 1.5, color: 'text.secondary', fontSize: 10, letterSpacing: 1.5 }}>
          Navigation
        </Typography>
        {navItems.map((item) => (
          <ListItemButton
            key={item.path}
            component={NavLink}
            to={item.path}
            end={item.end}
            onClick={onClose}
            sx={{
              borderRadius: 2, mb: 0.5, mt: 0.5, py: 1,
              color: 'text.secondary',
              '&.active': {
                bgcolor: 'rgba(0,180,216,0.1)',
                color: '#00B4D8',
                '& .MuiListItemIcon-root': { color: '#00B4D8' },
              },
              '&:hover:not(.active)': {
                bgcolor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                color: 'text.primary',
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              slotProps={{ primary: { style: { fontSize: 14, fontWeight: 600 } } }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ borderColor: isDark ? 'rgba(0,180,216,0.08)' : 'rgba(0,150,183,0.12)', mx: 2 }} />

      {/* Bottom */}
      <Box sx={{ p: 2 }}>
        <Tooltip title="View live portfolio" placement="right">
          <Button
            fullWidth
            component="a"
            href="/"
            target="_blank"
            endIcon={<OpenInNewIcon sx={{ fontSize: '14px !important' }} />}
            sx={{
              justifyContent: 'flex-start', textTransform: 'none', color: 'text.secondary',
              fontSize: 13, mb: 1,
              '&:hover': { color: '#00B4D8', bgcolor: 'rgba(0,180,216,0.06)' },
            }}
          >
            View Portfolio
          </Button>
        </Tooltip>

        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5,
          borderRadius: 2,
          bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
          mb: 1,
        }}>
          <Avatar sx={{ width: 30, height: 30, fontSize: 13, bgcolor: 'rgba(0,180,216,0.2)', color: '#00B4D8' }}>
            {user?.email?.[0]?.toUpperCase() ?? 'A'}
          </Avatar>
          <Typography variant="caption" color="text.secondary" noWrap sx={{ flex: 1, fontSize: 12 }}>
            {user?.email ?? 'Admin'}
          </Typography>
        </Box>

        <Button
          fullWidth
          startIcon={<LogoutIcon fontSize="small" />}
          onClick={onLogout}
          sx={{
            justifyContent: 'flex-start', textTransform: 'none',
            color: 'text.secondary', fontSize: 13,
            '&:hover': { color: '#EF4444', bgcolor: 'rgba(239,68,68,0.06)' },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  )
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const { isDark } = useAppTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Get current page label for mobile header
  const currentNav = navItems.find((n) =>
    n.end ? location.pathname === n.path : location.pathname.startsWith(n.path)
  )

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const drawerContent = (
    <DrawerContent
      user={user}
      onClose={() => setDrawerOpen(false)}
      onLogout={handleLogout}
    />
  )

  return (
    <Box sx={{
      display: 'flex',
      minHeight: '100vh',
      // transparent — GlobalBackground shows through
      bgcolor: 'transparent',
    }}>
      {/* Mobile top bar */}
      {isMobile && (
        <AppBar position="fixed" elevation={0} sx={{
          bgcolor: isDark ? 'rgba(10,15,30,0.9)' : 'rgba(240,247,255,0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,180,216,0.1)',
          zIndex: theme.zIndex.drawer + 1,
        }}>
          <Toolbar sx={{ gap: 1.5, minHeight: '56px !important' }}>
            <IconButton
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ color: 'text.secondary' }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{
              width: 28, height: 28, borderRadius: 1.5,
              background: 'linear-gradient(135deg, #00B4D8, #7C3AED)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: 13, lineHeight: 1 }}>S</Typography>
            </Box>
            <Typography fontWeight={700} sx={{
              background: 'linear-gradient(135deg, #00B4D8, #7C3AED)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontSize: 14, flex: 1,
            }}>
              {currentNav?.label ?? 'Admin'}
            </Typography>
            <ThemeToggle />
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar — temporary on mobile, permanent on desktop */}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={isMobile ? drawerOpen : true}
        onClose={() => setDrawerOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: isDark ? 'rgba(10,15,30,0.95)' : 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(20px)',
            borderRight: isDark ? '1px solid rgba(0,180,216,0.1)' : '1px solid rgba(0,150,183,0.12)',
          },
        }}
      >
        {/* Theme toggle at top of desktop drawer */}
        {!isMobile && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 1.5, pt: 1.5 }}>
            <ThemeToggle />
          </Box>
        )}
        {drawerContent}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 5 },
          pt: { xs: '72px', md: 5 },
          overflow: 'auto',
          minHeight: '100vh',
          width: { xs: '100%', md: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        <Routes>
          <Route index element={<DashboardHome />} />
          <Route path="dashboard"      element={<DashboardHome />} />
          <Route path="messages"       element={<AdminMessagesViewer />} />
          <Route path="experience"     element={<AdminExperienceManager />} />
          <Route path="projects"       element={<AdminProjectsManager />} />
          <Route path="collaborations" element={<AdminCollaborationsManager />} />
          <Route path="skills"         element={<AdminSkillsManager />} />
          <Route path="stats"          element={<AdminStatsManager />} />
          <Route path="achievements"   element={<AdminAchievementsManager />} />
          <Route path="resume"         element={<AdminResumeManager />} />
          <Route path="profile"        element={<AdminProfileManager />} />
        </Routes>
      </Box>
    </Box>
  )
}
