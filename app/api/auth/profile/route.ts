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
    
    // Add retry logic for backend wake-up
    let lastError: Error | null = null
    let response: Response | null = null
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await fetch(`${BACKEND_URL}/profile`, {
          method: 'GET',
          headers,
          cache: 'no-store',
          signal: AbortSignal.timeout(10000), // 10 second timeout
        })
        
        // If we get a successful response, break out of retry loop
        if (response.ok) {
          break
        }
        
        // If it's a 502/503/504, the backend might be waking up
        if (response.status >= 502 && response.status <= 504 && attempt < 3) {
          logger.warn(`Backend waking up (attempt ${attempt}/3), retrying...`, { status: response.status })
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt)) // Exponential backoff
          continue
        }
        
        // For other errors, don't retry
        break
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))
        
        // If it's a timeout or network error and we have retries left, try again
        if (attempt < 3 && (lastError.name === 'AbortError' || lastError.name === 'TypeError')) {
          logger.warn(`Network error (attempt ${attempt}/3), retrying...`, { error: lastError.message })
          await new Promise(resolve => setTimeout(resolve, 2000 * attempt))
          continue
        }
        
        break
      }
    }
    
    if (!response) {
      throw lastError || new Error('Failed to get response from backend')
    }
    
    // Check if response has content before parsing JSON
    const text = await response.text()
    if (!text) {
      return NextResponse.json(
        { error: 'Empty response from backend' },
        { status: 500 }
      )
    }
    
    // Check if response is HTML (error page) instead of JSON
    if (text.trim().startsWith('<!DOCTYPE html>') || text.trim().startsWith('<html')) {
      logger.error('Backend returned HTML instead of JSON', new Error('HTML response'), { responseText: text.substring(0, 200) })
      return NextResponse.json(
        { error: 'Backend unavailable - returned HTML error page' },
        { status: 503 }
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
    
    // Return a more specific error message for timeout/network issues
    if (err.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Backend request timeout - service may be waking up' },
        { status: 504 }
      )
    }
    
    return NextResponse.json(
      { error: 'Backend request failed' },
      { status: 500 }
    )
  }
}
