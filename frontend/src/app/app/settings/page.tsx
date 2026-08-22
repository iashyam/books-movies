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
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Settings</h2>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 max-w-md">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Authentication</h3>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {auth.isAuthenticated ? 'Logged in as admin' : 'Not logged in'}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">API Base URL</p>
            <p className="text-base font-mono text-gray-900 dark:text-white break-all">{API_BASE_URL}</p>
          </div>

          {auth.isAuthenticated && (
            <button
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
