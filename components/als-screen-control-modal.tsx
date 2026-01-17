"use client"

import { X, Monitor, AppWindow, TagsIcon as TabsIcon } from "lucide-react"
import { useState } from "react"

interface ScreenControlModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ScreenControlModal({ isOpen, onClose }: ScreenControlModalProps) {
  const [selectedControl, setSelectedControl] = useState<string | null>(null)

  const controlOptions = [
    {
      id: "screen",
      label: "Entire Screen",
      description: "Control the full display",
      icon: Monitor,
    },
    {
      id: "window",
      label: "Application Window",
      description: "Control a specific app window",
      icon: AppWindow,
    },
    {
      id: "tab",
      label: "Browser Tab",
      description: "Control current browser tab",
      icon: TabsIcon,
    },
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-border/50">
          <div>
            <h3 className="text-xl font-medium text-foreground">Choose What to Control</h3>
            <p className="text-sm text-muted-foreground mt-1">Select control surface</p>
          </div>
          <button 
            onClick={onClose} 
            className="h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center transition text-muted-foreground hover:text-foreground focus:outline-none focus:ring-4 focus:ring-primary/30"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Control Options */}
        <div className="p-6 space-y-3">
          <div className="grid grid-cols-1 gap-3">
            {controlOptions.map((option) => {
              const Icon = option.icon
              const isSelected = selectedControl === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedControl(option.id)}
                  className={`flex items-center gap-4 p-5 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-primary/10 border-primary shadow-md"
                      : "bg-transparent border-border/50 hover:border-border hover:bg-muted/30"
                  }`}
                >
                  <Icon size={32} className={isSelected ? "text-primary" : "text-muted-foreground"} />
                  <div className="text-left flex-1">
                    <h4 className="text-base font-medium text-foreground mb-0.5">{option.label}</h4>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "bg-primary border-primary" : "border-border"
                    }`}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Status & Actions */}
        {selectedControl && (
          <div className="bg-muted/30 border-t border-border/50 p-6 space-y-4">
            <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-xl">
              <p className="text-primary font-medium text-sm">✓ Control locked to selected surface</p>
            </div>
            <p className="text-sm text-muted-foreground">
              You can now use voice commands like "Scroll down", "Click here", or "Go back" to control this surface.
            </p>
            <button
              onClick={onClose}
              className="w-full px-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition focus:outline-none focus:ring-4 focus:ring-primary/30"
            >
              Confirm Selection
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
