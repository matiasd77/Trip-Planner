import api from './api';

class AuthService {
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          email: response.email,
          role: response.role
        }));
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          email: response.email,
          role: response.role
        }));
      }
      return response;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    return JSON.parse(userStr);
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  // For protected routes
  async checkAuthStatus() {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('No user found');
      // You could make an API call here to validate the token
      return user;
    } catch (error) {
      this.logout();
      throw error;
    }
  }
}

export default new AuthService();
