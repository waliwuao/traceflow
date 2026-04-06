import { useQuery } from '@tanstack/react-query'
import { activityService } from '@/services/activityService'

export const useUserActivity = (userId: number) =>
  useQuery({
    queryKey: ['activity', 'user', userId],
    queryFn: () => activityService.getUserActivity(userId),
  })

export const useYearActivity = (userId: number, year?: number) =>
  useQuery({
    queryKey: ['activity', 'user', userId, year],
    queryFn: () => activityService.getYearActivity(userId, year),
  })
