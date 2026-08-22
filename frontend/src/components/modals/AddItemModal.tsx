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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-2xl shadow-xl max-w-md w-full border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">
            {editItem ? `Edit ${config.singularLabel}` : `Add ${config.singularLabel}`}
          </h3>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {config.formFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-foreground/80 mb-1.5">
                {field.label}
                {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === 'select' ? (
                <select
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-shadow"
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
                  className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-shadow"
                />
              )}
            </div>
          ))}

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border rounded-xl text-foreground font-medium hover:bg-background transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-accent text-accent-foreground rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {isLoading ? '...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
