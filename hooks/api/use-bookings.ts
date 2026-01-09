// React Query hooks for bookings
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

export interface Booking {
  id: string
  _id?: string
  roomId: string
  checkIn: string
  checkOut: string
  guests?: {
    adults: number
    children?: number
  }
  status?: string
  totalAmount?: number
  [key: string]: unknown
}

export function useBookings(): UseQueryResult<Booking[], Error> {
  return useQuery<Booking[], Error>({
    queryKey: ['bookings'],
    queryFn: async () => {
      const data = await api.bookings.getAll()
      return Array.isArray(data) ? (data as Booking[]) : []
    },
    staleTime: 1 * 60 * 1000, // 1 minute - bookings change frequently
  })
}

export function useBooking(bookingId: string | null | undefined): UseQueryResult<Booking, Error> {
  return useQuery<Booking, Error>({
    queryKey: ['bookings', bookingId],
    queryFn: async () => {
      if (!bookingId) throw new Error('Booking ID is required')
      const data = await api.bookings.getById(bookingId)
      return data as Booking
    },
    enabled: !!bookingId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useAdminBookings(): UseQueryResult<Booking[], Error> {
  return useQuery<Booking[], Error>({
    queryKey: ['admin', 'bookings'],
    queryFn: async () => {
      const data = await api.admin.getAllBookings()
      // Handle response format: { bookings: [] } or []
      if (Array.isArray(data)) {
        return data as Booking[]
      }
      if (data && typeof data === 'object' && 'bookings' in data && Array.isArray((data as any).bookings)) {
        return (data as any).bookings as Booking[]
      }
      return []
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useMyBookings(
  options?: { 
    page?: number
    limit?: number
    status?: string
    enabled?: boolean
  }
): UseQueryResult<{ bookings: Booking[]; pagination: { page: number; limit: number; total: number; pages: number } }, Error> {
  const params = options ? { page: options.page, limit: options.limit, status: options.status } : undefined
  return useQuery<{ bookings: Booking[]; pagination: { page: number; limit: number; total: number; pages: number } }, Error>({
    queryKey: ['bookings', 'my-bookings', params],
    queryFn: async () => {
      const data = await api.bookings.getMyBookings(params)
      // Handle response format: { bookings: [], pagination: {} } or { bookings: [] }
      if (data && typeof data === 'object' && 'bookings' in data) {
        return data as { bookings: Booking[]; pagination: { page: number; limit: number; total: number; pages: number } }
      }
      // If no pagination, return with default pagination
      const bookings = Array.isArray(data) ? data : []
      return {
        bookings: bookings as Booking[],
        pagination: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          total: bookings.length,
          pages: Math.ceil(bookings.length / (params?.limit || 10))
        }
      }
    },
    enabled: options?.enabled !== false, // Default to true, but can be disabled
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useCancelBooking(): UseMutationResult<Booking, Error, string> {
  const queryClient = useQueryClient()
  
  return useMutation<Booking, Error, string>({
    mutationFn: async (bookingId: string) => {
      const data = await api.bookings.cancel(bookingId)
      return data as Booking
    },
    onSuccess: (_, bookingId) => {
      // Invalidate all booking queries to refresh the list
      queryClient.invalidateQueries({ queryKey: ['bookings', 'my-bookings'] })
      queryClient.invalidateQueries({ queryKey: ['bookings', bookingId] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

export function useUpdateBookingStatus(): UseMutationResult<Booking, Error, { bookingId: string; status: string; adminNotes?: string }> {
  const queryClient = useQueryClient()
  
  return useMutation<Booking, Error, { bookingId: string; status: string; adminNotes?: string }>({
    mutationFn: async ({ bookingId, status, adminNotes }: { bookingId: string; status: string; adminNotes?: string }) => {
      const data = await api.admin.updateBookingStatus(bookingId, status, adminNotes)
      return data as Booking
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings', variables.bookingId] })
      queryClient.invalidateQueries({ queryKey: ['bookings', variables.bookingId] })
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })
}

