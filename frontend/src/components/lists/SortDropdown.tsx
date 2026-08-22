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
        className="appearance-none pl-4 pr-10 py-2 rounded-full bg-surface border border-border text-sm font-medium text-foreground cursor-pointer hover:border-foreground/30 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-colors"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Sort by: {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted" size={16} />
    </div>
  );
}
