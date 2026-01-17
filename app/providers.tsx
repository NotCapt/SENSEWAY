"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User, AuthContextType } from "@/lib/auth"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = (email: string, password: string) => {
    // Simple validation
    const foundUser = Object.values(JSON.parse(localStorage.getItem("users") || "{}")).find(
      (u: any) => u.email === email && u.password === password,
    )
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
    }
  }

  const signup = (name: string, email: string, password: string, disability: "als" | "dyslexia" | "adhd") => {
    const id = Date.now().toString()
    const newUser: User = { id, name, email, disability }

    // Store in localStorage
    const users = JSON.parse(localStorage.getItem("users") || "{}")
    users[id] = { ...newUser, password }
    localStorage.setItem("users", JSON.stringify(users))

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  return <AuthContext.Provider value={{ user, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
