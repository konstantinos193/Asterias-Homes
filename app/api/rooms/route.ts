import { NextRequest, NextResponse } from 'next/server'
import { getBackendApiUrl } from '@/lib/backend-url'

export async function GET(request: NextRequest) {
  try {
    const BACKEND_URL = getBackendApiUrl('/api/rooms')
    
    const response = await fetch(BACKEND_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(30000),
    })
    
    if (!response.ok) {
      throw new Error(`Backend request failed: ${response.status}`)
    }
    
    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
    
  } catch (error) {
    console.error('Rooms API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rooms' },
      { status: 500 }
    )
  }
}
