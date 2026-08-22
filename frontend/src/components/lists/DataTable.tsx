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
  if (rows.length === 0) {
    return (
      <div className="border border-border rounded-2xl bg-surface shadow-sm text-center py-16 text-muted text-sm">
        No items found
      </div>
    );
  }

  // Convention shared by every entity config: title, subtitle (director/author),
  // then metadata columns, ending with status.
  const titleCol = columns[0];
  const subtitleCol = columns[1];
  const statusCol = columns[columns.length - 1];
  const metaCols = columns.slice(2, columns.length - 1);

  return (
    <>
      {/* Mobile: stacked cards */}
      <div className="md:hidden space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="border border-border rounded-2xl bg-surface shadow-sm p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-base truncate">{titleCol.render(row)}</div>
                {subtitleCol && (
                  <div className="text-sm text-muted truncate mt-0.5">{subtitleCol.render(row)}</div>
                )}
              </div>
              {onRowAction && <div className="shrink-0 -mr-1.5 -mt-1">{onRowAction(row)}</div>}
            </div>

            <div className="flex items-center justify-between gap-3 mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-muted min-w-0 overflow-hidden">
                {metaCols.map((col, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 whitespace-nowrap">
                    {idx > 0 && <span className="text-border">·</span>}
                    {col.render(row)}
                  </span>
                ))}
              </div>
              <div className="shrink-0">{statusCol.render(row)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto border border-border rounded-2xl bg-surface shadow-sm">
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
      </div>
    </>
  );
}
