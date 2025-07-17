import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'your-fallback-secret-key-here');

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const tokenCookie = request.cookies.get('authToken')
  const token = tokenCookie?.value

  // Check if the user is trying to access a protected admin route
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token) {
      // If no token, redirect to login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      // Verify the token
      await jwtVerify(token, SECRET_KEY)
      // If token is valid, proceed
      return NextResponse.next()
    } catch (error) {
      // If token is invalid (expired, etc.), redirect to login and clear the bad cookie
      console.error("Token verification failed:", error);
      const response = NextResponse.redirect(new URL('/admin/login', request.url))
      response.cookies.delete('authToken')
      return response
    }
  }

  // Check if a logged-in user is trying to access the login page
  if (pathname === '/admin/login') {
    if (token) {
      try {
        // Verify the token
        await jwtVerify(token, SECRET_KEY)
        // If token is valid, redirect them to the admin dashboard
        return NextResponse.redirect(new URL('/admin', request.url))
      } catch (error) {
        // If token is invalid, allow them to stay on the login page and clear the bad cookie
        console.error("Token verification failed on login page:", error);
        const response = NextResponse.next()
        response.cookies.delete('authToken')
        return response
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  // Match all admin routes except for API routes and static files
  matcher: ['/admin/:path*'],
} 