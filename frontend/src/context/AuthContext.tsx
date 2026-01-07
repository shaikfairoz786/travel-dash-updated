import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from "../config/api"; // ✅ Added this line

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  session: { access_token: string } | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => void;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Storage keys for authentication
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    return null;
  });

  const [session, setSession] = useState<{ access_token: string } | null>(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    return storedToken ? { access_token: storedToken } : null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      
      if (token && !user) {
        // Token exists but user not loaded, fetch user profile
        await fetchUserProfile(token);
      } else if (!token) {
        // No token, user is not authenticated
        setIsLoading(false);
      } else {
        // User already loaded from localStorage, ensure session is set
        if (token && !session) {
          setSession({ access_token: token });
        }
        setIsLoading(false);
      }

      // Check for Google login token in URL
      const urlParams = new URLSearchParams(window.location.search);
      const googleToken = urlParams.get('token');
      if (googleToken) {
        // Remove token from URL
        window.history.replaceState({}, document.title, window.location.pathname);
        await handleGoogleLoginSuccess(googleToken);
      }
    };

    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setSession({ access_token: token });
        setIsLoading(false);
        return data.user;
      } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setUser(null);
        setSession(null);
        setIsLoading(false);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      setSession(null);
      setIsLoading(false);
      return null;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem(TOKEN_KEY, data.accessToken);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        setUser(data.user);
        setSession({ access_token: data.accessToken });

        navigate(data.user.role === 'admin' ? '/admin/dashboard' : '/');
        return true;
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error', error);
      alert('An error occurred during login.');
      return false;
    }
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      if (response.ok) {
        alert('Registration successful! You can now log in.');
        navigate('/login');
        return true;
      } else {
        const errorData = await response.json();
        alert(errorData.error || 'Registration failed');
        return false;
      }
    } catch (error) {
      console.error('Registration error', error);
      alert('An error occurred during registration.');
      return false;
    }
  };

  const loginWithGoogle = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  const handleGoogleLoginSuccess = async (token: string) => {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      setSession({ access_token: token });

      // Fetch user profile
      const fetchedUser = await fetchUserProfile(token);

      if (fetchedUser) {
        // Navigate based on role (skip phone verification)
        navigate(fetchedUser.role === 'admin' ? '/admin/dashboard' : '/');
      }
    } catch (error) {
      console.error('Google login error', error);
      alert('An error occurred during Google login.');
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
      setSession(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  const value = {
    user,
    session,
    login,
    loginWithGoogle,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
