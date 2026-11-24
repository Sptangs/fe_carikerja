import { useEffect, useRef } from 'react'

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Ya',
  busy = false,
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null)
  const confirmRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!open) return

    previousFocusRef.current = document.activeElement
    confirmRef.current?.focus()

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        if (!busy) onCancel?.()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = dialogRef.current.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      const previous = previousFocusRef.current
      if (previous && typeof previous.focus === 'function') {
        previous.focus()
      }
    }
  }, [open, onCancel, busy])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby={description ? 'confirm-dialog-description' : undefined}
        className="w-full max-w-md rounded-2xl border border-[#e3ddcf] bg-white p-6 shadow-[0_28px_60px_-36px_rgba(16,37,31,0.55)]"
      >
        <h2
          id="confirm-dialog-title"
          className="font-display text-lg font-bold tracking-tight text-[#10251f]"
        >
          {title}
        </h2>
        {description ? (
          <p id="confirm-dialog-description" className="mt-2 text-sm text-[#4b5b55]">
            {description}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-full border border-[#e3ddcf] bg-white px-4 py-2.5 text-sm font-semibold text-[#10251f]/75 transition hover:border-[#0f2a23]/30 hover:text-[#10251f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Batal
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-full bg-[#e8623a] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d2542f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f2a23] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
