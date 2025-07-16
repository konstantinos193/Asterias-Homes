import React, { useState, useEffect, createContext, useContext } from 'react'
import { authAPI } from '@/lib/api'

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
  register: (userData: { name: string; email: string; password: string; phone?: string }) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (profileData: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on app start
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken')
      if (token) {
        try {
          const profile = await authAPI.getProfile()
          setUser(profile.user)
        } catch (error) {
          // Token is invalid, clear it
          localStorage.removeItem('authToken')
          localStorage.removeItem('refreshToken')
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password })
    setUser(response.user)
  }

  const register = async (userData: { name: string; email: string; password: string; phone?: string }) => {
    const response = await authAPI.register(userData)
    setUser(response.user)
  }

  const logout = async () => {
    await authAPI.logout()
    setUser(null)
  }

  const updateProfile = async (profileData: any) => {
    const response = await authAPI.updateProfile(profileData)
    setUser(response.user)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 