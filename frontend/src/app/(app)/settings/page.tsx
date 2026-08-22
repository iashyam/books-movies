'use client';

import { useAuth } from '@/hooks/useAuth';
import { useLogout } from '@/lib/queries';
import { API_BASE_URL } from '@/lib/constants';

export default function SettingsPage() {
  const auth = useAuth();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      auth.logout();
    } catch {
      auth.logout();
    }
  };

  return (
    <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
      <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-8">Settings</h2>

      <div className="bg-surface rounded-2xl border border-border p-6 max-w-md shadow-sm">
        <h3 className="text-base font-semibold text-foreground mb-5">Authentication</h3>

        <div className="space-y-5">
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">Status</p>
            <p className="text-sm font-medium text-foreground">
              {auth.isAuthenticated ? 'Logged in as admin' : 'Not logged in'}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-wide mb-1">API Base URL</p>
            <p className="text-sm font-mono text-foreground break-all">{API_BASE_URL}</p>
          </div>

          {auth.isAuthenticated && (
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
