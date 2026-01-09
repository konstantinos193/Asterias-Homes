import { NextRequest, NextResponse } from 'next/server'
import { getBackendApiUrl } from '@/lib/backend-url'
import { logger } from '@/lib/logger'

const BACKEND_URL = getBackendApiUrl('/api/payments')

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Get the authToken from cookies (optional for payment confirmation)
    const authToken = request.cookies.get('authToken')?.value
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      // Forward language headers to backend
      'Accept-Language': request.headers.get('Accept-Language') || 'el,en;q=0.9',
    }
    
    // If we have an auth token, send it as Authorization header to backend
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }
    
    const response = await fetch(`${BACKEND_URL}/confirm-payment`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    logger.error('Payment confirmation proxy error', err)
    return NextResponse.json(
      { error: 'Payment confirmation failed' },
      { status: 500 }
    )
  }
} 