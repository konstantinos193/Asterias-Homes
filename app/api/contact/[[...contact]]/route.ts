// Proxy for /api/contact - forwards requests to backend with auth token from cookies.
// Admin contact operations (GET list, PATCH, etc.) require auth; POST (submit form) is public.

import { NextRequest, NextResponse } from 'next/server'
import { getBackendApiUrl } from '@/lib/backend-url'
import { logger } from '@/lib/logger'

function buildBackendUrl(contactPath: string[] | undefined, searchParams: URLSearchParams): string {
  const base = getBackendApiUrl('/api/contact')
  const subPath = contactPath?.length ? contactPath.join('/') : ''
  const url = subPath ? `${base}/${subPath}` : base
  const query = searchParams.toString()
  return query ? `${url}?${query}` : url
}

async function proxyRequest(
  request: NextRequest,
  contactPath: string[] | undefined,
  method: string
): Promise<NextResponse> {
  const url = buildBackendUrl(contactPath, request.nextUrl.searchParams)
  const authToken = request.cookies.get('authToken')?.value

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`
  }

  const init: RequestInit = {
    method,
    headers,
    cache: 'no-store',
  }
  if (method !== 'GET' && method !== 'DELETE') {
    try {
      init.body = await request.text()
      if (!init.body) init.body = undefined
    } catch {
      // No body
    }
  }

  try {
    const response = await fetch(url, init)
    const text = await response.text()

    if (!text) {
      if (response.ok && (response.status === 204 || response.status === 201)) {
        return new NextResponse(null, { status: response.status })
      }
      return NextResponse.json(
        { error: 'Empty response from backend' },
        { status: 500 }
      )
    }

    let data: unknown
    try {
      data = JSON.parse(text)
    } catch (parseError) {
      logger.error('JSON parse error in contact API route', parseError as Error, { url, method })
      return NextResponse.json(
        { error: 'Invalid JSON response from backend' },
        { status: 500 }
      )
    }

    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    logger.error('Backend request failed in contact API route', error as Error, { url, method })
    return NextResponse.json(
      { error: 'Backend request failed' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contact?: string[] }> }
) {
  const resolvedParams = await params
  return proxyRequest(request, resolvedParams.contact, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ contact?: string[] }> }
) {
  const resolvedParams = await params
  return proxyRequest(request, resolvedParams.contact, 'POST')
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ contact?: string[] }> }
) {
  const resolvedParams = await params
  return proxyRequest(request, resolvedParams.contact, 'PATCH')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ contact?: string[] }> }
) {
  const resolvedParams = await params
  return proxyRequest(request, resolvedParams.contact, 'DELETE')
}
