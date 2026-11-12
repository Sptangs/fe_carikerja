import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import EmptyState from '../../components/EmptyState'
import ErrorAlert from '../../components/ErrorAlert'
import JobCard from '../../components/JobCard'
import LoadingSkeleton from '../../components/LoadingSkeleton'
import StatusBadge from '../../components/StatusBadge'
import { IconArrowUpRight, IconSearch } from '../../components/icons'
import { useAuth } from '../../auth/useAuth'
import useApi from '../../hooks/useApi'
import { formatDate } from '../../lib/format'

function StatCard({ label, value, note, accent }) {
  return (
    <div className="rounded-2xl border border-[#e3ddcf] bg-white/70 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7a857f]">
        {label}
      </p>
      <p
        className={`mt-3 font-display text-3xl font-bold tracking-tight ${
          accent ?? 'text-[#10251f]'
        }`}
      >
        {value}
      </p>
      {note ? <p className="mt-1 text-xs text-[#6b7671]">{note}</p> : null}
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const { data, loading, error } = useApi('/api/job-seeker/dashboard')

  const latestJobs = Array.isArray(data?.latest_jobs) ? data.latest_jobs : []
  const recentApplications = Array.isArray(data?.recent_applications)
    ? data.recent_applications
    : []

  function handleSearch(event) {
    event.preventDefault()
    const query = search.trim()
    navigate(
      query ? `/job-seeker/jobs?search=${encodeURIComponent(query)}` : '/job-seeker/jobs',
    )
  }

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <section className="relative overflow-hidden rounded-[28px] bg-[#0f2a23] px-6 py-10 text-[#f3efe4] sm:px-10 lg:px-12 lg:py-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-[#e8623a]/25 blur-3xl" />
          <div className="absolute -bottom-28 left-8 h-64 w-64 rounded-full bg-[#9dc36b]/20 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.1]"
            style={{
              backgroundImage: 'radial-gradient(#f3efe4 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="relative max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9dc36b]">
            Halo, {user?.name?.split(' ')[0] ?? 'Kandidat'}
          </p>
          <h1 className="mt-4 font-display text-3xl font-bold leading-[1.03] tracking-tight sm:text-4xl lg:text-5xl">
            Siap menemukan peran berikutnya?
          </h1>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-[#f3efe4]/65">
            Mulai dari pencarian lowongan, lanjutkan lamaran yang tertunda, dan jaga profilmu tetap
            siap.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-7 flex flex-col gap-2 rounded-2xl border border-white/15 bg-white/10 p-2.5 backdrop-blur sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5">
              <IconSearch className="h-5 w-5 shrink-0 text-[#f3efe4]/60" />
              <label htmlFor="seeker-search" className="sr-only">
                Kata kunci lowongan
              </label>
              <input
                id="seeker-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Posisi atau keahlian yang kamu cari"
                className="w-full bg-transparent text-sm text-[#f3efe4] placeholder:text-[#f3efe4]/45 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#f3efe4] px-5 py-3 text-sm font-semibold text-[#0f2a23] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
            >
              Cari lowongan
              <IconArrowUpRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      {error ? (
        <div className="mt-6">
          <ErrorAlert message="Gagal memuat ringkasan dashboard. Coba muat ulang halaman." />
        </div>
      ) : null}

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {loading ? (
          <>
            {[0, 1, 2].map((item) => (
              <div key={item} className="h-[7.5rem] animate-pulse rounded-2xl bg-[#e6e0d2]" />
            ))}
          </>
        ) : (
          <>
            <StatCard
              label="Lowongan terbuka"
              value={data?.open_jobs_count ?? '—'}
              note="Peluang aktif saat ini"
            />
            <StatCard
              label="Lamaran terkirim"
              value={data?.total_applications ?? '—'}
              note="Total sepanjang waktu"
              accent="text-[#e8623a]"
            />
            <StatCard
              label="Status CV"
              value={data?.has_cv ? 'Siap' : 'Belum ada'}
              note={data?.has_cv ? 'CV sudah bisa dipakai melamar' : 'Unggah CV agar bisa melamar'}
              accent={data?.has_cv ? 'text-[#3f5a2a]' : 'text-[#b45309]'}
            />
          </>
        )}
      </section>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
        <section>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8623a]">
                Untukmu
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#10251f]">
                Lowongan terbaru
              </h2>
            </div>
            <Link
              to="/job-seeker/jobs"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f2a23] transition hover:text-[#e8623a]"
            >
              Lihat semua
              <IconArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton rows={3} />
          ) : latestJobs.length > 0 ? (
            <div className="grid gap-4">
              {latestJobs.map((job) => (
                <JobCard key={job.id} job={job} to={`/job-seeker/jobs/${job.id}`} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Belum ada lowongan terbaru"
              description="Coba jelajahi semua lowongan yang sedang dibuka."
              action={
                <Link
                  to="/job-seeker/jobs"
                  className="inline-flex rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4]"
                >
                  Cari lowongan
                </Link>
              }
            />
          )}
        </section>

        <section>
          <div className="mb-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8623a]">
              Aktivitas
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#10251f]">
              Lamaran terbaru
            </h2>
          </div>

          {loading ? (
            <LoadingSkeleton rows={3} />
          ) : recentApplications.length > 0 ? (
            <ul className="space-y-3">
              {recentApplications.map((application) => (
                <li
                  key={application.id}
                  className="rounded-2xl border border-[#e3ddcf] bg-white/70 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#10251f]">
                        {application.job?.title ?? 'Lowongan'}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-[#6b7671]">
                        {application.job?.company?.company_name ??
                          application.job?.company?.name ??
                          'Perusahaan'}
                      </p>
                    </div>
                    <StatusBadge status={application.status} />
                  </div>
                  {application.created_at ? (
                    <p className="mt-3 text-[11px] text-[#7a857f]">
                      Dikirim {formatDate(application.created_at)}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              title="Belum ada lamaran"
              description="Lamaran yang kamu kirim akan muncul di sini."
            />
          )}

          <div className="mt-4 flex flex-col gap-2">
            <Link
              to="/job-seeker/applications"
              className="inline-flex items-center justify-between rounded-xl border border-[#e3ddcf] bg-white/70 px-4 py-3 text-sm font-semibold text-[#10251f] transition hover:border-[#0f2a23]/25 hover:text-[#e8623a]"
            >
              Riwayat lamaran
              <IconArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              to="/job-seeker/profile"
              className="inline-flex items-center justify-between rounded-xl border border-[#e3ddcf] bg-white/70 px-4 py-3 text-sm font-semibold text-[#10251f] transition hover:border-[#0f2a23]/25 hover:text-[#e8623a]"
            >
              Profil & CV
              <IconArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
