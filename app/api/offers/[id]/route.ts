import { NextRequest, NextResponse } from 'next/server'
import { getBackendApiUrl } from '@/lib/backend-url'
import { logger } from '@/lib/logger'

const BACKEND_URL = getBackendApiUrl('/api/offers')

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const response = await fetch(`${BACKEND_URL}/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    // Return 404 if offer not found
    if (response.status === 404) {
      return NextResponse.json(
        { error: 'Offer not found' },
        { status: 404 }
      )
    }
    
    // Return 500 only for server errors (5xx), not client errors (4xx)
    if (!response.ok) {
      // If it's a client error (4xx), return it as-is
      if (response.status >= 400 && response.status < 500) {
        const text = await response.text().catch(() => '')
        try {
          const errorData = text ? JSON.parse(text) : { error: `Client error: ${response.status}` }
          return NextResponse.json(errorData, { status: response.status })
        } catch {
          return NextResponse.json(
            { error: `Client error: ${response.status}` },
            { status: response.status }
          )
        }
      }
      // For server errors (5xx), log and return 500
      logger.error(`Backend server error ${response.status} for offer ${id}`)
      throw new Error(`Backend responded with status: ${response.status}`)
    }
    
    // Check if response has content before parsing JSON
    const text = await response.text()
    if (!text) {
      logger.error(`Empty response from backend for offer ${id}`)
      return NextResponse.json(
        { error: 'Empty response from backend' },
        { status: 500 }
      )
    }
    
    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      logger.error('JSON parse error in offer detail route', parseError as Error, { responseText: text, offerId: id })
      return NextResponse.json(
        { error: 'Invalid JSON response from backend' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    // Only log if it's not a handled error
    const err = error as Error
    if (!err.message.includes('Client error') && !err.message.includes('not found')) {
      logger.error('Error fetching offer', err, { offerId: id })
    }
    // Return 500 for network/unexpected errors
    return NextResponse.json(
      { error: 'Failed to fetch offer' },
      { status: 500 }
    )
  }
}

