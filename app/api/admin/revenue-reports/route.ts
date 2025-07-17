import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001'

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

    // Build query string
    const queryParams = new URLSearchParams()
    if (period) queryParams.set('period', period)

    const queryString = queryParams.toString()
    const url = `${BACKEND_URL}/api/admin/revenue-reports${queryString ? `?${queryString}` : ''}`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
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
    console.error('Revenue reports API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 