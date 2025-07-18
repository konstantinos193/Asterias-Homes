import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://asterias-backend.onrender.com/api/images'

export async function POST(request: NextRequest) {
  try {
    // Get the authToken from cookies
    const authToken = request.cookies.get('authToken')?.value
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get the form data from the request
    const formData = await request.formData()
    
    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
        // Don't set Content-Type, let fetch handle it for FormData
      },
      body: formData
    })
    
    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    )
  }
} 