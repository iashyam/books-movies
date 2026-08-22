'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { EntityConfig } from '@/lib/entityConfig';
import { useCreateEntity, useUpdateEntity } from '@/lib/queries';
import { ApiError } from '@/lib/api';

interface AddItemModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  config: EntityConfig<T>;
  editItem?: T;
  resource: 'movies' | 'books' | 'shows';
}

export function AddItemModal<T extends { id?: string }>({
  isOpen,
  onClose,
  config,
  editItem,
  resource,
}: AddItemModalProps<T>) {
  const [formData, setFormData] = useState<Record<string, string | number>>({});
  const [error, setError] = useState('');
  const createMutation = useCreateEntity(resource);
  const updateMutation = useUpdateEntity(resource);

  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        const data: Record<string, string | number> = {};
        Object.entries(editItem).forEach(([key, value]) => {
          if (key !== 'id' && (typeof value === 'string' || typeof value === 'number')) {
            data[key] = value;
          }
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing form state to the item being edited when the modal opens
        setFormData(data);
      } else {
        setFormData({});
      }
    }
  }, [editItem, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const payload = { ...formData };
      delete payload.id;

      if (editItem?.id) {
        await updateMutation.mutateAsync({ id: editItem.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }

      onClose();
      setFormData({});
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to save');
      }
    }
  };

  if (!isOpen) return null;

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {editItem ? `Edit ${config.singularLabel}` : `Add ${config.singularLabel}`}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {config.formFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">Select {field.label.toLowerCase()}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              )}
            </div>
          ))}

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isLoading ? '...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
