import { NextRequest, NextResponse } from 'next/server'
import { getBackendApiUrl } from '@/lib/backend-url'
import { logger } from '@/lib/logger'

const BACKEND_URL = getBackendApiUrl('/api/images/upload')

export async function POST(request: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await request.formData()
    
    // Forward authentication headers to the backend
    const authHeader = request.headers.get('authorization')
    const cookieHeader = request.headers.get('cookie')
    
    const headers: HeadersInit = {}
    if (authHeader) {
      headers.Authorization = authHeader
    }
    if (cookieHeader) {
      headers.Cookie = cookieHeader
    }
    
    // Forward the request to the backend
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      body: formData,
      headers
    })
    
    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    logger.error('Image upload error', err)
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    )
  }
}