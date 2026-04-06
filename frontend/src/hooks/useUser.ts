import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService, type RegisterRequest, type UpdateUserRequest } from '@/services/userService'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'

export const useUser = () => {
  const queryClient = useQueryClient()

  const profileQuery = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: userService.getProfile,
    enabled: !!localStorage.getItem('token'),
  })

  const loginMutation = useMutation({
    mutationFn: userService.login,
    onSuccess: (response) => {
      const { user, token } = response.data
      useAuthStore.getState().setAuth(user, token)
    },
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => userService.register(data),
    onSuccess: () => {
      useNavigate()('/login')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) => userService.update(id, data),
    onSuccess: (response) => {
      useAuthStore.getState().updateUser(response.data)
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
    },
  })

  return {
    profile: profileQuery.data?.data,
    isLoading: profileQuery.isLoading,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    updateUser: updateMutation.mutate,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    isUpdateLoading: updateMutation.isPending,
  }
}
