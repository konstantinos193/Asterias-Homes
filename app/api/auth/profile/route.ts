import { NextRequest, NextResponse } from 'next/server'
import { getBackendApiUrl } from '@/lib/backend-url'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

const BACKEND_URL = getBackendApiUrl('/api/auth')

export async function GET(request: NextRequest) {
  // Get the authToken from cookies
  const authToken = request.cookies.get('authToken')?.value
  
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    // If we have an auth token, send it as Authorization header to backend
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }
    
    logger.debug('Profile API GET request', { url: `${BACKEND_URL}/profile`, method: 'GET' })
    
    // Direct proxy to backend with minimal timeout
    const response = await fetch(`${BACKEND_URL}/profile`, {
      method: 'GET',
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(5000), // 5 second timeout
    })
    
    if (!response.ok) {
      logger.error('Backend profile request failed', new Error(`Status: ${response.status}`))
      return NextResponse.json(
        { error: 'Backend request failed' },
        { status: response.status }
      )
    }
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
    
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    logger.error('Profile API GET request failed', err)
    
    return NextResponse.json(
      { error: 'Backend request failed' },
      { status: 500 }
    )
  }
}
