'use client';

import { X } from 'lucide-react';
import { useDeleteEntity } from '@/lib/queries';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemTitle: string;
  resource: 'movies' | 'books' | 'shows';
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  itemId,
  itemTitle,
  resource,
}: ConfirmDeleteModalProps) {
  const deleteMutation = useDeleteEntity(resource);

  const handleDelete = async () => {
    await deleteMutation.mutateAsync(itemId);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl shadow-xl max-w-sm w-full border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Delete item?</h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4">
          <p className="text-foreground/70 text-sm">
            Are you sure you want to delete <strong className="text-foreground">{itemTitle}</strong>? This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-border rounded-xl text-foreground font-medium hover:bg-background transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {deleteMutation.isPending ? '...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
