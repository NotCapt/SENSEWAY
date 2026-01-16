"use client"

import type * as React from "react"
import { GazeCard } from "@/components/gaze-card"

interface ScreenSelectionCardProps {
  title: string
  description: string
  icon: React.ReactNode
  isSelected?: boolean
  onSelect: () => void
}

export function ScreenSelectionCard({
  title,
  description,
  icon,
  isSelected = false,
  onSelect,
}: ScreenSelectionCardProps) {
  return (
    <GazeCard
      onActivate={onSelect}
      className={`flex flex-col items-center justify-center gap-6 p-12 transition-all duration-300 ${
        isSelected ? "ring-4 ring-accent ring-offset-2 bg-primary/5" : "border-2 border-border hover:border-primary/50"
      }`}
    >
      <div className="text-6xl">{icon}</div>
      <div className="text-center">
        <h3 className="text-2xl font-semibold text-foreground">{title}</h3>
        <p className="text-base text-muted-foreground mt-2">{description}</p>
      </div>
      {isSelected && <div className="text-sm font-medium text-accent">Selected</div>}
    </GazeCard>
  )
}
