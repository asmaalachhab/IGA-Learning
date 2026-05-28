import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  firstName?: string;
  lastName?: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  updateStoredUser: (partial: Partial<User>) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('iga_token');
    const storedUser = localStorage.getItem('iga_user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(normalizeUser(JSON.parse(storedUser)));
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoading(false);
  }, []);

  const normalizeUser = (raw: any): User => ({
    ...raw,
    name: raw?.name || `${raw?.firstName || ''} ${raw?.lastName || ''}`.trim() || raw?.email || 'Utilisateur IGA',
    role: String(raw?.role || 'STUDENT').toUpperCase() as User['role'],
  });

  const handleAuthResult = (data: any) => {
    if (data.token) {
      setToken(data.token);
      localStorage.setItem('iga_token', data.token);
    }
    if (data.user) {
      const normalized = normalizeUser(data.user);
      setUser(normalized);
      localStorage.setItem('iga_user', JSON.stringify(normalized));
    }
  };

  const login = async (email: string, pass: string) => {
    const data = await api.login(email, pass);
    handleAuthResult(data);
  };

  const register = async (name: string, email: string, pass: string) => {
    const data = await api.register(name, email, pass);
    // Usually register might not return token directly, if so redirect to login
    // Our Java API seems to return user but maybe not token. Let's force a login after or check if token is there
    if (data.token) {
        handleAuthResult(data);
    } else if (data.user) {
        const normalized = normalizeUser(data.user);
        setUser(normalized);
        localStorage.setItem('iga_user', JSON.stringify(normalized));
    }
  };

  const updateStoredUser = (partial: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = normalizeUser({ ...prev, ...partial, role: prev.role });
      localStorage.setItem('iga_user', JSON.stringify(next));
      return next;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('iga_token');
    localStorage.removeItem('iga_user');
    window.location.href = '/connexion';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateStoredUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
