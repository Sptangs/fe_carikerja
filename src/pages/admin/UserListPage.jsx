import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ROLE_LABELS } from '../../auth/roles'
import EmptyState from '../../components/EmptyState'
import ErrorAlert from '../../components/ErrorAlert'
import PageHeader from '../../components/PageHeader'
import Pagination from '../../components/Pagination'
import { IconCheck, IconSearch } from '../../components/icons'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Skeleton } from '../../components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import useApi from '../../hooks/useApi'

const ROLE_OPTIONS = [
  { value: '', label: 'Semua role' },
  { value: 'job_seeker', label: 'Pencari Kerja' },
  { value: 'company', label: 'Perusahaan' },
  { value: 'admin', label: 'Admin' },
]

const ROLE_STYLES = {
  admin: 'bg-[#e8623a]/15 text-[#a63f1f]',
  company: 'bg-[#9dc36b]/25 text-[#3f5a2a]',
  job_seeker: 'bg-[#0f2a23]/10 text-[#0f2a23]',
}

function RoleBadge({ role }) {
  return (
    <Badge
      className={`h-auto rounded-full px-2.5 py-1 text-[11px] font-semibold ${
        ROLE_STYLES[role] ?? 'bg-muted text-muted-foreground'
      }`}
    >
      {ROLE_LABELS[role] ?? role ?? '-'}
    </Badge>
  )
}

export default function UserListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const [flash, setFlash] = useState(() => location.state?.flash ?? null)
  const search = searchParams.get('search') ?? ''
  const role = searchParams.get('role') ?? ''
  const page = Number.parseInt(searchParams.get('page') ?? '1', 10) || 1

  const [searchInput, setSearchInput] = useState(search)
  const lastQueuedSearch = useRef(search)

  useEffect(() => {
    if (search === lastQueuedSearch.current) return
    lastQueuedSearch.current = search
    setSearchInput(search)
  }, [search])

  useEffect(() => {
    const next = searchInput.trim().slice(0, 100)
    if (next === search) return undefined
    const timer = setTimeout(() => {
      lastQueuedSearch.current = next
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev)
          if (next) params.set('search', next)
          else params.delete('search')
          params.delete('page')
          return params
        },
        { replace: true },
      )
    }, 350)
    return () => clearTimeout(timer)
  }, [searchInput, search, setSearchParams])

  const apiPath = useMemo(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (role) params.set('role', role)
    if (page > 1) params.set('page', String(page))
    const query = params.toString()
    return query ? `/api/admin/users?${query}` : '/api/admin/users'
  }, [search, role, page])

  const { data, loading, error, refetch } = useApi(apiPath)

  useEffect(() => {
    if (!location.state?.flash) return
    navigate(location.pathname + location.search, { replace: true, state: null })
  }, [location.state, location.pathname, location.search, navigate])

  function updateParams(mutate, { replace = false } = {}) {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev)
        mutate(params)
        return params
      },
      { replace },
    )
  }

  function handleRoleChange(event) {
    const value = event.target.value
    updateParams((params) => {
      if (value) params.set('role', value)
      else params.delete('role')
      params.delete('page')
    })
  }

  function handleReset() {
    setSearchInput('')
    setSearchParams(new URLSearchParams())
  }

  const paginator = Array.isArray(data) ? null : data
  const users = Array.isArray(data) ? data : (paginator?.data ?? [])
  const total = paginator?.total ?? users.length
  const hasFilter = Boolean(search || role)

  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <PageHeader
        title="Daftar pengguna"
        description="Cari berdasarkan nama atau email, lalu filter berdasarkan role."
        actions={
          <Button
            render={<Link to="/admin/users/new" />}
            className="min-h-11 rounded-full bg-[#0f2a23] px-5 font-semibold text-[#f3efe4] hover:bg-[#173b31]"
          >
            Buat pengguna baru
          </Button>
        }
      />

      {flash ? (
        <div
          role="status"
          className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <IconCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="flex-1">{flash}</p>
          <button
            type="button"
            onClick={() => setFlash(null)}
            aria-label="Tutup pesan"
            className="-my-2 -mr-2 min-h-11 px-2 font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
          >
            ✕
          </button>
        </div>
      ) : null}

      <div className="rounded-2xl border border-border bg-card p-2.5 sm:flex sm:items-center sm:gap-2">
        <div className="flex min-h-11 flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5">
          <IconSearch aria-hidden="true" className="h-5 w-5 shrink-0 text-[#7a857f]" />
          <label htmlFor="admin-user-search" className="sr-only">
            Cari pengguna
          </label>
          <input
            id="admin-user-search"
            type="search"
            maxLength={100}
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
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
            onChange={handleRoleChange}
            className="min-h-11 w-full rounded-lg bg-transparent text-sm text-[#10251f] focus:outline-none sm:w-44"
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold tracking-tight text-[#10251f]">
          {loading ? 'Memuat pengguna...' : `${total} pengguna`}
        </h2>
        {hasFilter ? (
          <button
            type="button"
            onClick={handleReset}
            className="min-h-11 text-xs font-semibold uppercase tracking-[0.16em] text-[#e8623a] transition hover:text-[#0f2a23]"
          >
            Hapus filter
          </button>
        ) : null}
      </div>

      {error ? (
        <div className="mt-4">
          <ErrorAlert message="Gagal memuat daftar pengguna. Coba lagi sebentar." />
          <Button
            type="button"
            onClick={() => refetch().catch(() => {})}
            className="mt-4 min-h-11 rounded-full bg-[#0f2a23] px-5 font-semibold text-[#f3efe4] hover:bg-[#173b31]"
          >
            Coba lagi
          </Button>
        </div>
      ) : null}

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        {loading ? (
          <div className="space-y-px p-4" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((row) => (
              <Skeleton key={row} className="h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow className="border-[#e3ddcf] hover:bg-transparent">
                  <TableHead className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a857f]">
                    Nama
                  </TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a857f]">
                    Email
                  </TableHead>
                  <TableHead className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a857f]">
                    Role
                  </TableHead>
                  <TableHead className="text-right text-[10px] font-semibold uppercase tracking-[0.18em] text-[#7a857f]">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-[#ece7db]">
                    <TableCell className="font-semibold text-[#10251f]">{user.name}</TableCell>
                    <TableCell className="text-[#4b5b55]">{user.email}</TableCell>
                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        render={<Link to={`/admin/users/${user.id}`} />}
                        variant="outline"
                        className="min-h-11 rounded-full border-[#e3ddcf] bg-white px-4 font-semibold text-[#0f2a23] hover:border-[#0f2a23]/30 hover:text-[#0f2a23]"
                      >
                        Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-6">
            <EmptyState
              title="Belum ada pengguna"
              description="Coba ubah kata kunci atau filter role."
              action={
                hasFilter ? (
                  <Button
                    type="button"
                    onClick={handleReset}
                    className="min-h-11 rounded-full bg-[#0f2a23] px-5 font-semibold text-[#f3efe4] hover:bg-[#173b31]"
                  >
                    Reset pencarian
                  </Button>
                ) : null
              }
            />
          </div>
        )}
      </div>

      <Pagination
        meta={paginator}
        onPageChange={(nextPage) =>
          updateParams((params) => {
            if (nextPage > 1) params.set('page', String(nextPage))
            else params.delete('page')
          })
        }
      />
    </div>
  )
}
