import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes room names by removing numbers, so identical rooms display the same name
 * e.g., "Standard Apartment 1" -> "Standard Apartment"
 */
export function normalizeRoomName(roomName: string): string {
  if (!roomName) return "Standard Apartment"
  
  // Remove numbers and extra spaces from room names
  // This ensures "Standard Apartment 1", "Standard Apartment 2", etc. all show as "Standard Apartment"
  return roomName.replace(/\s+\d+$/, '').trim() || "Standard Apartment"
}

/**
 * Normalizes image URLs to ensure they work correctly across frontend and backend
 * Handles:
 * - Backend API URLs (converts to frontend proxy route)
 * - Relative backend URLs
 * - Bare filenames (assumes they're in /api/images/)
 * - Legacy imgur URLs (maps to local paths)
 * 
 * @param url - The image URL to normalize
 * @returns Normalized URL that works with Next.js Image component
 */
export function normalizeImageUrl(url: string): string {
  if (!url || typeof url !== 'string') return '/placeholder.svg';
  
  // Handle backend API image URLs - convert to frontend proxy route
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://asterias-backend.onrender.com';
  if (url.startsWith(`${backendUrl}/api/images/`)) {
    // Extract filename and use frontend proxy route
    const filename = url.replace(`${backendUrl}/api/images/`, '');
    return `/api/images/${filename}`;
  }
  
  // Handle relative backend URLs (already in correct format)
  if (url.startsWith('/api/images/')) {
    return url; // Already correct
  }
  
  // Handle bare filenames (e.g., "room-1234567890-123456789.jpg")
  // If it doesn't start with / or http, assume it's a filename and prepend /api/images/
  if (!url.startsWith('/') && !url.startsWith('http://') && !url.startsWith('https://')) {
    return `/api/images/${url}`;
  }
  
  // Handle legacy imgur URLs - map to local paths
  if (url.includes('i.imgur.com')) {
    const urlMappings: { [key: string]: string } = {
      'VjuPC23': '/room-featured-2.png',
      'SaAHqbC': '/room-featured-1.jpeg',
      '2JTTkSc': '/room-featured-3.png',
      'r1uVnhU': '/room-featured-4.png',
      'X7AG1TW': '/room-featured-5.png',
      'znGgwJY': '/favicon.png',
      'xgXMnQz': '/admin-logo.png',
      '3g12fLV': '/about-hero.jpeg',
      'SerzvD0': '/about-location.jpeg',
      'gdFTHDu': '/about-experiences.jpeg',
      'TnCq8q1': '/about-for-whom.jpeg',
      'KhgP0yg': '/about-amenities.jpeg',
    };
    
    for (const [imgurId, localPath] of Object.entries(urlMappings)) {
      if (url.includes(imgurId)) {
        return localPath;
      }
    }
    
    // If it's an imgur URL but not in mappings, return placeholder
    // This prevents unconfigured external hostname errors
    return '/placeholder.svg';
  }
  
  // If it's an external http/https URL that's not imgur or backend, check if it's Cloudinary
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Allow Cloudinary URLs since they're configured in next.config.mjs
    if (url.includes('res.cloudinary.com')) {
      return url;
    }
    // For other external URLs, return placeholder
    return '/placeholder.svg';
  }
  
  // If it's already a valid local path (starts with /), return as is
  return url;
}