// DEPRECATED: This API route is being phased out in favor of direct backend calls
// Components should use the apiClient from @/lib/api-client instead
// This route is kept temporarily for backward compatibility but should not be used in new code

import { NextRequest, NextResponse } from 'next/server'
import { getBackendApiUrl } from '@/lib/backend-url'
import { logger } from '@/lib/logger'

export async function GET(
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
    const headers: Record<string, string> = {
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
      logger.error('JSON parse error in admin API route GET', parseError as Error, { responseText: text, url })
      return NextResponse.json(
        { error: 'Invalid JSON response from backend' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    logger.error('Backend request failed in admin API route GET', error as Error, { url, adminPath })
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
    const headers: Record<string, string> = {
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
      logger.error('JSON parse error in admin API route POST', parseError as Error, { responseText: text, url })
      return NextResponse.json(
        { error: 'Invalid JSON response from backend' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    logger.error('Backend request failed in admin API route POST', error as Error, { url, adminPath })
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
    const headers: Record<string, string> = {
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
      logger.error('JSON parse error in admin API route PUT', parseError as Error, { responseText: text, url })
      return NextResponse.json(
        { error: 'Invalid JSON response from backend' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    logger.error('Backend request failed in admin API route PUT', error as Error, { url, adminPath })
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
    const headers: Record<string, string> = {
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
      logger.error('JSON parse error in admin API route DELETE', parseError as Error, { responseText: text, url })
      return NextResponse.json(
        { error: 'Invalid JSON response from backend' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    logger.error('Backend request failed in admin API route DELETE', error as Error, { url, adminPath })
    return NextResponse.json(
      { error: 'Backend request failed' },
      { status: 500 }
    )
  }
} 