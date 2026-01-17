"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/providers"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function SelectDashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const dashboards = [
    {
      id: "als",
      title: "ALS Dashboard",
      description: "Eye-gaze & voice controls for motor accessibility.",
      icon: "👁️",
      color: "from-primary to-secondary",
      bgColor: "bg-primary/5",
    },
    {
      id: "dyslexia",
      title: "Dyslexia Dashboard",
      description: "Reading-friendly interface with OCR support.",
      icon: "📖",
      color: "from-secondary to-accent",
      bgColor: "bg-secondary/5",
    },
    {
      id: "adhd",
      title: "ADHD Dashboard",
      description: "Focus-aware timer with task management.",
      icon: "⏰",
      color: "from-accent to-primary",
      bgColor: "bg-accent/5",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-md">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Platform</h1>
            <p className="text-xs text-muted-foreground">Accessibility dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-muted-foreground text-sm">
            Welcome, <span className="font-semibold text-foreground">{user.name}</span>
          </span>
          <Button
            onClick={logout}
            variant="ghost"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            Sign out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full space-y-12">
          {/* Introduction */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-foreground leading-tight">Choose dashboard</h2>
            <p className="text-base text-muted-foreground max-w-2xl mx-auto">
              Select the interface for your needs. Each dashboard includes features tailored to your requirements.
            </p>
          </div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboards.map((dashboard) => (
              <Link key={dashboard.id} href={`/dashboard/${dashboard.id}`} className="group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg">
                <div
                  className={`h-full bg-card border border-border rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all duration-200 flex flex-col gap-6 cursor-pointer ${dashboard.bgColor}`}
                >
                  {/* Icon Container */}
                  <div
                    className={`w-16 h-16 rounded-lg bg-gradient-to-br ${dashboard.color} flex items-center justify-center text-2xl shadow-md group-hover:shadow-lg transition-all duration-200`}
                  >
                    {dashboard.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">{dashboard.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{dashboard.description}</p>
                  </div>

                  {/* Button */}
                  <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    Select
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
