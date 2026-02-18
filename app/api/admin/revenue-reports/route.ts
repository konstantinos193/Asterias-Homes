import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/backend-url'
import { logger } from '@/lib/logger'

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period')

    // Build query string
    const queryParams = new URLSearchParams()
    if (period) queryParams.set('period', period)

    const queryString = queryParams.toString()
    const backendUrl = getBackendUrl()
    const url = `${backendUrl}/api/admin/revenue-reports${queryString ? `?${queryString}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      return NextResponse.json({ error: errorData || 'Failed to fetch revenue reports' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    logger.error('Revenue reports API error', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 