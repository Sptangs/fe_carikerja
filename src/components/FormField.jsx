export default function FormField({ label, htmlFor, error, hint, children }) {
  return (
    <div className="space-y-1">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-slate-900">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}
