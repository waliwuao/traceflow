import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center">
        <h1 className="text-4xl font-bold">欢迎使用 TraceFlow</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          将团队进度汇报转化为博客发布，让协作更高效
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/register"
            className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            立即开始
          </Link>
          <Link
            to="/login"
            className="rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            登录
          </Link>
        </div>
      </section>

      <section className="grid gap-8 md:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">项目组管理</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            创建和管理项目组，支持最多两层嵌套，让团队结构清晰可见
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">博客式进度汇报</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            用 Markdown 编写博客，轻松关联项目组，自动同步父组
          </p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-semibold">GitHub 风格活动图</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            绿色瓷砖记录每一天的贡献，清晰了解团队活跃度
          </p>
        </div>
      </section>
    </div>
  )
}
