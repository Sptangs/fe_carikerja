import { useState } from 'react'
import EmptyState from '../../components/EmptyState'
import ErrorAlert from '../../components/ErrorAlert'
import Pagination from '../../components/Pagination'
import { IconSearch } from '../../components/icons'
import { ROLE_LABELS } from '../../auth/roles'
import { usePaginated } from '../../hooks/usePaginated'
import { formatDate } from '../../lib/format'

const ROLE_STYLES = {
  admin: 'bg-[#e8623a]/15 text-[#a63f1f]',
  company: 'bg-[#9dc36b]/25 text-[#3f5a2a]',
  job_seeker: 'bg-[#0f2a23]/10 text-[#0f2a23]',
}

function RoleBadge({ role }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        ROLE_STYLES[role] ?? 'bg-slate-100 text-slate-700'
      }`}
    >
      {ROLE_LABELS[role] ?? role ?? '-'}
    </span>
  )
}

function getCompanyName(user) {
  return user.company?.company_name ?? user.company?.name ?? user.company_name ?? '—'
}

export default function UserListPage() {
  const { data, loading, error, setPage, filters, setFilters } = usePaginated('/api/admin/users', {
    search: '',
    role: '',
  })
  const [search, setSearch] = useState(filters.search)
  const [role, setRole] = useState(filters.role)

  function handleSubmit(event) {
    event.preventDefault()
    setFilters({ search: search.trim().slice(0, 100), role })
  }

  function handleReset() {
    setSearch('')
    setRole('')
    setFilters({ search: '', role: '' })
  }

  const paginator = Array.isArray(data) ? null : data
  const users = paginator ? (Array.isArray(paginator.data) ? paginator.data : []) : (data ?? [])
  const total = paginator?.total ?? users.length

  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8623a]">
            Manajemen pengguna
          </p>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl">
            Daftar pengguna
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4b5b55]">
            Cari berdasarkan nama atau email, lalu filter berdasarkan role.
          </p>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-[#e3ddcf] bg-white/70 p-2.5 sm:flex sm:items-center sm:gap-2"
      >
        <div className="flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5">
          <IconSearch className="h-5 w-5 shrink-0 text-[#7a857f]" />
          <label htmlFor="admin-user-search" className="sr-only">
            Cari pengguna
          </label>
          <input
            id="admin-user-search"
            type="text"
            maxLength={100}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama atau email"
            className="w-full bg-transparent text-sm text-[#10251f] placeholder:text-[#9aa39e] focus:outline-none"
          />
        </div>

        <div className="border-t border-[#ece7db] px-3 py-2.5 sm:border-l sm:border-t-0">
          <label htmlFor="admin-role-filter" className="sr-only">
            Filter role
          </label>
          <select
            id="admin-role-filter"
            value={role}
            onChange={(event) => setRole(event.target.value)}
            className="w-full rounded-lg bg-transparent text-sm text-[#10251f] focus:outline-none sm:w-44"
          >
            <option value="">Semua role</option>
            <option value="job_seeker">Pencari Kerja</option>
            <option value="company">Perusahaan</option>
            <option value="admin">Admin</option>
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
          {loading ? 'Memuat pengguna...' : `${total} pengguna`}
        </h2>
        {filters.search || filters.role ? (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e8623a] transition hover:text-[#0f2a23]"
          >
            Hapus filter
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="mt-4">
          <ErrorAlert message="Gagal memuat daftar pengguna. Coba lagi sebentar." />
        </div>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-2xl border border-[#e3ddcf] bg-white/70">
        {loading ? (
          <div className="space-y-px">
            {[0, 1, 2, 3, 4].map((row) => (
              <div key={row} className="h-16 animate-pulse bg-[#f0ebdf]" />
            ))}
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[#e3ddcf] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a857f]">
                  <th scope="col" className="px-5 py-4">
                    Pengguna
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Role
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Perusahaan
                  </th>
                  <th scope="col" className="px-5 py-4">
                    Terdaftar
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-[#ece7db] transition last:border-0 hover:bg-[#f8f6ef]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0f2a23] text-xs font-bold text-[#f3efe4]">
                          {(user.name ?? '?').charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-[#10251f]">{user.name}</p>
                          <p className="truncate text-xs text-[#6b7671]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-5 py-4 text-[#4b5b55]">{getCompanyName(user)}</td>
                    <td className="px-5 py-4 text-[#6b7671]">{formatDate(user.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              title="Belum ada pengguna"
              description="Coba ubah kata kunci atau filter role."
            />
          </div>
        )}
      </div>

      <Pagination meta={paginator} onPageChange={setPage} />
    </div>
  )
}
