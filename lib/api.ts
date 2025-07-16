// API service for communicating with the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to make API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  const response = await fetch(url, config);
  return handleResponse(response);
};

// Authentication API
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials: { email: string; password: string }) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    // Store token in localStorage
    if (response.token) {
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('refreshToken', response.refreshToken);
    }
    
    return response;
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    }
  },

  getProfile: async () => {
    return apiRequest('/auth/profile');
  },

  updateProfile: async (profileData: any) => {
    return apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// Rooms API
export const roomsAPI = {
  getAll: async (params?: {
    available?: boolean;
    minPrice?: number;
    maxPrice?: number;
    capacity?: number;
    features?: string[];
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            searchParams.append(key, value.join(','));
          } else {
            searchParams.append(key, String(value));
          }
        }
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/rooms?${queryString}` : '/rooms';
    return apiRequest(endpoint);
  },

  getById: async (id: string) => {
    return apiRequest(`/rooms/${id}`);
  },

  checkAvailability: async (roomId: string, checkIn: string, checkOut: string) => {
    return apiRequest(`/rooms/${roomId}/availability?checkIn=${checkIn}&checkOut=${checkOut}`);
  },
};

// Bookings API
export const bookingsAPI = {
  create: async (bookingData: {
    roomId: string;
    guestInfo: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    checkIn: string;
    checkOut: string;
    adults: number;
    children?: number;
    paymentMethod: 'CARD' | 'CASH';
    totalAmount: number;
    specialRequests?: string;
  }) => {
    return apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  getMyBookings: async () => {
    return apiRequest('/bookings/my-bookings');
  },

  getById: async (id: string) => {
    return apiRequest(`/bookings/${id}`);
  },

  cancel: async (id: string) => {
    return apiRequest(`/bookings/${id}/cancel`, {
      method: 'POST',
    });
  },
};

// Offers API
export const offersAPI = {
  getAll: async () => {
    return apiRequest('/offers');
  },

  getById: async (id: string) => {
    return apiRequest(`/offers/${id}`);
  },

  validateCode: async (code: string) => {
    return apiRequest('/offers/validate-code', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },
};

// Contact API
export const contactAPI = {
  submit: async (contactData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) => {
    return apiRequest('/contact', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },
};

// Payments API
export const paymentsAPI = {
  createPaymentIntent: async (paymentData: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    adults: number;
    children?: number;
    currency?: string;
  }) => {
    return apiRequest('/payments/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  confirmPayment: async (paymentData: {
    paymentIntentId: string;
    bookingData: any;
  }) => {
    return apiRequest('/payments/confirm-payment', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
};

// Admin API (requires admin authentication)
export const adminAPI = {
  getDashboard: async () => {
    return apiRequest('/admin/dashboard');
  },

  getStats: async () => {
    return apiRequest('/admin/stats');
  },

  // Room management
  getAllRooms: async (params?: any) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/rooms?${queryString}` : '/rooms';
    return apiRequest(endpoint);
  },

  createRoom: async (roomData: any) => {
    return apiRequest('/rooms', {
      method: 'POST',
      body: JSON.stringify(roomData),
    });
  },

  updateRoom: async (id: string, roomData: any) => {
    return apiRequest(`/rooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(roomData),
    });
  },

  deleteRoom: async (id: string) => {
    return apiRequest(`/rooms/${id}`, {
      method: 'DELETE',
    });
  },

  // Booking management
  getAllBookings: async (params?: any) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/bookings?${queryString}` : '/bookings';
    return apiRequest(endpoint);
  },

  updateBookingStatus: async (id: string, status: string) => {
    return apiRequest(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Offer management
  createOffer: async (offerData: any) => {
    return apiRequest('/offers', {
      method: 'POST',
      body: JSON.stringify(offerData),
    });
  },

  updateOffer: async (id: string, offerData: any) => {
    return apiRequest(`/offers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(offerData),
    });
  },

  deleteOffer: async (id: string) => {
    return apiRequest(`/offers/${id}`, {
      method: 'DELETE',
    });
  },

  toggleOffer: async (id: string) => {
    return apiRequest(`/offers/${id}/toggle`, {
      method: 'PATCH',
    });
  },

  // Contact management
  getAllContacts: async (params?: any) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/contact?${queryString}` : '/contact';
    return apiRequest(endpoint);
  },

  updateContactStatus: async (id: string, status: string) => {
    return apiRequest(`/contact/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  replyToContact: async (id: string, reply: string) => {
    return apiRequest(`/contact/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ reply }),
    });
  },

  // User management
  getAllUsers: async (params?: any) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/admin/users?${queryString}` : '/admin/users';
    return apiRequest(endpoint);
  },

  updateUser: async (id: string, userData: any) => {
    return apiRequest(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  deleteUser: async (id: string) => {
    return apiRequest(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  },
}; 