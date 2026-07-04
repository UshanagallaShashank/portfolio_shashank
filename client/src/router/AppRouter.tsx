import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Box } from '@mui/material'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ScrollToTop from '../components/layout/ScrollToTop'
import ProtectedRoute from './ProtectedRoute'
import PageLoader from '../components/ui/PageLoader'
import ScrollDownIndicator from '../components/ui/ScrollDownIndicator'
import GlobalBackground from '../components/ui/GlobalBackground'

const HomePage = lazy(() => import('../pages/HomePage'))
const AboutPage = lazy(() => import('../pages/AboutPage'))
const ExperiencePage = lazy(() => import('../pages/ExperiencePage'))
const ProjectsPage = lazy(() => import('../pages/ProjectsPage'))
const AchievementsPage = lazy(() => import('../pages/AchievementsPage'))
const CollaborationPage = lazy(() => import('../pages/CollaborationPage'))
const ContactPage = lazy(() => import('../pages/ContactPage'))
const AdminLoginPage = lazy(() => import('../pages/admin/AdminLoginPage'))
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'))

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
      <ScrollDownIndicator />
    </>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      {/* Global ambient background — behind all content */}
      <GlobalBackground />
      {/* Content layer sits above the background */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <ScrollToTop />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/experience" element={<ExperiencePage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/collaboration" element={<CollaborationPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Box>
    </BrowserRouter>
  )
}
