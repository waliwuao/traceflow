import api from './api'

export interface User {
  id: number
  username: string
  email: string
  displayName?: string
  bio?: string
  role: string
  createdAt: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
  displayName?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface UpdateUserRequest {
  email?: string
  displayName?: string
  bio?: string
  password?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export const userService = {
  register: (data: RegisterRequest) => api.post<User>('/auth/register', data),

  login: (data: LoginRequest) => api.post<AuthResponse>('/auth/login', data),

  getProfile: () => api.get<User>('/users/me'),

  getById: (id: number) => api.get<User>(`/users/${id}`),

  getByUsername: (username: string) => api.get<User>(`/users/username/${username}`),

  getAll: () => api.get<User[]>('/users'),

  update: (id: number, data: UpdateUserRequest) => api.put<User>(`/users/${id}`, data),

  delete: (id: number) => api.delete(`/users/${id}`),
}
