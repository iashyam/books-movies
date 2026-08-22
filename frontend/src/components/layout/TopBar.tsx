'use client';

import { useState } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { EntityConfig } from '@/lib/entityConfig';

interface TopBarProps<T> {
  title: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  config: EntityConfig<T>;
  onAddClick: () => void;
  isAuthenticated: boolean;
}

export function TopBar<T>({
  title,
  searchValue,
  onSearchChange,
  config,
  onAddClick,
  isAuthenticated,
}: TopBarProps<T>) {
  const [searchOpen, setSearchOpen] = useState(false);

  const closeSearch = () => {
    setSearchOpen(false);
    onSearchChange('');
  };

  return (
    <div className="flex items-center justify-between gap-3 px-4 sm:px-8 py-5 md:py-6 border-b border-border bg-surface">
      {searchOpen ? (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input
              autoFocus
              type="text"
              placeholder={config.searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-background text-sm text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-shadow"
            />
          </div>
          <button
            onClick={closeSearch}
            className="p-2 text-muted hover:text-foreground transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <>
          <h2 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight truncate">
            {title}
          </h2>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              <Search size={17} />
            </button>
            {isAuthenticated && (
              <button
                onClick={onAddClick}
                className="w-10 h-10 flex items-center justify-center bg-accent text-accent-foreground rounded-full hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
              >
                <Plus size={18} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
