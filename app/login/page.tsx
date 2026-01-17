"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/providers"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const users = JSON.parse(localStorage.getItem("users") || "{}")
      const foundUser = Object.values(users).find((u: any) => u.email === email && u.password === password)

      if (foundUser) {
        login(email, password)
        router.push("/select-dashboard")
      } else {
        setError("Invalid email or password. Please try again.")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-xl border border-border shadow-lg p-8 space-y-6">
          {/* Header */}
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-primary/10 mb-4">
              <div className="w-7 h-7 bg-gradient-to-br from-primary to-accent rounded-md" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
            <p className="text-muted-foreground text-sm">Access your account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-xl text-sm font-medium" role="alert">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="you@example.com"
                required
                aria-required="true"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-input border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="••••••••"
                required
                aria-required="true"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-xl transition duration-200 shadow-lg hover:shadow-xl"
            >
              Sign in
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center space-y-2 pt-4 border-t border-border">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link href="/signup" className="text-primary hover:text-primary/80 font-semibold">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
