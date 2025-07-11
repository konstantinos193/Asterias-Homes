export interface BookingData {
  roomId: string
  checkIn?: Date
  checkOut?: Date
  adults: number
  children: number
  guestInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    specialRequests: string
  }
  paymentMethod: "card" | "cash"
  cardDetails: {
    number: string
    expiry: string
    cvv: string
    name: string
  }
}

export interface Room {
  id: string
  name: string
  price: number
  maxGuests: number
  image: string
  size: number
  bedType: string
  view: string
  bathroom: string
  features: string[]
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
