import { Suspense } from "react"

import { LoginForm } from "./login-form"

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center p-6 text-sm text-muted-foreground">
          加载中…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
