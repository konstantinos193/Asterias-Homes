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
    
    const response = await fetch(`${BACKEND_URL}/profile`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    })
    
    // Check if response has content before parsing JSON
    const text = await response.text()
    if (!text) {
      return NextResponse.json(
        { error: 'Empty response from backend' },
        { status: 500 }
      )
    }
    
    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      const error = parseError instanceof Error ? parseError : new Error(String(parseError))
      logger.error('JSON parse error in profile API', error, { responseText: text.substring(0, 200) })
      return NextResponse.json(
        { error: 'Invalid JSON response from backend' },
        { status: 500 }
      )
    }
    
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
