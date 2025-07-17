import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL = 'https://asterias-backend.onrender.com/api/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { auth: string[] } }
) {
  const authPath = params.auth.join('/')
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
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    })
    
    const data = await response.json()
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
  { params }: { params: { auth: string[] } }
) {
  const authPath = params.auth.join('/')
  const url = `${BACKEND_URL}/${authPath}`
  const body = await request.json()
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    
    const data = await response.json()
    
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
    return NextResponse.json(
      { error: 'Backend request failed' },
      { status: 500 }
    )
  }
} 