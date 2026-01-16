"use client"

import { useState, useRef } from "react"
import { Mic, MicOff } from "lucide-react"

interface VoiceInputProps {
  onTranscript: (text: string) => void
  placeholder?: string
  className?: string
}

export default function VoiceInput({
  onTranscript,
  placeholder = "Say your name...",
  className = "",
}: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isSupported, setIsSupported] = useState(true)
  const recognitionRef = useRef<any>(null)

  // Initialize speech recognition on first use
  const initializeSpeechRecognition = () => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (!SpeechRecognition) {
        setIsSupported(false)
        return
      }

      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"

      recognitionRef.current.onstart = () => {
        setIsListening(true)
      }

      recognitionRef.current.onresult = (event: any) => {
        let final = ""
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript
          }
        }
        if (final) {
          setTranscript(final)
          onTranscript(final)
        }
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }
    }
  }

  const handleToggleListening = () => {
    if (!recognitionRef.current) {
      initializeSpeechRecognition()
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else if (recognitionRef.current) {
      recognitionRef.current.start()
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <button
      onClick={handleToggleListening}
      className={`p-3 rounded-lg transition-all duration-300 ${
        isListening
          ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 shadow-lg"
          : "bg-secondary border-2 border-border hover:border-primary/50 text-foreground"
      } ${className}`}
      title={isListening ? "Stop listening" : "Start voice input"}
    >
      {isListening ? <Mic className="w-6 h-6 animate-pulse" /> : <MicOff className="w-6 h-6" />}
    </button>
  )
}
