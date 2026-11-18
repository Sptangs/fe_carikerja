import { useState } from 'react'
import ConfirmDialog from '../../components/ConfirmDialog'
import EmptyState from '../../components/EmptyState'
import ErrorAlert from '../../components/ErrorAlert'
import Pagination from '../../components/Pagination'
import StatusBadge from '../../components/StatusBadge'
import { IconCheck, IconSearch } from '../../components/icons'
import { usePaginated } from '../../hooks/usePaginated'
import { formatDate } from '../../lib/format'
import apiClient from '../../lib/apiClient'

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Menunggu' },
  { value: 'accepted', label: 'Diterima' },
  { value: 'rejected', label: 'Ditolak' },
]

const SELECT_CLASS =
  'w-full rounded-xl bg-transparent text-sm text-[#10251f] focus:outline-none sm:w-44'

const STATUS_SELECT_CLASS =
  'rounded-full border border-[#e3ddcf] bg-white px-3 py-1.5 text-xs font-semibold text-[#0f2a23] transition hover:border-[#0f2a23]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] disabled:cursor-not-allowed disabled:opacity-60'

function applicantName(application) {
  return application.user?.name ?? application.applicant?.name ?? 'Pelamar'
}

function applicantEmail(application) {
  return application.user?.email ?? application.applicant?.email ?? null
}

export default function ApplicationListPage() {
  const { data, loading, error, refetch, setPage, filters, setFilters } = usePaginated(
    '/api/admin/applications',
    { search: '', status: '' },
  )
  const [search, setSearch] = useState(filters.search)
  const [status, setStatus] = useState(filters.status)

  const [statusTarget, setStatusTarget] = useState(null)
  const [statusBusy, setStatusBusy] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [actionError, setActionError] = useState(null)
  const [actionSuccess, setActionSuccess] = useState(null)

  const paginator = Array.isArray(data) ? null : data
  const applications = paginator
    ? Array.isArray(paginator.data)
      ? paginator.data
      : []
    : data ?? []
  const total = paginator?.total ?? applications.length

  function handleSubmit(event) {
    event.preventDefault()
    setFilters({ search: search.trim().slice(0, 100), status })
  }

  function handleReset() {
    setSearch('')
    setStatus('')
    setFilters({ search: '', status: '' })
  }

  async function handleStatusChange() {
    if (!statusTarget) return
    setStatusBusy(true)
    setActionError(null)
    setActionSuccess(null)
    try {
      const payload = await apiClient(
        `/api/admin/applications/${statusTarget.application.id}/status`,
        {
          method: 'PATCH',
          body: { status: statusTarget.nextStatus },
        },
      )
      setStatusTarget(null)
      setActionSuccess(payload?.message ?? 'Status lamaran berhasil diperbarui.')
      await refetch().catch(() => {})
    } catch (err) {
      setActionError(err?.message ?? 'Gagal mengubah status lamaran. Silakan coba lagi.')
      setStatusTarget(null)
    } finally {
      setStatusBusy(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteBusy(true)
    setActionError(null)
    setActionSuccess(null)
    try {
      const payload = await apiClient(`/api/admin/applications/${deleteTarget.id}`, {
        method: 'DELETE',
      })
      setDeleteTarget(null)
      setActionSuccess(payload?.message ?? 'Lamaran berhasil dihapus.')
      await refetch().catch(() => {})
    } catch (err) {
      setActionError(err?.message ?? 'Gagal menghapus lamaran. Silakan coba lagi.')
      setDeleteTarget(null)
    } finally {
      setDeleteBusy(false)
    }
  }

  const statusLabels = Object.fromEntries(STATUS_OPTIONS.map((option) => [option.value, option.label]))

  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8623a]">
            Manajemen lamaran
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl">
            Daftar lamaran
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4b5b55]">
            Cari pelamar atau judul lowongan, filter status, lalu ubah atau hapus lamaran.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-[#e3ddcf] bg-white/70 p-2.5 sm:flex sm:items-center sm:gap-2"
      >
        <div className="flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5">
          <IconSearch className="h-5 w-5 shrink-0 text-[#7a857f]" />
          <label htmlFor="admin-application-search" className="sr-only">
            Cari lamaran
          </label>
          <input
            id="admin-application-search"
            type="text"
            value={search}
            maxLength={100}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama, email, atau judul lowongan"
            className="w-full bg-transparent text-sm text-[#10251f] placeholder:text-[#9aa39e] focus:outline-none"
          />
        </div>

        <div className="border-t border-[#ece7db] px-3 py-2.5 sm:border-l sm:border-t-0">
          <label htmlFor="admin-application-status-filter" className="sr-only">
            Filter status
          </label>
          <select
            id="admin-application-status-filter"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className={SELECT_CLASS}
          >
            <option value="">Semua status</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f2a23] px-5 py-3 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] sm:mt-0 sm:w-auto"
        >
          Terapkan
        </button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold tracking-tight text-[#10251f]">
          {loading ? 'Memuat lamaran...' : `${total} lamaran`}
        </h2>
        {filters.search || filters.status ? (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e8623a] transition hover:text-[#0f2a23]"
          >
            Hapus filter
          </button>
        ) : null}
      </div>

      {actionError ? (
        <div className="mt-4">
          <ErrorAlert message={actionError} />
        </div>
      ) : null}
      {actionSuccess ? (
        <p
          role="status"
          className="mt-4 flex items-start gap-2 rounded-xl border border-[#9dc36b]/45 bg-[#9dc36b]/15 px-4 py-3 text-sm font-medium text-[#0f2a23]"
        >
          <IconCheck className="mt-0.5 h-4 w-4 shrink-0" />
          {actionSuccess}
        </p>
      ) : null}

      {error && !actionSuccess ? (
        <div className="mt-4">
          <ErrorAlert message="Gagal memuat daftar lamaran. Coba lagi sebentar." />
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
            {[0, 1, 2, 3, 4].map((row) => (
              <div key={row} className="h-16 animate-pulse bg-[#f0ebdf]" />
            ))}
          </div>
        ) : applications.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#e3ddcf] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a857f]">
                  <th scope="col" className="px-5 py-4">
                    Pelamar
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Lowongan
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Perusahaan
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Tanggal
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-4 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {applications.map((application) => {
                  const isPendingSelection =
                    statusTarget?.application.id === application.id
                  return (
                    <tr
                      key={application.id}
                      className="border-b border-[#ece7db] transition last:border-0 hover:bg-[#f8f6ef]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0f2a23] text-xs font-bold text-[#f3efe4]">
                            {applicantName(application).charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#10251f]">
                              {applicantName(application)}
                            </p>
                            <p className="truncate text-xs text-[#6b7671]">
                              {applicantEmail(application)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="truncate text-[#10251f]">
                          {application.job?.title ?? '—'}
                        </p>
                        <p className="truncate text-xs text-[#6b7671]">
                          ID {application.job_id ?? application.job?.id ?? '—'}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-[#4b5b55]">
                        <p className="truncate">
                          {application.job?.company?.company_name ?? '—'}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-[#6b7671]">
                        {formatDate(application.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={application.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <label
                            htmlFor={`application-status-${application.id}`}
                            className="sr-only"
                          >
                            Ubah status lamaran {applicantName(application)}
                          </label>
                          <select
                            id={`application-status-${application.id}`}
                            value={
                              isPendingSelection
                                ? statusTarget.nextStatus
                                : application.status
                            }
                            onChange={(event) => {
                              const nextStatus = event.target.value
                              if (nextStatus === application.status) return
                              setStatusTarget({ application, nextStatus })
                            }}
                            disabled={statusBusy || deleteBusy}
                            className={STATUS_SELECT_CLASS}
                          >
                            {STATUS_OPTIONS.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(application)}
                            disabled={statusBusy || deleteBusy}
                            className="inline-flex items-center rounded-full border border-[#e8623a]/35 bg-white px-3 py-1.5 text-xs font-semibold text-[#e8623a] transition hover:bg-[#e8623a]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : error ? null : (
          <div className="p-6">
            <EmptyState
              title="Belum ada lamaran"
              description="Coba ubah kata kunci atau filter status yang digunakan."
            />
          </div>
        )}
      </div>

      <Pagination meta={paginator} onPageChange={setPage} />

      <ConfirmDialog
        open={Boolean(statusTarget)}
        title="Ubah status lamaran?"
        description={`${applicantName(statusTarget?.application ?? {})} akan dipindahkan dari "${
          statusLabels[statusTarget?.application?.status] ?? statusTarget?.application?.status
        }" menjadi "${statusLabels[statusTarget?.nextStatus] ?? statusTarget?.nextStatus}".`}
        confirmLabel={statusBusy ? 'Memproses...' : 'Ubah status'}
        onConfirm={handleStatusChange}
        onCancel={() => setStatusTarget(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus lamaran?"
        description={`Lamaran dari "${applicantName(deleteTarget ?? {})}" akan dihapus permanen. Pengguna dan lowongan tidak ikut terhapus.`}
        confirmLabel={deleteBusy ? 'Menghapus...' : 'Hapus permanen'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
