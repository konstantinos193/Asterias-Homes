"use client"
import React, { useState, useEffect, createContext, useContext } from 'react'

interface User {
  id: string
  name: string
  username: string
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
  login: (username: string, password: string) => Promise<void>
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
          const text = await res.text()
          if (text) {
            try {
              const profile = JSON.parse(text)
              console.log('Profile response:', profile)
              setUser(profile.data || profile.user)
            } catch (parseError) {
              console.error('Profile parse error:', parseError)
              setUser(null)
            }
          } else {
            console.log('Empty profile response')
            setUser(null)
          }
        } else {
          console.log('Profile API failed:', res.status, res.statusText)
          setUser(null)
        }
      } catch (error) {
        console.error('Profile API error:', error)
        setUser(null)
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  // Removed debug console.log statements - use logger if needed in development

  const login = async (username: string, password: string) => {
    console.log('🔐 Starting login for:', username)
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: username, password }),
      credentials: "include",
    })
    console.log('🔐 Login response status:', response.status)
    
    if (!response.ok) {
      const text = await response.text()
      let data = {}
      if (text) {
        try {
          data = JSON.parse(text)
        } catch (parseError) {
          // Silently handle parse errors - invalid JSON means generic error
        }
      }
      throw new Error((data as any).error || 'Login failed')
    }
    
    // After login, fetch profile
    console.log('🔐 Fetching profile after login...')
    const profileRes = await fetch("/api/auth/profile", {
      credentials: "include",
    })
    console.log('🔐 Profile response status:', profileRes.status)
    
    if (profileRes.ok) {
      const text = await profileRes.text()
      console.log('🔐 Profile response text:', text)
      if (text) {
        try {
          const profile = JSON.parse(text)
          console.log('🔐 Parsed profile:', profile)
          setUser(profile.data)
        } catch (parseError) {
          console.error('🔐 Profile parse error:', parseError)
          setUser(null)
        }
      } else {
        console.log('🔐 Empty profile response')
        setUser(null)
      }
    } else {
      console.log('🔐 Profile fetch failed')
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