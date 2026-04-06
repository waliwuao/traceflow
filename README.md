# TraceFlow

团队协作进度管理系统 - 将"项目进度汇报"转化为"团队博客发布"。

## 项目概述

TraceFlow 是一个专为小团队设计的多人协作进度管理系统。它的核心理念是将"项目进度汇报"转化为"团队博客发布"。

### 主要功能

- **用户系统**: 注册、登录、个人资料管理、超级用户权限
- **项目组管理**: 支持最多两层嵌套的项目组结构
- **博客发布**: Markdown 编辑器、实时预览、项目组关联
- **评论系统**: 支持嵌套回复
- **活动记录**: GitHub 风格的绿色瓷砖活动图

## 技术栈

| 层级 | 技术 |
|------|------|
| 后端 | Java 17, Spring Boot 3.2, JPA, PostgreSQL |
| 前端 | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| 数据库 | PostgreSQL 16 |
| 容器化 | Docker, Docker Compose |
| CI/CD | GitHub Actions |

## 快速开始

### 前置要求

- Docker 和 Docker Compose
- Node.js 20+ (本地开发)
- Java 17+ (本地开发)

### 使用 Docker 启动 (推荐)

```bash
cd docker
./dev.sh
```

或手动启动:

```bash
cd docker
docker compose up -d
```

服务地址:
- 前端: http://localhost:3000
- 后端 API: http://localhost:8080/api
- 数据库: localhost:5432

### 本地开发

**后端:**

```bash
cd backend
# 配置数据库连接 (src/main/resources/application.yml)
mvn spring-boot:run
```

**前端:**

```bash
cd frontend
npm install
npm run dev
```

## 项目结构

```
traceflow/
├── backend/                 # Spring Boot 后端
│   ├── src/main/java/com/traceflow/
│   │   ├── controller/      # REST API 控制器
│   │   ├── service/        # 业务逻辑层
│   │   ├── repository/     # 数据访问层
│   │   ├── model/          # 实体类
│   │   ├── dto/            # 数据传输对象
│   │   ├── config/         # 配置类
│   │   └── exception/      # 异常处理
│   └── Dockerfile
├── frontend/               # React 前端
│   ├── src/
│   │   ├── components/     # 通用组件
│   │   ├── pages/         # 页面组件
│   │   ├── hooks/         # 自定义 Hooks
│   │   ├── services/      # API 服务
│   │   ├── stores/         # 状态管理
│   │   └── styles/         # 样式文件
│   └── Dockerfile
├── docker/                 # Docker 配置
├── docs/                   # 文档
├── .github/workflows/      # CI/CD 配置
└── README.md
```

## 环境变量

### 后端环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| DB_HOST | localhost | 数据库主机 |
| DB_PORT | 5432 | 数据库端口 |
| DB_NAME | traceflow | 数据库名 |
| DB_USER | traceflow | 数据库用户 |
| DB_PASSWORD | traceflow | 数据库密码 |
| SERVER_PORT | 8080 | 服务端口 |

### 前端环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| VITE_API_URL | /api | API 基础 URL |

## 开发指南

详细开发指南请参考 [docs/development.md](docs/development.md)。

## API 文档

API 文档请参考 [docs/api.md](docs/api.md)。

## GitHub Flow 工作流

1. 从 `main` 创建功能分支: `git checkout -b feature/xxx`
2. 开发并提交代码
3. 创建 Pull Request 到 `main`
4. CI 检查通过后合并
5. 自动部署到生产环境

## 许可证

MIT
