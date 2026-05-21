import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string | null;
  phone: string | null;
  is_admin: boolean;
  name?: string; // fallback
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (token: string) => {
    try {
      const response = await axios.get('http://localhost:8004/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser({ ...response.data, name: response.data.first_name });
    } catch (e) {
      console.error('Error fetching profile', e);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('user_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          fetchProfile(token);
        } else {
          logout();
          setIsLoading(false);
        }
      } catch (e) {
        logout();
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem('user_token', token);
    fetchProfile(token);
  };

  const logout = () => {
    localStorage.removeItem('user_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
