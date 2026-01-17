"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/providers"
import ALSSidebar from "@/components/als-sidebar"
import ALSAIAssistant from "@/components/als-ai-assistant"
import InputModeSelector from "@/components/als-input-mode-selector"
import ScreenControlModal from "@/components/als-screen-control-modal"
import { ThemeToggle } from "@/components/theme-toggle"
import { triggerSOSWorkflow } from "@/lib/ondemand-service"

export default function ALSDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [activeSection, setActiveSection] = useState("assistant")
  const [inputMode, setInputMode] = useState<"voice" | "eyegaze" | "tracking">("voice")
  const [showScreenControl, setShowScreenControl] = useState(false)
  const [showSOSConfirm, setShowSOSConfirm] = useState(false)
  const [isSendingSOS, setIsSendingSOS] = useState(false)
  // Emergency contact phone numbers that the workflow will call
  const sosPhoneNumbers = ["9311735459", "8800930307"]

  useEffect(() => {
    if (!user || user.disability !== "als") {
      router.push("/login")
    }
  }, [user, router])

  const handleSectionChange = (section: string) => {
    if (section === "recalibrate") {
      alert("Eye tracker recalibration started. Please follow the on-screen instructions.")
      return
    }
    if (section === "control") {
      setShowScreenControl(true)
      return
    }
    setActiveSection(section)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleSOS = async () => {
    setIsSendingSOS(true)
    try {
      // Trigger the OnDemand AI workflow to call emergency contacts
      const response = await triggerSOSWorkflow(sosPhoneNumbers)
      
      console.log("SOS workflow triggered:", response)
      
      // Show success message
      const contactsList = sosPhoneNumbers.join(", ")
      alert(
        `🚨 EMERGENCY SOS ALERT SENT!\n\n` +
        `Phone numbers being called:\n${contactsList}\n\n` +
        `The OnDemand AI workflow has been triggered to contact your emergency contacts.`
      )
    } catch (error) {
      console.error("Failed to trigger SOS workflow:", error)
      alert(
        `⚠️ SOS Alert Error\n\n` +
        `Failed to trigger emergency workflow. Please try again or contact emergency services directly.\n\n` +
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    } finally {
      setIsSendingSOS(false)
      setShowSOSConfirm(false)
    }
  }

  if (!user || user.disability !== "als") {
    return null
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Left Sidebar - Navigation & Safety */}
      <ALSSidebar
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
        onLogout={handleLogout}
        showSOSConfirm={showSOSConfirm}
        handleSOS={handleSOS}
        setShowSOSConfirm={setShowSOSConfirm}
        isSendingSOS={isSendingSOS}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header - Minimalistic */}
        <div className="px-8 py-4 border-b border-border/30 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium text-foreground">ALS Dashboard</h1>
          </div>
          <ThemeToggle />
        </div>

        {/* Main Content - Fixed Height, No Scroll */}
        <div className="flex-1 overflow-hidden p-8 flex flex-col">
          {/* AI Assistant Area */}
          {activeSection === "assistant" && (
            <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
              {/* Assistant Chat - Takes 2 columns */}
              <div className="lg:col-span-2 overflow-hidden">
                <ALSAIAssistant inputMode={inputMode} onOpenChatbot={() => {}} />
              </div>

              <div className="space-y-6 flex flex-col overflow-hidden">
                {/* Screen Control */}
                <div className="bg-card/50 border border-border/50 rounded-xl p-6 space-y-4 hover:border-border transition flex-shrink-0">
                  <div className="space-y-1">
                    <h3 className="text-base font-medium text-foreground">Screen control</h3>
                    <p className="text-sm text-muted-foreground">Choose control surface</p>
                  </div>
                  <button
                    onClick={() => setShowScreenControl(true)}
                    className="w-full px-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-xl transition text-base focus:outline-none focus:ring-4 focus:ring-primary/30"
                  >
                    Choose surface
                  </button>
                </div>

                {/* Input Mode Selector */}
                <div className="flex-shrink-0">
                  <InputModeSelector activeMode={inputMode} onModeChange={setInputMode} />
                </div>
              </div>
            </div>
          )}

          {/* Home Section */}
          {activeSection === "home" && (
            <div className="space-y-6 overflow-hidden flex flex-col">
              <div className="bg-card/50 border border-border/50 rounded-xl p-6 flex-shrink-0">
                <h2 className="text-lg font-medium text-foreground mb-2">Welcome</h2>
                <p className="text-sm text-muted-foreground">
                  Control and navigate using eye-gaze, voice, or eye tracking.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-hidden">
                <div className="bg-card/50 border border-border/50 rounded-xl p-6 hover:border-border transition overflow-hidden flex flex-col">
                  <h3 className="text-base font-medium text-foreground mb-4">Getting started</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Use the assistant to start conversations</li>
                    <li>• Select a control surface in screen control</li>
                    <li>• Change input mode as needed</li>
                    <li>• Keep emergency contacts updated</li>
                  </ul>
                </div>
                <div className="bg-card/50 border border-border/50 rounded-xl p-6 hover:border-border transition overflow-hidden flex flex-col">
                  <h3 className="text-base font-medium text-foreground mb-4">Status</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Eye tracker</span>
                      <span className="text-primary font-medium">Connected</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Microphone</span>
                      <span className="text-primary font-medium">Active</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Connection</span>
                      <span className="text-primary font-medium">Stable</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Screen Control Modal */}
      <ScreenControlModal isOpen={showScreenControl} onClose={() => setShowScreenControl(false)} />
    </div>
  )
}
