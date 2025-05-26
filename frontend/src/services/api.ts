import axios from 'axios';

// Types
export interface LoginResponse {
  message: string;
  userId: number;
  email: string;
  name: string;
  role: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Enable sending credentials with requests
});

// Intercept requests to add auth header
api.interceptors.request.use((config) => {
  const credentials = localStorage.getItem('credentials');
  if (credentials && !config.headers['Authorization']) {
    config.headers['Authorization'] = `Basic ${credentials}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Intercept responses to handle auth errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear invalid credentials
      localStorage.removeItem('credentials');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const users = {
  login: async (credentials: { email: string; password: string }) => {
    const authString = btoa(`${credentials.email}:${credentials.password}`);
    
    try {
      const response = await api.get<LoginResponse>('/auth/check', {
        headers: { 'Authorization': `Basic ${authString}` }
      });
      // Store credentials only after successful login
      localStorage.setItem('credentials', authString);
      return response;
    } catch (error) {
      throw error;
    }
  },
  
  register: (userData: { name: string; email: string; password: string; role: string }) =>
    api.post<{ message: string }>('/auth/register', userData),
  
  logout: () => {
    localStorage.removeItem('credentials');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    delete api.defaults.headers.common['Authorization'];
    return Promise.resolve();
  },
  
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData: any) => api.put('/users/profile', userData),
};

export const trips = {
  getAll: (userId: number) => api.get(`/trips/user/${userId}`),
  getById: (id: number) => api.get(`/trips/${id}`),
  create: (tripData: any) => api.post('/trips/createTrip', tripData),
  update: (id: number, tripData: any) => api.put(`/trips/${id}`, tripData),
  delete: (id: number) => api.delete(`/trips/${id}`),
};

export const activities = {
  getAll: (tripId: number) => api.get(`/activities/trip/${tripId}`),
  getById: (id: number) => api.get(`/activities/${id}`),
  create: (activityData: any) => api.post('/activities/addActivity', activityData),
  update: (id: number, activityData: any) => api.put(`/activities/${id}`, activityData),
  delete: (id: number) => api.delete(`/activities/${id}`),
};

export const accommodations = {
  getAll: (tripId: number) => api.get(`/accommodations/trip/${tripId}`),
  getById: (id: number) => api.get(`/accommodations/${id}`),
  create: (accommodationData: any) => api.post('/accommodations', accommodationData),
  update: (id: number, accommodationData: any) => api.put(`/accommodations/${id}`, accommodationData),
  delete: (id: number) => api.delete(`/accommodations/${id}`),
};

export const transport = {
  getAll: (tripId: number) => api.get(`/transports/trip/${tripId}`),
  getById: (id: number) => api.get(`/transports/trip/${id}`),
  create: (transportData: any) => api.post('/transports/addTransport', transportData),
  update: (id: number, transportData: any) => api.put(`/transports/${id}`, transportData),
  delete: (id: number) => api.delete(`/transports/${id}`),
};

export const weather = {
  getCurrentWeather: (city: string) => api.get(`/weather/current/${city}`),
  getForecast: (city: string, days: number = 5) => api.get(`/weather/forecast/${city}?days=${days}`),
};

export default api;
