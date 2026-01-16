"use client"

import { useState } from "react"
import { GazeButton } from "@/components/gaze-button"

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Array<{ id: string; role: "user" | "assistant"; content: string }>>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm here to help. How can I assist you today?",
    },
  ])

  const [inputMode, setInputMode] = useState<"voice" | "keyboard" | "eye-gaze">("voice")

  const quickResponses = [
    "What time is it?",
    "Set a reminder",
    "Read my messages",
    "Turn on lights",
    "Play music",
    "Help me type",
  ]

  const handleQuickResponse = (response: string) => {
    const newMessage = { id: Date.now().toString(), role: "user" as const, content: response }
    setMessages([...messages, newMessage])

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `Processing: "${response}". This would trigger the appropriate action.`,
        },
      ])
    }, 1000)
  }

  return (
    <div className="w-full h-full flex flex-col bg-background text-foreground">
      <div className="flex-shrink-0 border-b border-border p-6 text-center bg-card/50">
        <h1 className="text-3xl font-bold">AI Assistant</h1>
        <p className="text-sm text-muted-foreground mt-2">Input mode: {inputMode.toUpperCase()}</p>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-2xl rounded-lg p-6 shadow-md ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-card-foreground border-2 border-primary/20"
              }`}
            >
              <p className="text-lg leading-relaxed">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex-shrink-0 border-t border-border p-6 bg-card/30 space-y-4">
        <p className="text-sm text-muted-foreground text-center mb-4">Quick responses:</p>
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
          {quickResponses.map((response, idx) => (
            <GazeButton key={idx} size="md" variant="secondary" onClick={() => handleQuickResponse(response)}>
              {response}
            </GazeButton>
          ))}
        </div>
      </div>

      <div className="flex-shrink-0 border-t border-border p-6 bg-background space-y-4">
        <p className="text-sm text-muted-foreground text-center mb-4">Select input method:</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <GazeButton
            size="sm"
            variant={inputMode === "voice" ? "default" : "outline"}
            onClick={() => setInputMode("voice")}
          >
            Voice Input
          </GazeButton>
          <GazeButton
            size="sm"
            variant={inputMode === "keyboard" ? "default" : "outline"}
            onClick={() => setInputMode("keyboard")}
          >
            Eye-Gaze Keyboard
          </GazeButton>
          <GazeButton
            size="sm"
            variant={inputMode === "eye-gaze" ? "default" : "outline"}
            onClick={() => setInputMode("eye-gaze")}
          >
            Eye Tracking
          </GazeButton>
        </div>
      </div>
    </div>
  )
}
