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
    <div className="overflow-x-auto border border-border rounded-2xl bg-surface shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            {rowNumber && (
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-muted uppercase tracking-wider w-12">
                #
              </th>
            )}
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-3.5 text-left text-xs font-semibold text-muted uppercase tracking-wider whitespace-nowrap"
                style={{ width: col.width }}
              >
                {col.header}
              </th>
            ))}
            {onRowAction && <th className="px-6 py-3.5 w-10"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, rowIdx) => (
            <tr key={row.id} className="hover:bg-background/60 transition-colors">
              {rowNumber && (
                <td className="px-6 py-4 text-sm text-muted">{rowIdx + 1}</td>
              )}
              {columns.map((col, colIdx) => (
                <td key={colIdx} className="px-6 py-4 text-sm text-foreground">
                  {col.render(row)}
                </td>
              ))}
              {onRowAction && <td className="px-6 py-4">{onRowAction(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="text-center py-16 text-muted text-sm">
          No items found
        </div>
      )}
    </div>
  );
}
