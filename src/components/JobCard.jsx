import { Link } from 'react-router-dom'
import { IconArrowUpRight } from './icons'
import { formatDate, formatRupiah } from '../lib/format'

const EMPLOYMENT_LABELS = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Kontrak',
  internship: 'Magang',
  freelance: 'Freelance',
}

function getCompanyName(job) {
  return job.company?.company_name ?? job.company?.name ?? job.company_name ?? 'Perusahaan'
}

function getSalary(job) {
  const { salary_min: min, salary_max: max } = job
  if (!min && !max) return 'Gaji kompetitif'
  if (min && max) return `${formatRupiah(min)} – ${formatRupiah(max)}`
  return formatRupiah(min ?? max)
}

export default function JobCard({ job, to }) {
  const company = getCompanyName(job)
  const employment = EMPLOYMENT_LABELS[job.employment_type] ?? job.employment_type
  const href = to ?? `/job-seeker/jobs/${job.id}`

  return (
    <Link
      to={href}
      className="group flex flex-col gap-5 rounded-2xl border border-[#e3ddcf] bg-white/80 p-5 transition duration-300 hover:-translate-y-1 hover:border-[#0f2a23]/25 hover:shadow-[0_28px_60px_-38px_rgba(16,37,31,0.55)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] sm:flex-row sm:items-center sm:p-6"
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#0f2a23] font-display text-lg font-bold text-[#f3efe4]">
        {company.charAt(0).toUpperCase()}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-lg font-bold tracking-tight text-[#10251f]">
          {job.title}
        </h3>
        <p className="mt-0.5 text-sm text-[#6b7671]">{company}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#6b7671]">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#e8623a]" />
            {job.location ?? 'Lokasi fleksibel'}
          </span>
          {employment ? (
            <span className="rounded-full bg-[#9dc36b]/20 px-2.5 py-1 font-semibold text-[#3f5a2a]">
              {employment}
            </span>
          ) : null}
          {job.created_at ? <span>Dibuat {formatDate(job.created_at)}</span> : null}
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-[#ece7db] pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
        <p className="text-sm font-semibold text-[#0f2a23]">{getSalary(job)}</p>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#e8623a]">
          Lihat
          <IconArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  )
}
