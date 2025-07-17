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

// Minimal roomsAPI for getRooms compatibility
const roomsAPI = {
  getAll: async () => {
    return apiRequest('/api/rooms');
  }
};

export const getRooms = () => roomsAPI.getAll(); 