import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/Layout'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import ProfilePage from '@/pages/ProfilePage'
import BlogDetailPage from '@/pages/BlogDetailPage'
import CreateBlogPage from '@/pages/CreateBlogPage'
import ProjectGroupsPage from '@/pages/ProjectGroupsPage'
import UserProfilePage from '@/pages/UserProfilePage'

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
