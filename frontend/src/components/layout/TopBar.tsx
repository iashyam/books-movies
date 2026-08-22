'use client';

import { useState } from 'react';
import { Search, Plus, User } from 'lucide-react';
import { AvatarMenu } from './AvatarMenu';
import { EntityConfig } from '@/lib/entityConfig';

interface TopBarProps<T> {
  title: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  config: EntityConfig<T>;
  onAddClick: () => void;
}

export function TopBar<T>({
  title,
  searchValue,
  onSearchChange,
  config,
  onAddClick,
}: TopBarProps<T>) {
  const [showAvatar, setShowAvatar] = useState(false);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 px-4 sm:px-8 py-5 md:py-6 border-b border-border bg-surface">
      {/* Left: Title and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 flex-1 min-w-0">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground tracking-tight shrink-0">{title}</h2>
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" size={16} />
          <input
            type="text"
            placeholder={config.searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-border bg-background text-sm text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-shadow"
          />
        </div>
      </div>

      {/* Right: Add Button and Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent text-accent-foreground rounded-full font-medium text-sm hover:opacity-90 active:scale-[0.98] transition-all shadow-sm whitespace-nowrap"
        >
          <Plus size={16} strokeWidth={2.5} />
          <span className="hidden sm:inline">Add {config.singularLabel}</span>
          <span className="sm:hidden">Add</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowAvatar(!showAvatar)}
            className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-muted hover:text-foreground hover:border-foreground/30 transition-colors shrink-0"
          >
            <User size={17} />
          </button>

          {showAvatar && (
            <>
              <AvatarMenu onClose={() => setShowAvatar(false)} />
              <button
                onClick={() => setShowAvatar(false)}
                className="fixed inset-0 z-30"
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
