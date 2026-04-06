import api from './api'

export interface CommentAuthor {
  id: number
  username: string
  displayName?: string
}

export interface Comment {
  id: number
  content: string
  author: CommentAuthor
  blogId: number
  parentCommentId?: number
  replies?: Comment[]
  createdAt: string
}

export interface CreateCommentRequest {
  content: string
  blogId: number
  parentCommentId?: number
}

export const commentService = {
  create: (data: CreateCommentRequest) => api.post<Comment>('/comments', data),

  getByBlogId: (blogId: number) => api.get<Comment[]>(`/comments/blog/${blogId}`),

  delete: (id: number) => api.delete(`/comments/${id}`),
}
