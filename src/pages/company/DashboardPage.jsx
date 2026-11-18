import { Link } from 'react-router-dom'
import ErrorAlert from '../../components/ErrorAlert'
import StatusBadge from '../../components/StatusBadge'
import { IconArrowUpRight, IconFileText } from '../../components/icons'
import useApi from '../../hooks/useApi'
import { formatDate } from '../../lib/format'

const STAT_ITEMS = [
  { key: 'total_jobs', label: 'Total lowongan', note: 'Semua lowongan perusahaan' },
  { key: 'active_jobs', label: 'Lowongan aktif', note: 'Sedang dibuka untuk pelamar' },
  {
    key: 'total_applications',
    label: 'Total lamaran',
    note: 'Sepanjang waktu',
    accent: 'text-[#e8623a]',
  },
  {
    key: 'pending_applications',
    label: 'Menunggu tinjau',
    note: 'Belum diterima/ditolak',
    accent: 'text-[#b45309]',
  },
]

function StatCard({ label, note, value, accent }) {
  return (
    <div className="rounded-2xl border border-[#e3ddcf] bg-white/70 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7a857f]">
        {label}
      </p>
      <p
        className={`mt-3 font-display text-3xl font-bold tracking-tight ${accent ?? 'text-[#10251f]'}`}
      >
        {value ?? '—'}
      </p>
      <p className="mt-1 text-xs text-[#6b7671]">{note}</p>
    </div>
  )
}

function applicantName(application) {
  return (
    application.applicant?.name ??
    application.user?.name ??
    application.seeker?.name ??
    'Pelamar'
  )
}

function jobTitle(application) {
  return application.job?.title ?? 'Lowongan'
}

export default function DashboardPage() {
  const { data, loading, error, refetch } = useApi('/api/company/dashboard')

  const latestApplications = Array.isArray(data?.latest_applications)
    ? data.latest_applications
    : []

  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8623a]">
            Ringkasan
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl">
            Dashboard perusahaan.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4b5b55]">
            Pantau lowongan aktif dan lamaran masuk dari satu tempat.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/company/jobs/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
          >
            Buat lowongan
            <IconArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            to="/company/jobs"
            className="inline-flex items-center gap-2 rounded-full border border-[#e3ddcf] bg-white/70 px-5 py-2.5 text-sm font-semibold text-[#0f2a23] transition hover:border-[#0f2a23]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
          >
            Kelola lowongan
          </Link>
        </div>
      </header>

      {error ? (
        <div className="mt-6">
          <ErrorAlert message="Gagal memuat statistik perusahaan." />
          <button
            type="button"
            onClick={() => refetch().catch(() => {})}
            className="mt-3 rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
          >
            Coba lagi
          </button>
        </div>
      ) : null}

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? [0, 1, 2, 3].map((item) => (
              <div key={item} className="h-[8.5rem] animate-pulse rounded-2xl bg-[#e6e0d2]" />
            ))
          : STAT_ITEMS.map((item) => (
              <StatCard
                key={item.key}
                label={item.label}
                note={item.note}
                value={data?.[item.key]}
                accent={item.accent}
              />
            ))}
      </section>

      <section className="mt-8 rounded-2xl border border-[#e3ddcf] bg-white/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-[#10251f]">
              Lamaran terbaru
            </h2>
            <p className="mt-1 text-sm text-[#4b5b55]">
              Tinjau kandidat yang baru mengirim lamaran.
            </p>
          </div>
          <Link
            to="/company/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f2a23] transition hover:text-[#e8623a]"
          >
            Lihat lowongan
            <IconArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-5 space-y-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-16 animate-pulse rounded-xl bg-[#e6e0d2]" />
            ))}
          </div>
        ) : latestApplications.length > 0 ? (
          <ul className="mt-5 space-y-3">
            {latestApplications.map((application) => (
              <li
                key={application.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#ece7db] bg-[#faf7ef] px-4 py-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0f2a23] font-display text-sm font-bold text-[#f3efe4]">
                    {applicantName(application).charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#10251f]">
                      {applicantName(application)}
                    </p>
                    <p className="truncate text-xs text-[#6b7671]">{jobTitle(application)}</p>
                    {application.created_at ? (
                      <p className="mt-0.5 text-[11px] text-[#7a857f]">
                        {formatDate(application.created_at)}
                      </p>
                    ) : null}
                  </div>
                </div>
                <StatusBadge status={application.status} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-[#cfc7b6] px-4 py-8 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-[#0f2a23]/5 text-[#0f2a23]">
              <IconFileText className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm font-semibold text-[#10251f]">Belum ada lamaran masuk.</p>
            <p className="mt-1 text-xs text-[#6b7671]">
              Lamaran kandidat akan muncul setelah lowongan dibuka.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
