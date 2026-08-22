'use client';

import clsx from 'clsx';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterPillsProps {
  options: FilterOption[];
  active: string;
  onChange: (value: string) => void;
}

export function FilterPills({ options, active, onChange }: FilterPillsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={clsx(
            'px-4 py-2 rounded-full font-medium text-sm transition-colors',
            active === opt.value
              ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
