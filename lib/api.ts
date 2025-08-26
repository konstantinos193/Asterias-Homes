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
    // Call backend directly for payment intent creation
    const response = await fetch('https://asterias-backend.onrender.com/api/payments/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  confirmPayment: async (paymentData: {
    paymentIntentId: string;
    guestInfo: any;
    specialRequests?: string;
  }) => {
    // Call backend directly for payment confirmation
    const response = await fetch('https://asterias-backend.onrender.com/api/payments/confirm-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  createCashBooking: async (bookingData: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children?: number;
    totalAmount: number;
    guestInfo: any;
    specialRequests?: string;
  }) => {
    // Call backend directly for cash booking creation
    const response = await fetch('https://asterias-backend.onrender.com/api/payments/create-cash-booking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
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
    const response = await fetch('https://asterias-backend.onrender.com/api/rooms');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // Backend returns { rooms: [...] }, so we need to handle that structure
    const roomsArray = data.rooms || data;
    // Map _id to id for backward compatibility
    return roomsArray.map((room: any) => ({
      ...room,
      id: room._id
    }));
  }
};

export const calendarAPI = {
  // Get monthly availability for a specific room
  getMonthlyAvailability: async (roomId: string, month: number, year: number) => {
    const response = await fetch(`https://asterias-backend.onrender.com/api/availability/monthly/${roomId}?month=${month}&year=${year}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  
  // Get calendar availability data for frontend calendar component (aggregated across all rooms)
  getCalendarAvailability: async (month: number, year: number) => {
    const response = await fetch(`https://asterias-backend.onrender.com/api/availability/calendar?month=${month}&year=${year}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  
  // Get availability overview for dashboard
  getAvailabilityOverview: async () => {
    const response = await fetch('https://asterias-backend.onrender.com/api/availability/overview');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  },
  
  // Get room availability for a specific date range
  getRoomAvailability: async (roomId: string, startDate: string, endDate: string) => {
    const response = await fetch(`https://asterias-backend.onrender.com/api/availability/room/${roomId}?date=${startDate}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};

export const getRooms = () => roomsAPI.getAll(); 