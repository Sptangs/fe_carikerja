import { useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from '../../components/ConfirmDialog'
import EmptyState from '../../components/EmptyState'
import ErrorAlert from '../../components/ErrorAlert'
import Pagination from '../../components/Pagination'
import { IconArrowUpRight, IconCheck, IconSearch } from '../../components/icons'
import { usePaginated } from '../../hooks/usePaginated'
import { formatDate } from '../../lib/format'
import apiClient from '../../lib/apiClient'

function getOwner(company) {
  return company.user ?? company.owner ?? null
}

export default function CompanyListPage() {
  const { data, loading, error, refetch, setPage, filters, setFilters } = usePaginated(
    '/api/admin/companies',
    { search: '' },
  )
  const [search, setSearch] = useState(filters.search)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [actionError, setActionError] = useState(null)
  const [actionSuccess, setActionSuccess] = useState(null)

  const paginator = Array.isArray(data) ? null : data
  const companies = paginator
    ? Array.isArray(paginator.data)
      ? paginator.data
      : []
    : data ?? []
  const total = paginator?.total ?? companies.length

  function handleSubmit(event) {
    event.preventDefault()
    setFilters({ search: search.trim().slice(0, 100) })
  }

  function handleReset() {
    setSearch('')
    setFilters({ search: '' })
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleteBusy(true)
    setActionError(null)
    setActionSuccess(null)
    try {
      const payload = await apiClient(`/api/admin/companies/${deleteTarget.id}`, {
        method: 'DELETE',
      })
      setDeleteTarget(null)
      setActionSuccess(
        payload?.message ?? 'Perusahaan beserta datanya berhasil dihapus.',
      )
      await refetch().catch(() => {})
    } catch (err) {
      setActionError(err?.message ?? 'Gagal menghapus perusahaan. Silakan coba lagi.')
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
            Manajemen perusahaan
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl">
            Daftar perusahaan
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4b5b55]">
            Cari berdasarkan nama perusahaan atau pemiliknya, lalu tinjau detailnya.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-[#e3ddcf] bg-white/70 p-2.5 sm:flex sm:items-center sm:gap-2"
      >
        <div className="flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5">
          <IconSearch className="h-5 w-5 shrink-0 text-[#7a857f]" />
          <label htmlFor="admin-company-search" className="sr-only">
            Cari perusahaan
          </label>
          <input
            id="admin-company-search"
            type="text"
            value={search}
            maxLength={100}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama perusahaan atau pemilik"
            className="w-full bg-transparent text-sm text-[#10251f] placeholder:text-[#9aa39e] focus:outline-none"
          />
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
          {loading ? 'Memuat perusahaan...' : `${total} perusahaan`}
        </h2>
        {filters.search ? (
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
          <ErrorAlert message="Gagal memuat daftar perusahaan. Coba lagi sebentar." />
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
        ) : companies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#e3ddcf] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a857f]">
                  <th scope="col" className="px-5 py-4">
                    Perusahaan
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Pemilik
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Lowongan
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Lamaran
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Terdaftar
                  </th>
                  <th scope="col" className="px-5 py-4 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => {
                  const owner = getOwner(company)
                  return (
                    <tr
                      key={company.id}
                      className="border-b border-[#ece7db] transition last:border-0 hover:bg-[#f8f6ef]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0f2a23] text-xs font-bold text-[#f3efe4]">
                            {(company.company_name ?? '?').charAt(0).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-[#10251f]">
                              {company.company_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="truncate text-[#10251f]">{owner?.name ?? '—'}</p>
                        <p className="truncate text-xs text-[#6b7671]">
                          {owner?.email ?? ''}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-[#4b5b55]">
                        {company.jobs_count ?? 0}
                      </td>
                      <td className="px-5 py-4 text-[#4b5b55]">
                        {company.applications_count ?? 0}
                      </td>
                      <td className="px-5 py-4 text-[#6b7671]">
                        {formatDate(company.created_at)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Link
                            to={`/admin/companies/${company.id}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#e3ddcf] bg-white px-3 py-1.5 text-xs font-semibold text-[#0f2a23] transition hover:border-[#0f2a23]/30 hover:text-[#e8623a]"
                          >
                            Detail
                            <IconArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(company)}
                            className="inline-flex items-center rounded-full border border-[#e8623a]/35 bg-white px-3 py-1.5 text-xs font-semibold text-[#e8623a] transition hover:bg-[#e8623a]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
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
              title="Belum ada perusahaan"
              description="Coba ubah kata kunci pencarian Anda."
            />
          </div>
        )}
      </div>

      <Pagination meta={paginator} onPageChange={setPage} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Hapus perusahaan?"
        description={`Perusahaan "${deleteTarget?.company_name ?? ''}" beserta seluruh lowongan, lamaran terkait, dan akun pemiliknya akan dihapus permanen. Aksi ini tidak bisa dibatalkan.`}
        confirmLabel={deleteBusy ? 'Menghapus...' : 'Hapus permanen'}
        busy={deleteBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  )
}
