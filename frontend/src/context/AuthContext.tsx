import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<AuthContextType['user']>(null);

  useEffect(() => {
    // Check if user data exists in localStorage on component mount
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    const token = localStorage.getItem('token');

    // Only set as authenticated if we have all required data
    if (userId && userName && userEmail && userRole && token) {
      setUser({
        id: parseInt(userId),
        name: userName,
        email: userEmail,
        role: userRole
      });
      setIsAuthenticated(true);
    } else {
      // Clear any incomplete data
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userRole');
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    }
    
    // Set loading to false after checking authentication
    setIsLoading(false);
  }, []);

  const login = (userData: any) => {
    // Store user data in localStorage
    localStorage.setItem('userId', userData.userId.toString());
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('token', userData.token || 'dummy-token'); // Store token or dummy token

    // Update context state
    setUser({
      id: userData.userId,
      name: userData.name,
      email: userData.email,
      role: userData.role
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token'); // Clear any stored JWT tokens

    // Update context state
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect to home page
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
