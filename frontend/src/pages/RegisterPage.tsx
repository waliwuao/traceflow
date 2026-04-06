import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { userService } from '@/services/userService'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const registerMutation = useMutation({
    mutationFn: () => userService.register({ username, email, password, displayName }),
    onSuccess: () => {
      navigate('/login')
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || '注册失败')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    registerMutation.mutate()
  }

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">注册</h1>
        <p className="text-muted-foreground">创建新账户开始使用 TraceFlow</p>
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
          <label htmlFor="email" className="text-sm font-medium">
            邮箱
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-input px-3 py-2"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="displayName" className="text-sm font-medium">
            显示名称（可选）
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-md border border-input px-3 py-2"
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
            minLength={6}
          />
        </div>
        <button
          type="submit"
          disabled={registerMutation.isPending}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {registerMutation.isPending ? '注册中...' : '注册'}
        </button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        已有账户？{' '}
        <Link to="/login" className="text-primary hover:underline">
          登录
        </Link>
      </p>
    </div>
  )
}
