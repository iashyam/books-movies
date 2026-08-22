'use client';

import { ChevronDown } from 'lucide-react';

interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
}

export function SortDropdown({ options, value, onChange }: SortDropdownProps) {
  return (
    <div className="relative inline-block">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-10 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort by: {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600 dark:text-gray-400" size={18} />
    </div>
  );
}
