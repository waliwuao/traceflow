-- V1__init_schema.sql

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    display_name VARCHAR(200),
    bio VARCHAR(500),
    role VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project groups table
CREATE TABLE project_groups (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    parent_id BIGINT REFERENCES project_groups(id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Project group members (many-to-many)
CREATE TABLE project_group_members (
    project_group_id BIGINT NOT NULL REFERENCES project_groups(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY (project_group_id, user_id)
);

-- Blogs table
CREATE TABLE blogs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    publish_date DATE NOT NULL,
    author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog project groups (many-to-many)
CREATE TABLE blog_project_groups (
    blog_id BIGINT NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    project_group_id BIGINT NOT NULL REFERENCES project_groups(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_id, project_group_id)
);

-- Comments table
CREATE TABLE comments (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    blog_id BIGINT NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Activity tiles table (GitHub-style contribution graph)
CREATE TABLE activity_tiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    UNIQUE(user_id, activity_date)
);

-- Indexes
CREATE INDEX idx_blogs_author ON blogs(author_id);
CREATE INDEX idx_blogs_publish_date ON blogs(publish_date);
CREATE INDEX idx_comments_blog ON comments(blog_id);
CREATE INDEX idx_activity_tiles_user_date ON activity_tiles(user_id, activity_date);
