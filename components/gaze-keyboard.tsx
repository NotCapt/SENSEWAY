"use client"

import { useState } from "react"
import { GazeButton } from "./gaze-button"

interface GazeKeyboardProps {
  onInput: (text: string) => void
  onSend: () => void
  onCancel: () => void
}

export function GazeKeyboard({ onInput, onSend, onCancel }: GazeKeyboardProps) {
  const [text, setText] = useState("")

  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ]

  const handleKeyPress = (key: string) => {
    const newText = text + key
    setText(newText)
    onInput(newText)
  }

  const handleBackspace = () => {
    const newText = text.slice(0, -1)
    setText(newText)
    onInput(newText)
  }

  const handleSpace = () => {
    const newText = text + " "
    setText(newText)
    onInput(newText)
  }

  return (
    <div className="bg-card p-6 rounded-lg border-2 border-primary/20 space-y-4">
      {/* Display */}
      <div className="bg-background p-4 rounded-lg min-h-16 flex items-center text-foreground text-2xl">
        {text || "Start typing..."}
      </div>

      {/* Keyboard rows */}
      <div className="space-y-3">
        {rows.map((row, idx) => (
          <div key={idx} className="flex justify-center gap-2 flex-wrap">
            {row.map((key) => (
              <GazeButton
                key={key}
                size="sm"
                variant="secondary"
                onClick={() => handleKeyPress(key)}
                className="w-12 h-12 p-0"
              >
                {key}
              </GazeButton>
            ))}
          </div>
        ))}

        {/* Special keys */}
        <div className="flex justify-center gap-2 flex-wrap pt-2">
          <GazeButton size="sm" variant="secondary" onClick={handleSpace} className="flex-1 min-w-48">
            Space
          </GazeButton>
          <GazeButton size="sm" variant="secondary" onClick={handleBackspace}>
            Delete
          </GazeButton>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-4 justify-center pt-4">
        <GazeButton size="md" variant="default" onClick={onSend}>
          Send
        </GazeButton>
        <GazeButton size="md" variant="outline" onClick={onCancel}>
          Cancel
        </GazeButton>
      </div>
    </div>
  )
}
