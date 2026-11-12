import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import ErrorAlert from '../../components/ErrorAlert'
import Pagination from '../../components/Pagination'
import StatusBadge from '../../components/StatusBadge'
import { IconArrowUpRight, IconFileText } from '../../components/icons'
import { usePaginated } from '../../hooks/usePaginated'
import { formatDate } from '../../lib/format'

const STATUS_ACCENT = {
  pending: 'bg-[#e3a008]',
  accepted: 'bg-[#9dc36b]',
  rejected: 'bg-[#d2542f]',
}

function companyName(application) {
  const job = application?.job
  return job?.company?.company_name ?? job?.company?.name ?? job?.company_name ?? 'Perusahaan'
}

function ApplicationCard({ application }) {
  const job = application.job
  const company = companyName(application)

  return (
    <article className="relative overflow-hidden rounded-2xl border border-[#e3ddcf] bg-white/75 p-5 transition hover:border-[#0f2a23]/25 sm:p-6">
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 w-1 ${
          STATUS_ACCENT[application.status] ?? 'bg-[#e3ddcf]'
        }`}
      />

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0f2a23] font-display text-base font-bold text-[#f3efe4]">
            {company.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-lg font-semibold leading-snug text-[#10251f]">
              {job?.id ? (
                <Link
                  to={`/job-seeker/jobs/${job.id}`}
                  className="transition hover:text-[#e8623a]"
                >
                  {job.title ?? 'Lowongan'}
                </Link>
              ) : (
                job?.title ?? 'Lowongan'
              )}
            </h2>
            <p className="mt-0.5 truncate text-xs text-[#6b7671]">
              {company} · {job?.location ?? 'Lokasi fleksibel'}
            </p>
            <p className="mt-1 text-[11px] text-[#7a857f]">
              Dikirim {formatDate(application.created_at)}
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
          <p
            className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#4b5b55]"
            title={application.cover_letter}
          >
            {application.cover_letter}
          </p>
        </div>
      ) : null}

      {job?.id ? (
        <div className="mt-4 flex justify-end">
          <Link
            to={`/job-seeker/jobs/${job.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0f2a23] transition hover:text-[#e8623a]"
          >
            Lihat lowongan
            <IconArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : null}
    </article>
  )
}

function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#e3ddcf] bg-white/50 p-5 sm:p-6">
      <div className="flex items-start gap-3.5">
        <div className="h-11 w-11 animate-pulse rounded-xl bg-[#e6e0d2]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 animate-pulse rounded bg-[#e6e0d2]" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-[#e6e0d2]" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-[#e6e0d2]" />
        </div>
        <div className="h-6 w-20 animate-pulse rounded-full bg-[#e6e0d2]" />
      </div>
      <div className="mt-4 h-16 animate-pulse rounded-xl bg-[#e6e0d2]" />
    </div>
  )
}

export default function ApplicationsPage() {
  const { data, loading, error, refetch, page, setPage } = usePaginated(
    '/api/job-seeker/applications',
  )

  const paginator = Array.isArray(data) ? null : data
  const applications = paginator
    ? Array.isArray(paginator.data)
      ? paginator.data
      : []
    : data ?? []
  const total = paginator?.total ?? applications.length

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  return (
    <div className="mx-auto w-full max-w-[960px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <header className="max-w-2xl">
        <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0f2a23]/55">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e8623a]" />
          Riwayat lamaran
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-[#10251f] sm:text-4xl">
          Perjalanan lamaranmu.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#10251f]/65">
          Semua lamaran yang sudah kamu kirim ada di sini. Pantau statusnya dan buka kembali
          lowongannya kapan pun.
        </p>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-[#0f2a23]/15 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-[#0f2a23]">
          {error && !data
            ? 'Riwayat tidak tersedia'
            : loading
              ? 'Memuat lamaran…'
              : `${total} lamaran terkirim`}
        </span>
        <span className="text-xs text-[#7a857f]">
          Status diperbarui oleh perusahaan setelah lamaran ditinjau.
        </span>
      </div>

      {error ? (
        <div className="mt-6">
          <ErrorAlert message="Gagal memuat riwayat lamaran. Coba lagi sebentar." />
          <button
            type="button"
            onClick={() => refetch().catch(() => {})}
            className="mt-4 rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173a31]"
          >
            Coba lagi
          </button>
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 space-y-4">
          {[0, 1, 2].map((item) => (
            <CardSkeleton key={item} />
          ))}
        </div>
      ) : applications.length > 0 ? (
        <div className="mt-6 space-y-4">
          {applications.map((application) => (
            <ApplicationCard key={application.id} application={application} />
          ))}
        </div>
      ) : error ? null : (
        <div className="mt-6 rounded-[28px] border border-dashed border-[#cfc7b6] bg-white/60 px-6 py-12 text-center">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#0f2a23]/5 text-[#0f2a23]">
            <IconFileText className="h-6 w-6" />
          </span>
          <h2 className="mt-4 font-display text-xl font-bold text-[#10251f]">
            Belum ada lamaran.
          </h2>
          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-[#4b5b55]">
            Mulai jelajahi lowongan yang cocok, lalu kirim lamaran pertamamu. Riwayatnya akan
            muncul di sini.
          </p>
          <Link
            to="/job-seeker/jobs"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#e8623a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d2542f]"
          >
            Cari lowongan
            <IconArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      <Pagination meta={paginator} onPageChange={setPage} />
    </div>
  )
}
