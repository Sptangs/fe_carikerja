import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ConfirmDialog from '../../components/ConfirmDialog'
import ErrorAlert from '../../components/ErrorAlert'
import Pagination from '../../components/Pagination'
import StatusBadge from '../../components/StatusBadge'
import { IconArrowUpRight, IconCheck, IconFileText } from '../../components/icons'
import { usePaginated } from '../../hooks/usePaginated'
import useApi from '../../hooks/useApi'
import { formatDate } from '../../lib/format'
import apiClient from '../../lib/apiClient'
import { download } from '../../lib/download'

function applicantName(application) {
  return (
    application.applicant?.name ??
    application.user?.name ??
    application.seeker?.name ??
    'Pelamar'
  )
}

function applicantEmail(application) {
  return (
    application.applicant?.email ?? application.user?.email ?? application.seeker?.email ?? null
  )
}

export default function ApplicantsPage() {
  const { id: jobId } = useParams()
  const jobQuery = useApi(`/api/company/jobs/${jobId}`)
  const {
    data,
    loading,
    error,
    refetch,
    setPage,
  } = usePaginated(`/api/company/jobs/${jobId}/applications`)

  const [statusTarget, setStatusTarget] = useState(null)
  const [statusBusy, setStatusBusy] = useState(false)
  const [actionError, setActionError] = useState(null)
  const [actionSuccess, setActionSuccess] = useState(null)
  const [cvBusyId, setCvBusyId] = useState(null)
  const [exportBusy, setExportBusy] = useState(false)
  const [exportError, setExportError] = useState(null)

  const job = jobQuery.data?.job ?? jobQuery.data
  const paginator = Array.isArray(data) ? null : data
  const applications = paginator
    ? Array.isArray(paginator.data)
      ? paginator.data
      : []
    : data ?? []
  const total = paginator?.total ?? applications.length

  async function handleDecide() {
    if (!statusTarget) return
    setStatusBusy(true)
    setActionError(null)
    setActionSuccess(null)
    try {
      const payload = await apiClient(
        `/api/company/applications/${statusTarget.id}/status`,
        {
          method: 'PATCH',
          body: { status: statusTarget.nextStatus },
        },
      )
      const label = statusTarget.nextStatus === 'accepted' ? 'diterima' : 'ditolak'
      setStatusTarget(null)
      setActionSuccess(payload?.message ?? `Lamaran berhasil ${label}.`)
      await refetch().catch(() => {})
      await jobQuery.refetch().catch(() => {})
    } catch (err) {
      setActionError(err?.message ?? 'Gagal memperbarui status lamaran. Silakan coba lagi.')
      setStatusTarget(null)
    } finally {
      setStatusBusy(false)
    }
  }

  async function handleDownloadCv(application) {
    setCvBusyId(application.id)
    setActionError(null)
    try {
      await download(
        `/api/company/applications/${application.id}/cv`,
        `cv-${applicantName(application).replace(/\s+/g, '-').toLowerCase()}`,
      )
    } catch (err) {
      setActionError(err?.message ?? 'Gagal mengunduh CV. Silakan coba lagi.')
    } finally {
      setCvBusyId(null)
    }
  }

  async function handleExportExcel() {
    setExportBusy(true)
    setExportError(null)
    try {
      await download('/api/company/reports/applications', 'laporan-lamaran.xlsx')
    } catch (err) {
      setExportError(err?.message ?? 'Gagal mengunduh laporan Excel. Silakan coba lagi.')
    } finally {
      setExportBusy(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            to="/company/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7671] transition hover:text-[#e8623a]"
          >
            <span aria-hidden="true">←</span> Daftar lowongan
          </Link>
          <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8623a]">
            Pelamar lowongan
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl">
            {jobQuery.loading && !job ? 'Memuat lowongan…' : (job?.title ?? 'Pelamar')}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4b5b55]">
            {job?.location ? `${job.location} · ` : ''}
            Tinjau lamaran, unduh CV, lalu terima atau tolak kandidat.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportExcel}
          disabled={exportBusy}
          className="inline-flex items-center gap-2 rounded-full border border-[#e3ddcf] bg-white/70 px-5 py-2.5 text-sm font-semibold text-[#0f2a23] transition hover:border-[#0f2a23]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {exportBusy ? 'Mengunduh…' : 'Unduh laporan Excel'}
        </button>
      </header>

      {actionError ? (
        <div className="mt-6">
          <ErrorAlert message={actionError} />
        </div>
      ) : null}
      {exportError ? (
        <div className="mt-4">
          <ErrorAlert message={exportError} />
        </div>
      ) : null}
      {actionSuccess ? (
        <p
          role="status"
          className="mt-6 flex items-start gap-2 rounded-xl border border-[#9dc36b]/45 bg-[#9dc36b]/15 px-4 py-3 text-sm font-medium text-[#0f2a23]"
        >
          <IconCheck className="mt-0.5 h-4 w-4 shrink-0" />
          {actionSuccess}
        </p>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-[#0f2a23]/15 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-[#0f2a23]">
          {loading ? 'Memuat pelamar…' : `${total} pelamar`}
        </span>
        {job?.status ? <StatusBadge status={job.status} /> : null}
      </div>

      {error ? (
        <div className="mt-6">
          <ErrorAlert message="Gagal memuat daftar pelamar. Coba lagi sebentar." />
          <button
            type="button"
            onClick={() => refetch().catch(() => {})}
            className="mt-4 rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31]"
          >
            Coba lagi
          </button>
        </div>
      ) : null}

      <div className="mt-4 space-y-4">
        {loading ? (
          [0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-40 animate-pulse rounded-2xl border border-[#e3ddcf] bg-white/50"
            />
          ))
        ) : applications.length > 0 ? (
          applications.map((application) => {
            const name = applicantName(application)
            const email = applicantEmail(application)
            const isPending = application.status === 'pending'
            const busy = cvBusyId === application.id || statusBusy

            return (
              <article
                key={application.id}
                className="rounded-2xl border border-[#e3ddcf] bg-white/75 p-5 transition hover:border-[#0f2a23]/20 sm:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3.5">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#0f2a23] font-display text-lg font-bold text-[#f3efe4]">
                      {name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <h2 className="font-display text-lg font-semibold tracking-tight text-[#10251f]">
                        {name}
                      </h2>
                      {email ? (
                        <p className="truncate text-sm text-[#6b7671]">{email}</p>
                      ) : null}
                      <p className="mt-1 text-[11px] text-[#7a857f]">
                        Melamar {formatDate(application.created_at)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={application.status} />
                </div>

                {application.cover_letter ? (
                  <div className="mt-4 rounded-xl border border-[#ece7db] bg-[#faf7ef] px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a857f]">
                      Surat lamaran
                    </p>
                    <p className="mt-1.5 whitespace-pre-line text-xs leading-relaxed text-[#4b5b55]">
                      {application.cover_letter}
                    </p>
                  </div>
                ) : null}

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDownloadCv(application)}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#e3ddcf] bg-white px-4 py-2 text-xs font-semibold text-[#0f2a23] transition hover:border-[#0f2a23]/30 hover:text-[#e8623a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <IconFileText className="h-3.5 w-3.5" />
                    {cvBusyId === application.id ? 'Mengunduh…' : 'Unduh CV'}
                  </button>

                  {isPending ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setStatusTarget({ application, nextStatus: 'accepted' })
                        }
                        disabled={busy}
                        className="inline-flex items-center gap-1.5 rounded-full bg-[#0f2a23] px-4 py-2 text-xs font-semibold text-[#f3efe4] transition hover:bg-[#173b31] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <IconCheck className="h-3.5 w-3.5" />
                        Terima
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setStatusTarget({ application, nextStatus: 'rejected' })
                        }
                        disabled={busy}
                        className="inline-flex items-center rounded-full border border-[#e8623a]/35 bg-white px-4 py-2 text-xs font-semibold text-[#e8623a] transition hover:bg-[#e8623a]/10 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Tolak
                      </button>
                    </>
                  ) : null}
                </div>
              </article>
            )
          })
        ) : error ? null : (
          <div className="rounded-[28px] border border-dashed border-[#cfc7b6] bg-white/60 px-6 py-12 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#0f2a23]/5 text-[#0f2a23]">
              <IconFileText className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-display text-xl font-bold text-[#10251f]">
              Belum ada pelamar.
            </h2>
            <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-[#4b5b55]">
              Lamaran dari kandidat akan muncul di sini setelah lowongan dibuka.
            </p>
            <Link
              to="/company/jobs"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4]"
            >
              Kembali ke lowongan
              <IconArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>

      <Pagination meta={paginator} onPageChange={setPage} />

      <ConfirmDialog
        open={Boolean(statusTarget)}
        title={
          statusTarget?.nextStatus === 'accepted' ? 'Terima lamaran?' : 'Tolak lamaran?'
        }
        description={
          statusTarget?.nextStatus === 'accepted'
            ? `${applicantName(statusTarget?.application ?? {})} akan ditandai diterima pada lowongan ini.`
            : `${applicantName(statusTarget?.application ?? {})} akan ditandai ditolak pada lowongan ini.`
        }
        confirmLabel={
          statusBusy
            ? 'Memproses...'
            : statusTarget?.nextStatus === 'accepted'
              ? 'Terima'
              : 'Tolak'
        }
        busy={statusBusy}
        onConfirm={handleDecide}
        onCancel={() => setStatusTarget(null)}
      />
    </div>
  )
}
