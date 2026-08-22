'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film, BookOpen, Tv, Settings, X } from 'lucide-react';
import clsx from 'clsx';
import { useEntityList } from '@/lib/queries';
import { MY_LISTS } from '@/lib/constants';
import { Movie, Book } from '@/types/models';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: movies = [] } = useEntityList('movies');
  const { data: books = [] } = useEntityList('books');

  const getMyListCount = (resource: string, status: string) => {
    if (resource === 'movies') {
      const typedMovies = (movies as Movie[]) || [];
      return typedMovies.filter((m) => m.status === status).length;
    }
    if (resource === 'books') {
      const typedBooks = (books as Book[]) || [];
      return typedBooks.filter((b) => b.status === status).length;
    }
    return 0;
  };

  const navItems = [
    { href: '/movies', icon: Film, label: 'Movies', active: pathname?.startsWith('/movies') },
    { href: '/books', icon: BookOpen, label: 'Books', active: pathname?.startsWith('/books') },
    { href: '/shows', icon: Tv, label: 'Shows', active: pathname?.startsWith('/shows') },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          onClick={onClose}
          aria-label="Close menu"
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={clsx(
          'w-64 bg-surface border-r border-border flex flex-col h-screen shrink-0',
          'fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-out',
          'md:static md:z-auto md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="px-7 py-7 flex items-center justify-between">
          <h1 className="font-serif text-2xl text-foreground tracking-tight">shelf.</h1>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 text-muted hover:text-foreground rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={clsx(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  item.active
                    ? 'bg-accent text-accent-foreground'
                    : 'text-muted hover:bg-background hover:text-foreground'
                )}
              >
                <Icon size={18} strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* My Lists */}
        <div className="px-7 py-5 mt-4">
          <h3 className="text-[11px] font-semibold text-muted uppercase tracking-widest mb-3">
            My Lists
          </h3>
          <div className="space-y-2.5">
            {MY_LISTS.map((list) => (
              <div key={list.label} className="flex items-center justify-between text-sm">
                <span className="text-foreground/80">{list.label}</span>
                <span className="text-xs font-semibold text-muted bg-background px-2 py-0.5 rounded-full">
                  {getMyListCount(list.resource, list.status)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="px-4 py-4 border-t border-border">
          <Link
            href="/settings"
            onClick={onClose}
            className={clsx(
              'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors',
              pathname?.startsWith('/settings')
                ? 'bg-accent text-accent-foreground'
                : 'text-muted hover:bg-background hover:text-foreground'
            )}
          >
            <Settings size={18} strokeWidth={2} />
            Settings
          </Link>
        </div>
      </aside>
    </>
  );
}
