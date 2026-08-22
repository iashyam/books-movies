'use client';

import { ColumnDef } from '@/lib/entityConfig';

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  rows: T[];
  rowNumber?: boolean;
  onRowAction?: (row: T) => React.ReactNode;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  rowNumber = true,
  onRowAction,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
            {rowNumber && <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400">#</th>}
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap"
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
            {onRowAction && <th className="px-6 py-3 w-10"></th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIdx) => (
            <tr
              key={row.id}
              className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
            >
              {rowNumber && (
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{rowIdx + 1}</td>
              )}
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">
                  {col.render(row)}
                </td>
              ))}
              {onRowAction && <td className="px-6 py-4">{onRowAction(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No items found
        </div>
      )}
    </div>
  );
}
