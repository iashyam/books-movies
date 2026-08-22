'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageSize, total, onPageChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted">
          {start}–{end} of {total}
        </span>
      </div>
    );
  }

  const pages: (number | string)[] = [];
  const showEllipsis = totalPages > 7;

  if (showEllipsis) {
    for (let i = 1; i <= Math.min(3, totalPages); i++) {
      pages.push(i);
    }
    if (page > 5) {
      pages.push('...');
    }
    for (let i = Math.max(4, page - 1); i <= Math.min(totalPages - 3, page + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    if (page < totalPages - 4) {
      pages.push('...');
    }
    for (let i = Math.max(totalPages - 2, 1); i <= totalPages; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
  } else {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <span className="text-sm text-muted">
        {start}–{end} of {total}
      </span>
      <div className="flex items-center gap-1 overflow-x-auto">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={clsx(
            'p-2 rounded-lg transition-colors',
            page === 1
              ? 'text-muted/40 cursor-not-allowed'
              : 'text-muted hover:bg-background hover:text-foreground'
          )}
        >
          <ChevronLeft size={18} />
        </button>

        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-muted">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={clsx(
                'min-w-9 h-9 rounded-lg font-medium text-sm transition-colors',
                page === p
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted hover:bg-background hover:text-foreground'
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={clsx(
            'p-2 rounded-lg transition-colors',
            page === totalPages
              ? 'text-muted/40 cursor-not-allowed'
              : 'text-muted hover:bg-background hover:text-foreground'
          )}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
