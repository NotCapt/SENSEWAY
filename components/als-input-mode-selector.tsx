"use client"

import { Mic, Eye, Keyboard } from "lucide-react"

interface InputModeSelectorProps {
  activeMode: "voice" | "eyegaze" | "tracking"
  onModeChange: (mode: "voice" | "eyegaze" | "tracking") => void
}

export default function InputModeSelector({ activeMode, onModeChange }: InputModeSelectorProps) {
  const modes = [
    { id: "voice", label: "Voice", icon: Mic, description: "Talk" },
    { id: "eyegaze", label: "Eye-Gaze", icon: Keyboard, description: "Type" },
    { id: "tracking", label: "Tracking", icon: Eye, description: "Track" },
  ]

  return (
    <div className="bg-card/50 border border-border/50 rounded-xl p-6">
      <h3 className="text-base font-medium text-foreground mb-4">Input Mode</h3>
      <div className="grid grid-cols-3 gap-3">
        {modes.map((mode) => {
          const Icon = mode.icon
          const isActive = activeMode === mode.id
          return (
            <button
              key={mode.id}
              onClick={() => onModeChange(mode.id as "voice" | "eyegaze" | "tracking")}
              className={`flex flex-col items-center justify-center p-5 rounded-xl border transition-all ${
                isActive
                  ? "bg-primary border-primary text-primary-foreground shadow-lg"
                  : "bg-transparent border-border/50 text-muted-foreground hover:border-border hover:text-foreground hover:bg-muted/30"
              }`}
            >
              <Icon size={28} />
              <span className="text-sm font-medium mt-2">{mode.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
