export default function EmptyState({ title = 'Belum ada data', description, action }) {
  return (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <p className="font-medium text-slate-900">{title}</p>
      {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}
