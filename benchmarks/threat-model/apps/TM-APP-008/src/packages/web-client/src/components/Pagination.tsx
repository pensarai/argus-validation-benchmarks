import React from 'react';

interface PaginationProps {
  total: number;
  limit: number;
  offset: number;
  onPageChange: (offset: number) => void;
  onLimitChange?: (limit: number) => void;
}

export default function Pagination({ total, limit, offset, onPageChange, onLimitChange }: PaginationProps): React.ReactElement {
  const pageCount = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;
  const pages = Array.from({ length: Math.min(pageCount, 10) }, (_, i) => i + 1);

  return (
    <div className="pagination">
      <button disabled={currentPage === 1} onClick={() => onPageChange((currentPage - 2) * limit)}>Previous</button>
      {pages.map((page) => (
        <button key={page} className={page === currentPage ? 'active' : ''} onClick={() => onPageChange((page - 1) * limit)}>{page}</button>
      ))}
      <button disabled={currentPage >= pageCount} onClick={() => onPageChange(currentPage * limit)}>Next</button>
      {onLimitChange && (
        <select value={limit} onChange={(e) => onLimitChange(Number(e.target.value))}>
          {[10, 20, 50, 100].map((n) => <option key={n} value={n}>{n} per page</option>)}
        </select>
      )}
      <span className="pagination-info">Showing {offset + 1}-{Math.min(offset + limit, total)} of {total}</span>
    </div>
  );
}
