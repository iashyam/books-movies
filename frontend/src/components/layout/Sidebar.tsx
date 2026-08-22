'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Film, BookOpen, Tv, Settings } from 'lucide-react';
import clsx from 'clsx';
import { useEntityList } from '@/lib/queries';
import { MY_LISTS } from '@/lib/constants';

export function Sidebar() {
  const pathname = usePathname();
  const { data: movies = [] } = useEntityList('movies');
  const { data: books = [] } = useEntityList('books');

  const getMyListCount = (resource: string, status: string) => {
    if (resource === 'movies') {
      return movies.filter((m) => m.status === status).length;
    }
    if (resource === 'books') {
      return books.filter((b) => b.status === status).length;
    }
    return 0;
  };

  const navItems = [
    { href: '/app/movies', icon: Film, label: 'Movies', active: pathname?.startsWith('/app/movies') },
    { href: '/app/books', icon: BookOpen, label: 'Books', active: pathname?.startsWith('/app/books') },
    { href: '/app/shows', icon: Tv, label: 'Shows', active: pathname?.startsWith('/app/shows') },
  ];

  return (
    <aside className="w-56 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen">
      {/* Logo */}
      <div className="px-6 py-8 border-b border-gray-200 dark:border-gray-800">
        <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white">shelf.</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                item.active
                  ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
                  : 'text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              )}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* My Lists */}
      <div className="px-6 py-6 border-t border-gray-200 dark:border-gray-800">
        <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-3">
          My Lists
        </h3>
        <div className="space-y-2">
          {MY_LISTS.map((list) => (
            <div key={list.label} className="flex items-center justify-between text-sm">
              <span className="text-gray-700 dark:text-gray-300">{list.label}</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {getMyListCount(list.resource, list.status)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800">
        <Link
          href="/app/settings"
          className={clsx(
            'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
            pathname?.startsWith('/app/settings')
              ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white'
              : 'text-gray-700 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
          )}
        >
          <Settings size={20} />
          Settings
        </Link>
      </div>
    </aside>
  );
}
