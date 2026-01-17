// Simple frontend authentication context
export interface User {
  id: string
  name: string
  email: string
  disability: "als" | "dyslexia" | "adhd"
}

export interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => void
  signup: (name: string, email: string, password: string, disability: "als" | "dyslexia" | "adhd") => void
  logout: () => void
}

// Mock user database
const users: { [key: string]: User & { password: string } } = {}

export function loginUser(email: string, password: string): User | null {
  const user = Object.values(users).find((u) => u.email === email && u.password === password)
  if (user) {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  return null
}

export function signupUser(
  name: string,
  email: string,
  password: string,
  disability: "als" | "dyslexia" | "adhd",
): User {
  const id = Date.now().toString()
  const user: User & { password: string } = { id, name, email, password, disability }
  users[id] = user
  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}
