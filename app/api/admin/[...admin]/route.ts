import { NextRequest, NextResponse } from 'next/server'
import { getBackendApiUrl } from '@/lib/backend-url'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ admin: string[] }> }
) {
  const resolvedParams = await params
  const adminPath = resolvedParams.admin.join('/')
  const BACKEND_URL = getBackendApiUrl('/api/admin')
  const url = `${BACKEND_URL}/${adminPath}`
  
  console.log('🔍 Admin API Route - GET:', {
    adminPath,
    fullUrl: url,
    backendUrl: BACKEND_URL,
    envVar: process.env.NEXT_PUBLIC_BACKEND_URL
  })
  
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
    
    console.log('🚀 Making backend request to:', url)
    const response = await fetch(url, {
      method: 'GET',
      headers,
    })
    
    console.log('📡 Backend response status:', response.status, response.statusText)
    
    // Check if response has content before parsing JSON
    const text = await response.text()
    if (!text) {
      return NextResponse.json(
        { error: 'Empty response from backend' },
        { status: 500 }
      )
    }
    
    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Response text:', text)
      return NextResponse.json(
        { error: 'Invalid JSON response from backend' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      { error: 'Backend request failed' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ admin: string[] }> }
) {
  const resolvedParams = await params
  const adminPath = resolvedParams.admin.join('/')
  const BACKEND_URL = getBackendApiUrl('/api/admin')
  const url = `${BACKEND_URL}/${adminPath}`
  const body = await request.json()
  
  // Get the authToken from cookies
  const authToken = request.cookies.get('authToken')?.value
  
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    
    // Check if response has content before parsing JSON
    const text = await response.text()
    if (!text) {
      return NextResponse.json(
        { error: 'Empty response from backend' },
        { status: 500 }
      )
    }
    
    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Response text:', text)
      return NextResponse.json(
        { error: 'Invalid JSON response from backend' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      { error: 'Backend request failed' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ admin: string[] }> }
) {
  const resolvedParams = await params
  const adminPath = resolvedParams.admin.join('/')
  const BACKEND_URL = getBackendApiUrl('/api/admin')
  const url = `${BACKEND_URL}/${adminPath}`
  const body = await request.json()
  
  // Get the authToken from cookies
  const authToken = request.cookies.get('authToken')?.value
  
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }
    
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    })
    
    // Check if response has content before parsing JSON
    const text = await response.text()
    if (!text) {
      return NextResponse.json(
        { error: 'Empty response from backend' },
        { status: 500 }
      )
    }
    
    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Response text:', text)
      return NextResponse.json(
        { error: 'Invalid JSON response from backend' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      { error: 'Backend request failed' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ admin: string[] }> }
) {
  const resolvedParams = await params
  const adminPath = resolvedParams.admin.join('/')
  const BACKEND_URL = getBackendApiUrl('/api/admin')
  const url = `${BACKEND_URL}/${adminPath}`
  
  // Get the authToken from cookies
  const authToken = request.cookies.get('authToken')?.value
  
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    })
    
    // Check if response has content before parsing JSON
    const text = await response.text()
    if (!text) {
      return NextResponse.json(
        { error: 'Empty response from backend' },
        { status: 500 }
      )
    }
    
    let data
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Response text:', text)
      return NextResponse.json(
        { error: 'Invalid JSON response from backend' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      { error: 'Backend request failed' },
      { status: 500 }
    )
  }
} 