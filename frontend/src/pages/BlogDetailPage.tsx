import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useQuery } from '@tanstack/react-query'
import { blogService } from '@/services/blogService'
import { useComment } from '@/hooks/useComment'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function BlogDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { getCommentsByBlogId, create, isCreateLoading } = useComment()
  const [commentContent, setCommentContent] = useState('')

  const blogQuery = useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getById(Number(id)),
    enabled: !!id,
  })

  const commentsQuery = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getCommentsByBlogId(Number(id)),
    enabled: !!id,
  })

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentContent.trim()) return
    create(
      { content: commentContent, blogId: Number(id) },
      {
        onSuccess: () => {
          setCommentContent('')
          commentsQuery.refetch()
        },
      }
    )
  }

  if (blogQuery.isLoading) {
    return <div className="text-center">加载中...</div>
  }

  const blog = blogQuery.data?.data

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-4">
        <h1 className="text-4xl font-bold">{blog?.title}</h1>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link to={`/profile/${blog?.author.id}`} className="hover:text-primary">
            {blog?.author.displayName || blog?.author.username}
          </Link>
          <span>发布于 {blog?.publishDate && format(new Date(blog.publishDate), 'PPP', { locale: zhCN })}</span>
          {blog?.linkedGroups && blog.linkedGroups.length > 0 && (
            <div className="flex gap-2">
              {blog.linkedGroups.map((g) => (
                <Link key={g.id} to={`/groups/${g.id}`} className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                  {g.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{blog?.content || ''}</ReactMarkdown>
      </div>

      <section className="space-y-4 border-t pt-8">
        <h2 className="text-xl font-semibold">评论 ({blog?.commentCount || 0})</h2>
        <form onSubmit={handleSubmitComment} className="space-y-2">
          <textarea
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="写下你的评论..."
            className="min-h-[100px] w-full rounded-md border border-input px-3 py-2"
          />
          <button
            type="submit"
            disabled={isCreateLoading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isCreateLoading ? '发送中...' : '发送'}
          </button>
        </form>

        <div className="space-y-4">
          {commentsQuery.data?.data?.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </section>
    </article>
  )
}

function CommentItem({ comment }: { comment: any }) {
  return (
    <div className="space-y-2 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${comment.author.id}`} className="font-medium hover:text-primary">
          {comment.author.displayName || comment.author.username}
        </Link>
        <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
      </div>
      <p className="text-sm">{comment.content}</p>
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-4 space-y-2 border-l-2 border-border pl-4">
          {comment.replies.map((reply: any) => (
            <CommentItem key={reply.id} comment={reply} />
          ))}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
