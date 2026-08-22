'use client';

import { useState } from 'react';
import { MoreVertical, Edit2, Trash2 } from 'lucide-react';

interface RowActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function RowActionsMenu({ onEdit, onDelete }: RowActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-muted hover:bg-background hover:text-foreground rounded-lg transition-colors"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-surface border border-border rounded-xl shadow-lg z-10 overflow-hidden py-1">
          <button
            onClick={() => {
              onEdit();
              setIsOpen(false);
            }}
            className="w-full text-left px-3.5 py-2 text-sm text-foreground hover:bg-background flex items-center gap-2.5"
          >
            <Edit2 size={14} className="text-muted" /> Edit
          </button>
          <button
            onClick={() => {
              onDelete();
              setIsOpen(false);
            }}
            className="w-full text-left px-3.5 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}

      {isOpen && (
        <button
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-0"
        />
      )}
    </div>
  );
}
