'use client';

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
import { EntityConfig } from '@/lib/entityConfig';
import { formatDate } from '@/lib/dates';
import { sortByRecentActivity, sortByTitleAsc, sortByTitleDesc } from '@/lib/sort';

interface ListPageLayoutProps<T extends { id: string; title: string; status: string; endDate: string; genre: string }> {
  entity: EntityConfig<T>;
}

export function ListPageLayout<T extends { id: string; title: string; status: string; endDate: string; genre: string }>({
  entity,
}: ListPageLayoutProps<T>) {
  const auth = useAuth();
  const { data: items = [], isLoading } = useEntityList(entity.resource);

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<T | undefined>();
  const [deleteItem, setDeleteItem] = useState<{ id: string; title: string } | null>(null);

  const filtered = useMemo(() => {
    let result = [...items];

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
      result = sortByRecentActivity(result);
    } else if (sort === 'titleAsc') {
      result = sortByTitleAsc(result);
    } else if (sort === 'titleDesc') {
      result = sortByTitleDesc(result);
    }

    return result;
  }, [items, statusFilter, search, sort]);

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
    setDeleteItem({ id: item.id, title: item.title });
  };

  // Build columns with special rendering for genre, status, date
  const columns = entity.columns.map((col) => ({
    ...col,
    render: (row: T) => {
      if (col.key === 'genre') {
        return <GenrePill genre={row.genre} />;
      }
      if (col.key === 'status') {
        const label = entity.statusLabels[row.status];
        const statusColors = getStatusColors(entity.resource, row.status);
        return <StatusPill status={row.status} label={label} color={statusColors} />;
      }
      if (col.key === 'endDate') {
        return formatDate(row.endDate);
      }
      return col.render(row);
    },
  }));

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="flex-1 flex flex-col">
      <TopBar
        title={entity.navLabel}
        searchValue={search}
        onSearchChange={setSearch}
        config={entity}
        onAddClick={handleAddClick}
      />

      <div className="flex-1 p-8 space-y-6">
        {/* Filters and Sort */}
        <div className="flex items-center justify-between">
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
            columns={columns}
            rows={paginatedItems}
            onRowAction={
              auth.isAuthenticated
                ? (row) => (
                    <RowActionsMenu
                      onEdit={() => handleEditClick(row)}
                      onDelete={() => handleDeleteClick(row)}
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
    watchlist: { bg: 'bg-gray-100', text: 'text-gray-700' },
    toRead: { bg: 'bg-gray-100', text: 'text-gray-700' },
    currentlyWatching: { bg: 'bg-amber-100', text: 'text-amber-700' },
    currentlyReading: { bg: 'bg-amber-100', text: 'text-amber-700' },
    watched: { bg: 'bg-green-100', text: 'text-green-700' },
    read: { bg: 'bg-green-100', text: 'text-green-700' },
  };
  return colors[status] || { bg: 'bg-gray-100', text: 'text-gray-700' };
}
