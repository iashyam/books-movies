'use client';

/* eslint-disable @typescript-eslint/no-explicit-any -- generic table component spans
   Movie/Book/Show, which share no common field set beyond id/title/status/genre/dates */

import { useState, useMemo } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { FilterPills } from './FilterPills';
import { SortDropdown } from './SortDropdown';
import { DataTable } from './DataTable';
import { Pagination } from './Pagination';
import { GenrePill } from './GenrePill';
import { StatusPill } from './StatusPill';
import { RowActionsMenu } from './RowActionsMenu';
import { AddItemModal } from '@/components/modals/AddItemModal';
import { ConfirmDeleteModal } from '@/components/modals/ConfirmDeleteModal';
import { useEntityList } from '@/lib/queries';
import { useAuth } from '@/hooks/useAuth';
import { PAGE_SIZE } from '@/lib/constants';
import { Genre } from '@/types/genre';
import { EntityConfig } from '@/lib/entityConfig';
import { formatDate } from '@/lib/dates';
import { sortByRecentActivity, sortByTitleAsc, sortByTitleDesc } from '@/lib/sort';

interface ListPageLayoutProps<T> {
  entity: EntityConfig<T>;
}

export function ListPageLayout<T extends Record<string, any>>({
  entity,
}: ListPageLayoutProps<T>) {
  const auth = useAuth();
  const { data: items = [], isLoading } = useEntityList(entity.resource);
  const typedItems = useMemo(() => (items as T[]) || [], [items]);

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<T | undefined>();
  const [deleteItem, setDeleteItem] = useState<{ id: string; title: string } | null>(null);

  const filtered = useMemo(() => {
    let result = [...typedItems];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter((item) => item.status === statusFilter);
    }

    // Search
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter((item) => item.title.toLowerCase().includes(lowerSearch));
    }

    // Sort
    if (sort === 'recent') {
      result = sortByRecentActivity(result as any) as unknown as T[];
    } else if (sort === 'titleAsc') {
      result = sortByTitleAsc(result as any) as unknown as T[];
    } else if (sort === 'titleDesc') {
      result = sortByTitleDesc(result as any) as unknown as T[];
    }

    return result;
  }, [typedItems, statusFilter, search, sort]);

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const handleAddClick = () => {
    if (!auth.isAuthenticated) {
      // LoginModal is in AvatarMenu, user needs to click avatar first
      return;
    }
    setEditItem(undefined);
    setShowAddModal(true);
  };

  const handleEditClick = (item: T) => {
    if (!auth.isAuthenticated) return;
    setEditItem(item);
    setShowAddModal(true);
  };

  const handleDeleteClick = (item: T) => {
    if (!auth.isAuthenticated) return;
    const anyItem = item as any;
    setDeleteItem({ id: anyItem.id, title: anyItem.title });
  };

  // Build columns with special rendering for genre, status, date
  const columns = (entity.columns as any[]).map((col) => ({
    ...col,
    render: (row: T) => {
      if (col.key === 'genre') {
        return <GenrePill genre={(row as any).genre as Genre} />;
      }
      if (col.key === 'status') {
        const label = entity.statusLabels[(row as any).status];
        const statusColors = getStatusColors(entity.resource, (row as any).status);
        return <StatusPill status={(row as any).status} label={label} color={statusColors} />;
      }
      if (col.key === 'endDate') {
        return formatDate((row as any).endDate);
      }
      if (col.key === 'title') {
        return <span className="font-medium text-foreground">{(row as any).title}</span>;
      }
      return col.render(row);
    },
  }));

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted text-sm">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <TopBar
        title={entity.navLabel}
        searchValue={search}
        onSearchChange={setSearch}
        config={entity as any}
        onAddClick={handleAddClick}
      />

      <div className="flex-1 p-4 sm:p-8 space-y-5 max-w-[1400px] w-full">
        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-wrap gap-3">
          <FilterPills
            options={entity.statusFilters}
            active={statusFilter}
            onChange={setStatusFilter}
          />
          <SortDropdown
            options={entity.sortOptions}
            value={sort}
            onChange={setSort}
          />
        </div>

        {/* Table */}
        <div>
          <DataTable
            columns={columns as any}
            rows={paginatedItems as any}
            onRowAction={
              auth.isAuthenticated
                ? (row: any) => (
                    <RowActionsMenu
                      onEdit={() => handleEditClick(row as T)}
                      onDelete={() => handleDeleteClick(row as T)}
                    />
                  )
                : undefined
            }
          />
        </div>

        {/* Pagination */}
        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={filtered.length}
          onPageChange={setPage}
        />
      </div>

      {/* Modals */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditItem(undefined);
        }}
        config={entity}
        editItem={editItem}
        resource={entity.resource}
      />

      {deleteItem && (
        <ConfirmDeleteModal
          isOpen={true}
          onClose={() => setDeleteItem(null)}
          itemId={deleteItem.id}
          itemTitle={deleteItem.title}
          resource={entity.resource}
        />
      )}
    </div>
  );
}

function getStatusColors(
  resource: 'movies' | 'books' | 'shows',
  status: string
): { bg: string; text: string } {
  const colors: Record<string, { bg: string; text: string }> = {
    watchlist: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-300' },
    toRead: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-300' },
    currentlyWatching: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-400' },
    currentlyReading: { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-400' },
    watched: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-400' },
    read: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-400' },
  };
  return colors[status] || { bg: 'bg-slate-100', text: 'text-slate-600' };
}
