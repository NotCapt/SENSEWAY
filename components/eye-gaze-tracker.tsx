"use client"

import { useEffect, useRef, useState } from "react"

interface GazePoint {
  x: number
  y: number
  timestamp: number
}

interface EyeGazeTrackerProps {
  onGazeUpdate?: (point: GazePoint) => void
  onGestureDetected?: (gesture: string) => void
  showIndicator?: boolean
}

export function EyeGazeTracker({ onGazeUpdate, onGestureDetected, showIndicator = true }: EyeGazeTrackerProps) {
  const [gazePoint, setGazePoint] = useState<GazePoint | null>(null)
  const gazeHistoryRef = useRef<GazePoint[]>([])

  // Simulated eye-gaze tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const point: GazePoint = {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now(),
      }

      setGazePoint(point)
      gazeHistoryRef.current.push(point)

      // Keep only last 30 points for gesture detection
      if (gazeHistoryRef.current.length > 30) {
        gazeHistoryRef.current.shift()
      }

      onGazeUpdate?.(point)

      // Simple gesture detection (circular motion)
      if (gazeHistoryRef.current.length > 20) {
        detectGestures()
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [onGazeUpdate])

  const detectGestures = () => {
    const history = gazeHistoryRef.current
    if (history.length < 20) return

    const recent = history.slice(-20)
    const first = recent[0]
    const last = recent[recent.length - 1]

    // Calculate if motion is circular (simplified)
    const distance = Math.sqrt(Math.pow(last.x - first.x, 2) + Math.pow(last.y - first.y, 2))

    if (distance < 50 && recent.length > 15) {
      onGestureDetected?.("circular")
      gazeHistoryRef.current = []
    }
  }

  return (
    <>
      {showIndicator && gazePoint && (
        <div
          className="pointer-events-none fixed w-8 h-8 border-2 border-primary rounded-full shadow-lg"
          style={{
            left: `${gazePoint.x - 16}px`,
            top: `${gazePoint.y - 16}px`,
            zIndex: 1000,
          }}
        >
          <div className="absolute inset-2 bg-primary/20 rounded-full" />
        </div>
      )}
    </>
  )
}
