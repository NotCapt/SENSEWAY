"use client"

import { Home, MessageSquare, Monitor, RefreshCw, LogOut, AlertTriangle } from "lucide-react"
import { useState } from "react"

interface ALSSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  onLogout: () => void
  showSOSConfirm?: boolean
  handleSOS?: () => void
  setShowSOSConfirm?: (show: boolean) => void
  isSendingSOS?: boolean
}

export default function ALSSidebar({ 
  activeSection, 
  onSectionChange, 
  onLogout,
  showSOSConfirm = false,
  handleSOS,
  setShowSOSConfirm,
  isSendingSOS = false
}: ALSSidebarProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "assistant", label: "AI Assistant", icon: MessageSquare },
    { id: "control", label: "Screen Control", icon: Monitor },
    { id: "recalibrate", label: "Recalibrate", icon: RefreshCw },
  ]

  const handleSOSClick = () => {
    if (showSOSConfirm && handleSOS) {
      handleSOS()
    } else if (setShowSOSConfirm) {
      setShowSOSConfirm(true)
    }
  }

  return (
    <aside className="w-28 bg-background border-r border-border/30 flex flex-col items-center py-6 space-y-4 overflow-hidden">
      {/* Navigation Items */}
      <nav className="flex flex-col space-y-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
              title={item.label}
            >
              <Icon size={28} />
              <span className="text-xs font-medium mt-1.5 text-center">{item.label.split(" ")[0]}</span>
            </button>
          )
        })}
      </nav>

      <div className="flex-1" />

      <div className="w-full flex flex-col gap-3 items-center">
        {!showSOSConfirm ? (
          <button
            onClick={handleSOSClick}
            className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-all shadow-lg focus:outline-none focus:ring-4 focus:ring-destructive/30"
            title="Emergency SOS"
          >
            <AlertTriangle size={28} />
            <span className="text-xs font-medium mt-1.5">SOS</span>
          </button>
        ) : (
          <div className="space-y-2 w-full px-2">
            <button
              onClick={handleSOSClick}
              disabled={isSendingSOS}
              className="w-full px-4 py-3 bg-destructive text-destructive-foreground rounded-xl text-sm font-medium hover:bg-destructive/90 transition focus:outline-none focus:ring-4 focus:ring-destructive/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSendingSOS ? (
                <>
                  <div className="w-4 h-4 border-2 border-destructive-foreground border-t-transparent rounded-full animate-spin" />
                  SENDING...
                </>
              ) : (
                "SEND"
              )}
            </button>
            <button
              onClick={() => setShowSOSConfirm?.(false)}
              className="w-full px-4 py-3 bg-muted text-muted-foreground rounded-xl text-sm font-medium hover:bg-muted/80 transition focus:outline-none focus:ring-4 focus:ring-muted/30"
            >
              CANCEL
            </button>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl bg-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all focus:outline-none focus:ring-4 focus:ring-muted/30"
        title="Logout"
      >
        <LogOut size={28} />
        <span className="text-xs font-medium mt-1.5">Logout</span>
      </button>
    </aside>
  )
}
