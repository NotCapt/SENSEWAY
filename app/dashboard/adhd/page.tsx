"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/providers"
import DashboardNav from "@/components/dashboard-nav"

export default function ADHDDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()

  const [timeLeft, setTimeLeft] = useState(1500) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [tasks, setTasks] = useState<{ id: string; text: string; completed: boolean }[]>([])
  const [newTask, setNewTask] = useState("")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!user || user.disability !== "adhd") {
      router.push("/login")
    }
  }, [user, router])

  // Timer effect
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            if (!isBreak) {
              setIsBreak(true)
              setTimeLeft(300) // 5 minute break
              alert("Focus session complete! Time for a break.")
            } else {
              setIsBreak(false)
              setTimeLeft(1500) // 25 minute session
              alert("Break over! Ready for the next session?")
            }
            return prev
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isBreak])

  const handleAddTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now().toString(), text: newTask, completed: false }])
      setNewTask("")
    }
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  if (!user || user.disability !== "adhd") {
    return null
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const totalSeconds = isBreak ? 300 : 1500
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100
  const completedTasks = tasks.filter((t) => t.completed).length

  // Color progression based on time
  let progressColor = "from-green-500 to-green-600" // Start of session
  if (progress > 50) {
    progressColor = "from-yellow-500 to-yellow-600" // Mid session
  }
  if (progress > 80) {
    progressColor = "from-red-500 to-red-600" // End of session
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNav
        title="ADHD Dashboard"
        subtitle="Focus & Time Awareness Interface"
        user={user}
        onLogout={logout}
        onChangeDashboard={() => router.push("/select-dashboard")}
      />

      <div className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Time Awareness Bar */}
        <div className="fixed top-0 left-0 right-0 h-2 bg-border">
          <div
            className={`h-full bg-gradient-to-r ${progressColor} transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          {/* Main Pomodoro Timer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timer Display */}
            <div className={`bg-gradient-to-br ${progressColor} rounded-xl p-8 shadow-2xl text-center space-y-6`}>
              <div className="space-y-2">
                <p className="text-primary-foreground text-lg font-medium">
                  {isBreak ? "Break Time" : "Focus Session"}
                </p>
                <div className="text-7xl font-bold text-primary-foreground font-mono tracking-wider">
                  {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </div>
                <p className="text-primary-foreground/80 text-sm">
                  {isBreak ? "Recharge your focus" : "Stay focused on your task"}
                </p>
              </div>

              {/* Timer Controls */}
              <div className="flex gap-4 justify-center pt-4">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className="px-8 py-3 bg-primary-foreground text-primary rounded-lg font-bold text-lg hover:bg-primary-foreground/90 transition shadow-lg"
                >
                  {isRunning ? "Pause" : "Start"}
                </button>

                <button
                  onClick={() => {
                    setIsRunning(false)
                    setTimeLeft(isBreak ? 300 : 1500)
                  }}
                  className="px-8 py-3 bg-primary-foreground/20 text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary-foreground/30 transition border border-primary-foreground/30"
                >
                  Reset
                </button>

                <button
                  onClick={() => {
                    setIsRunning(false)
                    setIsBreak(!isBreak)
                    setTimeLeft(isBreak ? 1500 : 300)
                  }}
                  className="px-8 py-3 bg-primary-foreground/20 text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary-foreground/30 transition border border-primary-foreground/30"
                >
                  Skip
                </button>
              </div>
            </div>

            {/* Session Info */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="font-bold text-foreground text-lg">Session Progress</h3>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="w-full bg-border rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${progressColor} transition-all duration-300`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground text-center">{progress.toFixed(0)}% complete</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Type</p>
                  <p className="font-bold text-accent">{isBreak ? "Break" : "Focus"}</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Total Time</p>
                  <p className="font-bold text-secondary">{isBreak ? "5 min" : "25 min"}</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Remaining</p>
                  <p className="font-bold text-primary">
                    {minutes}:{String(seconds).padStart(2, "0")}
                  </p>
                </div>
              </div>
            </div>

            {/* Focus Tips */}
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="font-bold text-foreground text-lg">Focus Tips</h3>

              <div className="space-y-3">
                {[
                  "Find a quiet, distraction-free space",
                  "Close unnecessary tabs and apps",
                  "Put your phone in another room",
                  "Take notes to stay engaged",
                  "Break large tasks into smaller steps",
                ].map((tip, idx) => (
                  <div key={idx} className="flex gap-3 text-muted-foreground text-sm">
                    <span className="text-accent font-bold">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Task List */}
          <div className="space-y-4">
            {/* Task Stats */}
            <div className="bg-card border border-border rounded-lg p-6 text-center space-y-3">
              <div className="text-4xl font-bold text-accent">{completedTasks}</div>
              <div className="text-sm text-muted-foreground">of {tasks.length} tasks completed</div>
            </div>

            {/* Add Task */}
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <h3 className="font-bold text-foreground text-sm">Quick Tasks</h3>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleAddTask()
                    }
                  }}
                  placeholder="Add a task..."
                  className="flex-1 px-3 py-2 bg-input border border-border rounded text-foreground placeholder-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleAddTask}
                  className="px-3 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded font-medium text-sm transition shadow-md"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Task List */}
            <div className="bg-card border border-border rounded-lg p-4 space-y-3 max-h-96 overflow-y-auto">
              {tasks.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">No tasks yet. Add one to get started!</p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-2 p-3 bg-muted rounded-lg hover:bg-muted/80 transition"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm break-words ${
                          task.completed ? "text-muted-foreground line-through" : "text-foreground"
                        }`}
                      >
                        {task.text}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-muted-foreground hover:text-destructive transition text-sm font-bold"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
