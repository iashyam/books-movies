'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLogin, useLogout } from '@/lib/queries';
import { ApiError } from '@/lib/api';

interface AvatarMenuProps {
  onClose: () => void;
}

export function AvatarMenu({ onClose }: AvatarMenuProps) {
  const auth = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const loginMutation = useLogin();
  const logoutMutation = useLogout();

  const handleLogin = async () => {
    setError('');
    try {
      const result = await loginMutation.mutateAsync(password);
      auth.login(result.token);
      setPassword('');
      setShowPassword(false);
      onClose();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Login failed');
      }
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      auth.logout();
      onClose();
    } catch {
      auth.logout();
      onClose();
    }
  };

  if (auth.isAuthenticated) {
    return (
      <div className="absolute right-0 mt-2 w-52 bg-surface border border-border rounded-xl shadow-lg p-4 z-40">
        <p className="text-sm text-muted mb-3">Logged in as admin</p>
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    );
  }

  if (showPassword) {
    return (
      <div className="absolute right-0 mt-2 w-60 bg-surface border border-border rounded-xl shadow-lg p-4 z-40">
        <p className="text-sm font-medium text-foreground mb-3">Admin Password</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="Enter password"
          autoFocus
          className="w-full px-3 py-2 mb-3 border border-border rounded-lg bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
        {error && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleLogin}
            disabled={loginMutation.isPending || !password}
            className="flex-1 px-3 py-2 bg-accent text-accent-foreground rounded-lg font-medium text-sm hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loginMutation.isPending ? '...' : 'Login'}
          </button>
          <button
            onClick={() => {
              setShowPassword(false);
              setPassword('');
              setError('');
            }}
            className="flex-1 px-3 py-2 bg-background text-foreground rounded-lg font-medium text-sm hover:bg-border/40 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-lg p-3 z-40">
      <button
        onClick={() => setShowPassword(true)}
        className="w-full px-4 py-2 bg-accent text-accent-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
      >
        Login
      </button>
    </div>
  );
}
