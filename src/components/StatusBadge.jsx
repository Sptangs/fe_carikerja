const LABELS = {
  open: 'Dibuka',
  closed: 'Ditutup',
  pending: 'Menunggu',
  accepted: 'Diterima',
  rejected: 'Ditolak',
}

const STYLES = {
  open: 'bg-emerald-100 text-emerald-800',
  closed: 'bg-slate-200 text-slate-700',
  pending: 'bg-amber-100 text-amber-800',
  accepted: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-rose-100 text-rose-800',
}

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        STYLES[status] ?? 'bg-slate-100 text-slate-700'
      }`}
    >
      {LABELS[status] ?? status}
    </span>
  )
}
