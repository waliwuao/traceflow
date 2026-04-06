import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { projectGroupService } from '@/services/projectGroupService'
import { useAuthStore } from '@/stores/authStore'

export default function ProjectGroupsPage() {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useAuthStore()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupDesc, setNewGroupDesc] = useState('')
  const [parentId, setParentId] = useState<number | undefined>(undefined)

  const groupsQuery = useQuery({
    queryKey: ['projectGroups', 'roots'],
    queryFn: () => projectGroupService.getRoots(),
  })

  const createMutation = useMutation({
    mutationFn: () => projectGroupService.create({ name: newGroupName, description: newGroupDesc, parentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectGroups'] })
      setShowCreateModal(false)
      setNewGroupName('')
      setNewGroupDesc('')
      setParentId(undefined)
    },
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">项目组</h1>
        {isAuthenticated && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            创建项目组
          </button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {groupsQuery.data?.data?.map((group) => (
          <GroupCard key={group.id} group={group} />
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6">
            <h2 className="mb-4 text-xl font-bold">创建项目组</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                createMutation.mutate()
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <label htmlFor="groupName" className="text-sm font-medium">
                  名称
                </label>
                <input
                  id="groupName"
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full rounded-md border border-input px-3 py-2"
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="groupDesc" className="text-sm font-medium">
                  描述
                </label>
                <textarea
                  id="groupDesc"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full rounded-md border border-input px-3 py-2"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="parentGroup" className="text-sm font-medium">
                  父项目组（可选）
                </label>
                <select
                  id="parentGroup"
                  value={parentId || ''}
                  onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full rounded-md border border-input px-3 py-2"
                >
                  <option value="">无</option>
                  {groupsQuery.data?.data?.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {createMutation.isPending ? '创建中...' : '创建'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function GroupCard({ group }: { group: any }) {
  return (
    <div className="rounded-lg border p-6">
      <h3 className="text-lg font-semibold">{group.name}</h3>
      {group.description && <p className="mt-2 text-sm text-muted-foreground">{group.description}</p>}
      {group.children && group.children.length > 0 && (
        <div className="mt-4 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">子项目组</p>
          <div className="flex flex-wrap gap-1">
            {group.children.map((child: any) => (
              <Link
                key={child.id}
                to={`/groups/${child.id}`}
                className="rounded-full bg-secondary px-2 py-0.5 text-xs hover:bg-secondary/80"
              >
                {child.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      {group.members && group.members.length > 0 && (
        <div className="mt-4 flex items-center gap-2">
          <p className="text-xs text-muted-foreground">成员</p>
          <div className="flex -space-x-2">
            {group.members.slice(0, 5).map((member: any) => (
              <Link
                key={member.id}
                to={`/profile/${member.id}`}
                className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
              >
                {member.displayName?.[0] || member.username[0]}
              </Link>
            ))}
            {group.members.length > 5 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                +{group.members.length - 5}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
