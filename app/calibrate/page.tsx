"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/providers"
import { AlertCircle } from "lucide-react"

export default function CalibrationPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [calibrationStep, setCalibrationStep] = useState(0)
  const [calibrationPoints, setCalibrationPoints] = useState<{ x: number; y: number }[]>([])

  useEffect(() => {
    if (!user || user.disability !== "als") {
      router.push("/login")
    }
  }, [user, router])

  const calibrationSteps = [
    { x: "10%", y: "10%", label: "Top Left" },
    { x: "50%", y: "10%", label: "Top Center" },
    { x: "90%", y: "10%", label: "Top Right" },
    { x: "10%", y: "50%", label: "Middle Left" },
    { x: "50%", y: "50%", label: "Center" },
    { x: "90%", y: "50%", label: "Middle Right" },
    { x: "10%", y: "90%", label: "Bottom Left" },
    { x: "50%", y: "90%", label: "Bottom Center" },
    { x: "90%", y: "90%", label: "Bottom Right" },
  ]

  const handleCalibrationPoint = () => {
    if (calibrationStep < calibrationSteps.length - 1) {
      setCalibrationStep(calibrationStep + 1)
    } else {
      // Calibration complete
      localStorage.setItem("calibrated", "true")
      router.push("/dashboard/als")
    }
  }

  const skipCalibration = () => {
    localStorage.setItem("calibrated", "true")
    router.push("/dashboard/als")
  }

  const currentPoint = calibrationSteps[calibrationStep]

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-card border-b border-border px-8 py-6 z-10">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Eye gaze calibration</h1>
          <p className="text-sm text-muted-foreground">Look at each point to calibrate the eye tracker</p>
        </div>
      </div>

      {/* Calibration Area */}
      <div className="flex-1 w-full relative mt-20 flex items-center justify-center">
        {/* Calibration Point */}
        <div
          className="absolute w-12 h-12 bg-primary rounded-full border-4 border-primary-foreground shadow-2xl flex items-center justify-center cursor-crosshair transition-all duration-300"
          style={{
            left: currentPoint.x,
            top: currentPoint.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="w-3 h-3 bg-primary-foreground rounded-full"></div>
        </div>

        {/* Instructions */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center space-y-4 bg-card/80 backdrop-blur border border-border rounded-lg p-6 max-w-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-2">
              Step {calibrationStep + 1} of {calibrationSteps.length}
            </p>
            <h2 className="text-lg font-semibold text-foreground">{currentPoint.label}</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Look at the point above. Press SPACE or click when ready.
          </p>
          <button
            onClick={handleCalibrationPoint}
            className="w-full px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            Continue
          </button>
        </div>

        {/* Keyboard Hint */}
        <div className="absolute top-1/2 left-4 flex items-center gap-2 text-muted-foreground text-sm bg-card/80 backdrop-blur px-4 py-2 rounded-lg border border-border">
          <AlertCircle size={16} />
          Press SPACE
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border px-8 py-4 flex items-center justify-between">
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-300"
            style={{ width: `${((calibrationStep + 1) / calibrationSteps.length) * 100}%` }}
          ></div>
        </div>
        <button
          onClick={skipCalibration}
          className="ml-6 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
        >
          Skip
        </button>
      </div>
    </div>
  )
}
