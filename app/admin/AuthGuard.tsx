"use client"
import { useAuth, AuthProvider } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== "ADMIN")) {
      router.replace("/admin/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!user || user.role !== "ADMIN") {
    return <div className="min-h-screen flex items-center justify-center">Redirecting to login...</div>
  }

  return <>{children}</>
}