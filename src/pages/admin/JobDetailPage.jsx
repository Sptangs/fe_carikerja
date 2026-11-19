import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../../components/ConfirmDialog'
import ErrorAlert from '../../components/ErrorAlert'
import FormField from '../../components/FormField'
import StatusBadge from '../../components/StatusBadge'
import TextField from '../../components/TextField'
import { IconArrowUpRight, IconCheck } from '../../components/icons'
import useApi from '../../hooks/useApi'
import useForm from '../../hooks/useForm'
import apiClient from '../../lib/apiClient'
import { formatDate, formatRupiah } from '../../lib/format'

const EMPLOYMENT_OPTIONS = [
  { value: 'full_time', label: 'Full-time' },
  { value: 'part_time', label: 'Part-time' },
  { value: 'contract', label: 'Kontrak' },
  { value: 'internship', label: 'Magang' },
  { value: 'freelance', label: 'Freelance' },
]

const STATUS_OPTIONS = [
  { value: 'open', label: 'Dibuka' },
  { value: 'closed', label: 'Ditutup' },
]

const SELECT_CLASS =
  'w-full rounded-xl border border-[#ded8ca] bg-white px-4 py-3 text-sm text-[#10251f] outline-none transition focus:border-[#0f2a23] focus:ring-4 focus:ring-[#0f2a23]/10'

const INPUT_CLASS =
  'w-full rounded-xl border border-[#ded8ca] bg-white px-4 py-3 text-sm text-[#10251f] outline-none transition placeholder:text-[#9aa39e] focus:border-[#0f2a23] focus:ring-4 focus:ring-[#0f2a23]/10'

function toNumber(value) {
  if (value === '' || value === null || value === undefined) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function employmentOptionsWith(current) {
  if (!current) return EMPLOYMENT_OPTIONS
  const known = EMPLOYMENT_OPTIONS.some((option) => option.value === current)
  if (known) return EMPLOYMENT_OPTIONS
  return [{ value: current, label: current }, ...EMPLOYMENT_OPTIONS]
}

function validate(values) {
  const next = {}

  if (!values.title?.trim()) next.title = 'Judul lowongan wajib diisi.'
  else if (values.title.trim().length < 3) next.title = 'Judul minimal 3 karakter.'
  else if (values.title.length > 255) next.title = 'Judul maksimal 255 karakter.'

  if (!values.location?.trim()) next.location = 'Lokasi wajib diisi.'
  else if (values.location.length > 255) next.location = 'Lokasi maksimal 255 karakter.'

  if (!values.employment_type?.trim())
    next.employment_type = 'Tipe pekerjaan wajib diisi.'
  else if (values.employment_type.length > 50)
    next.employment_type = 'Tipe pekerjaan maksimal 50 karakter.'

  if (!STATUS_OPTIONS.some((option) => option.value === values.status)) {
    next.status = 'Status tidak valid.'
  }

  if (!values.description?.trim()) next.description = 'Deskripsi wajib diisi.'
  if (!values.requirements?.trim()) next.requirements = 'Persyaratan wajib diisi.'

  const min = values.salary_min === '' ? null : Number(values.salary_min)
  const max = values.salary_max === '' ? null : Number(values.salary_max)

  if (values.salary_min !== '' && (!Number.isFinite(min) || min < 0)) {
    next.salary_min = 'Gaji minimum tidak valid.'
  }
  if (values.salary_max !== '' && (!Number.isFinite(max) || max < 0)) {
    next.salary_max = 'Gaji maksimum tidak valid.'
  }
  if (min !== null && max !== null && max < min) {
    next.salary_max = 'Gaji maksimum tidak boleh kurang dari minimum.'
  }

  return next
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

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, loading, error } = useApi(`/api/admin/jobs/${id}`)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [actionError, setActionError] = useState(null)
  const [actionSuccess, setActionSuccess] = useState(null)

  const form = useForm({
    initialValues: {
      title: '',
      location: '',
      employment_type: 'full_time',
      salary_min: '',
      salary_max: '',
      description: '',
      requirements: '',
      status: 'open',
    },
    validate,
    onSubmit: async (values) => {
      const payload = await apiClient(`/api/admin/jobs/${id}`, {
        method: 'PUT',
        body: {
          title: values.title.trim(),
          location: values.location.trim(),
          employment_type: values.employment_type,
          salary_min: toNumber(values.salary_min),
          salary_max: toNumber(values.salary_max),
          description: values.description.trim(),
          requirements: values.requirements.trim(),
          status: values.status,
        },
      })
      setActionError(null)
      setActionSuccess(payload?.message ?? 'Lowongan berhasil diperbarui.')
      return payload
    },
  })

  useEffect(() => {
    if (!data) return
    const job = data.job ?? data
    form.setValues({
      title: job.title ?? '',
      location: job.location ?? '',
      employment_type: job.employment_type ?? 'full_time',
      salary_min: job.salary_min ?? '',
      salary_max: job.salary_max ?? '',
      description: job.description ?? '',
      requirements: job.requirements ?? '',
      status: job.status ?? 'open',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  async function handleDelete() {
    setDeleteBusy(true)
    setActionError(null)
    setActionSuccess(null)
    try {
      await apiClient(`/api/admin/jobs/${id}`, { method: 'DELETE' })
      navigate('/admin/jobs', { replace: true })
    } catch (err) {
      setActionError(err?.message ?? 'Gagal menghapus lowongan. Silakan coba lagi.')
      setDeleteOpen(false)
    } finally {
      setDeleteBusy(false)
    }
  }

  if (loading && !data) {
    return (
      <div className="mx-auto w-full max-w-[900px]">
        <div className="h-6 w-40 animate-pulse rounded bg-[#e3ddcf]" />
        <div className="mt-6 h-40 animate-pulse rounded-2xl bg-[#e6e0d2]" />
        <div className="mt-4 h-[560px] animate-pulse rounded-2xl bg-[#e6e0d2]" />
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="mx-auto w-full max-w-[900px]">
        <ErrorAlert message="Lowongan tidak ditemukan atau gagal dimuat." />
        <Link
          to="/admin/jobs"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4]"
        >
          Kembali ke daftar lowongan
        </Link>
      </div>
    )
  }

  const job = data?.job ?? data ?? {}
  const options = employmentOptionsWith(form.values.employment_type)

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <header>
        <Link
          to="/admin/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7671] transition hover:text-[#e8623a]"
        >
          <span aria-hidden="true">←</span> Daftar lowongan
        </Link>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8623a]">
            Detail lowongan
          </p>
          {job.status ? <StatusBadge status={job.status} /> : null}
        </div>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl">
          {job.title}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#4b5b55]">
          {job.company?.company_name ? `${job.company.company_name} · ` : ''}
          {job.location ?? 'Lokasi fleksibel'}
        </p>
      </header>

      {actionError ? (
        <div className="mt-6">
          <ErrorAlert message={actionError} />
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

      <section className="mt-6 rounded-2xl border border-[#e3ddcf] bg-white/70 p-6">
        <h2 className="font-display text-lg font-bold tracking-tight text-[#10251f]">
          Ringkasan
        </h2>
        <dl className="mt-2">
          <DetailRow label="Perusahaan" value={job.company?.company_name} />
          <DetailRow label="Jumlah pelamar" value={job.applications_count ?? 0} />
          <DetailRow
            label="Gaji"
            value={
              job.salary_min || job.salary_max
                ? job.salary_min && job.salary_max
                  ? `${formatRupiah(job.salary_min)} – ${formatRupiah(job.salary_max)}`
                  : formatRupiah(job.salary_min ?? job.salary_max)
                : 'Gaji kompetitif'
            }
          />
          <DetailRow label="Dibuat" value={formatDate(job.created_at)} />
          <DetailRow label="Terakhir diperbarui" value={formatDate(job.updated_at)} />
        </dl>
      </section>

      <form
        className="mt-4 space-y-5 rounded-2xl border border-[#e3ddcf] bg-white/70 p-5 sm:p-6"
        noValidate
        onSubmit={form.handleSubmit}
      >
        <h2 className="font-display text-lg font-bold tracking-tight text-[#10251f]">
          Ubah lowongan
        </h2>

        <TextField
          id="title"
          name="title"
          type="text"
          label="Judul lowongan"
          placeholder="Contoh: Frontend Developer"
          required
          value={form.values.title}
          onChange={form.handleChange}
          error={form.errors.title}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="location"
            name="location"
            type="text"
            label="Lokasi"
            placeholder="Contoh: Jakarta / Remote"
            required
            value={form.values.location}
            onChange={form.handleChange}
            error={form.errors.location}
          />

          <FormField
            label="Tipe pekerjaan"
            htmlFor="employment_type"
            error={form.errors.employment_type}
          >
            <select
              id="employment_type"
              name="employment_type"
              value={form.values.employment_type}
              onChange={form.handleChange}
              aria-invalid={form.errors.employment_type ? 'true' : undefined}
              className={SELECT_CLASS}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>

          <TextField
            id="salary_min"
            name="salary_min"
            type="number"
            inputMode="numeric"
            min="0"
            label="Gaji minimum (Rp)"
            placeholder="Contoh: 5000000"
            value={form.values.salary_min}
            onChange={form.handleChange}
            error={form.errors.salary_min}
          />

          <TextField
            id="salary_max"
            name="salary_max"
            type="number"
            inputMode="numeric"
            min="0"
            label="Gaji maksimum (Rp)"
            placeholder="Contoh: 8000000"
            value={form.values.salary_max}
            onChange={form.handleChange}
            error={form.errors.salary_max}
          />
        </div>

        <FormField
          label="Deskripsi pekerjaan"
          htmlFor="description"
          error={form.errors.description}
        >
          <textarea
            id="description"
            name="description"
            rows={5}
            value={form.values.description}
            onChange={form.handleChange}
            placeholder="Tanggung jawab dan konteks tim…"
            aria-invalid={form.errors.description ? 'true' : undefined}
            className={`${INPUT_CLASS} resize-y ${
              form.errors.description
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10'
                : ''
            }`}
          />
        </FormField>

        <FormField
          label="Persyaratan"
          htmlFor="requirements"
          error={form.errors.requirements}
          hint="Pisahkan poin dengan baris baru."
        >
          <textarea
            id="requirements"
            name="requirements"
            rows={5}
            value={form.values.requirements}
            onChange={form.handleChange}
            placeholder={'Minimal 3 tahun pengalaman…\nMenguasai React…'}
            aria-invalid={form.errors.requirements ? 'true' : undefined}
            className={`${INPUT_CLASS} resize-y ${
              form.errors.requirements
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10'
                : ''
            }`}
          />
        </FormField>

        <FormField label="Status lowongan" htmlFor="status" error={form.errors.status}>
          <select
            id="status"
            name="status"
            value={form.values.status}
            onChange={form.handleChange}
            aria-invalid={form.errors.status ? 'true' : undefined}
            className={SELECT_CLASS}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#ece7db] pt-5">
          <button
            type="submit"
            disabled={form.submitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0f2a23] px-6 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {form.submitting ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-[#f3efe4]/30 border-t-[#f3efe4]"
                />
                Menyimpan...
              </>
            ) : (
              'Simpan perubahan'
            )}
          </button>
        </div>
      </form>

      <section className="mt-4 rounded-2xl border border-[#e8623a]/30 bg-white/70 p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold tracking-tight text-[#10251f]">
          Zona berbahaya
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#4b5b55]">
          Menghapus lowongan juga menghapus seluruh lamaran pada lowongan ini. Aksi ini
          permanen.
        </p>
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#e8623a]/40 bg-white px-5 py-2.5 text-sm font-semibold text-[#e8623a] transition hover:bg-[#e8623a]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
        >
          Hapus lowongan
          <IconArrowUpRight className="h-4 w-4" />
        </button>
      </section>

      <ConfirmDialog
        open={deleteOpen}
        title="Hapus lowongan?"
        description={`Lowongan "${job.title ?? ''}" beserta seluruh lamarannya akan dihapus permanen.`}
        confirmLabel={deleteBusy ? 'Menghapus...' : 'Hapus permanen'}
        busy={deleteBusy}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  )
}
