import { Link, useParams } from 'react-router-dom'
import { ROLE_LABELS } from '../../auth/roles'
import ErrorAlert from '../../components/ErrorAlert'
import PageHeader from '../../components/PageHeader'
import { IconArrowUpRight, IconUsers } from '../../components/icons'
import { Badge } from '../../components/ui/badge'
import { Skeleton } from '../../components/ui/skeleton'
import useApi from '../../hooks/useApi'
import { formatDate } from '../../lib/format'

const ROLE_STYLES = {
  admin: 'bg-[#e8623a]/15 text-[#a63f1f]',
  company: 'bg-[#9dc36b]/25 text-[#3f5a2a]',
  job_seeker: 'bg-[#0f2a23]/10 text-[#0f2a23]',
}

function DetailRow({ label, value }) {
  return (
    <div className="border-b border-[#ece7db] py-4 last:border-0">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a857f]">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm text-[#10251f]">{value ?? '—'}</dd>
    </div>
  )
}

function errorCopy(error) {
  if (error?.status === 404) return 'Pengguna tidak ditemukan.'
  if (error?.status === 403) return 'Anda tidak berwenang melihat data pengguna ini.'
  return 'Gagal memuat detail pengguna. Coba lagi sebentar.'
}

export default function UserDetailPage() {
  const { id } = useParams()
  const { data, loading, error, refetch } = useApi(`/api/users/${id}`)

  const user = data?.user ?? data

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[900px]" aria-busy="true">
        <span className="sr-only" role="status">
          Memuat detail pengguna...
        </span>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-6 h-32 w-full rounded-2xl" />
        <Skeleton className="mt-4 h-56 w-full rounded-2xl" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="mx-auto w-full max-w-[900px]">
        <ErrorAlert message={errorCopy(error)} />
        <div className="mt-6 flex flex-wrap gap-3">
          {error?.status === 404 || error?.status === 403 ? (
            <Link
              to="/admin/users"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0f2a23] px-5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
            >
              <IconUsers className="h-4 w-4" aria-hidden="true" />
              Kembali ke daftar pengguna
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => refetch().catch(() => {})}
              className="inline-flex min-h-11 items-center rounded-full bg-[#0f2a23] px-5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
            >
              Coba lagi
            </button>
          )}
        </div>
      </div>
    )
  }

  const company =
    user.company?.company_name ?? user.company?.name ?? user.company_name ?? '—'

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <PageHeader
        title={user.name}
        description="Detail pengguna terdaftar."
        actions={
          <Link
            to="/admin/users"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#e3ddcf] bg-white px-5 text-sm font-semibold text-[#10251f]/70 transition hover:border-[#0f2a23]/30 hover:text-[#10251f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
          >
            <span aria-hidden="true">←</span> Daftar pengguna
          </Link>
        }
      />

      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-center gap-5">
          <span
            aria-hidden="true"
            className="grid h-16 w-16 place-items-center rounded-2xl bg-[#0f2a23] font-display text-2xl font-bold text-[#f3efe4]"
          >
            {(user.name ?? '?').charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-xl font-bold tracking-tight text-[#10251f]">
              {user.name}
            </p>
            <p className="truncate text-sm text-[#6b7671]">{user.email}</p>
          </div>
          <Badge
            className={`h-auto rounded-full px-3 py-1 text-xs font-semibold ${
              ROLE_STYLES[user.role] ?? 'bg-muted text-muted-foreground'
            }`}
          >
            {ROLE_LABELS[user.role] ?? user.role ?? '-'}
          </Badge>
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-bold tracking-tight text-[#10251f]">
            Informasi akun
          </h2>
          <dl className="mt-2">
            <DetailRow label="Nama" value={user.name} />
            <DetailRow label="Email" value={user.email} />
            <DetailRow label="Role" value={ROLE_LABELS[user.role] ?? user.role} />
            <DetailRow label="Perusahaan" value={company} />
            <DetailRow label="Terdaftar" value={formatDate(user.created_at)} />
            {user.updated_at ? (
              <DetailRow label="Terakhir diperbarui" value={formatDate(user.updated_at)} />
            ) : null}
          </dl>
        </section>

        <aside className="rounded-2xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-bold tracking-tight text-[#10251f]">
            Aksi
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[#6b7671]">
            Ubah, hapus, dan blokir pengguna belum tersedia pada API saat ini.
          </p>
          <Link
            to="/admin/users"
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#e3ddcf] bg-[#f8f6ef] px-4 text-sm font-semibold text-[#0f2a23] transition hover:border-[#0f2a23]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
          >
            <IconUsers className="h-4 w-4" aria-hidden="true" />
            Kembali ke daftar
          </Link>
          <Link
            to="/admin/users/new"
            className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#0f2a23] px-4 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
          >
            Tambah pengguna
            <IconArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </div>
  )
}
