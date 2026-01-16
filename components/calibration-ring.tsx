"use client"

interface CalibrationRingProps {
  isActive?: boolean
  progress?: number
}

export function CalibrationRing({ isActive = true, progress = 0 }: CalibrationRingProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-32 h-32">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary/20"
          />
          <circle
            cx="64"
            cy="64"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary/15"
          />
        </svg>

        {isActive && (
          <svg
            className="absolute inset-0 w-full h-full animate-spin"
            style={{ animationDuration: "3s" }}
            viewBox="0 0 128 128"
          >
            <circle
              cx="64"
              cy="64"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="314"
              strokeDashoffset={314 - (314 * progress) / 100}
              className="text-primary transition-all duration-500"
            />
          </svg>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-primary rounded-full shadow-lg" />
        </div>
      </div>
    </div>
  )
}
