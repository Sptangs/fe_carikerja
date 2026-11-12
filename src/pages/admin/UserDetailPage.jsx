import { Link, useParams } from 'react-router-dom'
import ErrorAlert from '../../components/ErrorAlert'
import { IconArrowUpRight, IconUsers } from '../../components/icons'
import { ROLE_LABELS } from '../../auth/roles'
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

export default function UserDetailPage() {
  const { id } = useParams()
  const { data, loading, error } = useApi(`/api/users/${id}`)

  const user = data?.user ?? data
  const company = user?.company?.company_name ?? user?.company?.name ?? user?.company_name ?? '—'

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[900px]">
        <div className="h-6 w-32 animate-pulse rounded bg-[#e3ddcf]" />
        <div className="mt-6 h-40 animate-pulse rounded-2xl bg-[#e6e0d2]" />
        <div className="mt-4 h-56 animate-pulse rounded-2xl bg-[#e6e0d2]" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="mx-auto w-full max-w-[900px]">
        <ErrorAlert message="Pengguna tidak ditemukan." />
        <Link
          to="/admin/users"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4]"
        >
          Kembali ke daftar pengguna
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <header>
        <Link
          to="/admin/users"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7671] transition hover:text-[#e8623a]"
        >
          <span aria-hidden="true">←</span> Daftar pengguna
        </Link>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8623a]">
          Detail pengguna
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl">
          {user.name}
        </h1>
      </header>

      <section className="mt-6 rounded-2xl border border-[#e3ddcf] bg-white/70 p-6">
        <div className="flex flex-wrap items-center gap-5">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#0f2a23] font-display text-2xl font-bold text-[#f3efe4]">
            {(user.name ?? '?').charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-xl font-bold tracking-tight text-[#10251f]">
              {user.name}
            </p>
            <p className="truncate text-sm text-[#6b7671]">{user.email}</p>
          </div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              ROLE_STYLES[user.role] ?? 'bg-slate-100 text-slate-700'
            }`}
          >
            {ROLE_LABELS[user.role] ?? user.role ?? '-'}
          </span>
        </div>
      </section>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <section className="rounded-2xl border border-[#e3ddcf] bg-white/70 p-6">
          <h2 className="font-display text-lg font-bold tracking-tight text-[#10251f]">
            Informasi akun
          </h2>
          <dl className="mt-2">
            <DetailRow label="ID pengguna" value={user.id} />
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

        <aside className="space-y-4">
          <div className="rounded-2xl border border-[#e3ddcf] bg-white/70 p-6">
            <h2 className="font-display text-lg font-bold tracking-tight text-[#10251f]">
              Aksi
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[#6b7671]">
              Ubah dan hapus pengguna belum tersedia pada API saat ini.
            </p>
            <Link
              to="/admin/users"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#e3ddcf] bg-[#f8f6ef] px-4 py-2.5 text-sm font-semibold text-[#0f2a23] transition hover:border-[#0f2a23]/30"
            >
              <IconUsers className="h-4 w-4" />
              Kembali ke daftar
            </Link>
            <Link
              to="/admin/users/new"
              className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f2a23] px-4 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31]"
            >
              Tambah pengguna
              <IconArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
