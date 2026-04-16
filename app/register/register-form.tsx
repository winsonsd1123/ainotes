"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2Icon } from "lucide-react"
import Link from "next/link"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { signUpAction } from "@/actions/auth"
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
import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validation/auth-schemas"

export function RegisterForm() {
  const [pending, startTransition] = useTransition()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "" },
  })

  function onSubmit(values: RegisterFormValues) {
    startTransition(async () => {
      const fd = new FormData()
      fd.set("email", values.email)
      fd.set("password", values.password)

      const result = await signUpAction(fd)
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
          <CardTitle>注册</CardTitle>
          <CardDescription>创建账号后将自动同步用户资料（由数据库触发器维护）。</CardDescription>
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
                autoComplete="new-password"
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
                  提交中…
                </>
              ) : (
                "注册"
              )}
            </Button>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "w-full justify-center sm:w-auto"
              )}
            >
              已有账号？去登录
            </Link>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
