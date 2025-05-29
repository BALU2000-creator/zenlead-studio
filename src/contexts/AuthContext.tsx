import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';

// Define the shape of the user data and auth state
interface User {
  _id: string;
  firstName: string;
  lastName:string;
  email: string;
  credits: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email_param: string, password_param: string) => Promise<void>; // Will be properly typed later with authService
  logout: () => void;
}

// Create the context with a default undefined value
const AuthContext = createContext<AuthState | undefined>(undefined);

// Define the props for the AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Effect to load token and user from localStorage on initial mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    // Optional: Add logic here to validate token with backend if necessary
  }, []);

  const login = async (email_param: string, password_param: string) => {
    setIsLoading(true);
    try {
      // Call the actual authService
      const { user: userData, access_token } = await authService.loginUser(email_param, password_param);
      
      setUser(userData);
      setToken(access_token);
      localStorage.setItem('authToken', access_token);
      localStorage.setItem('authUser', JSON.stringify(userData));
      
      // Optionally log success for debugging
      console.log("AuthContext: Login successful, user and token set.");

    } catch (error) {
      console.error("AuthContext: Login failed:", error);
      // Clear any partial state if login fails
      setUser(null);
      setToken(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      // Re-throw error so UI components can catch it and display messages
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    // Optional: Call a backend logout endpoint if available
    console.log("AuthContext: User logged out");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!token, // True if token exists
      isLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthState => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
