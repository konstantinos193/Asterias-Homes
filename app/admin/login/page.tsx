"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/hooks/use-auth"

export default function AdminLogin() {
  const { t } = useLanguage()
  const router = useRouter()
  const { login, user, loading } = useAuth()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.replace("/admin")
      // Using a hard redirect as a fallback to ensure navigation
      window.location.href = "/admin"
    }
  }, [user, loading, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    try {
      console.log("Attempting login with:", formData.email)
      await login(formData.email, formData.password)
      console.log("Login successful, redirecting...")
      // Force a hard redirect to admin dashboard
      window.location.replace("/admin")
    } catch (err: any) {
      console.error("Login error:", err)

      // Handle rate limiting specifically
      if (err.message && err.message.includes('429')) {
        setError("Too many login attempts. Please wait a few minutes and try again.")
      } else {
        setError(err.message || "Login failed")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>
  }
  
  if (user) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Redirecting to admin dashboard...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full space-y-8">
        <h2 className="mt-6 text-center text-3xl font-light text-slate-900">
          Admin Login
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to access the admin dashboard
        </p>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-sm font-alegreya">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-sm text-white bg-[#0A4A4A] hover:bg-[#083a3a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 