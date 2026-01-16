"use client"

import { useState } from "react"
import { GazeButton } from "@/components/gaze-button"
import { TimeAwarenessBar } from "./time-awareness-bar"

export function GazeControlReference() {
  const [isExpanded, setIsExpanded] = useState(true)

  const controls = [
    { gesture: "Look → Click Target", action: "Move cursor", symbol: "👁️" },
    { gesture: "Intentional Blink", action: "Click / Select", symbol: "⊙" },
    { gesture: "Dwell (2 sec look)", action: "Activate button", symbol: "⏱️" },
    { gesture: "Voice: 'Next'", action: "Switch tab", symbol: "🎤" },
    { gesture: "Voice: 'Stop'", action: "Stop control", symbol: "🎤" },
  ]

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Gaze & Voice</h2>
        <GazeButton size="sm" variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "−" : "+"}
        </GazeButton>
      </div>

      {/* Expandable Controls Reference */}
      {isExpanded && (
        <div className="space-y-2 overflow-y-auto flex-1 pr-2">
          {controls.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex-shrink-0 text-2xl w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                {item.symbol}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{item.gesture}</p>
                <p className="text-xs text-muted-foreground">{item.action}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Time Awareness Bar */}
      <div className="border-t border-border pt-4 mt-auto">
        <TimeAwarenessBar />
      </div>
    </div>
  )
}
