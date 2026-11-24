import { Card, CardContent } from '../ui/card'

export default function StatCard({ icon: Icon, label, value, note }) {
  return (
    <Card className="rounded-2xl py-0">
      <CardContent className="flex items-start gap-4 p-5">
        <span
          aria-hidden="true"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0f2a23] text-[#f3efe4]"
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7a857f]">
            {label}
          </p>
          <p className="mt-2 font-display text-3xl font-bold tracking-tight text-[#10251f]">
            {value ?? '—'}
          </p>
          {note ? <p className="mt-1 text-xs text-[#6b7671]">{note}</p> : null}
        </div>
      </CardContent>
    </Card>
  )
}
