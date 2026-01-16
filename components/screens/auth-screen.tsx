"use client"

import { useState } from "react"
import VoiceInput from "../voice-input"

interface AuthScreenProps {
  onComplete: (disability: string, name: string) => void
}

export default function AuthScreen({ onComplete }: AuthScreenProps) {
  const [step, setStep] = useState<"welcome" | "disability" | "name">("welcome")
  const [selectedDisability, setSelectedDisability] = useState<string | null>(null)
  const [name, setName] = useState("")

  const disabilities = [
    {
      id: "ALS",
      label: "ALS (Amyotrophic Lateral Sclerosis)",
      description: "Progressive motor neuron disease",
      icon: "🔄",
    },
    {
      id: "cerebral-palsy",
      label: "Cerebral Palsy",
      description: "Movement and posture disorder",
      icon: "🎯",
    },
    {
      id: "spinal-cord",
      label: "Spinal Cord Injury",
      description: "Limited mobility or paralysis",
      icon: "⚡",
    },
    {
      id: "other",
      label: "Other Motor Disability",
      description: "Other accessibility needs",
      icon: "✨",
    },
  ]

  const handleDisabilitySelect = (id: string) => {
    setSelectedDisability(id)
    setStep("name")
  }

  const handleComplete = () => {
    if (name.trim()) {
      onComplete(selectedDisability || "other", name.trim())
    }
  }

  const handleVoiceTranscript = (transcript: string) => {
    setName(transcript)
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-12">
        {/* Welcome Step */}
        {step === "welcome" && (
          <div className="animate-smooth-fade space-y-8 text-center">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-light tracking-tight text-balance">
                Welcome to <span className="font-medium text-primary">AccessHub</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-light">
                An inclusive platform designed with you in mind. Let's customize your experience.
              </p>
            </div>

            <button
              onClick={() => setStep("disability")}
              className="mx-auto mt-8 px-8 py-4 bg-primary text-primary-foreground rounded-full text-lg font-medium hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </div>
        )}

        {/* Disability Selection Step */}
        {step === "disability" && (
          <div className="animate-smooth-fade space-y-8">
            <div className="space-y-3 text-center">
              <h2 className="text-3xl md:text-4xl font-light">Tell us about your needs</h2>
              <p className="text-base text-muted-foreground">This helps us customize the interface for your comfort</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {disabilities.map((disability) => (
                <button
                  key={disability.id}
                  onClick={() => handleDisabilitySelect(disability.id)}
                  className={`p-6 rounded-2xl transition-all duration-300 text-left border-2 ${
                    selectedDisability === disability.id
                      ? "bg-primary/10 border-primary ring-2 ring-primary ring-offset-2"
                      : "bg-card border-border hover:border-primary/50 hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-4xl">{disability.icon}</span>
                    <div>
                      <h3 className="font-medium text-foreground">{disability.label}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{disability.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setStep("welcome")}
                className="px-6 py-3 rounded-full border-2 border-border hover:bg-secondary transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep("name")}
                disabled={!selectedDisability}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Name Input Step */}
        {step === "name" && (
          <div className="animate-smooth-fade space-y-8">
            <div className="space-y-3 text-center">
              <h2 className="text-3xl md:text-4xl font-light">What's your name?</h2>
              <p className="text-base text-muted-foreground">We'd love to personalize your experience</p>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3 items-end">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="flex-1 px-6 py-4 rounded-xl bg-secondary border-2 border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleComplete()}
                />
                <VoiceInput onTranscript={handleVoiceTranscript} className="flex-shrink-0" />
              </div>
              {name && (
                <p className="text-sm text-muted-foreground text-center">
                  You said: <span className="text-foreground font-medium">{name}</span>
                </p>
              )}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setStep("disability")}
                className="px-6 py-3 rounded-full border-2 border-border hover:bg-secondary transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleComplete}
                disabled={!name.trim()}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium disabled:opacity-50 hover:opacity-90 transition-opacity"
              >
                Start Using AccessHub
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
