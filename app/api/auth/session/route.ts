import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST(request: Request) {
  const body = await request.json();
  const { token } = body;

  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 });
  }

  const cookie = serialize('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'lax',
  });

  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', cookie);

  return response;
}

export async function DELETE() {
  const cookie = serialize('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), // Set to a past date to delete
    path: '/',
    sameSite: 'lax',
  });

  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', cookie);

  return response;
} 