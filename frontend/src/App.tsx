import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ProfilePage from '@/pages/ProfilePage'
import BlogDetailPage from '@/pages/BlogDetailPage'
import CreateBlogPage from '@/pages/CreateBlogPage'
import ProjectGroupsPage from '@/pages/ProjectGroupsPage'
import UserProfilePage from '@/pages/UserProfilePage'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="profile/:userId" element={<UserProfilePage />} />
        <Route path="blog/:id" element={<BlogDetailPage />} />
        <Route path="create" element={<CreateBlogPage />} />
        <Route path="edit/:id" element={<CreateBlogPage />} />
        <Route path="groups" element={<ProjectGroupsPage />} />
      </Route>
    </Routes>
  )
}
