import React, { useState } from 'react';

interface Column { key: string; label: string; sortable?: boolean; render?: (value: any, row: any) => React.ReactNode; }
interface DataTableProps { columns: Column[]; data: any[]; pagination?: { total: number; limit: number; offset: number }; onPageChange?: (offset: number) => void; loading?: boolean; }

export default function DataTable({ columns, data, pagination, onPageChange, loading }: DataTableProps): React.ReactElement {
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleSort = (key: string) => {
    if (sortBy === key) { setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); }
    else { setSortBy(key); setSortOrder('asc'); }
  };

  const sorted = sortBy ? [...data].sort((a, b) => {
    const av = a[sortBy]; const bv = b[sortBy];
    const cmp = typeof av === 'string' ? av.localeCompare(bv) : (av > bv ? 1 : -1);
    return sortOrder === 'asc' ? cmp : -cmp;
  }) : data;

  if (loading) return <div className="table-loading">Loading...</div>;

  return (
    <div className="data-table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            <th><input type="checkbox" onChange={(e) => setSelectedRows(e.target.checked ? new Set(data.map((r) => r.id)) : new Set())} /></th>
            {columns.map((col) => (
              <th key={col.key} onClick={col.sortable ? () => handleSort(col.key) : undefined} className={col.sortable ? 'sortable' : ''}>
                {col.label} {sortBy === col.key && (sortOrder === 'asc' ? ' ^' : ' v')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.length === 0 ? (
            <tr><td colSpan={columns.length + 1} className="empty-row">No data available</td></tr>
          ) : (
            sorted.map((row) => (
              <tr key={row.id} className={selectedRows.has(row.id) ? 'selected' : ''}>
                <td><input type="checkbox" checked={selectedRows.has(row.id)} onChange={() => {
                  const next = new Set(selectedRows);
                  next.has(row.id) ? next.delete(row.id) : next.add(row.id);
                  setSelectedRows(next);
                }} /></td>
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
      {pagination && (
        <div className="table-pagination">
          <span>Showing {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}</span>
          <button disabled={pagination.offset === 0} onClick={() => onPageChange?.(Math.max(0, pagination.offset - pagination.limit))}>Prev</button>
          <button disabled={pagination.offset + pagination.limit >= pagination.total} onClick={() => onPageChange?.(pagination.offset + pagination.limit)}>Next</button>
        </div>
      )}
    </div>
  );
}
