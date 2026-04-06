import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { commentService, type CreateCommentRequest } from '@/services/commentService'

export const useCommentsByBlogId = (blogId: number) =>
  useQuery({
    queryKey: ['comments', blogId],
    queryFn: () => commentService.getByBlogId(blogId),
    enabled: !!blogId,
  })

export const useComment = () => {
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: CreateCommentRequest) => commentService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => commentService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] })
    },
  })

  return {
    create: createMutation.mutate,
    delete: deleteMutation.mutate,
    isCreateLoading: createMutation.isPending,
    isDeleteLoading: deleteMutation.isPending,
  }
}
