"use client"

import { Button } from "@/components/ui/button"

interface DashboardNavProps {
  title: string
  subtitle: string
  user: { id: string; name: string; email: string; disability: "als" | "dyslexia" | "adhd" }
  onLogout: () => void
  onChangeDashboard: () => void
}

export default function DashboardNav({ title, subtitle, user, onLogout, onChangeDashboard }: DashboardNavProps) {
  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left - Logo & Title */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        {/* Right - Navigation */}
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground text-sm">
            Hello, <span className="font-semibold text-foreground">{user.name}</span>
          </span>

          <Button
            onClick={onChangeDashboard}
            variant="ghost"
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            Change Dashboard
          </Button>

          <Button
            onClick={onLogout}
            variant="ghost"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  )
}
