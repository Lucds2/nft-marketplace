/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  wallets?: Array<{ id: string; address: string; network: string; isPrimary?: boolean }>;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: { name: string; email: string; password?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('@NFTMarketplace:token'));
  const [isLoading, setIsLoading] = useState(true);

  // Função declarada com useCallback ANTES de ser chamada no useEffect
  const logoutState = useCallback(() => {
    localStorage.removeItem('@NFTMarketplace:token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
  }, []);

  useEffect(() => {
    async function loadStoredAuth() {
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          // Alterado de '/api/auth/me' para '/auth/me'
          const response = await api.get<User>('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error('Falha ao restaurar sessão:', error);
          logoutState();
        }
      }
      setIsLoading(false);
    }

    loadStoredAuth();
  }, [token, logoutState]);

  const login = async (email: string, password = '123456') => {
    // Alterado de '/api/auth/login' para '/auth/login'
    const response = await api.post<{ user: User; token: string }>('/auth/login', {
      email,
      password,
    });

    const { user: loggedUser, token: authToken } = response.data;

    localStorage.setItem('@NFTMarketplace:token', authToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

    setToken(authToken);
    setUser(loggedUser);
  };

  const register = async (data: { name: string; email: string; password?: string }) => {
    // Alterado de '/api/auth/register' para '/auth/register'
    const response = await api.post<{ user: User; token: string }>('/auth/register', data);

    const { user: newUser, token: authToken } = response.data;

    localStorage.setItem('@NFTMarketplace:token', authToken);
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

    setToken(authToken);
    setUser(newUser);
  };

  const logout = async () => {
    try {
      // Alterado de '/api/auth/logout' para '/auth/logout'
      await api.post('/auth/logout');
    } catch {
      // Ignora erro na API de logout para garantir a limpeza local
    } finally {
      logoutState();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}