"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/providers"

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    // Redirect based on authentication status
    if (user) {
      router.push(`/dashboard/${user.disability}`)
    } else {
      router.push("/login")
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="w-16 h-16 border-4 border-border border-t-primary rounded-full animate-spin mx-auto" aria-label="Loading" />
        <div className="space-y-2">
          <p className="text-foreground text-lg font-semibold">Loading</p>
          <p className="text-muted-foreground text-sm">Please wait</p>
        </div>
      </div>
    </div>
  )
}
