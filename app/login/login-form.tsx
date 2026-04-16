"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { signInAction } from "@/actions/auth"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { loginSchema, type LoginFormValues } from "@/lib/validation/auth-schemas"

export function LoginForm() {
  const searchParams = useSearchParams()
  const redirectUrl = searchParams.get("redirectUrl") ?? ""
  const [pending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  function onSubmit(values: LoginFormValues) {
    startTransition(async () => {
      const fd = new FormData()
      fd.set("email", values.email)
      fd.set("password", values.password)
      if (redirectUrl) fd.set("redirectUrl", redirectUrl)

      const result = await signInAction(fd)
      if (result && !result.success) {
        toast.error(result.error)
        if (result.fieldErrors) {
          for (const [key, msgs] of Object.entries(result.fieldErrors)) {
            const msg = msgs?.[0]
            if (msg && (key === "email" || key === "password")) {
              setError(key, { message: msg })
            }
          }
        }
      }
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>登录</CardTitle>
          <CardDescription>使用邮箱与密码登录 AI 笔记。</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email?.message ? (
                <p className="text-destructive text-sm" role="alert">
                  {errors.email.message}
                </p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password?.message ? (
                <p className="text-destructive text-sm" role="alert">
                  {errors.password.message}
                </p>
              ) : null}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button type="submit" disabled={pending} className="w-full sm:w-auto">
              {pending ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" aria-hidden />
                  登录中…
                </>
              ) : (
                "登录"
              )}
            </Button>
            <Link
              href="/register"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full justify-center sm:w-auto"
              )}
            >
              去注册
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
