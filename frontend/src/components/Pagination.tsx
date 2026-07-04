"use client";

export default function Pagination({ page, pages, onPageChange }: {
  page: number; pages: number; onPageChange: (p: number) => void;
}) {
  if (pages <= 1) return null;
  return (
    <div className="flex justify-center gap-2 mt-8">
      <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
        className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
      <span className="px-3 py-1">Page {page} of {pages}</span>
      <button onClick={() => onPageChange(page + 1)} disabled={page === pages}
        className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
    </div>
  );
}
