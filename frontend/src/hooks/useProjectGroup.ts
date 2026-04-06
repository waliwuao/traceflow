import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  projectGroupService,
  type CreateGroupRequest,
  type UpdateGroupRequest,
  type AddMembersRequest,
} from '@/services/projectGroupService'

export const useProjectGroup = () => {
  const queryClient = useQueryClient()

  const getGroupById = (id: number) =>
    useQuery({
      queryKey: ['projectGroup', id],
      queryFn: () => projectGroupService.getById(id),
    })

  const getRootGroups = () =>
    useQuery({
      queryKey: ['projectGroups', 'roots'],
      queryFn: () => projectGroupService.getRoots(),
    })

  const getChildGroups = (parentId: number) =>
    useQuery({
      queryKey: ['projectGroups', 'children', parentId],
      queryFn: () => projectGroupService.getByParentId(parentId),
    })

  const createMutation = useMutation({
    mutationFn: (data: CreateGroupRequest) => projectGroupService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectGroups'] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGroupRequest }) => projectGroupService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectGroups'] })
    },
  })

  const addMembersMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: AddMembersRequest }) => projectGroupService.addMembers(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectGroups'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => projectGroupService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectGroups'] })
    },
  })

  return {
    getGroupById,
    getRootGroups,
    getChildGroups,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    addMembers: addMembersMutation.mutate,
    delete: deleteMutation.mutate,
    isCreateLoading: createMutation.isPending,
    isUpdateLoading: updateMutation.isPending,
    isAddMembersLoading: addMembersMutation.isPending,
    isDeleteLoading: deleteMutation.isPending,
  }
}
