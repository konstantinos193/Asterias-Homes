// React Query hooks for rooms
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

export interface Room {
  id: string
  _id?: string
  name: string
  description?: string
  price?: number
  maxOccupancy?: number
  maxGuests?: number
  capacity?: number
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
  images?: string[]
  image?: string
  size?: string | number
  bedType?: string
  view?: string
  bathroom?: string
  features?: string[]
  featureKeys?: string[]
  rating?: number
  totalRooms?: number
  nameKey?: string
  descriptionKey?: string
  [key: string]: unknown
}

export function useRooms(): UseQueryResult<Room[], Error> {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: () => api.rooms.getAll(),
    staleTime: 0, // Force fresh data
    gcTime: 0, // Don't cache (renamed from cacheTime)
    refetchOnWindowFocus: true, // Refetch on focus
    refetchOnMount: true, // Refetch on mount
  })
}

export function useRoom(
  roomId: string | null | undefined,
  options?: {
    initialData?: Room | null
    enabled?: boolean
  }
): UseQueryResult<Room, Error> {
  return useQuery({
    queryKey: ['rooms', roomId],
    queryFn: () => {
      if (!roomId) throw new Error('Room ID is required')
      return api.rooms.getById(roomId)
    },
    enabled: options?.enabled !== undefined ? options.enabled : !!roomId,
    initialData: options?.initialData || undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

