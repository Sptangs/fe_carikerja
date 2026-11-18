import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from '../../components/ConfirmDialog'
import EmptyState from '../../components/EmptyState'
import ErrorAlert from '../../components/ErrorAlert'
import Pagination from '../../components/Pagination'
import StatusBadge from '../../components/StatusBadge'
import { IconArrowUpRight, IconCheck, IconFileText, IconSearch } from '../../components/icons'
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

const SELECT_CLASS =
  'w-full rounded-xl bg-transparent text-sm text-[#10251f] focus:outline-none sm:w-44'

const MAX_COMPANY_PAGES = 10

function getSalary(job) {
  const { salary_min: min, salary_max: max } = job
  if (!min && !max) return 'Gaji kompetitif'
  if (min && max) return `${formatRupiah(min)} – ${formatRupiah(max)}`
  return formatRupiah(min ?? max)
}

export default function JobListPage() {
  const { data, loading, error, refetch, setPage, filters, setFilters } = usePaginated(
    '/api/admin/jobs',
    { search: '', status: '', company: '' },
  )
  const [search, setSearch] = useState(filters.search)
  const [status, setStatus] = useState(filters.status)
  const [company, setCompany] = useState(filters.company)
  const [companyOptions, setCompanyOptions] = useState([])
  const [companiesTruncated, setCompaniesTruncated] = useState(false)

  const [statusTarget, setStatusTarget] = useState(null)
  const [statusBusy, setStatusBusy] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [actionError, setActionError] = useState(null)
  const [actionSuccess, setActionSuccess] = useState(null)

  const paginator = Array.isArray(data) ? null : data
  const jobs = paginator ? (Array.isArray(paginator.data) ? paginator.data : []) : (data ?? [])
  const total = paginator?.total ?? jobs.length

  useEffect(() => {
    let cancelled = false

    async function loadCompanies() {
      const options = []
      let truncated = false

      for (let page = 1; page <= MAX_COMPANY_PAGES; page += 1) {
        try {
          const payload = await apiClient(`/api/admin/companies?page=${page}`)
          const rows = Array.isArray(payload?.data?.data) ? payload.data.data : []
          options.push(...rows)
          if (rows.length < 15 || !payload?.data?.next_page_url) break
        } catch {
          break
        }
        if (page === MAX_COMPANY_PAGES) truncated = true
      }

      if (cancelled) return
      setCompanyOptions(options)
      setCompaniesTruncated(truncated)
    }

    loadCompanies()
    return () => {
      cancelled = true
    }
  }, [])

  function handleSubmit(event) {
    event.preventDefault()
    setFilters({
      search: search.trim().slice(0, 100),
      status,
      company,
    })
  }

  function handleReset() {
    setSearch('')
    setStatus('')
    setCompany('')
    setFilters({ search: '', status: '', company: '' })
  }

  async function handleToggleStatus() {
    if (!statusTarget) return
    setStatusBusy(true)
    setActionError(null)
    setActionSuccess(null)
    try {
      const nextStatus = statusTarget.status === 'open' ? 'closed' : 'open'
      const payload = await apiClient(`/api/admin/jobs/${statusTarget.id}/status`, {
        method: 'PATCH',
        body: { status: nextStatus },
      })
      const label = nextStatus === 'open' ? 'dibuka kembali' : 'ditutup'
      setStatusTarget(null)
      setActionSuccess(payload?.message ?? `Lowongan berhasil ${label}.`)
      await refetch().catch(() => {})
    } catch (err) {
      setActionError(err?.message ?? 'Gagal mengubah status lowongan. Silakan coba lagi.')
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
      const payload = await apiClient(`/api/admin/jobs/${deleteTarget.id}`, {
        method: 'DELETE',
      })
      setDeleteTarget(null)
      setActionSuccess(payload?.message ?? 'Lowongan beserta lamarannya berhasil dihapus.')
      await refetch().catch(() => {})
    } catch (err) {
      setActionError(err?.message ?? 'Gagal menghapus lowongan. Silakan coba lagi.')
      setDeleteTarget(null)
    } finally {
      setDeleteBusy(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8623a]">
            Manajemen lowongan
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl">
            Daftar lowongan
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4b5b55]">
            Cari judul atau lokasi, filter berdasarkan status dan perusahaan.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-[#e3ddcf] bg-white/70 p-2.5 sm:flex sm:items-center sm:gap-2"
      >
        <div className="flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5">
          <IconSearch className="h-5 w-5 shrink-0 text-[#7a857f]" />
          <label htmlFor="admin-job-search" className="sr-only">
            Cari lowongan
          </label>
          <input
            id="admin-job-search"
            type="text"
            value={search}
            maxLength={100}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari judul atau lokasi"
            className="w-full bg-transparent text-sm text-[#10251f] placeholder:text-[#9aa39e] focus:outline-none"
          />
        </div>

        <div className="border-t border-[#ece7db] px-3 py-2.5 sm:border-l sm:border-t-0">
          <label htmlFor="admin-job-status-filter" className="sr-only">
            Filter status
          </label>
          <select
            id="admin-job-status-filter"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className={SELECT_CLASS}
          >
            <option value="">Semua status</option>
            <option value="open">Dibuka</option>
            <option value="closed">Ditutup</option>
          </select>
        </div>

        <div className="border-t border-[#ece7db] px-3 py-2.5 sm:border-l sm:border-t-0">
          <label htmlFor="admin-job-company-filter" className="sr-only">
            Filter perusahaan
          </label>
          <select
            id="admin-job-company-filter"
            value={company}
            onChange={(event) => setCompany(event.target.value)}
            className={SELECT_CLASS}
          >
            <option value="">Semua perusahaan</option>
            {companyOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.company_name}
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
          {loading ? 'Memuat lowongan...' : `${total} lowongan`}
        </h2>
        {filters.search || filters.status || filters.company ? (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e8623a] transition hover:text-[#0f2a23]"
          >
            Hapus filter
          </button>
        ) : null}
      </div>

      {companiesTruncated ? (
        <p className="mt-2 text-xs text-[#7a857f]">
          Daftar pilihan perusahaan menampilkan 150 entri teratas.
        </p>
      ) : null}

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
            {[0, 1, 2, 3, 4].map((row) => (
              <div key={row} className="h-16 animate-pulse bg-[#f0ebdf]" />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#e3ddcf] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a857f]">
                  <th scope="col" className="px-5 py-4">
                    Lowongan
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Perusahaan
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Status
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Pelamar
                  </th>
                  <th scope="col" className="px-5 py-4 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    className="border-b border-[#ece7db] transition last:border-0 hover:bg-[#f8f6ef]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#0f2a23] text-[#f3efe4]">
                          <IconFileText className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#10251f]">{job.title}</p>
                          <p className="truncate text-xs text-[#6b7671]">
                            {job.location ?? 'Lokasi fleksibel'}
                            {job.employment_type
                              ? ` · ${EMPLOYMENT_LABELS[job.employment_type] ?? job.employment_type}`
                              : ''}
                          </p>
                          <p className="mt-0.5 truncate text-[11px] font-semibold text-[#0f2a23]">
                            {getSalary(job)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-[#4b5b55]">
                      <p className="truncate">{job.company?.company_name ?? '—'}</p>
                      <p className="truncate text-xs text-[#6b7671]">
                        Dibuat {formatDate(job.created_at)}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-5 py-4 text-[#4b5b55]">
                      {job.applications_count ?? 0}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <Link
                          to={`/admin/jobs/${job.id}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-[#e3ddcf] bg-white px-3 py-1.5 text-xs font-semibold text-[#0f2a23] transition hover:border-[#0f2a23]/30 hover:text-[#e8623a]"
                        >
                          Detail
                          <IconArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setStatusTarget(job)}
                          className="inline-flex items-center rounded-full border border-[#e3ddcf] bg-white px-3 py-1.5 text-xs font-semibold text-[#0f2a23] transition hover:border-[#0f2a23]/30 hover:text-[#e8623a]"
                        >
                          {job.status === 'open' ? 'Tutup' : 'Buka'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(job)}
                          className="inline-flex items-center rounded-full border border-[#e8623a]/35 bg-white px-3 py-1.5 text-xs font-semibold text-[#e8623a] transition hover:bg-[#e8623a]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : error ? null : (
          <div className="p-6">
            <EmptyState
              title="Belum ada lowongan"
              description="Coba ubah kata kunci atau filter yang digunakan."
            />
          </div>
        )}
      </div>

      <Pagination meta={paginator} onPageChange={setPage} />

      <ConfirmDialog
        open={Boolean(statusTarget)}
        title={statusTarget?.status === 'open' ? 'Tutup lowongan?' : 'Buka lowongan?'}
        description={
          statusTarget?.status === 'open'
            ? `Lowongan "${statusTarget?.title ?? ''}" tidak lagi menerima lamaran baru.`
            : `Lowongan "${statusTarget?.title ?? ''}" akan kembali menerima lamaran.`
        }
        confirmLabel={
          statusBusy ? 'Memproses...' : statusTarget?.status === 'open' ? 'Tutup' : 'Buka'
        }
        onConfirm={handleToggleStatus}
        onCancel={() => setStatusTarget(null)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus lowongan?"
        description={`Lowongan "${deleteTarget?.title ?? ''}" beserta seluruh lamarannya akan dihapus permanen. Aksi ini tidak bisa dibatalkan.`}
        confirmLabel={deleteBusy ? 'Menghapus...' : 'Hapus permanen'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
