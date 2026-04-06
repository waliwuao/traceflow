import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { userService } from '@/services/userService'
import { useAuthStore } from '@/stores/authStore'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const loginMutation = useMutation({
    mutationFn: () => userService.login({ username, password }),
    onSuccess: (response) => {
      setAuth(response.data, 'token')
      navigate('/')
    },
    onError: () => {
      setError('用户名或密码错误')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    loginMutation.mutate()
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">登录</h1>
        <p className="text-muted-foreground">欢迎回来！请登录您的账户</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            用户名
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border border-input px-3 py-2"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            密码
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-input px-3 py-2"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loginMutation.isPending}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loginMutation.isPending ? '登录中...' : '登录'}
        </button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        还没有账户？{' '}
        <Link to="/register" className="text-primary hover:underline">
          注册
        </Link>
      </p>
    </div>
  )
}
