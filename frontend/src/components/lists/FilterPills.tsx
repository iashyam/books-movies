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
    <div className="flex gap-1 bg-background p-1 rounded-full w-fit max-w-full border border-border overflow-x-auto">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={clsx(
            'px-3 py-1.5 rounded-full font-medium text-sm transition-colors whitespace-nowrap shrink-0',
            active === opt.value
              ? 'bg-accent text-accent-foreground shadow-sm'
              : 'text-muted hover:text-foreground'
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
