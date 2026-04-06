import { useQuery } from '@tanstack/react-query'
import { activityService } from '@/services/activityService'

export const useActivity = () => {
  const getUserActivity = (userId: number) =>
    useQuery({
      queryKey: ['activity', 'user', userId],
      queryFn: () => activityService.getUserActivity(userId),
    })

  const getYearActivity = (userId: number, year?: number) =>
    useQuery({
      queryKey: ['activity', 'user', userId, year],
      queryFn: () => activityService.getYearActivity(userId, year),
    })

  return {
    getUserActivity,
    getYearActivity,
  }
}
