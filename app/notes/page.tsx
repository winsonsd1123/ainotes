import Link from "next/link"
import { redirect } from "next/navigation"

import { signOutAction } from "@/actions/auth"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { cn } from "@/lib/utils"

export default async function NotesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>笔记</CardTitle>
          <CardDescription>已登录：{user.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            此页面为模块 1 占位，后续可接入笔记列表。
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "inline-flex w-full justify-center sm:w-auto"
            )}
          >
            返回首页
          </Link>
          <form action={signOutAction} className="w-full sm:w-auto">
            <Button type="submit" variant="destructive" className="w-full">
              退出登录
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}
