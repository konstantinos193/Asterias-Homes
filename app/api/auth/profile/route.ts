import { NextRequest, NextResponse } from 'next/server'
import { decodeJwt } from 'jose'
import { logger } from '@/lib/logger'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const authToken = request.cookies.get('authToken')?.value

  if (!authToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = decodeJwt(authToken)

    const profile = {
      _id: payload.sub,
      email: payload.email,
      role: payload.role,
      username: payload.username ?? null,
    }

    logger.debug('Profile resolved from JWT', { userId: profile._id })

    return NextResponse.json(profile)
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    logger.error('Failed to decode JWT for profile', err)
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
  }
}
