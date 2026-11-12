import { Link, useParams } from 'react-router-dom'
import ErrorAlert from '../../components/ErrorAlert'
import { IconArrowUpRight, IconFileText } from '../../components/icons'
import useApi from '../../hooks/useApi'
import { formatDate, formatRupiah } from '../../lib/format'

const EMPLOYMENT_LABELS = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Kontrak',
  internship: 'Magang',
  freelance: 'Freelance',
}

function getSalary(job) {
  const { salary_min: min, salary_max: max } = job
  if (!min && !max) return 'Gaji kompetitif'
  if (min && max) return `${formatRupiah(min)} – ${formatRupiah(max)}`
  return formatRupiah(min ?? max)
}

function getRequirements(value) {
  if (!value) return []
  if (Array.isArray(value)) return value
  return String(value)
    .split(/\r?\n/)
    .map((line) => line.replace(/^[-•*]\s*/, '').trim())
    .filter(Boolean)
}

export default function JobDetailPage() {
  const { id } = useParams()
  const { data, loading, error } = useApi(`/api/job-seeker/jobs/${id}`)

  const job = data?.job ?? data
  const hasApplied = Boolean(data?.has_applied)
  const company = job?.company?.name ?? job?.company_name ?? 'Perusahaan'
  const requirements = getRequirements(job?.requirements)

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[900px] px-4 py-16 sm:px-6">
        <div className="h-8 w-2/3 animate-pulse rounded-lg bg-[#e3ddcf]" />
        <div className="mt-4 h-4 w-1/3 animate-pulse rounded bg-[#e3ddcf]" />
        <div className="mt-10 space-y-3">
          {[0, 1, 2, 3, 4].map((row) => (
            <div key={row} className="h-4 animate-pulse rounded bg-[#e3ddcf]" />
          ))}
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="mx-auto w-full max-w-[900px] px-4 py-16 sm:px-6">
        <ErrorAlert message="Lowongan tidak ditemukan atau sudah ditutup." />
        <Link
          to="/job-seeker/jobs"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4]"
        >
          Kembali ke daftar lowongan
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 py-10 sm:px-6 lg:py-14">
      <Link
        to="/job-seeker/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7671] transition hover:text-[#e8623a]"
      >
        <span aria-hidden="true">←</span> Semua lowongan
      </Link>

      <div className="mt-6 flex flex-wrap items-start gap-5">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#0f2a23] font-display text-xl font-bold text-[#f3efe4]">
          {company.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-[#10251f] sm:text-4xl">
            {job.title}
          </h1>
          <p className="mt-2 text-sm text-[#4b5b55]">
            {company} · {job.location ?? 'Lokasi fleksibel'}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {job.employment_type ? (
              <span className="rounded-full bg-[#9dc36b]/25 px-3 py-1 text-[11px] font-semibold text-[#3f5a2a]">
                {EMPLOYMENT_LABELS[job.employment_type] ?? job.employment_type}
              </span>
            ) : null}
            <span className="rounded-full border border-[#e3ddcf] bg-white/70 px-3 py-1 text-[11px] font-medium text-[#4b5b55]">
              {getSalary(job)}
            </span>
            {job.created_at ? (
              <span className="rounded-full border border-[#e3ddcf] bg-white/70 px-3 py-1 text-[11px] font-medium text-[#4b5b55]">
                Dibuat {formatDate(job.created_at)}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="space-y-10">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-[#10251f]">
              Tentang peran ini
            </h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-[#4b5b55]">
              {job.description ?? 'Deskripsi lowongan belum tersedia.'}
            </p>
          </div>

          {requirements.length > 0 ? (
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-[#10251f]">
                Kualifikasi
              </h2>
              <ul className="mt-4 space-y-2.5">
                {requirements.map((item, index) => (
                  <li
                    key={`${item}-${index}`}
                    className="flex items-start gap-3 text-sm leading-relaxed text-[#4b5b55]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e8623a]"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-2xl border border-[#e3ddcf] bg-white/80 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e8623a]">
              {hasApplied ? 'Sudah dilamar' : 'Tertarik?'}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#4b5b55]">
              {hasApplied
                ? 'Lamaranmu untuk lowongan ini sudah terkirim. Pantau statusnya di riwayat lamaran.'
                : 'Kirim lamaranmu dan tunjukkan kenapa kamu cocok untuk peran ini.'}
            </p>

            {hasApplied ? (
              <Link
                to="/job-seeker/applications"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[#e3ddcf] bg-[#f8f6ef] px-5 py-3 text-sm font-semibold text-[#0f2a23] transition hover:border-[#0f2a23]/30"
              >
                Lihat riwayat lamaran
                <IconArrowUpRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                to={`/job-seeker/jobs/${id}/apply`}
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#e8623a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#d2542f]"
              >
                Lamar sekarang
                <IconArrowUpRight className="h-4 w-4" />
              </Link>
            )}

            <div className="mt-5 flex items-center gap-2 border-t border-[#ece7db] pt-4 text-xs text-[#7a857f]">
              <IconFileText className="h-4 w-4" />
              Siapkan CV sebelum melamar.
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
