import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ScrollToTop from '../components/layout/ScrollToTop'
import ProtectedRoute from './ProtectedRoute'
import LoadingSpinner from '../components/ui/LoadingSpinner'

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
    </>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
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
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
