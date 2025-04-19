"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { clientStorage, parseJwt } from '@/lib/client-utils';
import { userService } from '@/lib/api';

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in (token exists)
    const token = clientStorage.getItem('token');
    if (token) {
      try {
        // Try to get user data from localStorage first
        const savedUserData = clientStorage.getItem('user');
        if (savedUserData) {
          const userData = JSON.parse(savedUserData);
          setUser(userData);
        } else {
          // If no user data in localStorage, try to decode the token
          const decodedToken = parseJwt(token);
          if (decodedToken && decodedToken.id) {
            // Set basic user info from token
            setUser({
              id: decodedToken.id,
              name: decodedToken.name || '',
              email: decodedToken.email || '',
              role: decodedToken.role || 'user'
            });
          }
        }
      } catch (err) {
        // Clear invalid data
        clientStorage.removeItem('token');
        clientStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await authService.login(email, password);
      
      if (result.token) {
        // Parse JWT token to get user ID and basic data
        const decodedToken = parseJwt(result.token);
        
        if (decodedToken && decodedToken.id) {
          try {
            // Fetch complete user data using the ID from the token
            const userResponse = await userService.getOne(decodedToken.id);
            
            if (userResponse && userResponse.data) {
              // Remove sensitive data before storing
              const { password, ...userData } = userResponse.data;
              
              // Store user data
              clientStorage.setItem('user', JSON.stringify(userData));
              setUser(userData);
              
              // Redirect based on role
              if (userData.role === 'admin') {
                router.push('/admin/dashboard');
              } else {
                router.push('/dashboard');
              }
            }
          } catch (fetchError) {
            console.error('Error fetching user data:', fetchError);
            // Fallback to using basic data from token
            const basicUserData = {
              id: decodedToken.id,
              name: decodedToken.name || '',
              email: decodedToken.email || '',
              role: decodedToken.role || 'user'
            };
            clientStorage.setItem('user', JSON.stringify(basicUserData));
            setUser(basicUserData);
            
            // Redirect based on role
            if (basicUserData.role === 'admin') {
              router.push('/admin/dashboard');
            } else {
              router.push('/dashboard');
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(name, email, password, confirmPassword);
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    clientStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, isAdmin }}>
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