import api from './api'

export interface ActivityTile {
  date: string
  count: number
}

export interface UserActivity {
  userId: number
  username: string
  tiles: ActivityTile[]
}

export interface MonthActivity {
  month: number
  tiles: ActivityTile[]
}

export interface YearActivity {
  year: number
  months: MonthActivity[]
}

export const activityService = {
  getUserActivity: (userId: number) => api.get<UserActivity>(`/activity/user/${userId}`),

  getYearActivity: (userId: number, year?: number) =>
    api.get<YearActivity>(`/activity/user/${userId}/year`, { params: { year } }),
}
