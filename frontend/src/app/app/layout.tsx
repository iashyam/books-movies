'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { useEntityList } from '@/lib/queries';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Prefetch all entity lists so Sidebar counts are available
  useEntityList('movies');
  useEntityList('books');
  useEntityList('shows');

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>
    </div>
  );
}
