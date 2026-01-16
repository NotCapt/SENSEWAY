"use client"

import { useState } from "react"

interface SidebarProps {
  userName: string
  currentScreen: string
  onScreenChange: (screen: "boot" | "dashboard" | "chatbot" | "control") => void
  onSignOut: () => void
}

export default function Sidebar({ userName, currentScreen, onScreenChange, onSignOut }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: "dashboard", label: "Home", icon: "🏠", screen: "dashboard" as const },
    { id: "chatbot", label: "AI Assistant", icon: "💬", screen: "chatbot" as const },
    { id: "control", label: "Screen Control", icon: "🖥️", screen: "control" as const },
    { id: "calibrate", label: "Recalibrate", icon: "🎯", screen: "boot" as const },
  ]

  return (
    <aside
      className={`flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex-1">
            <p className="text-xs text-sidebar-foreground/60 font-medium uppercase tracking-wider">Welcome</p>
            <p className="text-lg font-semibold text-sidebar-foreground truncate">{userName}</p>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-sidebar-accent/10 rounded-lg transition-colors text-sidebar-foreground"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onScreenChange(item.screen)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentScreen === item.screen
                ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                : "text-sidebar-foreground hover:bg-sidebar-accent/10"
            }`}
            aria-label={item.label}
          >
            <span className="text-2xl flex-shrink-0">{item.icon}</span>
            {!isCollapsed && <span className="font-medium truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Sign Out Button */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={onSignOut}
          className="w-full px-4 py-3 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-lg font-medium transition-colors"
        >
          {isCollapsed ? "↪️" : "Sign Out"}
        </button>
      </div>
    </aside>
  )
}
