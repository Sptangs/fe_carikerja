import { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import FormField from '../../components/FormField'
import TextField from '../../components/TextField'
import ErrorAlert from '../../components/ErrorAlert'
import useApi from '../../hooks/useApi'
import useForm from '../../hooks/useForm'
import apiClient from '../../lib/apiClient'

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

function validate(values) {
  const next = {}

  if (!values.title?.trim()) next.title = 'Judul lowongan wajib diisi.'
  else if (values.title.trim().length < 3) next.title = 'Judul minimal 3 karakter.'
  else if (values.title.length > 255) next.title = 'Judul maksimal 255 karakter.'

  if (!values.location?.trim()) next.location = 'Lokasi wajib diisi.'
  else if (values.location.length > 255) next.location = 'Lokasi maksimal 255 karakter.'

  if (!EMPLOYMENT_OPTIONS.some((option) => option.value === values.employment_type)) {
    next.employment_type = 'Tipe pekerjaan tidak valid.'
  }

  if (!STATUS_OPTIONS.some((option) => option.value === values.status)) {
    next.status = 'Status tidak valid.'
  }

  if (!values.description?.trim()) next.description = 'Deskripsi wajib diisi.'
  else if (values.description.trim().length < 20) {
    next.description = 'Deskripsi minimal 20 karakter.'
  }

  if (!values.requirements?.trim()) next.requirements = 'Persyaratan wajib diisi.'
  else if (values.requirements.trim().length < 10) {
    next.requirements = 'Persyaratan minimal 10 karakter.'
  }

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

export default function JobFormPage() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { data, loading, error, refetch } = useApi(
    isEdit ? `/api/company/jobs/${id}` : null,
    { immediate: isEdit },
  )

  const {
    values,
    errors,
    formError,
    submitting,
    setValues,
    handleChange,
    handleSubmit,
  } = useForm({
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
    onSubmit: async (formValues) => {
      const body = {
        title: formValues.title.trim(),
        location: formValues.location.trim(),
        employment_type: formValues.employment_type,
        salary_min: toNumber(formValues.salary_min),
        salary_max: toNumber(formValues.salary_max),
        description: formValues.description.trim(),
        requirements: formValues.requirements.trim(),
        status: formValues.status,
      }

      const path = isEdit ? `/api/company/jobs/${id}` : '/api/company/jobs'
      await apiClient(path, { method: isEdit ? 'PUT' : 'POST', body })
      navigate('/company/jobs', { replace: true })
    },
  })

  useEffect(() => {
    if (!data) return
    const job = data.job ?? data
    setValues({
      title: job.title ?? '',
      location: job.location ?? '',
      employment_type: job.employment_type ?? 'full_time',
      salary_min: job.salary_min ?? '',
      salary_max: job.salary_max ?? '',
      description: job.description ?? '',
      requirements: job.requirements ?? '',
      status: job.status ?? 'open',
    })
  }, [data, setValues])

  if (isEdit && loading && !data) {
    return (
      <div className="mx-auto w-full max-w-[900px]">
        <div className="h-6 w-32 animate-pulse rounded bg-[#e3ddcf]" />
        <div className="mt-6 h-[520px] animate-pulse rounded-2xl bg-[#e6e0d2]" />
      </div>
    )
  }

  if (isEdit && error && !data) {
    return (
      <div className="mx-auto w-full max-w-[900px]">
        <ErrorAlert message="Lowongan tidak ditemukan atau gagal dimuat." />
        <button
          type="button"
          onClick={() => refetch().catch(() => {})}
          className="mt-4 rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31]"
        >
          Coba lagi
        </button>
        <Link
          to="/company/jobs"
          className="mt-3 ml-3 inline-flex rounded-full border border-[#e3ddcf] bg-white px-5 py-2.5 text-sm font-semibold text-[#10251f]"
        >
          Kembali ke daftar lowongan
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <header>
        <Link
          to="/company/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7671] transition hover:text-[#e8623a]"
        >
          <span aria-hidden="true">←</span> Daftar lowongan
        </Link>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8623a]">
          {isEdit ? 'Ubah lowongan' : 'Buat lowongan'}
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl">
          {isEdit ? 'Perbarui detail lowongan.' : 'Lowongan baru untuk kandidat.'}
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#4b5b55]">
          Tulis judul, lokasi, gaji, deskripsi, dan persyaratan agar kandidat paham posisinya.
        </p>
      </header>

      <form
        className="mt-6 space-y-5 rounded-2xl border border-[#e3ddcf] bg-white/70 p-5 sm:p-6"
        noValidate
        onSubmit={handleSubmit}
      >
        {formError ? <ErrorAlert message={formError} /> : null}

        <TextField
          id="title"
          name="title"
          label="Judul lowongan"
          placeholder="Contoh: Frontend Developer"
          value={values.title}
          onChange={handleChange}
          error={errors.title}
          required
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="location"
            name="location"
            label="Lokasi"
            placeholder="Contoh: Jakarta / Remote"
            value={values.location}
            onChange={handleChange}
            error={errors.location}
            required
          />

          <FormField
            label="Tipe pekerjaan"
            htmlFor="employment_type"
            error={errors.employment_type}
          >
            <select
              id="employment_type"
              name="employment_type"
              value={values.employment_type}
              onChange={handleChange}
              aria-invalid={errors.employment_type ? 'true' : undefined}
              className={SELECT_CLASS}
            >
              {EMPLOYMENT_OPTIONS.map((option) => (
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
            value={values.salary_min}
            onChange={handleChange}
            error={errors.salary_min}
          />

          <TextField
            id="salary_max"
            name="salary_max"
            type="number"
            inputMode="numeric"
            min="0"
            label="Gaji maksimum (Rp)"
            placeholder="Contoh: 8000000"
            value={values.salary_max}
            onChange={handleChange}
            error={errors.salary_max}
          />
        </div>

        <FormField
          label="Deskripsi pekerjaan"
          htmlFor="description"
          error={errors.description}
          hint="Jelaskan tanggung jawab dan konteks tim."
        >
          <textarea
            id="description"
            name="description"
            rows={5}
            value={values.description}
            onChange={handleChange}
            placeholder="Apa yang akan dikerjakan kandidat…"
            aria-invalid={errors.description ? 'true' : undefined}
            className={`${INPUT_CLASS} resize-y ${
              errors.description ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : ''
            }`}
          />
        </FormField>

        <FormField
          label="Persyaratan"
          htmlFor="requirements"
          error={errors.requirements}
          hint="Pisahkan poin dengan baris baru."
        >
          <textarea
            id="requirements"
            name="requirements"
            rows={5}
            value={values.requirements}
            onChange={handleChange}
            placeholder={'Minimal 3 tahun pengalaman…\nMenguasai React…'}
            aria-invalid={errors.requirements ? 'true' : undefined}
            className={`${INPUT_CLASS} resize-y ${
              errors.requirements ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10' : ''
            }`}
          />
        </FormField>

        <FormField label="Status lowongan" htmlFor="status" error={errors.status}>
          <select
            id="status"
            name="status"
            value={values.status}
            onChange={handleChange}
            aria-invalid={errors.status ? 'true' : undefined}
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
          <Link
            to="/company/jobs"
            className="rounded-full border border-[#e3ddcf] bg-white px-5 py-2.5 text-sm font-semibold text-[#10251f]/70 transition hover:border-[#0f2a23]/30 hover:text-[#10251f]"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0f2a23] px-6 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-[#f3efe4]/30 border-t-[#f3efe4]"
                />
                Menyimpan...
              </>
            ) : isEdit ? (
              'Simpan perubahan'
            ) : (
              'Buat lowongan'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
