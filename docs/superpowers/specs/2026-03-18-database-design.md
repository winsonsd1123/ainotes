# AI 智能笔记应用 - 数据库设计文档

> **项目名称：** AI 智能笔记应用 (Vibe Coding 教学演示项目)
> **文档版本：** v1.0
> **创建日期：** 2026-03-18

---

## 一、逻辑结构设计 (Logical Design)

### 1.1 核心实体与关系

本系统基于 Supabase (PostgreSQL) 构建，核心实体分为以下三类：

1.  **User (用户账号)**：由 Supabase Auth 原生托管的 `auth.users` 表，负责处理认证凭证（Email/Password、OAuth等）。
2.  **Profile (用户画像)**：`public.profiles` 表，存储应用的业务层用户数据（如昵称、头像），与 `User` 是 **1:1** 的强关联映射。
3.  **Note (笔记)**：`public.notes` 表，存储用户创建的笔记内容、AI 摘要及生成状态。与 `User` 是 **N:1** 关系（一个用户拥有多条笔记）。

### 1.2 实体属性映射

具体字段与类型见 PRD 中的第三节：数据领域模型。

---

## 二、物理结构设计 (Physical Design / DDL)

以下 DDL 脚本设计完全遵循 PostgreSQL 标准，并结合了 Supabase 的最佳实践（包含 RLS 安全防御机制、自动时间戳 Trigger 等）。所有的逻辑都收口在数据库底层（数据访问层），确保业务逻辑层（Next.js）代码保持极致的清爽。

### 2.1 基础设施 (Infrastructure)

定义通用的 `updated_at` 自动更新函数。由于并发控制依赖乐观锁（Optimistic Concurrency Control），必须确保每次更新都刷新时间戳。

```sql
-- 创建自动更新 updated_at 字段的通用触发器函数
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### 2.2 用户资料表 (Profiles)

利用 Trigger 实现在用户注册 `auth.users` 时，自动同步一条记录到 `public.profiles`，避免在应用层写易出错的双写逻辑。

```sql
-- 1. 创建 profiles 表
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. 绑定 updated_at 触发器
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 3. 创建 auth.users 自动同步 profile 的触发器函数
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_url)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'username', 
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. 绑定新建用户触发器
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```

### 2.3 笔记表 (Notes)

严格按照 PRD 中的边界条件，在数据库层面增加 `CHECK` 约束（如标题长度、内容长度限制），防止脏数据写入。

```sql
-- 1. 创建状态枚举类型
CREATE TYPE public.note_status AS ENUM ('DRAFT', 'COMPLETED');

-- 2. 创建 notes 表
CREATE TABLE public.notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) > 0 AND char_length(title) <= 200),
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 10000),
  summary TEXT,
  status public.note_status NOT NULL DEFAULT 'DRAFT'::public.note_status,
  ai_model_used TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. 绑定 updated_at 触发器
CREATE TRIGGER set_notes_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 4. 创建查询优化索引：针对 "按创建时间倒序查看我的笔记列表" 场景
CREATE INDEX idx_notes_user_id_created_at ON public.notes(user_id, created_at DESC);
```

### 2.4 行级安全策略 (Row Level Security - RLS)

开启 RLS，这是防御越权访问的核心。所有的 API 请求（哪怕是客户端直连），只要带上了 JWT Token，PostgreSQL 就会自动把操作限制在当前 `auth.uid()` 的数据范围内。

```sql
-- 1. 开启 profiles 和 notes 的 RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- 2. Profiles RLS 策略 (只能查改自己的资料)
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 3. Notes RLS 策略 (CRUD 仅限自己的笔记)
CREATE POLICY "Users can view own notes"
  ON public.notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes"
  ON public.notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes"
  ON public.notes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own notes"
  ON public.notes FOR DELETE
  USING (auth.uid() = user_id);
```

---

> **架构注记 (Architectural Note)：**
> 
> 本设计严格遵循 **KISS** 和 **SOLID** 原则：
> - **单一职责**：业务逻辑交由前端（Next.js Server Actions）处理，数据一致性和访问控制交由数据层（PostgreSQL / Supabase）处理。
> - **DRY 原则**：将 `updated_at` 逻辑抽离为通用 Trigger，防止多处硬编码。
> - **防御性编程**：结合 RLS、`CHECK` 约束和触发器，形成三道防线，杜绝越权和脏数据。
