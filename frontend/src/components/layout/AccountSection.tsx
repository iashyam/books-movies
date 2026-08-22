'use client';

import { useState } from 'react';
import { LogIn, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLogin, useLogout } from '@/lib/queries';
import { ApiError } from '@/lib/api';

export function AccountSection() {
  const auth = useAuth();
  const [showForm, setShowForm] = useState(false);
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
      setShowForm(false);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Login failed');
    }
  };

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch {
      // token may already be invalid server-side; clear locally regardless
    } finally {
      auth.logout();
    }
  };

  if (auth.isAuthenticated) {
    return (
      <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted">
        <span className="flex items-center gap-3">
          <User size={18} strokeWidth={2} />
          Admin
        </span>
        <button
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
          className="text-xs font-medium text-muted hover:text-foreground transition-colors disabled:opacity-50"
        >
          {logoutMutation.isPending ? '...' : 'Logout'}
        </button>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="px-3.5 py-2 space-y-2">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          placeholder="Admin password"
          autoFocus
          className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/20"
        />
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleLogin}
            disabled={loginMutation.isPending || !password}
            className="flex-1 px-3 py-1.5 bg-accent text-accent-foreground rounded-lg text-xs font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {loginMutation.isPending ? '...' : 'Login'}
          </button>
          <button
            onClick={() => {
              setShowForm(false);
              setPassword('');
              setError('');
            }}
            className="flex-1 px-3 py-1.5 bg-background text-foreground rounded-lg text-xs font-medium hover:bg-border/40 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowForm(true)}
      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-muted hover:bg-background hover:text-foreground transition-colors"
    >
      <LogIn size={18} strokeWidth={2} />
      Login
    </button>
  );
}
