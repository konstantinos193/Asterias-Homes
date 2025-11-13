// Backend URL utility
// Uses NEXT_PUBLIC_BACKEND_URL from .env for both client and server-side

export function getBackendUrl(): string {
  return process.env.NEXT_PUBLIC_BACKEND_URL || 'https://asterias-backend.onrender.com'
}

export function getBackendApiUrl(path: string = ''): string {
  const baseUrl = getBackendUrl()
  // Remove trailing slash from baseUrl and leading slash from path
  const cleanBase = baseUrl.replace(/\/$/, '')
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${cleanBase}${cleanPath}`
}

