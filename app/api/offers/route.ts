import { NextRequest, NextResponse } from 'next/server'
import { getBackendApiUrl } from '@/lib/backend-url'
import { logger } from '@/lib/logger'

const BACKEND_URL = getBackendApiUrl('/api/offers')

// Mock data for when backend is unavailable
const mockOffers = [
  {
    id: '1',
    title: 'Summer Special',
    description: 'Get 20% off on all bookings this summer',
    discount: 20,
    validUntil: '2024-09-30',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Weekend Getaway',
    description: 'Book a weekend stay and get 15% off',
    discount: 15,
    validUntil: '2024-12-31',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    // Try backend first
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000)
      })
      
      if (response.ok) {
        // Check if response has content before parsing JSON
        const text = await response.text()
        if (text) {
          try {
            const data = JSON.parse(text)
            return NextResponse.json(data, { status: response.status })
          } catch (parseError) {
            logger.error('JSON parse error in offers route', parseError instanceof Error ? parseError : new Error(String(parseError)), { responseText: text })
          }
        }
      }
    } catch (backendError) {
      logger.warn('Backend unavailable, using mock data for offers', { backendUrl: BACKEND_URL, error: backendError instanceof Error ? backendError.message : String(backendError) })
    }
    
    // Fallback to mock data
    logger.info('Returning mock offers data')
    return NextResponse.json({ offers: mockOffers })
    
  } catch (error) {
    logger.error('Error fetching offers', error instanceof Error ? error : new Error(String(error)))
    return NextResponse.json(
      { error: 'Failed to fetch offers' },
      { status: 500 }
    )
  }
}

