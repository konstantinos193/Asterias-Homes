// React Query hooks for admin operations
import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query'
import { api } from '@/lib/api-client'

export function useAdminDashboard(): UseQueryResult<unknown, Error> {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => api.admin.getDashboard(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useAdminRooms(): UseQueryResult<unknown[], Error> {
  return useQuery<unknown[], Error>({
    queryKey: ['admin', 'rooms'],
    queryFn: async () => {
      const data = await api.admin.getAllRooms()
      // API returns { rooms: [], pagination: {} }
      if (data && typeof data === 'object' && 'rooms' in data && Array.isArray((data as { rooms: unknown[] }).rooms)) {
        return (data as { rooms: unknown[] }).rooms
      }
      return Array.isArray(data) ? data : []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useAdminRoom(roomId: string | null | undefined): UseQueryResult<unknown, Error> {
  return useQuery({
    queryKey: ['admin', 'rooms', roomId],
    queryFn: () => {
      if (!roomId) throw new Error('Room ID is required')
      return api.admin.getRoomById(roomId)
    },
    enabled: !!roomId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useAdminAnalytics(params?: { period?: string; startDate?: string; endDate?: string }): UseQueryResult<unknown, Error> {
  return useQuery({
    queryKey: ['admin', 'analytics', params],
    queryFn: () => api.admin.getAnalytics(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useAdminRevenueReports(period?: string): UseQueryResult<unknown, Error> {
  return useQuery({
    queryKey: ['admin', 'revenue-reports', period],
    queryFn: () => api.admin.getRevenueReports(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useAdminUsers(): UseQueryResult<unknown[], Error> {
  return useQuery<unknown[], Error>({
    queryKey: ['admin', 'users'],
    queryFn: async () => {
      const data = await api.admin.getAllUsers()
      // Handle both { users: [] } and [] formats
      if (data && typeof data === 'object' && 'users' in data && Array.isArray((data as any).users)) {
        return (data as any).users
      }
      return Array.isArray(data) ? data : []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useAdminSettings(): UseQueryResult<unknown, Error> {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const response = await api.admin.getSettings()
      // Handle { success: true, data: {...} } format
      if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        return (response as { success: boolean; data: unknown }).data
      }
      return response
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export function useUpdateAdminSettings(): UseMutationResult<unknown, Error, unknown> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (settings: unknown) => api.admin.updateSettings(settings),
    onSuccess: (response) => {
      // Invalidate and refetch settings
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] })
      // Update cache with new data if response includes it
      if (response && typeof response === 'object' && 'success' in response && 'data' in response) {
        queryClient.setQueryData(['admin', 'settings'], (response as { success: boolean; data: unknown }).data)
      }
    },
  })
}

export function useGuestByEmail(email: string | null | undefined): UseQueryResult<{ guest: unknown; bookings: unknown[] }, Error> {
  return useQuery({
    queryKey: ['admin', 'guests', email],
    queryFn: async () => {
      if (!email) throw new Error('Email is required')
      const data = await api.admin.getGuestByEmail(email)
      // Normalize response structure - backend returns { guest, bookings }
      if (data && typeof data === 'object' && 'guest' in data && 'bookings' in data) {
        return data as { guest: unknown; bookings: unknown[] }
      }
      throw new Error('Invalid response format from guest endpoint')
    },
    enabled: !!email,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useUpdateGuest(): UseMutationResult<unknown, Error, { email: string; data: unknown }> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ email, data }: { email: string; data: unknown }) => api.admin.updateGuest(email, data),
    onSuccess: (_, variables) => {
      // Invalidate guest queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'guests', variables.email] })
      // Also invalidate users list since guest might be a user
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export function useDeleteGuest(): UseMutationResult<unknown, Error, string> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (email: string) => api.admin.deleteGuest(email),
    onSuccess: (_, email) => {
      // Invalidate guest queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'guests', email] })
      // Also invalidate users list
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export function useAdminUser(userId: string | null | undefined): UseQueryResult<{ user: unknown; bookings: unknown[] }, Error> {
  return useQuery({
    queryKey: ['admin', 'users', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required')
      const data = await api.admin.getUserById(userId)
      // Normalize response structure - backend returns { user, bookings }
      if (data && typeof data === 'object' && 'user' in data && 'bookings' in data) {
        return data as { user: unknown; bookings: unknown[] }
      }
      throw new Error('Invalid response format from user endpoint')
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}

export function useUpdateUser(): UseMutationResult<unknown, Error, { userId: string; data: unknown }> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: unknown }) => api.admin.updateUser(userId, data),
    onSuccess: (_, variables) => {
      // Invalidate user queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'users', variables.userId] })
      // Also invalidate users list
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export function useDeleteUser(): UseMutationResult<unknown, Error, string> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userId: string) => api.admin.deleteUser(userId),
    onSuccess: () => {
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export function useCreateAdminUser(): UseMutationResult<unknown, Error, { name: string; email: string; password: string }> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (userData: { name: string; email: string; password: string }) => api.admin.createAdminUser(userData),
    onSuccess: () => {
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export function useAdminBooking(bookingId: string | null | undefined): UseQueryResult<unknown, Error> {
  return useQuery({
    queryKey: ['admin', 'bookings', bookingId],
    queryFn: async () => {
      if (!bookingId) throw new Error('Booking ID is required')
      const data = await api.admin.getBookingById(bookingId)
      // Handle response format: { booking: {} } or {}
      if (data && typeof data === 'object' && 'booking' in data) {
        return (data as { booking: unknown }).booking
      }
      return data
    },
    enabled: !!bookingId,
    staleTime: 1 * 60 * 1000, // 1 minute
  })
}

export function useRefundBooking(): UseMutationResult<unknown, Error, string> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bookingId: string) => api.payments.refund(bookingId),
    onSuccess: (_, bookingId) => {
      // Invalidate booking queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings', bookingId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] })
      queryClient.invalidateQueries({ queryKey: ['bookings', bookingId] })
    },
  })
}

export function useCancelAdminBooking(): UseMutationResult<unknown, Error, { bookingId: string; cancellationReason?: string; refundAmount?: number; adminNotes?: string }> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ bookingId, ...data }: { bookingId: string; cancellationReason?: string; refundAmount?: number; adminNotes?: string }) =>
      api.admin.cancelBooking(bookingId, data),
    onSuccess: (_, variables) => {
      // Invalidate booking queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings', variables.bookingId] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] })
      queryClient.invalidateQueries({ queryKey: ['bookings', variables.bookingId] })
    },
  })
}

export function useSendBookingEmail(): UseMutationResult<unknown, Error, { bookingId: string; emailType: string; customMessage?: string }> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ bookingId, emailType, customMessage }: { bookingId: string; emailType: string; customMessage?: string }) =>
      api.admin.sendBookingEmail(bookingId, { emailType, customMessage }),
    onSuccess: (_, variables) => {
      // Invalidate booking queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings', variables.bookingId] })
    },
  })
}

export function useBulkDeleteBookings(): UseMutationResult<unknown, Error, string[]> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bookingIds: string[]) => api.admin.bulkDeleteBookings(bookingIds),
    onSuccess: () => {
      // Invalidate all booking queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] })
    },
  })
}

export function useBulkUpdateBookingStatus(): UseMutationResult<unknown, Error, { bookingIds: string[]; status: string; adminNotes?: string }> {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ bookingIds, status, adminNotes }: { bookingIds: string[]; status: string; adminNotes?: string }) =>
      api.admin.bulkUpdateBookingStatus(bookingIds, status, adminNotes),
    onSuccess: () => {
      // Invalidate all booking queries
      queryClient.invalidateQueries({ queryKey: ['admin', 'bookings'] })
    },
  })
}

