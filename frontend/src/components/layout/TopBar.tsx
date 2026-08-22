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
    <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      {/* Left: Title and Search */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{title}</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder={config.searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full max-w-md pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white"
          />
        </div>
      </div>

      {/* Right: Add Button and Avatar */}
      <div className="flex items-center gap-4">
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={18} />
          Add {config.singularLabel}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowAvatar(!showAvatar)}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <User size={20} />
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
