"use client"

import { useState } from "react"
import { GazeButton } from "@/components/gaze-button"
import { GazeCard } from "@/components/gaze-card"

interface AccessibilitySettingsProps {
  onThemeChange: (theme: "light" | "dark") => void
  onFontSizeChange: (size: "normal" | "large" | "extra-large") => void
  currentTheme: "light" | "dark"
  currentFontSize: "normal" | "large" | "extra-large"
}

export function AccessibilitySettings({
  onThemeChange,
  onFontSizeChange,
  currentTheme,
  currentFontSize,
}: AccessibilitySettingsProps) {
  const [isOpen, setIsOpen] = useState(false)

  const fontSizes = [
    { id: "normal", label: "Normal", class: "text-base" },
    { id: "large", label: "Large", class: "text-lg" },
    { id: "extra-large", label: "Extra Large", class: "text-xl" },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Settings Toggle */}
      <GazeButton size="md" variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full">
        {isOpen ? "Close Settings" : "Accessibility"}
      </GazeButton>

      {/* Settings Panel */}
      {isOpen && (
        <GazeCard className="p-6 space-y-6 border-2 border-border">
          {/* Theme Toggle */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">Visual Theme</h3>
            <div className="flex gap-3">
              <GazeButton
                size="md"
                variant={currentTheme === "light" ? "default" : "outline"}
                onClick={() => onThemeChange("light")}
                className="flex-1"
              >
                Light
              </GazeButton>
              <GazeButton
                size="md"
                variant={currentTheme === "dark" ? "default" : "outline"}
                onClick={() => onThemeChange("dark")}
                className="flex-1"
              >
                Dark
              </GazeButton>
            </div>
            <p className="text-xs text-muted-foreground">Reduce visual strain with your preferred contrast level</p>
          </div>

          {/* Font Size Selector */}
          <div className="space-y-3 border-t border-border pt-4">
            <h3 className="text-lg font-semibold text-foreground">Text Size</h3>
            <div className="flex flex-col gap-2">
              {fontSizes.map((size) => (
                <GazeButton
                  key={size.id}
                  size="md"
                  variant={currentFontSize === size.id ? "default" : "outline"}
                  onClick={() => onFontSizeChange(size.id as any)}
                  className="w-full"
                >
                  <span className={size.class}>{size.label}</span>
                </GazeButton>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Larger text supports dyslexia and low vision accessibility</p>
          </div>

          {/* High Contrast Info */}
          <div className="bg-primary/10 border-l-4 border-primary p-3 rounded text-sm text-foreground">
            <p className="font-semibold">High Contrast</p>
            <p className="text-xs text-muted-foreground mt-1">
              This interface uses high contrast colors to support visual accessibility.
            </p>
          </div>
        </GazeCard>
      )}
    </div>
  )
}
