"use client"

/**
 * Client component to initialize memory monitoring in development
 * This component should be added to the root layout
 */
import { useEffect } from 'react'
import { MemoryMonitor } from '@/lib/memory-monitor'

export function MemoryMonitorInit() {
  useEffect(() => {
    // Only initialize in development mode
    if (process.env.NODE_ENV !== 'development') {
      return
    }

    // Check if memory monitoring is enabled via environment variable
    const enableMemoryMonitor = process.env.NEXT_PUBLIC_ENABLE_MEMORY_MONITOR === 'true'
    
    if (!enableMemoryMonitor) {
      return
    }

    // Get configuration from environment variables
    const thresholdMB = parseInt(process.env.NEXT_PUBLIC_MEMORY_WARNING_THRESHOLD || '100')
    const checkIntervalMs = parseInt(process.env.NEXT_PUBLIC_MEMORY_CHECK_INTERVAL || '30000')

    // Start monitoring after a delay to let the app initialize
    const timeout = setTimeout(() => {
      MemoryMonitor.start(thresholdMB, checkIntervalMs)
    }, 5000)

    // Cleanup on unmount
    return () => {
      clearTimeout(timeout)
      MemoryMonitor.stop()
    }
  }, [])

  // This component doesn't render anything
  return null
}

