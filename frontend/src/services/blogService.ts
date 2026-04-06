import api from './api'

export interface AuthorInfo {
  id: number
  username: string
  displayName?: string
}

export interface GroupInfo {
  id: number
  name: string
}

export interface Blog {
  id: number
  title: string
  content: string
  publishDate: string
  author: AuthorInfo
  linkedGroups: GroupInfo[]
  commentCount: number
  createdAt: string
  updatedAt: string
}

export interface BlogListItem {
  id: number
  title: string
  publishDate: string
  author: AuthorInfo
  linkedGroups: GroupInfo[]
  commentCount: number
}

export interface CreateBlogRequest {
  title: string
  content: string
  publishDate?: string
  groupIds?: number[]
}

export interface UpdateBlogRequest {
  title?: string
  content?: string
  publishDate?: string
  groupIds?: number[]
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  number: number
  size: number
}

export const blogService = {
  create: (data: CreateBlogRequest) => api.post<Blog>('/blogs', data),

  getById: (id: number) => api.get<Blog>(`/blogs/${id}`),

  getByAuthor: (authorId: number, page = 0, size = 10) =>
    api.get<PaginatedResponse<BlogListItem>>(`/blogs/author/${authorId}`, { params: { page, size } }),

  getByGroup: (groupId: number, page = 0, size = 10) =>
    api.get<PaginatedResponse<BlogListItem>>(`/blogs/group/${groupId}`, { params: { page, size } }),

  update: (id: number, data: UpdateBlogRequest) => api.put<Blog>(`/blogs/${id}`, data),

  delete: (id: number) => api.delete(`/blogs/${id}`),
}
