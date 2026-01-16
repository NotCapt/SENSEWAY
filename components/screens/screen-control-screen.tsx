"use client"

import { useState } from "react"
import { ScreenSelectionCard } from "./screen-selection-card"
import { GazeControlReference } from "./gaze-control-reference"
import { AccessibilitySettings } from "./accessibility-settings"

export default function ScreenControlScreen() {
  const [selectedScreen, setSelectedScreen] = useState<string | null>(null)
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [fontSize, setFontSize] = useState<"normal" | "large" | "extra-large">("normal")
  const [expandedPanel, setExpandedPanel] = useState<"gaze" | "settings" | null>(null)

  const screenOptions = [
    {
      id: "entire-screen",
      title: "Entire Screen",
      description: "Control everything currently visible on your display",
      icon: "🖥️",
    },
    {
      id: "application-window",
      title: "Single Window",
      description: "Focus on one specific open application window",
      icon: "📦",
    },
    {
      id: "browser-tab",
      title: "Browser Tab",
      description: "Control content within a specific web browser tab",
      icon: "🌐",
    },
  ]

  const fontSizeClass = {
    normal: "",
    large: "text-lg",
    "extra-large": "text-xl",
  }[fontSize]

  return (
    <div
      className={`w-full h-full flex flex-col bg-background text-foreground overflow-hidden ${fontSizeClass} ${
        theme === "dark" ? "dark" : ""
      }`}
    >
      {/* Header */}
      <div className="flex-shrink-0 border-b border-border p-6 bg-card/30">
        <h1 className="text-3xl font-bold">Choose What to Control</h1>
        <p className="text-base text-muted-foreground mt-2">Select the screen, window, or tab you want to control.</p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-4 p-6 overflow-hidden">
        {/* Screen Selection Cards - Primary Focus */}
        <div className="flex-1 flex flex-col gap-4 overflow-auto">
          {screenOptions.map((option) => (
            <ScreenSelectionCard
              key={option.id}
              title={option.title}
              description={option.description}
              icon={option.icon}
              isSelected={selectedScreen === option.id}
              onSelect={() => setSelectedScreen(option.id)}
            />
          ))}
        </div>

        {/* Collapsible Panels - Secondary */}
        <div className="flex-shrink-0 flex gap-3">
          {/* Gaze Reference Collapse */}
          <button
            onClick={() => setExpandedPanel(expandedPanel === "gaze" ? null : "gaze")}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              expandedPanel === "gaze"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-foreground hover:bg-card/80"
            }`}
          >
            {expandedPanel === "gaze" ? "Hide Gaze Help" : "Show Gaze Help"}
          </button>

          {/* Accessibility Settings Collapse */}
          <button
            onClick={() => setExpandedPanel(expandedPanel === "settings" ? null : "settings")}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              expandedPanel === "settings"
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-foreground hover:bg-card/80"
            }`}
          >
            {expandedPanel === "settings" ? "Hide Settings" : "Show Settings"}
          </button>
        </div>
      </div>

      {/* Expandable Panel Area */}
      {expandedPanel && (
        <div className="flex-shrink-0 border-t border-border bg-card/30 overflow-auto max-h-48">
          <div className="p-6">
            {expandedPanel === "gaze" && <GazeControlReference />}
            {expandedPanel === "settings" && (
              <AccessibilitySettings
                onThemeChange={setTheme}
                onFontSizeChange={setFontSize}
                currentTheme={theme}
                currentFontSize={fontSize}
              />
            )}
          </div>
        </div>
      )}

      {/* Status Footer */}
      {selectedScreen && (
        <div className="flex-shrink-0 border-t border-border p-4 bg-accent/10">
          <p className="text-sm font-medium text-accent">
            ✓ {screenOptions.find((s) => s.id === selectedScreen)?.title} selected
          </p>
        </div>
      )}
    </div>
  )
}
