import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService, type RegisterRequest, type UpdateUserRequest } from '@/services/userService'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate } from 'react-router-dom'

export const useUserProfile = () => {
  const profileQuery = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: userService.getProfile,
    enabled: !!localStorage.getItem('token'),
  })

  return {
    profile: profileQuery.data?.data,
    isLoading: profileQuery.isLoading,
  }
}

export const useLogin = () => {
  const loginMutation = useMutation({
    mutationFn: userService.login,
    onSuccess: (response) => {
      const { user, token } = response.data
      useAuthStore.getState().setAuth(user, token)
    },
  })

  return {
    login: loginMutation.mutate,
    isLoginLoading: loginMutation.isPending,
  }
}

export const useRegister = () => {
  const navigate = useNavigate()
  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => userService.register(data),
    onSuccess: () => {
      navigate('/login')
    },
  })

  return {
    register: registerMutation.mutate,
    isRegisterLoading: registerMutation.isPending,
  }
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient()
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) => userService.update(id, data),
    onSuccess: (response) => {
      useAuthStore.getState().updateUser(response.data)
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] })
    },
  })

  return {
    updateUser: updateMutation.mutate,
    isUpdateLoading: updateMutation.isPending,
  }
}
