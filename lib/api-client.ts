// Unified API client for direct backend communication
import { getBackendApiUrl } from './backend-url'
import { ApiError, handleApiError, parseErrorResponse } from './errors'

/**
 * Unified API client that replaces the Next.js API proxy layer
 * Calls backend directly with proper error handling and auth
 */
class ApiClient {
  private baseURL: string

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://asterias-backend.onrender.com'
  }

  /**
   * Get auth token from cookies (client-side) or headers (server-side)
   */
  private getAuthToken(): string | null {
    // Client-side: get from cookies
    if (typeof window !== 'undefined') {
      const cookies = document.cookie.split(';')
      const authCookie = cookies.find((cookie) => cookie.trim().startsWith('authToken='))
      if (authCookie) {
        return authCookie.split('=')[1]?.trim() || null
      }
    }
    return null
  }

  /**
   * Whether this endpoint should use the Next.js API proxy (same-origin) so the
   * server can read the httpOnly auth cookie and add the Authorization header.
   */
  private useProxyForEndpoint(endpoint: string): boolean {
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
    return path.startsWith('/api/admin') || path.startsWith('/api/auth') || path.startsWith('/api/contact')
  }

  /**
   * Build full URL from endpoint
   */
  private buildUrl(endpoint: string): string {
    // If endpoint already has the base URL, use it directly
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint
    }

    const cleanPath = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

    // Client-side: use Next.js API proxy for auth-required routes so the server
    // can read the httpOnly authToken cookie and forward it to the backend
    if (typeof window !== 'undefined' && this.useProxyForEndpoint(endpoint)) {
      return cleanPath
    }

    // Otherwise, construct from base URL
    const cleanBase = this.baseURL.replace(/\/$/, '')
    return `${cleanBase}${cleanPath}`
  }

  /**
   * Core request method with centralized error handling
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = this.buildUrl(endpoint)
    const authToken = this.getAuthToken()

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    // Add auth token if available
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`
    }

    // Add API key if available (for admin endpoints that require it)
    // Check if this is a booking endpoint that needs API key
    if (endpoint.includes('/api/bookings/') && !endpoint.includes('/my-bookings') && !endpoint.includes('/create') && !endpoint.includes('/confirm')) {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY
      if (apiKey) {
        headers['x-api-key'] = apiKey
      }
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Always include cookies for CORS
      })

      // Handle empty responses (e.g., 204 No Content)
      if (response.status === 204 || response.status === 201) {
        return undefined as T
      }

      // Handle error responses
      if (!response.ok) {
        throw await parseErrorResponse(response)
      }

      // Parse JSON response
      const text = await response.text()
      if (!text) {
        return undefined as T
      }

      try {
        return JSON.parse(text) as T
      } catch (parseError) {
        throw new ApiError('Invalid JSON response from server', response.status, { text })
      }
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' })
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' })
  }

  /**
   * DELETE request with body (for bulk operations)
   */
  async deleteWithBody<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

// API namespace for organized endpoint access
export const api = {
  // Rooms
  rooms: {
    getAll: () => {
      return apiClient.get<{ rooms?: unknown[]; pagination?: unknown } | unknown[]>('/api/rooms').then((data) => {
        // Normalize response structure
        let roomsArray: unknown[]
        if (data && typeof data === 'object' && 'rooms' in data && Array.isArray(data.rooms)) {
          roomsArray = data.rooms
        } else if (Array.isArray(data)) {
          roomsArray = data
        } else {
          return []
        }

        // Map _id to id for backward compatibility
        return roomsArray.map((room: any) => ({
          ...room,
          id: room._id || room.id,
        }))
      })
    },
    getById: (roomId: string) => {
      return apiClient.get<{ room?: unknown } | unknown>(`/api/rooms/${roomId}`).then((data) => {
        // Normalize response structure
        if (data && typeof data === 'object' && 'room' in data) {
          const room = (data as { room: any }).room
          return {
            ...room,
            id: room._id || room.id,
          }
        }
        const room = data as any
        return {
          ...room,
          id: room?._id || room?.id,
        }
      })
    },
  },

  // Bookings
  bookings: {
    getAll: () => apiClient.get('/api/bookings'),
    getById: (bookingId: string) => apiClient.get(`/api/bookings/${bookingId}`),
    getMyBookings: (params?: { page?: number; limit?: number; status?: string }) => {
      const queryParams = params ? new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)])).toString() : ''
      return apiClient.get(`/api/bookings/my-bookings${queryParams ? `?${queryParams}` : ''}`)
    },
    create: (bookingData: unknown) => apiClient.post('/api/bookings', bookingData),
    update: (bookingId: string, bookingData: unknown) =>
      apiClient.put(`/api/bookings/${bookingId}`, bookingData),
    cancel: (bookingId: string) => apiClient.post(`/api/bookings/${bookingId}/cancel`),
    delete: (bookingId: string) => apiClient.delete(`/api/bookings/${bookingId}`),
  },

  // Offers
  offers: {
    getAll: () => apiClient.get('/api/offers'),
    getById: (id: string) => apiClient.get(`/api/offers/${id}`),
    getAllAdmin: () => apiClient.get('/api/admin/offers'),
    create: (offerData: unknown) => apiClient.post('/api/admin/offers', offerData),
    update: (id: string, offerData: unknown) => apiClient.put(`/api/admin/offers/${id}`, offerData),
    delete: (id: string) => apiClient.delete(`/api/admin/offers/${id}`),
    toggle: (id: string) => apiClient.put(`/api/admin/offers/${id}/toggle`),
  },

  // Auth
  auth: {
    login: (credentials: { email: string; password: string }) =>
      apiClient.post('/api/auth/login', credentials),
    logout: () => apiClient.post('/api/auth/logout'),
    getProfile: () => apiClient.get('/api/auth/profile'),
    updateProfile: (profileData: { name?: string; phone?: string; preferences?: unknown }) =>
      apiClient.put('/api/auth/profile', profileData),
    changePassword: (passwordData: { currentPassword: string; newPassword: string }) =>
      apiClient.put('/api/auth/change-password', passwordData),
    register: (userData: unknown) => apiClient.post('/api/auth/register', userData),
  },

  // Payments
  payments: {
    createPaymentIntent: (bookingData: {
      roomId: string
      checkIn: string
      checkOut: string
      adults: number
      children?: number
      currency?: string
    }) => apiClient.post('/api/payments/create-payment-intent', bookingData),
    confirmPayment: (paymentData: {
      paymentIntentId: string
      guestInfo: unknown
      specialRequests?: string
    }) => apiClient.post('/api/payments/confirm-payment', paymentData),
    createCashBooking: (bookingData: {
      roomId: string
      checkIn: string
      checkOut: string
      adults: number
      children?: number
      totalAmount: number
      guestInfo: unknown
      specialRequests?: string
    }) => apiClient.post('/api/payments/create-cash-booking', bookingData),
    refund: (bookingId: string) => apiClient.post(`/api/payments/refund/${bookingId}`),
  },

  // Contact
  contact: {
    submit: (contactData: {
      name: string
      email: string
      phone?: string
      subject: string
      message: string
    }) => apiClient.post('/api/contact', contactData),
    // Admin contact management
    getAll: (params?: {
      status?: string
      priority?: string
      page?: number
      limit?: number
      sortBy?: string
      sortOrder?: string
    }) => {
      const queryParams = params ? new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)])).toString() : ''
      return apiClient.get(`/api/contact${queryParams ? `?${queryParams}` : ''}`)
    },
    getById: (id: string) => apiClient.get(`/api/contact/${id}`),
    updateStatus: (id: string, data: { status?: string; priority?: string; assignedTo?: string }) =>
      apiClient.patch(`/api/contact/${id}/status`, data),
    reply: (id: string, message: string) =>
      apiClient.post(`/api/contact/${id}/reply`, { message }),
    markAsRead: (id: string) => apiClient.patch(`/api/contact/${id}/read`),
    close: (id: string) => apiClient.patch(`/api/contact/${id}/close`),
    delete: (id: string) => apiClient.delete(`/api/contact/${id}`),
    getStats: () => apiClient.get('/api/contact/stats/overview'),
  },

  // Admin
  admin: {
    getDashboard: () => apiClient.get('/api/admin/dashboard'),
    getAllBookings: () => apiClient.get('/api/admin/bookings'),
    getAllRooms: () => apiClient.get('/api/admin/rooms'),
    getRoomById: (roomId: string) => apiClient.get(`/api/admin/rooms/${roomId}`),
    createRoom: (roomData: unknown) => apiClient.post('/api/admin/rooms', roomData),
    updateRoom: (roomId: string, roomData: unknown) =>
      apiClient.put(`/api/admin/rooms/${roomId}`, roomData),
    deleteRoom: (roomId: string) => apiClient.delete(`/api/admin/rooms/${roomId}`),
    getBookingById: (bookingId: string) => apiClient.get(`/api/bookings/${bookingId}`),
    updateBookingStatus: (bookingId: string, status: string, adminNotes?: string) =>
      apiClient.put(`/api/admin/bookings/${bookingId}/status`, { status, adminNotes }),
    cancelBooking: (bookingId: string, data: { cancellationReason?: string; refundAmount?: number; adminNotes?: string }) =>
      apiClient.put(`/api/admin/bookings/${bookingId}/cancel`, data),
    sendBookingEmail: (bookingId: string, data: { emailType: string; customMessage?: string }) =>
      apiClient.post(`/api/bookings/${bookingId}/send-email`, data),
    bulkDeleteBookings: (bookingIds: string[]) =>
      apiClient.deleteWithBody('/api/admin/bookings/bulk', { bookingIds }),
    bulkUpdateBookingStatus: (bookingIds: string[], status: string, adminNotes?: string) =>
      apiClient.put('/api/admin/bookings/bulk/status', { bookingIds, status, adminNotes }),
    getAnalytics: (params?: { period?: string; startDate?: string; endDate?: string }) => {
      const queryParams = params ? new URLSearchParams(params as Record<string, string>).toString() : ''
      return apiClient.get(`/api/admin/analytics${queryParams ? `?${queryParams}` : ''}`)
    },
    getRevenueReports: (period?: string) =>
      apiClient.get(`/api/admin/revenue-reports${period ? `?period=${period}` : ''}`),
    getAllUsers: () => apiClient.get<{ users?: unknown[]; pagination?: unknown } | unknown[]>('/api/admin/users'),
    getUserById: (userId: string) => apiClient.get<{ user: unknown; bookings: unknown[] }>(`/api/admin/users/${userId}`),
    updateUser: (userId: string, userData: unknown) => apiClient.put(`/api/admin/users/${userId}`, userData),
    deleteUser: (userId: string) => apiClient.delete(`/api/admin/users/${userId}`),
    createAdminUser: (userData: { name: string; email: string; password: string }) => apiClient.post('/api/admin/users/admin', userData),
    getSettings: () => apiClient.get<{ success: boolean; data: unknown }>('/api/admin/settings'),
    updateSettings: (settings: unknown) => apiClient.put<{ success: boolean; data: unknown }>('/api/admin/settings', settings),
    // Contacts management (admin only) - these reference the contact namespace defined above
    getAllContacts: (params?: {
      status?: string
      priority?: string
      page?: number
      limit?: number
      sortBy?: string
      sortOrder?: string
    }) => {
      const queryParams = params ? new URLSearchParams(Object.entries(params).filter(([_, v]) => v !== undefined).map(([k, v]) => [k, String(v)])).toString() : ''
      return apiClient.get(`/api/contact${queryParams ? `?${queryParams}` : ''}`)
    },
    getContactById: (id: string) => apiClient.get(`/api/contact/${id}`),
    updateContactStatus: (id: string, data: { status?: string; priority?: string; assignedTo?: string }) =>
      apiClient.patch(`/api/contact/${id}/status`, data),
    replyToContact: (id: string, message: string) =>
      apiClient.post(`/api/contact/${id}/reply`, { message }),
    markContactAsRead: (id: string) => apiClient.patch(`/api/contact/${id}/read`),
    closeContact: (id: string) => apiClient.patch(`/api/contact/${id}/close`),
    deleteContact: (id: string) => apiClient.delete(`/api/contact/${id}`),
    getContactStats: () => apiClient.get('/api/contact/stats/overview'),
    // Guest management
    getGuestByEmail: (email: string) => apiClient.get<{ guest: unknown; bookings: unknown[] }>(`/api/admin/guests/${encodeURIComponent(email)}`),
    updateGuest: (email: string, data: unknown) => apiClient.put(`/api/admin/guests/${encodeURIComponent(email)}`, data),
    deleteGuest: (email: string) => apiClient.delete(`/api/admin/guests/${encodeURIComponent(email)}`),
  },

  // Availability
  availability: {
    getMonthlyAvailability: (roomId: string, month: number, year: number) =>
      apiClient.get(`/api/availability/monthly/${roomId}?month=${month}&year=${year}`),
    getCalendarAvailability: (month: number, year: number) =>
      apiClient.get(`/api/availability/calendar?month=${month}&year=${year}`),
    getAvailabilityOverview: () => apiClient.get('/api/availability/overview'),
    getRoomAvailability: (roomId: string, startDate: string, endDate: string) =>
      apiClient.get(`/api/availability/room/${roomId}?date=${startDate}`),
  },
}

