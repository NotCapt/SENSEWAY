"use client"

import { useState } from "react"
import { GazeCard } from "@/components/gaze-card"

interface ALSDashboardProps {
  onFeatureSelect?: (feature: string) => void
}

export default function ALSDashboard({ onFeatureSelect }: ALSDashboardProps) {
  const [activeScreen, setActiveScreen] = useState<string | null>(null)

  const features = [
    { id: "speech", title: "Speech to Action", description: "Voice-activated commands", icon: "🎤" },
    { id: "chatbot", title: "AI Assistant", description: "Chat and get assistance", icon: "💬" },
    { id: "control", title: "Screen Control", description: "Control your computer", icon: "🖥️" },
    { id: "messaging", title: "Messaging", description: "Send messages easily", icon: "✉️" },
  ]

  const handleFeatureSelect = (id: string) => {
    setActiveScreen(id)
    setTimeout(() => {
      onFeatureSelect?.(id)
    }, 300)
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-12 px-8 py-12 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="text-center space-y-3">
        <h1 className="text-5xl md:text-6xl font-light tracking-tight">AccessHub</h1>
        <p className="text-lg text-muted-foreground font-light">Select a feature to get started</p>
      </div>

      <div className="grid grid-cols-2 gap-8 max-w-4xl w-full">
        {features.map((feature) => (
          <GazeCard
            key={feature.id}
            onActivate={() => handleFeatureSelect(feature.id)}
            className={`min-h-56 flex items-center justify-center transition-all duration-300 ${
              activeScreen === feature.id ? "ring-4 ring-primary scale-105" : ""
            }`}
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <span className="text-7xl">{feature.icon}</span>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">{feature.title}</h2>
                <p className="text-base text-muted-foreground mt-2">{feature.description}</p>
              </div>
            </div>
          </GazeCard>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">All systems operational</p>
      </div>
    </div>
  )
}
