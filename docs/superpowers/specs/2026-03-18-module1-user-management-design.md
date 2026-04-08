# 模块 1：用户管理 - 详细设计文档

> **所属项目：** AI 智能笔记应用 (Vibe Coding 教学演示项目)
> **创建日期：** 2026-03-18

---

## 1. 架构分层设计概述

遵循 Web 开发经典的**三层架构（3-Tier Architecture）**规范，本模块严格分离展示、业务与数据操作，确保职责单一（SOLID 原则）：
- **前端展示层 (Presentation Layer):** 负责页面渲染、表单交互与客户端输入校验。
- **业务逻辑层 (Business Logic Layer):** 负责处理核心业务规则（Server Actions）、用户会话管理以及路由重定向控制。
- **数据访问层 (Data Access Layer):** 负责与底层数据库通信（Supabase Auth 接口）、数据持久化及底层触发器（Trigger）联动。

---

## 2. 功能详细设计 (按三层架构展开)

### 2.1 前端展示层 (UI)
- **注册/登录页面 (`/register`, `/login`):** 使用 Server Components 渲染静态外壳，内部嵌套 Client Components 处理表单状态。
- **表单与交互:** 基于 Shadcn UI 构建表单，使用 Zod 定义 Schema（如邮箱格式、密码长度≥6位）。提交时按钮置灰并显示 Spinner 图标。
- **异常反馈:** 字段级错误（如格式不对）直接在输入框下方标红拦截；服务端返回的业务异常（如账号密码错误）通过全局 Toast 弹出提示框。

### 2.2 业务逻辑层 (Server Actions)
认证核心逻辑封装在 `actions/auth.ts` 中，严格禁止客户端直接调用数据访问层。
- **`signUpAction(data: FormData)`:**
  - 接收并进行服务端的二次校验。
  - 调用数据访问层创建账号。
  - 处理成功后的 Session 建立，并执行 `redirect('/notes')`。
- **`signInAction(data: FormData)`:**
  - 验证凭证，若失败则返回标准化的错误结构 `{ success: false, error: '具体错误信息' }`。
  - 成功后建立 Session，并执行 `redirect('/notes')`。
- **`signOutAction()`:**
  - 清除服务端 Session，并执行 `redirect('/login')`。

### 2.3 数据访问层 (Data Access)
封装在 `lib/supabase/server.ts` 及数据库底层设施中。
- **Supabase API 交互:** 封装 `@supabase/ssr` 提供的客户端，执行实际的 `auth.signUp`、`auth.signInWithPassword` 和 `auth.signOut` 数据库操作。
- **数据库底层联动:** 依赖 PostgreSQL 触发器 `handle_new_user()`。当 Auth 注册成功时，数据库自动向 `public.profiles` 插入同步数据，该过程对业务逻辑层完全透明。

---

## 3. 开发计划 (具体到每一层的任务)

为保证层级清晰，开发计划按依赖关系**自底向上**执行：

### Phase 1: 数据访问层 (Data Access Layer) - 预计 0.5 小时
- [ ] **任务 1.1:** 编写 `lib/supabase/server.ts` 和 `lib/supabase/client.ts`，配置并导出 Supabase SSR 工具函数。
- [ ] **任务 1.2:** 确认数据库底层 `profiles` 表及 `handle_new_user` 触发器已在 Supabase 平台就绪（可通过 SQL 编辑器验证）。

### Phase 2: 业务逻辑层 (Business Logic Layer) - 预计 1 小时
- [ ] **任务 2.1:** 创建 `actions/auth.ts`，实现 `signUpAction` 函数，对接数据层 API。
- [ ] **任务 2.2:** 在同文件中实现 `signInAction` 和 `signOutAction` 函数，处理 Cookie 与路由重定向。
- [ ] **任务 2.3:** 编写全局 Auth Middleware (`middleware.ts`)，拦截未登录用户对 `/notes` 路由的访问，处理鉴权路由保护。

### Phase 3: 前端展示层 (Presentation Layer) - 预计 1 小时
- [ ] **任务 3.1:** 定义前端验证的 Zod Schemas（`registerSchema`, `loginSchema`）。
- [ ] **任务 3.2:** 开发 `/login` 和 `/register` 页面，集成 Shadcn UI (Card, Form, Input, Button) 完成静态布局。
- [ ] **任务 3.3:** 接入 React Hook Form，绑定 Phase 2 开发的 Server Actions。完善提交时的 Loading 状态与错误 Toast 提示逻辑。

---

## 4. 数据模型描述

- **`auth.users` 表：** 核心认证表（由 Supabase Auth 托管），存储 `id`, `email`, `encrypted_password`。
- **`public.profiles` 表：** 业务侧用户资料表，与 `auth.users` 通过 UUID 外键 1:1 强关联映射。数据一致性由数据访问层的 Trigger 自动维护。

---

## 5. 依赖声明 (Dependencies)

在进行本模块开发前，需确保以下依赖服务、第三方库及内部模块已就绪：

### 5.1 第三方服务 (External Services)
- **Supabase Project:** 需提供可用的 Supabase URL 和 Anon Key。
- **Supabase Auth:** 已在 Supabase 控制台开启 Email/Password 认证提供商。

### 5.2 第三方核心库 (Libraries)
- **前端核心:** `next` (App Router), `react`, `react-dom`
- **数据与校验:** `@supabase/ssr`, `@supabase/supabase-js`, `zod`, `react-hook-form`, `@hookform/resolvers`
- **UI 与样式:** `tailwindcss`, `lucide-react` (图标), 及其依赖的 Radix UI 基础库（Shadcn UI 所需）。

### 5.3 内部模块依赖 (Internal Modules)
- **数据库底层设施:** 需提前执行数据库设计文档中的 DDL，确保 `auth.users` 表、`public.profiles` 表以及相关的自动同步 Trigger (`handle_new_user`) 均已创建并生效。
- **UI 组件库:** 需提前通过 Shadcn CLI 初始化基础组件，如 `Card`, `Form`, `Input`, `Button`, `Toast`/`Toaster` 等。

---

## 6. 验证方法 (BDD 验收)

按层级链路进行端到端（E2E）验证：

- **验证项 1 (展示层独立拦截)：** 在注册/登录页输入不合法邮箱或短于 6 位的密码，点击提交，验证是否触发红字拦截，且**不**调用业务逻辑层。
- **验证项 2 (全链路打通 - 注册)：** 输入合法凭证注册。验证：展示层 Loading → 业务层 redirect → 数据层 `auth.users` 和 `public.profiles` 均生成新记录。
- **验证项 3 (全链路打通 - 登录/异常)：** 使用错误密码登录。验证：业务层捕获异常并返回 error 对象 → 展示层成功解析并弹出 Toast 提示。
- **验证项 4 (业务逻辑层防御)：** 在 `/notes` 页面点击退出登录（触发清除 Session）。随后手动在浏览器地址栏访问 `/notes`，验证是否被 Middleware 成功拦截并重定向到 `/login`。