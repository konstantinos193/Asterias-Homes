import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getBackendApiUrl } from '@/lib/backend-url'
import { logger } from '@/lib/logger'
import RoomDetailPageClient from "./RoomDetailPageClient"
import { Room as BookingRoom } from "@/types/booking"

interface Room {
  id: string
  _id?: string
  name?: string
  nameKey?: string
  description?: string
  descriptionKey?: string
  price?: number
  maxGuests?: number
  capacity?: number
  size?: string | number
  view?: string
  bathroom?: string
  bedType?: string
  rating?: number
  features?: string[]
  featureKeys?: string[]
  images?: string[]
  image?: string
  amenities?: {
    wifi?: boolean
    ac?: boolean
    tv?: boolean
    minibar?: boolean
    balcony?: boolean
    seaView?: boolean
    roomService?: boolean
    safe?: boolean
    [key: string]: unknown
  }
  totalRooms?: number
  [key: string]: unknown
}

async function getRoom(roomId: string): Promise<Room | null> {
  try {
    const backendUrl = getBackendApiUrl(`/api/rooms/${roomId}`)
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Revalidate every 60 seconds (ISR - Incremental Static Regeneration)
      next: { revalidate: 60 },
    })

    // If room not found, return null (will trigger 404)
    if (response.status === 404) {
      return null
    }

    // If server error, log and return null (will trigger 404)
    if (!response.ok) {
      logger.error(`Backend responded with status ${response.status} for room ${roomId}`)
      return null
    }

    const text = await response.text()
    if (!text) {
      logger.error(`Empty response from backend for room ${roomId}`)
      return null
    }

    let data
    try {
      data = JSON.parse(text)
      console.log('🔍 Server-side API response:', { data, text: text.substring(0, 500) + '...' })
    } catch (parseError) {
      logger.error('JSON parse error in room detail page', parseError as Error, { roomId, responseText: text })
      return null
    }

    // Normalize response structure - Server-side API returns { data: { room: {...} } }
    let room: Room
    if (data && typeof data === 'object' && 'data' in data && data.data) {
      // API returns wrapped format: { data: { room: {...} } }
      room = data.data as Room
    } else {
      // Fallback: direct room object
      room = data as Room
    }
    
    console.log('🔍 Extracted room data:', { 
      roomKeys: Object.keys(room || {}), 
      hasImages: !!room.images, 
      hasImage: !!room.image,
      imagesLength: room.images?.length || 0,
      imageValue: room.image
    })

    // Ensure id is set
    room.id = room._id || room.id || roomId

    return room
  } catch (error) {
    logger.error('Error fetching room in server component', error as Error, { roomId })
    // Return null to trigger 404 instead of 500
    return null
  }
}

// Helper function to normalize room data to match BookingRoom type
function normalizeRoomForClient(room: Room): BookingRoom {
  // Handle both single image and images array
  let roomImages: string[] = []
  if (Array.isArray(room.images) && room.images.length > 0) {
    roomImages = room.images
  } else if (room.image) {
    roomImages = [room.image]
  }
  
  console.log('🔍 normalizeRoomForClient:', { 
    roomImages: room.images, 
    singleImage: room.image, 
    finalImages: roomImages,
    roomData: room
  })
  
  return {
    id: room.id || room._id || '',
    name: room.name || room.nameKey || '',
    nameKey: room.nameKey || '',
    description: room.description || room.descriptionKey || '',
    descriptionKey: room.descriptionKey || '',
    price: room.price || 0,
    maxGuests: room.maxGuests || room.capacity || 0,
    images: roomImages,
    size: typeof room.size === 'number' ? room.size : (typeof room.size === 'string' ? parseFloat(room.size) || 0 : 0),
    bedType: room.bedType || '',
    view: room.view || '',
    bathroom: room.bathroom || '',
    features: Array.isArray(room.features) ? room.features : [],
    featureKeys: Array.isArray(room.featureKeys) ? room.featureKeys : [],
    amenities: {
      wifi: room.amenities?.wifi ?? false,
      ac: room.amenities?.ac ?? false,
      tv: room.amenities?.tv ?? false,
      minibar: room.amenities?.minibar ?? false,
      balcony: room.amenities?.balcony ?? false,
      seaView: room.amenities?.seaView ?? false,
      roomService: room.amenities?.roomService ?? false,
      safe: room.amenities?.safe ?? false,
    },
    rating: room.rating || 0,
    totalRooms: room.totalRooms || 0,
  }
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, roomId: string }> }): Promise<Metadata> {
  const { lang, roomId } = await params
  const baseUrl = 'https://asteriashome.gr'
  const room = await getRoom(roomId)

  // If room not found, return basic metadata
  if (!room) {
    return {
      title: "Room Not Found | Asterias Homes",
      description: "The requested room could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const localeMap: Record<string, string> = {
    'en': 'en_US',
    'el': 'el_GR',
    'de': 'de_DE'
  }

  const roomName = room.name || room.nameKey || 'Room'
  const roomDescription = room.description || room.descriptionKey || `Traditional holiday apartment in Koronisia, Arta. ${room.maxGuests || room.capacity || 2} guests. €${room.price || 0}/night.`
  const roomImage = (Array.isArray(room.images) && room.images.length > 0) 
    ? room.images[0] 
    : (room.image || '/room-featured-1.jpeg')

  return {
    title: `${roomName} | Traditional Holiday Apartment in Koronisia | Asterias Homes`,
    description: roomDescription,
    keywords: [
      "traditional apartment Koronisia",
      "holiday accommodation Arta",
      "Koronisia vacation rental",
      "Amvrakikos Gulf apartments",
      `${roomName} Koronisia`,
    ],
    openGraph: {
      title: `${roomName} | Asterias Homes`,
      description: roomDescription,
      images: [
        {
          url: roomImage.startsWith('http') ? roomImage : `${baseUrl}${roomImage}`,
          width: 1200,
          height: 630,
          alt: `${roomName} - Traditional Holiday Apartment in Koronisia`,
        }
      ],
      type: "website",
      locale: localeMap[lang] || 'en_US',
      siteName: "Asterias Homes",
      url: `${baseUrl}/${lang}/rooms/${roomId}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${roomName} | Asterias Homes`,
      description: roomDescription,
      images: [roomImage.startsWith('http') ? roomImage : `${baseUrl}${roomImage}`],
    },
    alternates: {
      canonical: `${baseUrl}/${lang}/rooms/${roomId}`,
      languages: {
        "en-US": `${baseUrl}/en/rooms/${roomId}`,
        "el-GR": `${baseUrl}/el/rooms/${roomId}`,
        "de-DE": `${baseUrl}/de/rooms/${roomId}`,
        "x-default": `${baseUrl}/en/rooms/${roomId}`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  }
}

export default async function RoomDetailPage({ params }: { params: Promise<{ lang: string, roomId: string }> }) {
  const { lang, roomId } = await params
  
  // Fetch room data server-side
  const room = await getRoom(roomId)
  
  // If room not found, return 404 page
  if (!room) {
    notFound()
  }
  
  // Normalize room data to match BookingRoom type
  const normalizedRoom = normalizeRoomForClient(room)
  
  // Pass room data to client component
  return <RoomDetailPageClient roomId={roomId} initialRoom={normalizedRoom} />
} 