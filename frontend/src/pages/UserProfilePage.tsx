import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { userService } from '@/services/userService'
import { useActivity } from '@/hooks/useActivity'

export default function UserProfilePage() {
  const { userId } = useParams<{ userId: string }>()
  const { getYearActivity } = useActivity()

  const userQuery = useQuery({
    queryKey: ['user', userId],
    queryFn: () => userService.getById(Number(userId)),
    enabled: !!userId,
  })

  const activityQuery = useQuery({
    queryKey: ['activity', 'user', userId],
    queryFn: () => getYearActivity(Number(userId)),
    enabled: !!userId,
  })

  if (userQuery.isLoading) {
    return <div className="text-center">加载中...</div>
  }

  const user = userQuery.data?.data

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex items-center gap-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary text-3xl font-bold text-primary-foreground">
          {user?.displayName?.[0] || user?.username[0]}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{user?.displayName || user?.username}</h1>
          <p className="text-muted-foreground">@{user?.username}</p>
          {user?.bio && <p className="mt-2 text-sm">{user.bio}</p>}
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">活动记录</h2>
        <div className="rounded-lg border p-4">
          <ActivityGraph tiles={activityQuery.data?.data?.months || []} />
        </div>
      </section>
    </div>
  )
}

function ActivityGraph({ tiles }: { tiles: any[] }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1">
        {Array.from({ length: 365 }).map((_, i) => {
          const tile = tiles.find((t: any) => t.date === i)
          const intensity = tile?.count || 0
          const color =
            intensity === 0
              ? 'bg-muted'
              : intensity <= 2
              ? 'bg-green-300'
              : intensity <= 5
              ? 'bg-green-500'
              : 'bg-green-700'
          return <div key={i} className={`h-3 w-3 rounded-sm ${color}`} />
        })}
      </div>
    </div>
  )
}
