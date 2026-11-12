import FormField from './FormField'

const BASE_CLASS =
  'w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#10251f] outline-none transition placeholder:text-[#9aa39e]'

export default function TextField({ id, label, error, hint, trailing, className = '', ...props }) {
  const describedBy =
    [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(' ') || undefined

  return (
    <FormField label={label} htmlFor={id} error={error} hint={hint}>
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={`${BASE_CLASS} ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
              : 'border-[#ded8ca] focus:border-[#0f2a23] focus:ring-4 focus:ring-[#0f2a23]/10'
          } ${trailing ? 'pr-24' : ''} ${className}`}
          {...props}
        />
        {trailing ? (
          <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div>
        ) : null}
      </div>
    </FormField>
  )
}
