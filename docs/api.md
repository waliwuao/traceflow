# TraceFlow API 文档

## 基础信息

- 基础 URL: `http://localhost:8080/api`
- 所有请求需要认证 (除了 `/auth/*`)
- 请求格式: `application/json`
- 响应格式: `application/json`

## 认证

### 注册

```
POST /auth/register
```

**请求体:**

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "displayName": "string (可选)"
}
```

**响应:**

```json
{
  "id": 1,
  "username": "john",
  "email": "john@example.com",
  "displayName": "John",
  "role": "NORMAL",
  "createdAt": "2024-01-01T00:00:00"
}
```

### 登录

```
POST /auth/login
```

**请求体:**

```json
{
  "username": "string",
  "password": "string"
}
```

---

## 用户

### 获取用户列表

```
GET /users
```

**响应:**

```json
[
  {
    "id": 1,
    "username": "john",
    "email": "john@example.com",
    "displayName": "John",
    "role": "NORMAL",
    "createdAt": "2024-01-01T00:00:00"
  }
]
```

### 获取用户详情

```
GET /users/{id}
```

### 获取用户 (按用户名)

```
GET /users/username/{username}
```

### 更新用户

```
PUT /users/{id}
```

**请求体:**

```json
{
  "email": "new@example.com",
  "displayName": "New Name",
  "bio": "用户简介",
  "password": "newpassword (可选)"
}
```

### 删除用户

```
DELETE /users/{id}
```

---

## 项目组

### 创建项目组

```
POST /project-groups
```

**请求体:**

```json
{
  "name": "算法组",
  "description": "算法相关项目",
  "parentId": 1
}
```

**响应:**

```json
{
  "id": 1,
  "name": "算法组",
  "description": "算法相关项目",
  "parentId": null,
  "children": [],
  "members": [],
  "createdAt": "2024-01-01T00:00:00"
}
```

### 获取根项目组

```
GET /project-groups/roots
```

### 获取子项目组

```
GET /project-groups/parent/{parentId}
```

### 获取项目组详情

```
GET /project-groups/{id}
```

### 更新项目组

```
PUT /project-groups/{id}
```

**请求体:**

```json
{
  "name": "新名称",
  "description": "新描述"
}
```

### 添加成员

```
POST /project-groups/{id}/members
```

**请求体:**

```json
{
  "userIds": [1, 2, 3]
}
```

### 删除项目组

```
DELETE /project-groups/{id}
```

---

## 博客

### 创建博客

```
POST /blogs
```

**请求体:**

```json
{
  "title": "第一篇博客",
  "content": "# 标题\n\n内容...",
  "publishDate": "2024-01-01",
  "groupIds": [1, 2]
}
```

**响应:**

```json
{
  "id": 1,
  "title": "第一篇博客",
  "content": "# 标题\n\n内容...",
  "publishDate": "2024-01-01",
  "author": {
    "id": 1,
    "username": "john",
    "displayName": "John"
  },
  "linkedGroups": [
    { "id": 1, "name": "算法组" }
  ],
  "commentCount": 0,
  "createdAt": "2024-01-01T00:00:00"
}
```

### 获取博客详情

```
GET /blogs/{id}
```

### 获取用户的博客

```
GET /blogs/author/{authorId}?page=0&size=10
```

### 获取项目组的博客

```
GET /blogs/group/{groupId}?page=0&size=10
```

### 更新博客

```
PUT /blogs/{id}
```

**请求体:**

```json
{
  "title": "更新后的标题",
  "content": "更新后的内容",
  "groupIds": [1]
}
```

### 删除博客

```
DELETE /blogs/{id}
```

---

## 评论

### 创建评论

```
POST /comments
```

**请求体:**

```json
{
  "content": "这是评论内容",
  "blogId": 1,
  "parentCommentId": null
}
```

**响应:**

```json
{
  "id": 1,
  "content": "这是评论内容",
  "author": {
    "id": 1,
    "username": "john",
    "displayName": "John"
  },
  "blogId": 1,
  "parentCommentId": null,
  "replies": [],
  "createdAt": "2024-01-01T00:00:00"
}
```

### 获取博客的评论

```
GET /comments/blog/{blogId}
```

### 删除评论

```
DELETE /comments/{id}
```

---

## 活动记录

### 获取用户活动 (最近一年)

```
GET /activity/user/{userId}
```

**响应:**

```json
{
  "userId": 1,
  "username": "john",
  "tiles": [
    { "date": "2024-01-01", "count": 3 },
    { "date": "2024-01-02", "count": 1 }
  ]
}
```

### 获取用户年度活动

```
GET /activity/user/{userId}/year?year=2024
```

**响应:**

```json
{
  "year": 2024,
  "months": [
    {
      "month": 1,
      "tiles": [
        { "date": "2024-01-01", "count": 3 }
      ]
    }
  ]
}
```

---

## 错误响应

所有错误响应格式:

```json
{
  "timestamp": "2024-01-01T00:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "具体的错误信息"
}
```

### 常见错误码

| 状态码 | 说明 |
|--------|------|
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 认证方式

使用 JWT Token 或 Session 进行认证。

请求头示例:

```
Authorization: Bearer <token>
```

或

```
Cookie: JSESSIONID=<session_id>
```
