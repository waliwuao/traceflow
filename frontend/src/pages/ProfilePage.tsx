import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { userService } from '@/services/userService'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    email: user?.email || '',
  })

  const updateMutation = useMutation({
    mutationFn: () => userService.update(user!.id, formData),
    onSuccess: (response) => {
      updateUser(response.data)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate()
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold">个人资料</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-6">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            用户名
          </label>
          <input
            id="username"
            type="text"
            value={user?.username || ''}
            disabled
            className="w-full rounded-md border border-input bg-muted px-3 py-2"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="displayName" className="text-sm font-medium">
            显示名称
          </label>
          <input
            id="displayName"
            type="text"
            value={formData.displayName}
            onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
            className="w-full rounded-md border border-input px-3 py-2"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            邮箱
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-md border border-input px-3 py-2"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="bio" className="text-sm font-medium">
            个人简介
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="min-h-[100px] w-full rounded-md border border-input px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {updateMutation.isPending ? '保存中...' : '保存'}
        </button>
      </form>
    </div>
  )
}
