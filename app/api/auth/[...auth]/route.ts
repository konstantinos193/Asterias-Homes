import { NextRequest, NextResponse } from 'next/server'
import { getBackendApiUrl } from '@/lib/backend-url'
import { logger } from '@/lib/logger'

const BACKEND_URL = getBackendApiUrl('/api/auth')

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ auth: string[] }> }
) {
  const resolvedParams = await params
  const authPath = resolvedParams.auth.join('/')
  const url = `${BACKEND_URL}/${authPath}`
  
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
    
    logger.debug('Auth API GET request', { authPath, url, method: 'GET' })
    
    const response = await fetch(url, {
      method: 'GET',
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
      const error = parseError instanceof Error ? parseError : new Error(String(parseError))
      logger.error('JSON parse error in auth API', error, { url, responseText: text.substring(0, 200) })
      return NextResponse.json(
        { error: 'Invalid JSON response from backend' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    logger.error('Auth API GET request failed', err, { authPath, url })
    return NextResponse.json(
      { error: 'Backend request failed' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ auth: string[] }> }
) {
  const resolvedParams = await params
  const authPath = resolvedParams.auth.join('/')
  const url = `${BACKEND_URL}/${authPath}`
  const body = await request.json()
  
  try {
    logger.debug('Auth API POST request', { authPath, url, method: 'POST' })
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
      const error = parseError instanceof Error ? parseError : new Error(String(parseError))
      logger.error('JSON parse error in auth API POST', error, { url, responseText: text.substring(0, 200) })
      return NextResponse.json(
        { error: 'Invalid JSON response from backend' },
        { status: 500 }
      )
    }
    
    // If login is successful and backend returns a token, set it as a cookie
    if (response.ok && authPath === 'login' && data.token) {
      const nextResponse = NextResponse.json(data, { status: response.status })
      nextResponse.cookies.set('authToken', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60, // 1 week in seconds
      })
      return nextResponse
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    logger.error('Auth API POST request failed', err, { authPath, url })
    return NextResponse.json(
      { error: 'Backend request failed' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ auth: string[] }> }
) {
  const resolvedParams = await params
  const authPath = resolvedParams.auth.join('/')
  const url = `${BACKEND_URL}/${authPath}`
  const body = await request.json()
  
  // Get the authToken from cookies
  const authToken = request.cookies.get('authToken')?.value
  
  try {
    logger.debug('Auth API PUT request', { authPath, url, method: 'PUT' })
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    // If we have an auth token, send it as Authorization header to backend
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
      const error = parseError instanceof Error ? parseError : new Error(String(parseError))
      logger.error('JSON parse error in auth API PUT', error, { url, responseText: text.substring(0, 200) })
      return NextResponse.json(
        { error: 'Invalid JSON response from backend' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    logger.error('Auth API PUT request failed', err, { authPath, url })
    return NextResponse.json(
      { error: 'Backend request failed' },
      { status: 500 }
    )
  }
} 