'use client'

import { useEffect, useState } from 'react'
import { apiCache } from '@/lib/api-cache'

export default function CacheMonitor() {
  const [stats, setStats] = useState({ cacheSize: 0, pendingRequests: 0 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const interval = setInterval(() => {
      setStats(apiCache.getStats())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          background: '#8B4B5C',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '8px',
          fontSize: '12px',
          cursor: 'pointer',
          zIndex: 9999
        }}
      >
        📊 Cache
      </button>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(139, 75, 92, 0.9)',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999,
        minWidth: '200px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <strong>📊 Cache Monitor</strong>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '16px',
            cursor: 'pointer',
            padding: '0',
            marginLeft: '8px'
          }}
        >
          ×
        </button>
      </div>
      
      <div style={{ marginBottom: '4px' }}>
        Cache Size: {stats.cacheSize}
      </div>
      
      <div style={{ marginBottom: '8px' }}>
        Pending: {stats.pendingRequests}
      </div>
      
      <button
        onClick={() => apiCache.clear()}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid white',
          color: 'white',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '11px',
          cursor: 'pointer',
          marginRight: '8px'
        }}
      >
        Clear Cache
      </button>
      
      <button
        onClick={() => window.location.reload()}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid white',
          color: 'white',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '11px',
          cursor: 'pointer'
        }}
      >
        Reload
      </button>
    </div>
  )
}
