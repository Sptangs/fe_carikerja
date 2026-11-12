export default function Pagination({ meta, onPageChange }) {
  if (!meta) return null

  return (
    <nav className="mt-6 flex items-center justify-between gap-4" aria-label="Paginasi">
      <button
        type="button"
        disabled={!meta.prev_page_url}
        onClick={() => onPageChange?.(meta.current_page - 1)}
        className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
      >
        Sebelumnya
      </button>
      <span className="text-sm text-slate-600">
        Halaman {meta.current_page} dari {meta.last_page}
      </span>
      <button
        type="button"
        disabled={!meta.next_page_url}
        onClick={() => onPageChange?.(meta.current_page + 1)}
        className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
      >
        Berikutnya
      </button>
    </nav>
  )
}
