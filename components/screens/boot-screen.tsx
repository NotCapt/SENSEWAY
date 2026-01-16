"use client"

import { useEffect, useState } from "react"
import { CalibrationRing } from "@/components/calibration-ring"

interface BootScreenProps {
  onCalibrationComplete: () => void
}

export default function BootScreen({ onCalibrationComplete }: BootScreenProps) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-12 bg-gradient-to-b from-background to-card/20 px-8">
      <CalibrationRing isActive={!isReady} progress={isReady ? 100 : 75} />

      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground text-balance">Focus to Start</h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-md mx-auto text-balance">
          Eye tracking is calibrating. Keep your focus on the center point.
        </p>
      </div>

      {isReady && (
        <div className="animate-smooth-fade mt-8">
          <p className="text-base text-accent text-center">Calibration complete. Look anywhere to continue...</p>
          <button
            onClick={onCalibrationComplete}
            className="mt-6 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}
