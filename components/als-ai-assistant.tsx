"use client"

import { Mic, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"

// Dynamically import the chatbot to ensure client-side rendering
const OnDemandChatBot = dynamic(
  () => import("ondemand-react-chat-bot").then((mod) => ({ default: mod.OnDemandChatBot })),
  {
    ssr: false,
  }
)

interface ALSAIAssistantProps {
  inputMode: "voice" | "eyegaze" | "tracking"
  onOpenChatbot: () => void
}

export default function ALSAIAssistant({ inputMode, onOpenChatbot }: ALSAIAssistantProps) {
  const [messages, setMessages] = useState<{ role: "assistant" | "user"; content: string }[]>([
    { role: "assistant", content: "Hello! I'm here to help. How can I assist you today?" },
  ])
  const [isRecording, setIsRecording] = useState(false)
  const consoleErrorRef = useRef<typeof console.error | null>(null)

  // Suppress React DOM property warnings from third-party chatbot library
  useEffect(() => {
    if (typeof window === "undefined") return

    // Store original console.error
    consoleErrorRef.current = console.error

    // Override console.error to filter out DOM property warnings from the chatbot
    console.error = (...args) => {
      const message = args[0]
      if (
        typeof message === "string" &&
        message.includes("Invalid DOM property") &&
        (message.includes("stroke-width") ||
          message.includes("stroke-linecap") ||
          message.includes("stroke-linejoin") ||
          message.includes("Did you mean"))
      ) {
        // Suppress these specific warnings from the chatbot library
        return
      }
      // Call original console.error for all other errors
      if (consoleErrorRef.current) {
        consoleErrorRef.current.apply(console, args)
      }
    }

    // Cleanup: restore original console.error on unmount
    return () => {
      if (consoleErrorRef.current) {
        console.error = consoleErrorRef.current
      }
    }
  }, [])

  const handleMicClick = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      // Simulate processing voice input
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "user", content: "Voice message recorded" },
          { role: "assistant", content: "I understand. Let me help with that." },
        ])
      }, 500)
    } else {
      // Start recording
      setIsRecording(true)
    }
  }

  const handleCloseMic = () => {
    setIsRecording(false)
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-lg overflow-hidden">
      {/* Header - Minimalistic */}
      <div className="px-6 py-4 border-b border-border/50 flex-shrink-0">
        <h2 className="text-lg font-medium text-foreground">Assistant</h2>
      </div>

      {/* Chat Messages */}
      <div className="p-6 space-y-4 flex-shrink-0 border-b border-border/50 max-h-32 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted/50 text-foreground"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Chatbot Component - Below Assistant text */}
      <div className="flex-1 overflow-hidden border-b border-border/50 min-h-0 flex flex-col">
        <div className="flex-1 min-h-0 p-4">
          <OnDemandChatBot
            apiKey="j5Io65KDWI3sImmez9Zd1bokfJTPMW5W"
            botId="696a0c56d07fb6270a171e10"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>

      {/* Mic Button Area - Minimalistic */}
      <div className="border-t border-border/50 p-4 flex items-center justify-center flex-shrink-0">
        {!isRecording ? (
          <button
            onClick={handleMicClick}
            className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-primary/30"
            aria-label="Start voice recording"
          >
            <Mic size={48} className="md:w-16 md:h-16" />
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={handleMicClick}
              className="h-32 w-32 md:h-40 md:w-40 rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground flex items-center justify-center transition-all shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-destructive/30 animate-pulse"
              aria-label="Stop voice recording"
            >
              <Mic size={48} className="md:w-16 md:h-16" />
            </button>
            <button
              onClick={handleCloseMic}
              className="h-20 w-20 rounded-full bg-muted hover:bg-muted/80 text-foreground flex items-center justify-center transition-all focus:outline-none focus:ring-4 focus:ring-muted/30"
              aria-label="Close microphone"
            >
              <X size={32} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
