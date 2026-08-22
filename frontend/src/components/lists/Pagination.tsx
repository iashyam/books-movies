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
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  if (totalPages <= 1) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">
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
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {start}–{end} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={clsx(
            'p-2 rounded-lg transition-colors',
            page === 1
              ? 'text-gray-300 cursor-not-allowed dark:text-gray-700'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          )}
        >
          <ChevronLeft size={18} />
        </button>

        {pages.map((p, idx) =>
          p === '...' ? (
            <span key={`ellipsis-${idx}`} className="px-2 text-gray-600 dark:text-gray-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={clsx(
                'min-w-10 h-10 rounded-lg font-medium text-sm transition-colors',
                page === p
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
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
              ? 'text-gray-300 cursor-not-allowed dark:text-gray-700'
              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
          )}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
