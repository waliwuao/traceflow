import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'

export default function Layout() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            TraceFlow
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary">
              首页
            </Link>
            <Link to="/groups" className="text-sm font-medium hover:text-primary">
              项目组
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/create" className="text-sm font-medium hover:text-primary">
                  写博客
                </Link>
                <Link to="/profile" className="text-sm font-medium hover:text-primary">
                  {user?.displayName || user?.username}
                </Link>
                <button onClick={handleLogout} className="text-sm font-medium text-destructive hover:underline">
                  退出
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium hover:text-primary">
                  登录
                </Link>
                <Link
                  to="/register"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  注册
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
