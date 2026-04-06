# TraceFlow 开发指南

## 目录

1. [环境搭建](#环境搭建)
2. [开发规范](#开发规范)
3. [后端开发](#后端开发)
4. [前端开发](#前端开发)
5. [数据库管理](#数据库管理)
6. [测试](#测试)
7. [部署](#部署)

---

## 环境搭建

### 1. 安装基础工具

**Docker Desktop** (包含 Docker 和 Docker Compose):
- macOS: https://docs.docker.com/desktop/mac/install/
- Windows: https://docs.docker.com/desktop/windows/install/
- Linux: https://docs.docker.com/engine/install/

**Java 17+**:
```bash
# macOS
brew install openjdk@17

# Ubuntu/Debian
sudo apt install openjdk-17-jdk
```

**Node.js 20+**:
```bash
# 使用 nvm (推荐)
nvm install 20
nvm use 20
```

**Maven**:
```bash
# macOS
brew install maven

# Ubuntu/Debian
sudo apt install maven
```

### 2. 克隆代码

```bash
git clone https://github.com/yourusername/traceflow.git
cd traceflow
```

### 3. 启动数据库

使用 Docker 启动 PostgreSQL:

```bash
docker run -d \
  --name traceflow-db \
  -e POSTGRES_DB=traceflow \
  -e POSTGRES_USER=traceflow \
  -e POSTGRES_PASSWORD=traceflow_secret \
  -p 5432:5432 \
  postgres:16-alpine
```

或使用 Docker Compose:

```bash
cd docker
docker compose up -d postgres
```

### 4. 验证环境

```bash
# 检查 Java
java -version

# 检查 Maven
mvn -version

# 检查 Node
node -v

# 检查 Docker
docker --version
docker compose version
```

---

## 开发规范

### Git 规范

**分支命名:**

```
feature/<功能名称>      # 新功能
bugfix/<问题描述>       # Bug 修复
hotfix/<问题描述>       # 紧急修复
refactor/<范围>         # 重构
docs/<范围>             # 文档更新
```

**提交信息:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

类型 (type):
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建/工具

示例:
```
feat(user): add user registration endpoint

- add username validation
- add email verification
- add password hashing

Closes #123
```

### 代码规范

**后端 (Java):**

- 使用 Google Java Style Guide
- 缩进: 4 空格
- 行长度: 100 字符
- 使用 Lombok 减少样板代码
- 接口参数使用 DTO，避免暴露实体

**前端 (React/TypeScript):**

- 使用 ESLint + Prettier
- 组件使用 PascalCase
- 工具函数使用 camelCase
- 优先使用函数组件和 Hooks
- 类型定义放在单独文件或文件末尾

---

## 后端开发

### 项目结构

```
backend/src/main/java/com/traceflow/
├── TraceflowApplication.java    # 启动类
├── controller/                   # REST 控制器
│   ├── UserController.java
│   ├── BlogController.java
│   └── ...
├── service/                      # 业务逻辑
│   ├── UserService.java
│   ├── BlogService.java
│   └── ...
├── repository/                    # 数据访问
│   ├── UserRepository.java
│   └── ...
├── model/                        # 实体类
│   ├── User.java
│   ├── Blog.java
│   └── ...
├── dto/                          # 数据传输对象
│   ├── UserDto.java
│   └── ...
├── config/                       # 配置类
│   └── SecurityConfig.java
└── exception/                    # 异常处理
    └── GlobalExceptionHandler.java
```

### 创建新实体

1. 创建 Model:

```java
@Entity
@Table(name = "my_entities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MyEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;
}
```

2. 创建 Repository:

```java
@Repository
public interface MyEntityRepository extends JpaRepository<MyEntity, Long> {
    Optional<MyEntity> findByName(String name);
}
```

3. 创建 Service:

```java
@Service
@RequiredArgsConstructor
public class MyEntityService {
    private final MyEntityRepository repository;

    public MyEntity create(MyEntity entity) {
        return repository.save(entity);
    }
}
```

4. 创建 Controller:

```java
@RestController
@RequestMapping("/my-entities")
@RequiredArgsConstructor
public class MyEntityController {
    private final MyEntityService service;

    @PostMapping
    public ResponseEntity<MyEntity> create(@RequestBody MyEntity entity) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(entity));
    }
}
```

### 运行后端

```bash
cd backend
mvn spring-boot:run
```

API 地址: http://localhost:8080/api

---

## 前端开发

### 项目结构

```
frontend/src/
├── main.tsx              # 入口文件
├── App.tsx               # 路由配置
├── components/          # 通用组件
│   ├── Layout.tsx
│   └── ...
├── pages/               # 页面组件
│   ├── HomePage.tsx
│   └── ...
├── hooks/               # 自定义 Hooks
│   ├── useUser.ts
│   └── ...
├── services/            # API 调用
│   ├── api.ts
│   └── userService.ts
├── stores/              # 状态管理 (Zustand)
│   └── authStore.ts
├── styles/              # 全局样式
└── lib/                 # 工具函数
    └── utils.ts
```

### 创建新页面

1. 创建页面组件:

```tsx
// src/pages/MyPage.tsx
import { useQuery } from '@tanstack/react-query'
import { myService } from '@/services/myService'

export default function MyPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['myData'],
    queryFn: myService.getAll,
  })

  if (isLoading) return <div>加载中...</div>

  return (
    <div>
      {data?.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

2. 添加路由:

```tsx
// App.tsx
<Route path="/my-page" element={<MyPage />} />
```

### 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端地址: http://localhost:5173

---

## 数据库管理

### Flyway 迁移

迁移脚本位置: `backend/src/main/resources/db/migration/`

命名规范: `V<序号>__<描述>.sql`

示例:
```
V1__init_schema.sql
V2__add_user_avatar.sql
```

### 本地数据库操作

```bash
# 连接数据库
docker exec -it traceflow-db psql -U traceflow -d traceflow

# 常用命令
\dt          # 列出所有表
\d users     # 查看表结构
\du         # 列出所有用户
```

### 数据重置

```bash
# 删除并重建数据库
docker exec -it traceflow-db psql -U traceflow -c "DROP DATABASE traceflow;"
docker exec -it traceflow-db psql -U traceflow -c "CREATE DATABASE traceflow;"

# 或使用 Docker Compose
docker compose down -v
docker compose up -d
```

---

## 测试

### 后端测试

```bash
cd backend

# 运行所有测试
mvn test

# 运行单个测试类
mvn test -Dtest=UserServiceTest

# 生成测试覆盖率报告
mvn test jacoco:report
```

### 前端测试

```bash
cd frontend

# 运行测试
npm run test

# 交互式测试
npm run test:ui

# 测试覆盖率
npm run test:coverage
```

### 集成测试 (Testcontainers)

```bash
cd backend
mvn verify
```

---

## 部署

### Docker 部署

**开发环境:**

```bash
cd docker
docker compose up -d
```

**生产环境:**

```bash
cd docker

# 设置环境变量
export DB_NAME=traceflow_prod
export DB_USER=prod_user
export DB_PASSWORD=secure_password
export IMAGE_TAG=latest

# 启动服务
docker compose -f docker-compose.prod.yml up -d
```

### 手动部署

**后端:**

```bash
cd backend
mvn clean package -DskipTests
docker build -t traceflow-backend .
docker run -d -p 8080:8080 \
  -e DB_HOST=your-db-host \
  -e DB_NAME=traceflow \
  traceflow-backend
```

**前端:**

```bash
cd frontend
npm run build
docker build -t traceflow-frontend .
docker run -d -p 80:80 traceflow-frontend
```

### 环境检查清单

- [ ] 数据库连接配置正确
- [ ] 环境变量已设置
- [ ] Docker 镜像已构建
- [ ] 端口未被占用
- [ ] 防火墙规则已配置
- [ ] HTTPS 证书已配置 (生产环境)
