import { z } from "zod"

/** 注册 / 登录共用字段校验（邮箱 + 密码 ≥6） */
export const registerSchema = z.object({
  email: z.string().email("请输入有效邮箱"),
  password: z.string().min(6, "密码至少 6 位"),
})

export const loginSchema = registerSchema

export const loginServerSchema = registerSchema.extend({
  redirectUrl: z.string().optional(),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
export type LoginFormValues = z.infer<typeof loginSchema>
