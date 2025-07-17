"use client"
import React, { useState, useEffect, createContext, useContext } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'USER'
  phone?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/profile", {
          credentials: "include",
        })
        if (res.ok) {
          const profile = await res.json()
          setUser(profile.user)
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  useEffect(() => {
    console.log("[AUTH] user:", user)
    console.log("[AUTH] loading:", loading)
  }, [user, loading])

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    })
    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Login failed')
    }
    // After login, fetch profile
    const profileRes = await fetch("/api/auth/profile", {
      credentials: "include",
    })
    if (profileRes.ok) {
      const profile = await profileRes.json()
      setUser(profile.user)
    } else {
      setUser(null)
    }
  }

  const logout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })
    setUser(null)
  }

  const value = { user, loading, login, logout }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}