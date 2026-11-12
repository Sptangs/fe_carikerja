import { Link } from 'react-router-dom'
import ErrorAlert from '../../components/ErrorAlert'
import { IconArrowUpRight, IconUsers } from '../../components/icons'
import useApi from '../../hooks/useApi'

const STAT_ITEMS = [
  { key: 'user_count', label: 'Total pengguna', note: 'Semua akun terdaftar' },
  { key: 'company_count', label: 'Perusahaan', note: 'Akun perusahaan' },
  { key: 'job_posting_count', label: 'Lowongan', note: 'Lowongan di platform' },
  { key: 'application_count', label: 'Lamaran', note: 'Total lamaran masuk' },
]

function StatCard({ label, note, value }) {
  return (
    <div className="rounded-2xl border border-[#e3ddcf] bg-white/70 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7a857f]">{label}</p>
      <p className="mt-3 font-display text-3xl font-bold tracking-tight text-[#10251f]">
        {value ?? '—'}
      </p>
      <p className="mt-1 text-xs text-[#6b7671]">{note}</p>
    </div>
  )
}

export default function DashboardPage() {
  const { data, loading, error } = useApi('/api/admin/dashboard')

  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8623a]">
            Ringkasan
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl">
            Dashboard admin.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4b5b55]">
            Pantau aktivitas platform dan kelola akun pengguna dari satu tempat.
          </p>
        </div>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-2 rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
        >
          <IconUsers className="h-4 w-4" />
          Kelola pengguna
        </Link>
      </header>

      {error ? (
        <div className="mt-6">
          <ErrorAlert message="Gagal memuat statistik admin. Coba muat ulang halaman." />
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
              />
            ))}
      </section>

      <section className="mt-8 rounded-2xl border border-[#e3ddcf] bg-white/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold tracking-tight text-[#10251f]">
              Manajemen pengguna
            </h2>
            <p className="mt-1 text-sm text-[#4b5b55]">
              Cari, filter berdasarkan role, dan buat akun baru.
            </p>
          </div>
          <Link
            to="/admin/users"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f2a23] transition hover:text-[#e8623a]"
          >
            Buka daftar pengguna
            <IconArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
