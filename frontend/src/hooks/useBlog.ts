import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blogService, type CreateBlogRequest, type UpdateBlogRequest } from '@/services/blogService'

export const useBlogById = (id: number) =>
  useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getById(id),
  })

export const useBlogsByAuthor = (authorId: number, page = 0, size = 10) =>
  useQuery({
    queryKey: ['blogs', 'author', authorId, page, size],
    queryFn: () => blogService.getByAuthor(authorId, page, size),
  })

export const useBlogsByGroup = (groupId: number, page = 0, size = 10) =>
  useQuery({
    queryKey: ['blogs', 'group', groupId, page, size],
    queryFn: () => blogService.getByGroup(groupId, page, size),
  })

export const useBlog = () => {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: CreateBlogRequest) => blogService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBlogRequest }) => blogService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => blogService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    },
  })

  return {
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreateLoading: createMutation.isPending,
    isUpdateLoading: updateMutation.isPending,
    isDeleteLoading: deleteMutation.isPending,
  }
}
