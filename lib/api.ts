// API utility for backend communication using Next.js API proxy routes
const API_BASE_URL = '';

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Always include cookies
    ...options,
  };
  
  const response = await fetch(url, config);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const authAPI = {
  login: async (credentials: { email: string; password: string }) => {
    return apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  logout: async () => {
    await apiRequest('/api/auth/logout', { method: 'POST' });
  },
  getProfile: async () => {
    return apiRequest('/api/auth/profile');
  },
};

export const paymentsAPI = {
  createPaymentIntent: async (bookingData: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children?: number;
    currency?: string;
  }) => {
    // Use backend endpoint through admin proxy for proper database integration
    return apiRequest('/api/admin/payments/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },
  confirmPayment: async (paymentData: {
    paymentIntentId: string;
    guestInfo: any;
    specialRequests?: string;
  }) => {
    // Determine language from URL or use default
    const urlPath = window.location.pathname;
    const pathLang = urlPath.startsWith('/en') ? 'en' : urlPath.startsWith('/de') ? 'de' : 'el';
    
    return apiRequest('/api/confirm-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': `${pathLang},${navigator.language || 'el'},el;q=0.9`
      }
    });
  }
};

export const adminAPI = {
  getDashboard: async () => {
    return apiRequest('/api/admin/dashboard');
  },
  getAllBookings: async () => {
    return apiRequest('/api/admin/bookings');
  },
  getAllRooms: async () => {
    return apiRequest('/api/admin/rooms');
  },
  updateBookingStatus: async (bookingId: string, status: string) => {
    return apiRequest(`/api/admin/bookings/${bookingId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
  getAnalytics: async (params?: { period?: string; startDate?: string; endDate?: string }) => {
    const queryParams = new URLSearchParams(params).toString();
    return apiRequest(`/api/admin/analytics${queryParams ? `?${queryParams}` : ''}`);
  },
  getRevenueReports: async (period?: string) => {
    return apiRequest(`/api/admin/revenue-reports${period ? `?period=${period}` : ''}`);
  },
  getAllUsers: async () => {
    return apiRequest('/api/admin/users');
  },
  deleteRoom: async (roomId: string) => {
    return apiRequest(`/api/admin/rooms/${roomId}`, {
      method: 'DELETE',
    });
  },
  createRoom: async (roomData: any) => {
    return apiRequest('/api/admin/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  },
  updateRoom: async (roomId: string, roomData: any) => {
    return apiRequest(`/api/admin/rooms/${roomId}`, {
      method: 'PUT',
      body: JSON.stringify(roomData),
    });
  },
};

export const offersAPI = {
  getAll: async () => {
    return apiRequest('/api/offers');
  },
  getById: async (id: string) => {
    return apiRequest(`/api/offers/${id}`);
  },
  getAllAdmin: async () => {
    return apiRequest('/api/admin/offers');
  },
  create: async (offerData: any) => {
    return apiRequest('/api/admin/offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    });
  },
  delete: async (id: string) => {
    return apiRequest(`/api/admin/offers/${id}`, {
      method: 'DELETE',
    });
  },
  toggle: async (id: string) => {
    return apiRequest(`/api/admin/offers/${id}/toggle`, {
      method: 'PUT',
    });
  },
};

export const contactAPI = {
  submit: async (contactData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => {
    return apiRequest('/api/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  }
};

export const roomsAPI = {
  getAll: async () => {
    const rooms = await apiRequest('/api/rooms');
    // Map _id to id for backward compatibility
    return rooms.map((room: any) => ({
      ...room,
      id: room._id
    }));
  }
};

export const calendarAPI = {
  // Get monthly availability for a specific room
  getMonthlyAvailability: async (roomId: string, month: number, year: number) => {
    return apiRequest(`/api/availability/monthly/${roomId}?month=${month}&year=${year}`);
  },
  
  // Get calendar availability data for frontend calendar component
  getCalendarAvailability: async (roomId: string, month: number, year: number) => {
    return apiRequest(`/api/availability/calendar/${roomId}?month=${month}&year=${year}`);
  },
  
  // Get availability overview for dashboard
  getAvailabilityOverview: async () => {
    return apiRequest('/api/availability/overview');
  },
  
  // Get room availability for a specific date range
  getRoomAvailability: async (roomId: string, startDate: string, endDate: string) => {
    return apiRequest(`/api/availability/room/${roomId}?date=${startDate}`);
  }
};

export const getRooms = () => roomsAPI.getAll(); 