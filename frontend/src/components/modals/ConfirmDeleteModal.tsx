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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delete item?</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete <strong>{itemTitle}</strong>? This action cannot be undone.
          </p>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {deleteMutation.isPending ? '...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
