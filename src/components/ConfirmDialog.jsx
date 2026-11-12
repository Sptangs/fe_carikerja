export default function ConfirmDialog({ open, title, description, confirmLabel = 'Ya', onConfirm, onCancel }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div role="dialog" aria-modal="true" aria-label={title} className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-md border px-4 py-2 text-sm">
            Batal
          </button>
          <button type="button" onClick={onConfirm} className="rounded-md bg-rose-600 px-4 py-2 text-sm text-white">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
