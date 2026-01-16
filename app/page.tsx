"use client"

import { useState } from "react"
import AuthScreen from "@/components/screens/auth-screen"
import BootScreen from "@/components/screens/boot-screen"
import ALSDashboard from "@/components/screens/als-dashboard"
import ChatbotScreen from "@/components/screens/chatbot-screen"
import ScreenControlScreen from "@/components/screens/screen-control-screen"
import Sidebar from "@/components/sidebar"

type Screen = "boot" | "dashboard" | "chatbot" | "control"
type Disability = "ALS" | "cerebral-palsy" | "spinal-cord" | "other" | null

interface UserSession {
  name: string
  disability: Disability
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<UserSession | null>(null)
  const [currentScreen, setCurrentScreen] = useState<Screen>("boot")

  const handleAuthComplete = (disability: string, name: string) => {
    setUser({
      name,
      disability: disability as Disability,
    })
    setIsAuthenticated(true)
    setCurrentScreen("boot")
  }

  const handleSignOut = () => {
    setIsAuthenticated(false)
    setUser(null)
    setCurrentScreen("boot")
  }

  if (!isAuthenticated) {
    return <AuthScreen onComplete={handleAuthComplete} />
  }

  return (
    <main className="w-screen h-screen flex overflow-hidden bg-background">
      <Sidebar
        userName={user?.name || "User"}
        currentScreen={currentScreen}
        onScreenChange={setCurrentScreen}
        onSignOut={handleSignOut}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentScreen === "boot" && <BootScreen onCalibrationComplete={() => setCurrentScreen("dashboard")} />}
        {currentScreen === "dashboard" && (
          <ALSDashboard
            onFeatureSelect={(feature) => {
              if (feature === "chatbot") setCurrentScreen("chatbot")
              if (feature === "control") setCurrentScreen("control")
            }}
          />
        )}
        {currentScreen === "chatbot" && <ChatbotScreen />}
        {currentScreen === "control" && <ScreenControlScreen />}
      </div>
    </main>
  )
}
