"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"
import * as Sentry from "@sentry/nextjs"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to Sentry
    Sentry.captureException(error)
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by error boundary:', error)
    }
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-6">
            <AlertTriangle className="h-16 w-16 text-red-600" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-cormorant font-semibold text-slate-800">
            Something went wrong!
          </h1>
          <p className="text-lg text-slate-600 font-alegreya max-w-md mx-auto">
            We encountered an unexpected error. Don't worry, our team has been notified 
            and we're working on fixing it.
          </p>
          {process.env.NODE_ENV === 'development' && error.message && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
              <p className="text-sm font-mono text-red-800 break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-xs text-red-600 mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            onClick={reset}
            className="bg-[#0A4A4A] hover:bg-[#083a3a] text-white font-alegreya px-8 py-6 text-lg"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Try Again
          </Button>
          
          <Button
            asChild
            variant="outline"
            className="border-2 border-[#0A4A4A] text-[#0A4A4A] hover:bg-[#0A4A4A] hover:text-white font-alegreya px-8 py-6 text-lg"
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="pt-8">
          <p className="text-sm text-slate-500 font-alegreya">
            If this problem persists, please{" "}
            <Link href="/el/contact" className="text-[#0A4A4A] hover:underline">
              contact us
            </Link>
            {" "}and we'll help you right away.
          </p>
        </div>
      </div>
    </div>
  )
}

