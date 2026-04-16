"use server"

import { redirect } from "next/navigation"
import type { ZodIssue } from "zod"

import { createClient } from "@/lib/supabase/server"
import { loginServerSchema, registerSchema } from "@/lib/validation/auth-schemas"

export type AuthActionFailure = {
  success: false
  error: string
  fieldErrors?: Record<string, string[]>
}

function issuesToFieldErrors(issues: ZodIssue[]): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {}
  for (const issue of issues) {
    const key = issue.path[0]
    if (typeof key === "string") {
      if (!fieldErrors[key]) fieldErrors[key] = []
      fieldErrors[key].push(issue.message)
    }
  }
  return fieldErrors
}

function zodFailure(issues: ZodIssue[]): AuthActionFailure {
  return {
    success: false,
    error: "请检查表单",
    fieldErrors: issuesToFieldErrors(issues),
  }
}

function safeAppPath(path: string | undefined): string {
  if (!path || typeof path !== "string") return "/notes"
  const t = path.trim()
  if (!t.startsWith("/") || t.startsWith("//")) return "/notes"
  return t
}

export async function signUpAction(
  formData: FormData
): Promise<AuthActionFailure | void> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })
  if (!parsed.success) return zodFailure(parsed.error.issues)

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  if (data.session) {
    redirect("/notes")
  }

  return {
    success: false,
    error:
      "注册已提交。若项目开启了邮箱验证，请先查收邮件完成验证后再登录。",
  }
}

export async function signInAction(
  formData: FormData
): Promise<AuthActionFailure | void> {
  const redirectRaw = formData.get("redirectUrl")
  const parsed = loginServerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    redirectUrl:
      typeof redirectRaw === "string" && redirectRaw.length > 0
        ? redirectRaw
        : undefined,
  })
  if (!parsed.success) return zodFailure(parsed.error.issues)

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  redirect(safeAppPath(parsed.data.redirectUrl))
}

export async function signOutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
