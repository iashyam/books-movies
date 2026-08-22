'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 h-14 border-b border-border bg-surface shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-foreground rounded-lg hover:bg-background transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="font-logo text-lg text-foreground">Shyam's Shelf</h1>
        </div>

        <main className="flex-1 flex flex-col overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
