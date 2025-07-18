import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'https://asterias-backend.onrender.com'

// Force dynamic rendering since we use cookies
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get the session token from cookies
    const authToken = request.cookies.get('authToken')?.value
    
    if (!authToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Build query string
    const queryParams = new URLSearchParams()
    if (period) queryParams.set('period', period)
    if (startDate) queryParams.set('startDate', startDate)
    if (endDate) queryParams.set('endDate', endDate)

    const queryString = queryParams.toString()
    const url = `${BACKEND_URL}/api/admin/analytics${queryString ? `?${queryString}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      return NextResponse.json({ error: errorData || 'Failed to fetch analytics' }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 