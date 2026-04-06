import api from './api'

export interface ProjectGroup {
  id: number
  name: string
  description?: string
  parentId?: number
  parentName?: string
  children?: ProjectGroup[]
  members?: MemberInfo[]
  createdAt: string
  updatedAt: string
}

export interface MemberInfo {
  id: number
  username: string
  displayName?: string
}

export interface CreateGroupRequest {
  name: string
  description?: string
  parentId?: number
}

export interface UpdateGroupRequest {
  name?: string
  description?: string
}

export interface AddMembersRequest {
  userIds: number[]
}

export const projectGroupService = {
  create: (data: CreateGroupRequest) => api.post<ProjectGroup>('/project-groups', data),

  getById: (id: number) => api.get<ProjectGroup>(`/project-groups/${id}`),

  getRoots: () => api.get<ProjectGroup[]>('/project-groups/roots'),

  getByParentId: (parentId: number) => api.get<ProjectGroup[]>(`/project-groups/parent/${parentId}`),

  update: (id: number, data: UpdateGroupRequest) => api.put<ProjectGroup>(`/project-groups/${id}`, data),

  addMembers: (id: number, data: AddMembersRequest) => api.post<ProjectGroup>(`/project-groups/${id}/members`, data),

  delete: (id: number) => api.delete(`/project-groups/${id}`),
}
