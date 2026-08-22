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
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = getToken();
    // eslint-disable-next-line
    setTokenState(stored);
    // eslint-disable-next-line
    setIsHydrated(true);
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    setTokenState(newToken);
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
  };

  // Don't render until we've checked localStorage
  if (!isHydrated) {
    return <>{children}</>;
  }

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
