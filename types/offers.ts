export interface Offer {
  _id: string
  title: string
  titleKey?: string
  description: string
  descriptionKey?: string
  image?: string
  discount: number
  startDate: string
  endDate: string
  active: boolean
  applicableRooms?: string[]
  minStay?: number
  maxStay?: number
  conditions?: string
  code?: string
  badgeKey?: string
  roomTypeKey?: string
  includesKeys?: string[]
  featured?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface OffersResponse {
  offers: Offer[]
}
