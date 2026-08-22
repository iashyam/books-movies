'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MoreVertical, Edit2, Trash2, Check } from 'lucide-react';

interface QuickAction {
  label: string;
  onClick: () => void;
}

interface RowActionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  quickAction?: QuickAction | null;
}

export function RowActionsMenu({ onEdit, onDelete, quickAction }: RowActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const close = () => setIsOpen(false);
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="p-1.5 text-muted hover:bg-background hover:text-foreground rounded-lg transition-colors"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen &&
        createPortal(
          <>
            <button
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <div
              style={{ top: position.top, right: position.right }}
              className="fixed w-44 bg-surface border border-border rounded-xl shadow-lg z-50 overflow-hidden py-1"
            >
              {quickAction && (
                <button
                  onClick={() => {
                    quickAction.onClick();
                    setIsOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 text-sm text-foreground hover:bg-background flex items-center gap-2.5"
                >
                  <Check size={14} className="text-muted" /> {quickAction.label}
                </button>
              )}
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
          </>,
          document.body
        )}
    </div>
  );
}
