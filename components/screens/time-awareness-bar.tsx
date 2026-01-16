"use client"

import { useState, useEffect } from "react"
import { GazeButton } from "@/components/gaze-button"

interface TimeAwarenessBarProps {
  onTimerTick?: (secondsRemaining: number) => void
}

export function TimeAwarenessBar({ onTimerTick }: TimeAwarenessBarProps) {
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [inputMinutes, setInputMinutes] = useState("5")

  useEffect(() => {
    if (!isActive || timerSeconds <= 0) return

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        const next = prev - 1
        onTimerTick?.(next)
        if (next <= 0) {
          setIsActive(false)
        }
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, timerSeconds, onTimerTick])

  const getBarColor = () => {
    if (timerSeconds <= 0) return "bg-muted"
    const maxSeconds = Number.parseInt(inputMinutes) * 60
    const percent = (timerSeconds / maxSeconds) * 100

    if (percent > 66) return "bg-green-500"
    if (percent > 33) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getPercentage = () => {
    if (timerSeconds <= 0) return 0
    const maxSeconds = Number.parseInt(inputMinutes) * 60
    return (timerSeconds / maxSeconds) * 100
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleStartTimer = () => {
    const minutes = Number.parseInt(inputMinutes) || 5
    setTimerSeconds(minutes * 60)
    setIsActive(true)
  }

  const handleStopTimer = () => {
    setIsActive(false)
    setTimerSeconds(0)
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Time Bar Visualization */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Activity Timer</span>
          {isActive && <span className="text-lg font-semibold text-foreground">{formatTime(timerSeconds)}</span>}
        </div>
        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${getBarColor()}`}
            style={{ width: `${getPercentage()}%` }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3">
        {!isActive ? (
          <>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                min="1"
                max="60"
                value={inputMinutes}
                onChange={(e) => setInputMinutes(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Minutes"
              />
              <span className="text-sm text-muted-foreground">min</span>
            </div>
            <GazeButton size="sm" onClick={handleStartTimer} className="w-full">
              Start Timer
            </GazeButton>
          </>
        ) : (
          <GazeButton size="sm" variant="outline" onClick={handleStopTimer} className="w-full">
            Stop Timer
          </GazeButton>
        )}
      </div>

      {/* Voice Command Help Text */}
      <div className="text-xs text-muted-foreground space-y-1 bg-card/50 p-2 rounded">
        <p className="font-medium">Voice Commands:</p>
        <p>"Start 20-minute timer"</p>
        <p>"Stop timer"</p>
      </div>
    </div>
  )
}
