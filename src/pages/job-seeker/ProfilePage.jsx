import { useEffect, useRef, useState } from 'react'
import ConfirmDialog from '../../components/ConfirmDialog'
import FormField from '../../components/FormField'
import TextField from '../../components/TextField'
import { IconCheck, IconFileText } from '../../components/icons'
import { useAuth } from '../../auth/useAuth'
import useApi from '../../hooks/useApi'
import useForm from '../../hooks/useForm'
import apiClient from '../../lib/apiClient'
import { download } from '../../lib/download'

const MAX_CV_SIZE = 5 * 1024 * 1024
const CV_EXTENSION = /\.(pdf|doc|docx)$/i
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const INPUT_CLASS =
  'w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#10251f] outline-none transition placeholder:text-[#9aa39e] focus:ring-4 focus:ring-[#0f2a23]/10'

function getCvError(file) {
  if (!file) return null
  if (!CV_EXTENSION.test(file.name)) return 'Format CV harus PDF, DOC, atau DOCX.'
  if (file.size > MAX_CV_SIZE) return 'Ukuran CV maksimal 5 MB.'
  return null
}

function validate(values) {
  const next = {}

  if (!values.name?.trim()) next.name = 'Nama lengkap wajib diisi.'
  else if (values.name.trim().length < 2) next.name = 'Nama minimal 2 karakter.'

  if (!values.email?.trim()) next.email = 'Email wajib diisi.'
  else if (!EMAIL_PATTERN.test(values.email.trim())) next.email = 'Format email tidak valid.'

  if (values.phone && values.phone.length > 30) next.phone = 'Nomor telepon maksimal 30 karakter.'
  if (values.education && values.education.length > 255) {
    next.education = 'Pendidikan maksimal 255 karakter.'
  }
  if (values.address && values.address.length > 5000) next.address = 'Alamat terlalu panjang.'

  const cvError = getCvError(values.cv)
  if (cvError) next.cv = cvError

  return next
}

function FieldHint({ children }) {
  return <span className="text-[#7a857f]">{children}</span>
}

export default function ProfilePage() {
  const { refreshUser } = useAuth()
  const { data, loading, error, refetch } = useApi('/api/job-seeker/profile')
  const fileInputRef = useRef(null)

  const [hasCvOverride, setHasCvOverride] = useState(null)
  const [success, setSuccess] = useState(null)
  const [fileError, setFileError] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [cvBusy, setCvBusy] = useState(false)
  const [downloadBusy, setDownloadBusy] = useState(false)
  const [cvError, setCvError] = useState(null)

  const {
    values,
    errors,
    formError,
    submitting,
    setValues,
    setValue,
    handleChange,
    handleSubmit,
  } = useForm({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      education: '',
      cv: null,
    },
    validate,
    onSubmit: async (formValues) => {
      const body = new FormData()
      body.append('_method', 'PUT')
      body.append('name', formValues.name.trim())
      body.append('email', formValues.email.trim())
      body.append('phone', formValues.phone?.trim() ?? '')
      body.append('address', formValues.address?.trim() ?? '')
      body.append('education', formValues.education?.trim() ?? '')
      if (formValues.cv) body.append('cv', formValues.cv)

      const payload = await apiClient('/api/job-seeker/profile', {
        method: 'POST',
        body,
      })

      setSuccess(payload?.message ?? 'Profil berhasil diperbarui.')
      setHasCvOverride(Boolean(payload?.data?.has_cv))
      setValue('cv', null)
      setFileError(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      await Promise.allSettled([refetch(), refreshUser()])

      return payload
    },
  })

  useEffect(() => {
    if (!data) return
    setValues({
      name: data.user?.name ?? '',
      email: data.user?.email ?? '',
      phone: data.profile?.phone ?? '',
      address: data.profile?.address ?? '',
      education: data.profile?.education ?? '',
      cv: null,
    })
  }, [data, setValues])

  const hasCv = hasCvOverride ?? Boolean(data?.has_cv)

  function handleCvChange(event) {
    const file = event.target.files?.[0] ?? null
    setValue('cv', file)
    setFileError(getCvError(file))
    setSuccess(null)
  }

  function clearSelectedCv() {
    setValue('cv', null)
    setFileError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleDeleteCv() {
    setCvBusy(true)
    setCvError(null)
    try {
      await apiClient('/api/job-seeker/profile/cv', { method: 'DELETE' })
      setHasCvOverride(false)
      setConfirmDelete(false)
      setSuccess('CV berhasil dihapus.')
      await refetch().catch(() => {})
    } catch (err) {
      setCvError(err?.message ?? 'Gagal menghapus CV. Silakan coba lagi.')
      setConfirmDelete(false)
    } finally {
      setCvBusy(false)
    }
  }

  async function handleDownloadCv() {
    setDownloadBusy(true)
    setCvError(null)
    try {
      await download('/api/job-seeker/profile/cv', 'cv.pdf')
    } catch (err) {
      setCvError(err?.message ?? 'Gagal mengunduh CV. Silakan coba lagi.')
    } finally {
      setDownloadBusy(false)
    }
  }

  const displayCvError = errors.cv ?? fileError
  const selectedCvName = values.cv?.name ?? null

  return (
    <div className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <header className="max-w-2xl">
        <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#0f2a23]/55">
          <span className="h-1.5 w-1.5 rounded-full bg-[#e8623a]" />
          Profil & CV
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-[#10251f] sm:text-4xl">
          Rapikan profil, siapkan CV terbaikmu.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#10251f]/65">
          Data profil yang lengkap membantu perusahaan mengenalimu lebih cepat. Perbarui CV
          kapan pun kamu punya versi terbaru.
        </p>
      </header>

      {loading && !data ? (
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <div className="h-[520px] animate-pulse rounded-[28px] border border-[#e3ddcf] bg-white/50" />
          <div className="space-y-6">
            <div className="h-48 animate-pulse rounded-[28px] border border-[#e3ddcf] bg-white/50" />
            <div className="h-56 animate-pulse rounded-[28px] border border-[#e3ddcf] bg-white/50" />
          </div>
        </div>
      ) : error && !data ? (
        <div
          role="alert"
          className="mt-8 rounded-[28px] border border-[#e8623a]/25 bg-white/70 p-8 text-center"
        >
          <p className="font-display text-lg font-semibold text-[#10251f]">
            Profil belum bisa dimuat.
          </p>
          <p className="mt-2 text-sm text-[#10251f]/60">
            {error.message ?? 'Periksa koneksi lalu coba lagi.'}
          </p>
          <button
            type="button"
            onClick={() => refetch().catch(() => {})}
            className="mt-4 rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173a31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
          >
            Coba lagi
          </button>
        </div>
      ) : (
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
          <section className="rounded-[28px] border border-[#e3ddcf] bg-white/75 p-5 shadow-[0_30px_60px_-50px_rgba(16,37,31,0.6)] sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-semibold text-[#10251f]">
                  Informasi pribadi
                </h2>
                <p className="mt-1 text-xs text-[#6b7671]">
                  Pastikan nama dan email sama dengan dokumen lamaranmu.
                </p>
              </div>
              <span className="rounded-full border border-[#0f2a23]/15 bg-[#f3efe4] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0f2a23]/60">
                Kandidat
              </span>
            </div>

            <form className="mt-6 space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                  id="name"
                  name="name"
                  label="Nama lengkap"
                  placeholder="Nama sesuai KTP"
                  value={values.name}
                  onChange={handleChange}
                  error={errors.name}
                  autoComplete="name"
                  required
                />
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  placeholder="nama@email.com"
                  value={values.email}
                  onChange={handleChange}
                  error={errors.email}
                  autoComplete="email"
                  required
                />
                <TextField
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Nomor telepon"
                  placeholder="08xxxxxxxxxx"
                  value={values.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  autoComplete="tel"
                />
                <TextField
                  id="education"
                  name="education"
                  label="Pendidikan terakhir"
                  placeholder="Contoh: S1 Teknik Informatika"
                  value={values.education}
                  onChange={handleChange}
                  error={errors.education}
                />
              </div>

              <FormField
                label="Alamat"
                htmlFor="address"
                error={errors.address}
                hint="Boleh kota domisili saja."
              >
                <textarea
                  id="address"
                  name="address"
                  rows={4}
                  value={values.address}
                  onChange={handleChange}
                  placeholder="Contoh: Bandung, Jawa Barat"
                  className={`${INPUT_CLASS} resize-y ${
                    errors.address
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10'
                      : 'border-[#ded8ca] focus:border-[#0f2a23]'
                  }`}
                />
              </FormField>

              <div className="rounded-2xl border border-dashed border-[#cfc7b6] bg-[#faf7ef] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#10251f]">CV</p>
                    <p className="mt-1 text-xs text-[#6b7671]">
                      PDF, DOC, atau DOCX. Maksimal 5 MB.
                    </p>
                  </div>
                  {selectedCvName ? (
                    <button
                      type="button"
                      onClick={clearSelectedCv}
                      className="text-xs font-semibold text-[#e8623a] underline-offset-4 hover:underline"
                    >
                      Batalkan pilihan
                    </button>
                  ) : null}
                </div>

                <label
                  htmlFor="cv"
                  className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl border border-[#e3ddcf] bg-white px-4 py-3 transition hover:border-[#0f2a23]/35 focus-within:border-[#0f2a23]"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#0f2a23]/5 text-[#0f2a23]">
                    <IconFileText className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[#10251f]">
                      {selectedCvName ?? 'Pilih file CV baru'}
                    </span>
                    <span className="block text-xs text-[#7a857f]">
                      {hasCv && !selectedCvName
                        ? 'CV saat ini akan diganti jika kamu memilih file.'
                        : 'File akan diunggah saat kamu menyimpan.'}
                    </span>
                  </span>
                </label>
                <input
                  ref={fileInputRef}
                  id="cv"
                  name="cv"
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleCvChange}
                  className="sr-only"
                />
                {displayCvError ? (
                  <p role="alert" className="mt-2 text-xs font-medium text-rose-600">
                    {displayCvError}
                  </p>
                ) : null}
              </div>

              {formError ? (
                <p
                  role="alert"
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                >
                  {formError}
                </p>
              ) : null}

              {success ? (
                <p
                  role="status"
                  className="flex items-start gap-2 rounded-xl border border-[#9dc36b]/45 bg-[#9dc36b]/15 px-4 py-3 text-sm font-medium text-[#0f2a23]"
                >
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  {success}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#ece7db] pt-5">
                <FieldHint>Perubahan langsung tersimpan ke akunmu.</FieldHint>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-full bg-[#0f2a23] px-6 py-3 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173a31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Menyimpan…' : 'Simpan perubahan'}
                </button>
              </div>
            </form>
          </section>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-[#e3ddcf] bg-white/75 p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#7a857f]">
                Status CV
              </p>
              <div className="mt-4 flex items-start gap-3">
                <span
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${
                    hasCv
                      ? 'bg-[#9dc36b]/25 text-[#0f2a23]'
                      : 'bg-[#e8623a]/10 text-[#e8623a]'
                  }`}
                >
                  <IconFileText className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-lg font-semibold leading-snug text-[#10251f]">
                    {hasCv ? 'CV sudah diunggah' : 'Belum ada CV'}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-[#6b7671]">
                    {hasCv
                      ? 'Unduh untuk mengecek, atau ganti dengan versi terbaru lewat formulir.'
                      : 'Lengkapi CV agar perusahaan bisa menilai pengalamanmu.'}
                  </p>
                </div>
              </div>

              {hasCv ? (
                <div className="mt-5 space-y-2">
                  <button
                    type="button"
                    onClick={handleDownloadCv}
                    disabled={downloadBusy}
                    className="w-full rounded-full bg-[#0f2a23] px-4 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173a31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {downloadBusy ? 'Mengunduh…' : 'Unduh CV'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    disabled={cvBusy}
                    className="w-full rounded-full border border-[#e8623a]/35 px-4 py-2.5 text-sm font-semibold text-[#e8623a] transition hover:bg-[#e8623a]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Hapus CV
                  </button>
                </div>
              ) : null}

              {cvError ? (
                <p role="alert" className="mt-3 text-xs font-medium text-rose-600">
                  {cvError}
                </p>
              ) : null}
            </section>

            <section className="rounded-[28px] border border-[#e3ddcf] bg-[#faf7ef] p-6">
              <h2 className="font-display text-base font-semibold text-[#10251f]">
                Sebelum menyimpan
              </h2>
              <ul className="mt-4 space-y-3 text-xs leading-relaxed text-[#10251f]/70">
                {[
                  'Gunakan email aktif yang sering kamu cek.',
                  'Tulis nomor telepon yang bisa dihubungi perusahaan.',
                  'Pastikan CV terbaru berukuran di bawah 5 MB.',
                  'Sebutkan pendidikan terakhir secara singkat.',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2">
                    <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#0f2a23]" />
                    {tip}
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Hapus CV?"
        description="CV yang dihapus tidak bisa dikembalikan. Kamu tetap bisa mengunggah CV baru kapan saja."
        confirmLabel={cvBusy ? 'Menghapus…' : 'Hapus CV'}
        onConfirm={handleDeleteCv}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  )
}
