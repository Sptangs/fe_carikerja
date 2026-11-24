export default function FullPageLoader({ label = 'Memuat...' }) {
  return (
    <div className="grid min-h-svh place-items-center bg-[#f3efe4]" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <span
          className="h-10 w-10 animate-spin rounded-full border-2 border-[#0f2a23]/15 border-t-[#0f2a23]"
          aria-hidden="true"
        />
        <p className="text-sm text-[#4b5b55]">{label}</p>
      </div>
    </div>
  )
}
