import type { ReactNode } from 'react';
import type { TableColumnConfig, TableDensity } from '@/lib/contracts/api';

export function DataGrid<T extends { id: string }>({ columns, rows, density = 'comfortable', renderCell }: { columns: TableColumnConfig[]; rows: T[]; density?: TableDensity; renderCell: (row: T, columnId: string) => ReactNode }) {
  const rowClass = density === 'compact' ? 'py-2' : 'py-4';
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="text-xs uppercase tracking-[0.2em] text-slate-400">
          <tr>
            {columns.map((column) => (
              <th key={column.id} className="pb-3 pr-4">{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-slate-100/90 text-slate-700">
              {columns.map((column) => (
                <td key={`${row.id}-${column.id}`} className={`${rowClass} pr-4 align-top`}>{renderCell(row, column.id)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
