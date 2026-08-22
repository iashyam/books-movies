'use client';

import { createContext, useEffect, useState } from 'react';
import { getToken, setToken, clearToken } from '@/lib/auth';

export interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);

  // Hydrate from localStorage on mount (SSR/static render has no localStorage,
  // so token starts null and updates once mounted in the browser)
  useEffect(() => {
    const stored = getToken();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing React state from localStorage, unavailable during SSR/static render
    setTokenState(stored);
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
