export interface BookingData {
  roomId: string
  checkIn?: Date
  checkOut?: Date
  adults: number
  children: number
  roomQuantity?: number
  roomPrice?: number
  nights?: number
  guestInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    specialRequests: string
  }
  paymentMethod: "card" | "cash"
  bookingResult?: any // Store the payment confirmation result
}

export interface Room {
  id: string
  name: string
  nameKey: string
  description: string
  descriptionKey: string
  price: number
  maxGuests: number
  images: string[]
  size: number
  bedType: string
  view: string
  bathroom: string
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
  rating: number
  totalRooms: number
}
