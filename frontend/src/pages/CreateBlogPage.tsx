import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useMutation, useQuery } from '@tanstack/react-query'
import { blogService } from '@/services/blogService'
import { projectGroupService } from '@/services/projectGroupService'
import { useAuthStore } from '@/stores/authStore'

export default function CreateBlogPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedGroups, setSelectedGroups] = useState<number[]>([])

  const groupsQuery = useQuery({
    queryKey: ['projectGroups', 'roots'],
    queryFn: () => projectGroupService.getRoots(),
  })

  const createMutation = useMutation({
    mutationFn: () => blogService.create({ title, content, groupIds: selectedGroups }),
    onSuccess: (response) => {
      navigate(`/blog/${response.data.id}`)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate()
  }

  const toggleGroup = (groupId: number) => {
    setSelectedGroups((prev) => (prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]))
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">写博客</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium">
            标题
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-input px-3 py-2"
            placeholder="博客标题"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="content" className="text-sm font-medium">
            内容 (Markdown)
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px] w-full rounded-md border border-input px-3 py-2 font-mono"
              placeholder="用 Markdown 编写内容..."
              required
            />
            <div className="min-h-[400px] overflow-auto rounded-md border border-input bg-muted p-4">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || '*预览区域*'}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">关联项目组</label>
          <div className="flex flex-wrap gap-2">
            {groupsQuery.data?.data?.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => toggleGroup(group.id)}
                className={`rounded-full px-3 py-1 text-sm ${
                  selectedGroups.includes(group.id)
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {group.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {createMutation.isPending ? '发布中...' : '发布'}
          </button>
        </div>
      </form>
    </div>
  )
}
