"use client"

import { useState } from "react"
import { X, Monitor, Maximize2, Move } from "lucide-react"

interface TabControlModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TabControlModal({ isOpen, onClose }: TabControlModalProps) {
  const [openTabs] = useState([
    { id: "1", name: "Gmail", icon: "📧", active: true },
    { id: "2", name: "Google Meet", icon: "📹", active: false },
    { id: "3", name: "YouTube", icon: "▶️", active: false },
    { id: "4", name: "Document", icon: "📄", active: false },
  ])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 border-2 border-green-500 rounded-lg w-full max-w-md max-h-96 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-700">
          <h3 className="text-xl font-bold text-white">Open Tabs & Windows</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X size={24} />
          </button>
        </div>

        {/* Tabs List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {openTabs.map((tab) => (
            <button
              key={tab.id}
              className={`w-full p-4 rounded-lg text-left font-medium transition flex items-center gap-3 ${
                tab.active
                  ? "bg-green-600 text-white shadow-lg shadow-green-500/50"
                  : "bg-slate-700 text-white hover:bg-slate-600"
              }`}
            >
              <span className="text-2xl">{tab.icon}</span>
              <div className="flex-1">
                <p className="font-bold">{tab.name}</p>
                <p className="text-xs opacity-75">{tab.active ? "Currently Active" : "Click to focus"}</p>
              </div>
              {tab.active && <Monitor size={20} />}
            </button>
          ))}
        </div>

        {/* Control Instructions */}
        <div className="border-t border-slate-700 p-4 bg-slate-700/50 space-y-2 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <Maximize2 size={16} />
            <span>Click a tab to bring it to focus</span>
          </div>
          <div className="flex items-center gap-2">
            <Move size={16} />
            <span>Use eye gaze cursor to control the active window</span>
          </div>
        </div>
      </div>
    </div>
  )
}
