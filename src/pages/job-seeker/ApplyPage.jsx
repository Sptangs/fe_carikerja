  import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ErrorAlert from '../../components/ErrorAlert'
import {
  IconArrowUpRight,
  IconCheck,
  IconClose,
  IconFileText,
} from '../../components/icons'
import useApi from '../../hooks/useApi'
import useForm from '../../hooks/useForm'
import apiClient from '../../lib/apiClient'
import { formatRupiah } from '../../lib/format'

const EMPLOYMENT_LABELS = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Kontrak',
  internship: 'Magang',
  freelance: 'Freelance',
}

const TIPS = [
  'Sebutkan pengalaman yang paling relevan dengan peran ini.',
  'Jelaskan alasanmu tertarik pada perusahaan dan posisinya.',
  'Gunakan bahasa yang ringkas, sopan, dan mudah dibaca.',
]

function getSalary(job) {
  const { salary_min: min, salary_max: max } = job ?? {}
  if (!min && !max) return 'Gaji kompetitif'
  if (min && max) return `${formatRupiah(min)} – ${formatRupiah(max)}`
  return formatRupiah(min ?? max)
}

function companyName(job) {
  return job?.company?.company_name ?? job?.company?.name ?? job?.company_name ?? 'Perusahaan'
}

function JobSummary({ job }) {
  const company = companyName(job)

  return (
    <section className="rounded-[28px] border border-[#e3ddcf] bg-white/75 p-6">
      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7a857f]">
        Lowongan
      </p>
      <div className="mt-4 flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#0f2a23] font-display text-base font-bold text-[#f3efe4]">
          {company.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold leading-snug text-[#10251f]">
            {job?.title ?? 'Lowongan'}
          </h2>
          <p className="mt-0.5 truncate text-xs text-[#6b7671]">{company}</p>
        </div>
      </div>

      <dl className="mt-5 space-y-2.5 text-xs text-[#4b5b55]">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-[#7a857f]">Lokasi</dt>
          <dd className="text-right font-medium">{job?.location ?? 'Fleksibel'}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-[#7a857f]">Tipe</dt>
          <dd className="text-right font-medium">
            {EMPLOYMENT_LABELS[job?.employment_type] ?? job?.employment_type ?? '—'}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-[#7a857f]">Gaji</dt>
          <dd className="text-right font-medium">{getSalary(job)}</dd>
        </div>
      </dl>

      <Link
        to={`/job-seeker/jobs/${job?.id}`}
        className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[#e3ddcf] bg-[#f8f6ef] px-4 py-2.5 text-xs font-semibold text-[#0f2a23] transition hover:border-[#0f2a23]/30"
      >
        Lihat detail lowongan
        <IconArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </section>
  )
}

function Shell({ children }) {
  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      {children}
    </div>
  )
}

function BackLink() {
  return (
    <Link
      to="/job-seeker/jobs"
      className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7671] transition hover:text-[#e8623a]"
    >
      <span aria-hidden="true">←</span> Semua lowongan
    </Link>
  )
}

export default function ApplyPage() {
  const { id } = useParams()
  const { data, loading, error, refetch } = useApi(`/api/job-seeker/jobs/${id}/application`)
  const [submitted, setSubmitted] = useState(null)

  const job = data?.job
  const canApply = Boolean(data?.can_apply)

  const {
    values,
    errors,
    formError,
    submitting,
    handleChange,
    handleSubmit,
  } = useForm({
    initialValues: { cover_letter: '' },
    validate: (formValues) => {
      const next = {}
      const length = formValues.cover_letter.trim().length
      if (!formValues.cover_letter.trim()) next.cover_letter = 'Surat lamaran wajib diisi.'
      else if (length < 30) next.cover_letter = 'Surat lamaran minimal 30 karakter.'
      else if (length > 5000) next.cover_letter = 'Surat lamaran maksimal 5000 karakter.'
      return next
    },
    onSubmit: async (formValues) => {
      const payload = await apiClient(`/api/job-seeker/jobs/${id}/applications`, {
        method: 'POST',
        body: { cover_letter: formValues.cover_letter.trim() },
      })
      setSubmitted(payload?.data ?? true)
      return payload
    },
  })

  if (loading) {
    return (
      <Shell>
        <div className="h-3 w-32 animate-pulse rounded bg-[#e3ddcf]" />
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <div className="h-[460px] animate-pulse rounded-[28px] border border-[#e3ddcf] bg-white/50" />
          <div className="h-72 animate-pulse rounded-[28px] border border-[#e3ddcf] bg-white/50" />
        </div>
      </Shell>
    )
  }

  if (error) {
    if (error.status === 422) {
      return (
        <Shell>
          <BackLink />
          <div className="mt-8 rounded-[28px] border border-[#e8623a]/25 bg-white/75 p-8 text-center sm:p-12">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e8623a]/10 text-[#e8623a]">
              <IconFileText className="h-6 w-6" />
            </span>
            <h1 className="mt-5 font-display text-2xl font-bold text-[#10251f]">
              Unggah CV dulu, ya.
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#4b5b55]">
              Setiap lamaran membutuhkan CV. Lengkapi CV di halaman profil, lalu kembali ke
              lowongan ini untuk mengirim lamaran.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link
                to="/job-seeker/profile"
                className="rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173a31]"
              >
                Lengkapi CV
              </Link>
              <Link
                to={`/job-seeker/jobs/${id}`}
                className="rounded-full border border-[#e3ddcf] bg-white/70 px-5 py-2.5 text-sm font-semibold text-[#0f2a23] transition hover:border-[#0f2a23]/30"
              >
                Kembali ke lowongan
              </Link>
            </div>
          </div>
        </Shell>
      )
    }

    if (error.status === 409) {
      return (
        <Shell>
          <BackLink />
          <div className="mt-8 rounded-[28px] border border-[#e3ddcf] bg-white/75 p-8 text-center sm:p-12">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#9dc36b]/25 text-[#0f2a23]">
              <IconCheck className="h-6 w-6" />
            </span>
            <h1 className="mt-5 font-display text-2xl font-bold text-[#10251f]">
              Kamu sudah melamar lowongan ini.
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#4b5b55]">
              Lamaranmu sudah tercatat. Pantau perubahan statusnya lewat riwayat lamaran.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Link
                to="/job-seeker/applications"
                className="rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173a31]"
              >
                Lihat riwayat lamaran
              </Link>
              <Link
                to="/job-seeker/jobs"
                className="rounded-full border border-[#e3ddcf] bg-white/70 px-5 py-2.5 text-sm font-semibold text-[#0f2a23] transition hover:border-[#0f2a23]/30"
              >
                Cari lowongan lain
              </Link>
            </div>
          </div>
        </Shell>
      )
    }

    return (
      <Shell>
        <BackLink />
        <div className="mt-8">
          <ErrorAlert message={error.message ?? 'Form lamaran belum bisa dimuat.'} />
          <button
            type="button"
            onClick={() => refetch().catch(() => {})}
            className="mt-4 rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173a31]"
          >
            Coba lagi
          </button>
        </div>
      </Shell>
    )
  }

  if (!job) {
    return (
      <Shell>
        <BackLink />
        <div className="mt-8">
          <ErrorAlert message="Lowongan tidak ditemukan atau sudah ditutup." />
        </div>
      </Shell>
    )
  }

  if (submitted) {
    return (
      <Shell>
        <div className="mx-auto max-w-xl rounded-[28px] border border-[#9dc36b]/45 bg-white/80 p-8 text-center sm:p-12">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#9dc36b]/25 text-[#0f2a23]">
            <IconCheck className="h-7 w-7" />
          </span>
          <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7a857f]">
            Lamaran terkirim
          </p>
          <h1 className="mt-2 font-display text-2xl font-bold leading-tight text-[#10251f] sm:text-3xl">
            Lamaranmu sudah terkirim.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#4b5b55]">
            Lamaran untuk posisi <strong>{job.title}</strong> di {companyName(job)} sudah
            diterima dan berstatus menunggu. Kamu bisa memantau perkembangannya kapan saja.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <Link
              to="/job-seeker/applications"
              className="rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173a31]"
            >
              Lihat riwayat lamaran
            </Link>
            <Link
              to="/job-seeker/jobs"
              className="rounded-full border border-[#e3ddcf] bg-white/70 px-5 py-2.5 text-sm font-semibold text-[#0f2a23] transition hover:border-[#0f2a23]/30"
            >
              Cari lowongan lain
            </Link>
          </div>
        </div>
      </Shell>
    )
  }

  if (!canApply) {
    const isClosed = job.status === 'closed'
    return (
      <Shell>
        <BackLink />
        <div className="mt-8 rounded-[28px] border border-[#e3ddcf] bg-white/75 p-8 text-center sm:p-12">
          <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#e8623a]/10 text-[#e8623a]">
            <IconClose className="h-6 w-6" />
          </span>
          <h1 className="mt-5 font-display text-2xl font-bold text-[#10251f]">
            {isClosed ? 'Lowongan sudah ditutup.' : 'Lamaran tidak dapat dikirim.'}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#4b5b55]">
            {isClosed
              ? 'Lowongan ini tidak lagi menerima lamaran baru. Temukan peluang lain yang mungkin lebih cocok untukmu.'
              : 'Lowongan ini belum bisa dilamar saat ini. Cek riwayat lamaranmu atau temukan lowongan lain.'}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link
              to="/job-seeker/jobs"
              className="rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173a31]"
            >
              Cari lowongan lain
            </Link>
            <Link
              to="/job-seeker/applications"
              className="rounded-full border border-[#e3ddcf] bg-white/70 px-5 py-2.5 text-sm font-semibold text-[#0f2a23] transition hover:border-[#0f2a23]/30"
            >
              Lihat riwayat lamaran
            </Link>
          </div>
        </div>
      </Shell>
    )
  }

  const characterCount = values.cover_letter.length
  const company = companyName(job)

  return (
    <div className="mx-auto w-full max-w-[1080px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <BackLink />

      <header className="mt-6 max-w-2xl">
        <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0f2a23]/55">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e8623a]" />
          Form lamaran
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-[#10251f] sm:text-4xl">
          Kirim lamaranmu ke {company}.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#10251f]/65">
          Tulis surat lamaran singkat untuk posisi <strong>{job.title}</strong>. Pastikan CV di
          profilmu sudah versi terbaru sebelum mengirim.
        </p>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <section className="rounded-[28px] border border-[#e3ddcf] bg-white/75 p-5 shadow-[0_30px_60px_-50px_rgba(16,37,31,0.6)] sm:p-7">
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label
                htmlFor="cover_letter"
                className="block text-sm font-semibold text-[#10251f]"
              >
                Surat lamaran
              </label>
              <p className="mt-1 text-xs text-[#6b7671]">
                Ceritakan pengalaman dan alasanmu cocok untuk peran ini (30–5000 karakter).
              </p>
              <textarea
                id="cover_letter"
                name="cover_letter"
                rows={11}
                value={values.cover_letter}
                onChange={handleChange}
                aria-invalid={errors.cover_letter ? 'true' : undefined}
                aria-describedby={errors.cover_letter ? 'cover_letter-error' : undefined}
                placeholder={`Halo ${company}, saya tertarik dengan posisi ${job.title}...`}
                className={`mt-3 w-full resize-y rounded-xl border bg-white px-4 py-3 text-sm leading-relaxed text-[#10251f] outline-none transition placeholder:text-[#9aa39e] focus:ring-4 focus:ring-[#0f2a23]/10 ${
                  errors.cover_letter
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10'
                    : 'border-[#ded8ca] focus:border-[#0f2a23]'
                }`}
              />
              <div className="mt-1.5 flex items-start justify-between gap-3">
                <span
                  id="cover_letter-error"
                  role={errors.cover_letter ? 'alert' : undefined}
                  className="text-xs text-rose-600"
                >
                  {errors.cover_letter ?? ''}
                </span>
                <span
                  className={`shrink-0 text-xs tabular-nums ${
                    characterCount > 5000 ? 'font-semibold text-rose-600' : 'text-[#7a857f]'
                  }`}
                >
                  {characterCount}/5000
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl border border-[#e3ddcf] bg-[#faf7ef] p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#0f2a23]/5 text-[#0f2a23]">
                <IconFileText className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#10251f]">CV dari profilmu</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[#6b7671]">
                  CV yang tersimpan di profil akan ikut dikirim bersama lamaran ini.
                </p>
                <Link
                  to="/job-seeker/profile"
                  className="mt-1 inline-block text-xs font-semibold text-[#e8623a] underline-offset-4 hover:underline"
                >
                  Kelola CV
                </Link>
              </div>
            </div>

            {formError ? <ErrorAlert message={formError} /> : null}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#ece7db] pt-5">
              <p className="text-xs text-[#7a857f]">
                Lamaran yang sudah dikirim tidak dapat diubah.
              </p>
              <div className="flex items-center gap-2">
                <Link
                  to={`/job-seeker/jobs/${id}`}
                  className="rounded-full border border-[#e3ddcf] bg-white/70 px-5 py-2.5 text-sm font-semibold text-[#0f2a23] transition hover:border-[#0f2a23]/30"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-full bg-[#e8623a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d2542f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f2a23] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Mengirim…' : 'Kirim lamaran'}
                  {!submitting ? <IconArrowUpRight className="h-4 w-4" /> : null}
                </button>
              </div>
            </div>
          </form>
        </section>

        <aside className="space-y-6">
          <JobSummary job={job} />

          <section className="rounded-[28px] border border-[#e3ddcf] bg-[#faf7ef] p-6">
            <h2 className="font-display text-base font-semibold text-[#10251f]">
              Sebelum mengirim
            </h2>
            <ul className="mt-4 space-y-3 text-xs leading-relaxed text-[#10251f]/70">
              {TIPS.map((tip) => (
                <li key={tip} className="flex items-start gap-2">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0f2a23]" />
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
