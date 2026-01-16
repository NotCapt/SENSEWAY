"use client"

import { useState } from "react"
import { GazeCard } from "@/components/gaze-card"

interface ConditionSelectionScreenProps {
  onSelect: (condition: string) => void
}

export default function ConditionSelectionScreen({ onSelect }: ConditionSelectionScreenProps) {
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null)

  const conditions = [
    { id: "als", title: "ALS / Motor Disability", description: "Optimized for motor control challenges", icon: "🦾" },
    {
      id: "hearing",
      title: "Deaf / Hearing Impairment",
      description: "Visual-first communication interface",
      icon: "👂",
    },
    { id: "vision", title: "Blind / Low Vision", description: "Audio-focused with haptic feedback", icon: "👁️" },
    { id: "injury", title: "Temporary Injury", description: "Adaptive controls for recovery period", icon: "🏥" },
  ]

  const handleSelect = (id: string) => {
    setSelectedCondition(id)
    setTimeout(() => {
      onSelect(id)
    }, 300)
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-12 px-8 py-12">
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">Select Your Profile</h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">Choose how you interact with this application</p>
      </div>

      <div className="grid grid-cols-2 gap-6 max-w-4xl w-full">
        {conditions.map((condition) => (
          <GazeCard
            key={condition.id}
            onActivate={() => handleSelect(condition.id)}
            className={selectedCondition === condition.id ? "ring-4 ring-primary" : ""}
          >
            <div className="flex flex-col items-center gap-6 text-center">
              <span className="text-7xl">{condition.icon}</span>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">{condition.title}</h2>
                <p className="text-base text-muted-foreground">{condition.description}</p>
              </div>
            </div>
          </GazeCard>
        ))}
      </div>

      <p className="text-sm text-muted-foreground text-center">Click a card to select it</p>
    </div>
  )
}
