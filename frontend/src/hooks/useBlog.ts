import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { blogService, type CreateBlogRequest, type UpdateBlogRequest } from '@/services/blogService'

export const useBlog = () => {
  const queryClient = useQueryClient()

  const getBlogById = (id: number) =>
    useQuery({
      queryKey: ['blog', id],
      queryFn: () => blogService.getById(id),
    })

  const getBlogsByAuthor = (authorId: number, page = 0, size = 10) =>
    useQuery({
      queryKey: ['blogs', 'author', authorId, page, size],
      queryFn: () => blogService.getByAuthor(authorId, page, size),
    })

  const getBlogsByGroup = (groupId: number, page = 0, size = 10) =>
    useQuery({
      queryKey: ['blogs', 'group', groupId, page, size],
      queryFn: () => blogService.getByGroup(groupId, page, size),
    })

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
    getBlogById,
    getBlogsByAuthor,
    getBlogsByGroup,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    isCreateLoading: createMutation.isPending,
    isUpdateLoading: updateMutation.isPending,
    isDeleteLoading: deleteMutation.isPending,
  }
}
