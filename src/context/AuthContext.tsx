'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, AuthState } from '@/types';

interface AuthContextValue extends AuthState {
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null });

  useEffect(() => {
    const raw = localStorage.getItem('elevens_auth');
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setState({ user: parsed.user, token: parsed.token });
      } catch {
        localStorage.removeItem('elevens_auth');
      }
    }
  }, []);

  const login = (token: string, user: User) => {
    localStorage.setItem('elevens_auth', JSON.stringify({ token, user }));
    setState({ token, user });
  };

  const logout = () => {
    localStorage.removeItem('elevens_auth');
    setState({ user: null, token: null });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
