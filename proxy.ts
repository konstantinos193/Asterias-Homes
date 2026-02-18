import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'el', 'de']
const DEFAULT_LANGUAGE = 'en'

// Detect language from Accept-Language header
function detectLanguage(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return DEFAULT_LANGUAGE

  // Parse Accept-Language header (format: "en-US,en;q=0.9,el;q=0.8")
  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code] = lang.trim().split(';')
      return code.toLowerCase().split('-')[0] // Extract language code (e.g., 'en' from 'en-US')
    })

  // Find first supported language
  for (const lang of languages) {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      return lang
    }
  }

  return DEFAULT_LANGUAGE
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const url = request.nextUrl.clone()
  const token = request.cookies.get('authToken')?.value
  const hostname = request.headers.get('host') || ''
  const searchParams = url.searchParams.toString()

  // Force HTTPS redirect (if not already HTTPS) - always redirect HTTP to HTTPS
  if (url.protocol === 'http:' && !url.hostname.includes('localhost')) {
    url.protocol = 'https:'
    return NextResponse.redirect(url, 301) // Permanent redirect
  }

  // Handle www to non-www redirect
  if (hostname.startsWith('www.')) {
    const nonWwwHostname = hostname.replace('www.', '')
    const newUrl = new URL(url.href)
    newUrl.hostname = nonWwwHostname
    return NextResponse.redirect(newUrl, 301)
  }

  // Handle trailing slashes (remove them except for root)
  if (pathname !== '/' && pathname.endsWith('/')) {
    const newPath = pathname.slice(0, -1)
    const newUrl = new URL(`https://${hostname}${newPath}`)
    if (searchParams) {
      newUrl.search = searchParams
    }
    return NextResponse.redirect(newUrl, 301)
  }

  // Fix broken URLs with special characters that Google is trying to index
  // Handle the specific URLs from your Google Search Console: /%, /8, etc.
  if (pathname.includes('%26') || pathname.includes('%24') || pathname.includes('&') || pathname.includes('$') || 
      pathname.includes('%') || pathname === '/%' || pathname === '/8' || pathname === '/$') {
    // For single character invalid paths, redirect to home
    if (pathname === '/%' || pathname === '/8' || pathname === '/$') {
      const detectedLang = detectLanguage(request)
      const redirectUrl = new URL(`/${detectedLang}`, request.url)
      redirectUrl.protocol = 'https:'
      return NextResponse.redirect(redirectUrl, 301)
    }
    
    // For paths with special characters, clean them up
    const fixedPathname = pathname.replace(/%26|&/g, '/').replace(/%24|\$/g, '').replace(/%/g, '')
    const redirectUrl = new URL(fixedPathname || '/', request.url)
    redirectUrl.protocol = 'https:'
    return NextResponse.redirect(redirectUrl, 301)
  }

  // PERMANENT root redirect - detect language from browser
  // Use 301 (Permanent Redirect) for SEO - tells Google the root always redirects to language-specific pages
  if (pathname === '/') {
    const detectedLang = detectLanguage(request)
    const redirectUrl = new URL(`/${detectedLang}`, request.url)
    // Use 301 (Permanent Redirect) for SEO - this is the canonical behavior
    return NextResponse.redirect(redirectUrl, 301)
  }

  // Valid page routes (without language prefix - these are invalid)
  const VALID_PAGE_ROUTES = ['about', 'rooms', 'gallery', 'offers', 'contact', 'bookings', 'success', 'book']
  
  // Special routes that should redirect to home or contact (privacy, terms don't exist as pages)
  const SPECIAL_ROUTES = ['privacy', 'terms', 'terms-of-service', 'privacy-policy']
  
  // Validate and redirect invalid paths
  const pathSegments = pathname.split('/').filter(Boolean)
  const firstSegment = pathSegments[0]
  
  // Decode URL-encoded characters (e.g., %24 = $, %26 = &)
  const decodedFirstSegment = firstSegment ? decodeURIComponent(firstSegment) : null

  // Skip if it's an admin, API, or Next.js internal route
  if (firstSegment && (
    firstSegment.startsWith('admin') || 
    firstSegment.startsWith('api') || 
    firstSegment.startsWith('_next') ||
    firstSegment === 'robots.txt' ||
    firstSegment === 'sitemap.xml'
  )) {
    return NextResponse.next()
  }

  // IMPORTANT: Allow valid language codes to pass through without redirect
  // This ensures /en, /el, /de work correctly with their canonical tags
  // But check if there's a privacy/terms page after language code - redirect to contact
  if (firstSegment && SUPPORTED_LANGUAGES.includes(firstSegment)) {
    const secondSegment = pathSegments[1]
    // If there's a privacy/terms page after language code, redirect to contact (these pages don't exist)
    if (secondSegment && SPECIAL_ROUTES.includes(secondSegment)) {
      const detectedLang = firstSegment
      const redirectUrl = new URL(`/${detectedLang}/contact`, request.url)
      return NextResponse.redirect(redirectUrl, 301)
    }
    return NextResponse.next()
  }

  // Case 1: If first segment is a valid page route but missing language prefix
  // Handle invalid combinations like /about/rooms, /gallery/gallery, /about/about, etc.
  if (firstSegment && VALID_PAGE_ROUTES.includes(firstSegment)) {
    const detectedLang = detectLanguage(request)
    const restOfPath = pathSegments.slice(1).join('/')
    const secondSegment = pathSegments[1]
    
    // Special case: /rooms/{id} or /rooms/{objectId} without language prefix
    // Redirect to /lang/rooms/{id}
    if (firstSegment === 'rooms' && secondSegment && !VALID_PAGE_ROUTES.includes(secondSegment) && !SPECIAL_ROUTES.includes(secondSegment)) {
      const roomId = secondSegment
      const remainingPath = pathSegments.slice(2).join('/')
      const redirectUrl = new URL(`/${detectedLang}/rooms/${roomId}${remainingPath ? `/${remainingPath}` : ''}`, request.url)
      return NextResponse.redirect(redirectUrl, 301)
    }
    
    // Special case: /offers/{slug} without language prefix
    // Redirect to /lang/offers/{slug}
    if (firstSegment === 'offers' && secondSegment && !VALID_PAGE_ROUTES.includes(secondSegment) && !SPECIAL_ROUTES.includes(secondSegment)) {
      const offerSlug = secondSegment
      const remainingPath = pathSegments.slice(2).join('/')
      const redirectUrl = new URL(`/${detectedLang}/offers/${offerSlug}${remainingPath ? `/${remainingPath}` : ''}`, request.url)
      return NextResponse.redirect(redirectUrl, 301)
    }
    
    // If the first and second segments are the same (e.g., /about/about, /gallery/gallery)
    // Redirect to the single page with language prefix
    if (secondSegment && firstSegment === secondSegment) {
      const redirectUrl = new URL(`/${detectedLang}/${firstSegment}`, request.url)
      return NextResponse.redirect(redirectUrl, 301)
    }
    
    // If there's a sub-path that's also a valid page route (e.g., /about/rooms, /gallery/bookings)
    // Redirect to the second path (the actual page) with language prefix, ignoring the first
    // This handles: /rooms/bookings, /about/gallery, /offers/contact, etc.
    if (secondSegment && VALID_PAGE_ROUTES.includes(secondSegment)) {
      const redirectUrl = new URL(`/${detectedLang}/${secondSegment}${pathSegments.length > 2 ? `/${pathSegments.slice(2).join('/')}` : ''}`, request.url)
      return NextResponse.redirect(redirectUrl, 301)
    }
    
    // If second segment is a special route (privacy, terms), redirect to home
    // These pages don't exist, so redirect to contact page or home
    if (secondSegment && SPECIAL_ROUTES.includes(secondSegment)) {
      const redirectUrl = new URL(`/${detectedLang}/contact`, request.url)
      return NextResponse.redirect(redirectUrl, 301)
    }
    
    // Valid single-level path like /about - redirect to language version
    const redirectUrl = new URL(`/${detectedLang}/${firstSegment}${restOfPath ? `/${restOfPath}` : ''}`, request.url)
    return NextResponse.redirect(redirectUrl, 301)
  }
  
  // Case 1.5: Handle /privacy, /terms without any prefix or with invalid prefix
  // These should redirect to contact page (privacy/terms pages don't exist)
  if (firstSegment && SPECIAL_ROUTES.includes(firstSegment)) {
    const detectedLang = detectLanguage(request)
    // Redirect privacy/terms to contact page where they can find info
    const redirectUrl = new URL(`/${detectedLang}/contact`, request.url)
    return NextResponse.redirect(redirectUrl, 301)
  }

  // Case 2: If first segment is invalid (URL-encoded chars like %24 ($), %26 (&), or invalid 2-char codes)
  // Handle URLs like /%24/about, /%26/gallery, /%24/bookings, /%24/contact, etc.
  if (firstSegment) {
    // Check if it's URL-encoded special character (e.g., %24 = $, %26 = &)
    const isUrlEncodedSpecialChar = decodedFirstSegment && 
      decodedFirstSegment.length === 1 && 
      /[^a-zA-Z0-9]/.test(decodedFirstSegment)
    
    // Check if it's invalid 2-character code (not a language)
    const isInvalidLangCode = firstSegment.length === 2 && !SUPPORTED_LANGUAGES.includes(firstSegment)
    
    if (isUrlEncodedSpecialChar || isInvalidLangCode) {
      const detectedLang = detectLanguage(request)
      const restOfPath = pathSegments.slice(1).join('/')
      const secondSegment = pathSegments[1]
      
      // If there's a valid page route in the rest of the path, redirect to it
      if (restOfPath) {
        if (secondSegment && VALID_PAGE_ROUTES.includes(secondSegment)) {
          // Redirect to the valid page route with language (e.g., /%24/about -> /en/about)
          const remainingPath = pathSegments.slice(1).join('/')
          const redirectUrl = new URL(`/${detectedLang}/${remainingPath}`, request.url)
          return NextResponse.redirect(redirectUrl, 301)
        }
        // If second segment is privacy/terms, redirect to contact
        if (secondSegment && SPECIAL_ROUTES.includes(secondSegment)) {
          const redirectUrl = new URL(`/${detectedLang}/contact`, request.url)
          return NextResponse.redirect(redirectUrl, 301)
        }
        // If rest of path doesn't contain valid page, redirect to home
        const redirectUrl = new URL(`/${detectedLang}`, request.url)
        return NextResponse.redirect(redirectUrl, 301)
      }
      
      // No rest path, just redirect to home
      const redirectUrl = new URL(`/${detectedLang}`, request.url)
      return NextResponse.redirect(redirectUrl, 301)
    }
  }

  // Case 3: If first segment is something else (not a language code, not a valid page, not admin/api)
  // Try to intelligently redirect based on what seems to be intended
  if (firstSegment && firstSegment.length > 2 && !SUPPORTED_LANGUAGES.includes(firstSegment) && !VALID_PAGE_ROUTES.includes(firstSegment)) {
    // Check if any of the path segments match a valid page route
    const matchingPageIndex = pathSegments.findIndex(seg => VALID_PAGE_ROUTES.includes(seg))
    if (matchingPageIndex !== -1) {
      const detectedLang = detectLanguage(request)
      const validPath = pathSegments.slice(matchingPageIndex).join('/')
      const redirectUrl = new URL(`/${detectedLang}/${validPath}`, request.url)
      return NextResponse.redirect(redirectUrl, 301)
    }
    // If no valid page found, redirect to home with detected language
    const detectedLang = detectLanguage(request)
    const redirectUrl = new URL(`/${detectedLang}`, request.url)
    return NextResponse.redirect(redirectUrl, 301)
  }

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url), 307)
    }
  }

  // If already logged in, redirect /admin/login to /admin
  if (pathname === '/admin/login' && token) {
    return NextResponse.redirect(new URL('/admin', request.url), 307)
  }

  // Add security headers to response
  const response = NextResponse.next()
  
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // HSTS for HTTPS (only on production)
  if (!url.hostname.includes('localhost')) {
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  }

  // Set canonical URL in headers for debugging and SEO
  const canonicalUrl = `https://asteriashome.gr${pathname}`
  response.headers.set('X-Canonical-URL', canonicalUrl)
  
  // Add Link header for canonical URL (helps Google understand the preferred URL)
  response.headers.set('Link', `<${canonicalUrl}>; rel="canonical"`)

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     * - sitemap
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|json)).*)',
  ],
}

