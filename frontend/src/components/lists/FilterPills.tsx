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
    <div className="flex gap-1.5 flex-wrap bg-background p-1 rounded-full w-fit border border-border">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={clsx(
            'px-4 py-1.5 rounded-full font-medium text-sm transition-colors',
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
