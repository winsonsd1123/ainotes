import { describe, expect, it } from "vitest"
import { loginSchema, loginServerSchema, registerSchema } from "./auth-schemas"

describe("registerSchema", () => {
  it("accepts valid email and password length >= 6", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "123456",
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid email with expected message", () => {
    const result = registerSchema.safeParse({
      email: "not-an-email",
      password: "123456",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("请输入有效邮箱！")
    }
  })

  it("rejects password shorter than 6 characters", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "12345",
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("密码至少 6 位")
    }
  })
})

describe("loginSchema", () => {
  it("matches registerSchema rules", () => {
    const ok = loginSchema.safeParse({
      email: "a@b.co",
      password: "secret12",
    })
    expect(ok.success).toBe(true)
  })
})

describe("loginServerSchema", () => {
  it("allows optional redirectUrl", () => {
    const result = loginServerSchema.safeParse({
      email: "user@example.com",
      password: "123456",
      redirectUrl: "/notes",
    })
    expect(result.success).toBe(true)
  })

  it("parses without redirectUrl", () => {
    const result = loginServerSchema.safeParse({
      email: "user@example.com",
      password: "123456",
    })
    expect(result.success).toBe(true)
  })
})
