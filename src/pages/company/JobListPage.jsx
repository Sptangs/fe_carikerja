import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmDialog from '../../components/ConfirmDialog'
import EmptyState from '../../components/EmptyState'
import ErrorAlert from '../../components/ErrorAlert'
import Pagination from '../../components/Pagination'
import StatusBadge from '../../components/StatusBadge'
import { IconArrowUpRight, IconFileText } from '../../components/icons'
import { usePaginated } from '../../hooks/usePaginated'
import { formatDate, formatRupiah } from '../../lib/format'
import apiClient from '../../lib/apiClient'

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

export default function JobListPage() {
  const navigate = useNavigate()
  const { data, loading, error, refetch, setPage } = usePaginated('/api/company/jobs')

  const [closeTarget, setCloseTarget] = useState(null)
  const [closeBusy, setCloseBusy] = useState(false)
  const [actionError, setActionError] = useState(null)
  const [actionSuccess, setActionSuccess] = useState(null)

  const paginator = Array.isArray(data) ? null : data
  const jobs = paginator ? (Array.isArray(paginator.data) ? paginator.data : []) : (data ?? [])
  const total = paginator?.total ?? jobs.length

  async function handleCloseJob() {
    if (!closeTarget) return
    setCloseBusy(true)
    setActionError(null)
    setActionSuccess(null)
    try {
      const payload = await apiClient(`/api/company/jobs/${closeTarget.id}/close`, {
        method: 'PATCH',
      })
      setCloseTarget(null)
      setActionSuccess(payload?.message ?? 'Lowongan berhasil ditutup.')
      await refetch().catch(() => {})
    } catch (err) {
      setActionError(err?.message ?? 'Gagal menutup lowongan. Silakan coba lagi.')
      setCloseTarget(null)
    } finally {
      setCloseBusy(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8623a]">
            Lowongan
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl">
            Kelola lowongan.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4b5b55]">
            Buat, ubah, atau tutup lowongan. Pantau pelamar per lowongan.
          </p>
        </div>
        <Link
          to="/company/jobs/new"
          className="inline-flex items-center gap-2 rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
        >
          Buat lowongan
          <IconArrowUpRight className="h-4 w-4" />
        </Link>
      </header>

      {actionError ? (
        <div className="mt-6">
          <ErrorAlert message={actionError} />
        </div>
      ) : null}
      {actionSuccess ? (
        <p
          role="status"
          className="mt-6 rounded-xl border border-[#9dc36b]/45 bg-[#9dc36b]/15 px-4 py-3 text-sm font-medium text-[#0f2a23]"
        >
          {actionSuccess}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold tracking-tight text-[#10251f]">
          {loading ? 'Memuat lowongan...' : `${total} lowongan`}
        </h2>
      </div>

      {error && !actionSuccess ? (
        <div className="mt-4">
          <ErrorAlert message="Gagal memuat daftar lowongan. Coba lagi sebentar." />
          <button
            type="button"
            onClick={() => refetch().catch(() => {})}
            className="mt-3 rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31]"
          >
            Coba lagi
          </button>
        </div>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-2xl border border-[#e3ddcf] bg-white/70">
        {loading ? (
          <div className="space-y-px">
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="h-20 animate-pulse bg-[#f0ebdf]" />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <ul className="divide-y divide-[#ece7db]">
            {jobs.map((job) => (
              <li
                key={job.id}
                className="flex flex-wrap items-start justify-between gap-4 p-5 transition hover:bg-[#f8f6ef]"
              >
                <div className="flex min-w-0 flex-1 items-start gap-3.5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0f2a23] text-[#f3efe4]">
                    <IconFileText className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-bold tracking-tight text-[#10251f] sm:text-lg">
                        {job.title}
                      </h3>
                      <StatusBadge status={job.status} />
                    </div>
                    <p className="mt-1 text-sm text-[#6b7671]">
                      {job.location ?? 'Lokasi fleksibel'}
                      {job.employment_type
                        ? ` · ${EMPLOYMENT_LABELS[job.employment_type] ?? job.employment_type}`
                        : ''}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#7a857f]">
                      <span className="font-semibold text-[#0f2a23]">{getSalary(job)}</span>
                      {job.created_at ? <span>Dibuat {formatDate(job.created_at)}</span> : null}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={`/company/jobs/${job.id}/applicants`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#e3ddcf] bg-white px-3.5 py-2 text-xs font-semibold text-[#0f2a23] transition hover:border-[#0f2a23]/30 hover:text-[#e8623a]"
                  >
                    Pelamar
                    <IconArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    to={`/company/jobs/${job.id}/edit`}
                    className="inline-flex items-center rounded-full border border-[#e3ddcf] bg-white px-3.5 py-2 text-xs font-semibold text-[#0f2a23] transition hover:border-[#0f2a23]/30 hover:text-[#e8623a]"
                  >
                    Ubah
                  </Link>
                  {job.status === 'open' ? (
                    <button
                      type="button"
                      onClick={() => setCloseTarget(job)}
                      className="inline-flex items-center rounded-full border border-[#e8623a]/35 bg-white px-3.5 py-2 text-xs font-semibold text-[#e8623a] transition hover:bg-[#e8623a]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
                    >
                      Tutup
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        ) : error ? null : (
          <div className="p-6">
            <EmptyState
              title="Belum ada lowongan"
              description="Buat lowongan pertama agar kandidat bisa melamar."
              action={
                <button
                  type="button"
                  onClick={() => navigate('/company/jobs/new')}
                  className="inline-flex rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4]"
                >
                  Buat lowongan
                </button>
              }
            />
          </div>
        )}
      </div>

      <Pagination meta={paginator} onPageChange={setPage} />

      <ConfirmDialog
        open={Boolean(closeTarget)}
        title="Tutup lowongan?"
        description={`Lowongan "${closeTarget?.title ?? ''}" tidak lagi menerima lamaran baru. Aksi ini tidak bisa dibatalkan dari UI.`}
        confirmLabel={closeBusy ? 'Menutup...' : 'Tutup lowongan'}
        onConfirm={handleCloseJob}
        onCancel={() => setCloseTarget(null)}
      />
    </div>
  )
}
