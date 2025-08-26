// This file defines the RoomData interface that matches the backend structure
// All room data will be fetched from the backend API

export interface RoomData {
  _id: string
  id?: string // For backward compatibility - will map to _id
  name: string
  nameKey: string
  description: string
  descriptionKey: string
  price: number
  capacity: number
  size?: string
  bedType: string
  view?: string
  bathroom?: string
  features: string[]
  featureKeys: string[]
  amenities: {
    wifi: boolean
    ac: boolean
    tv: boolean
    minibar: boolean
    balcony: boolean
    seaView: boolean
    roomService: boolean
    safe: boolean
  }
  totalRooms: number
  image?: string
  images?: string[]
  rating: number
  reviewCount: number
  bookingcom_room_id?: string
  source: 'asterias' | 'bookingcom'
  createdAt: string
  updatedAt: string
}

// Export empty array - data will be fetched from backend
export const allRoomsData: RoomData[] = []
