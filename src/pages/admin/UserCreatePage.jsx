import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormField from '../../components/FormField'
import PageHeader from '../../components/PageHeader'
import TextField from '../../components/TextField'
import { useForm } from '../../hooks/useForm'
import apiClient from '../../lib/apiClient'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ROLE_OPTIONS = [
  { value: 'job_seeker', label: 'Pencari Kerja' },
  { value: 'company', label: 'Perusahaan' },
  { value: 'admin', label: 'Admin' },
]

const SELECT_CLASS =
  'w-full min-h-11 rounded-xl border border-[#ded8ca] bg-white px-4 py-3 text-sm text-[#10251f] outline-none transition focus:border-[#0f2a23] focus:ring-4 focus:ring-[#0f2a23]/10'

function describeError(error) {
  const server = error?.message?.trim()
  switch (error?.status) {
    case 403:
      return 'Anda tidak berwenang untuk membuat pengguna.'
    case 409:
      return server || 'Email sudah terdaftar. Gunakan email lain.'
    case 429:
      return 'Terlalu banyak permintaan. Mohon tunggu sebentar lalu coba lagi.'
    case 500:
      return 'Gagal menyimpan pengguna. Coba lagi sebentar.'
    default:
      return server || 'Terjadi kesalahan. Coba lagi sebentar.'
  }
}

function PasswordToggle({ visible, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
      aria-pressed={visible}
      className="rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#0f2a23]/60 transition hover:bg-[#0f2a23]/5 hover:text-[#0f2a23] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
    >
      {visible ? 'Sembunyi' : 'Lihat'}
    </button>
  )
}

export default function UserCreatePage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      role: 'job_seeker',
      company_name: '',
      password: '',
      password_confirmation: '',
    },
    validate: (values) => {
      const errors = {}
      if (!values.name.trim()) errors.name = 'Nama wajib diisi.'
      else if (values.name.trim().length < 2) errors.name = 'Nama minimal 2 karakter.'

      if (!values.email.trim()) errors.email = 'Email wajib diisi.'
      else if (!EMAIL_PATTERN.test(values.email.trim()))
        errors.email = 'Format email tidak valid.'

      if (!ROLE_OPTIONS.some((option) => option.value === values.role))
        errors.role = 'Role tidak valid.'

      if (values.role === 'company' && !values.company_name.trim())
        errors.company_name = 'Nama perusahaan wajib diisi.'

      if (!values.password) errors.password = 'Kata sandi wajib diisi.'
      else if (values.password.length < 8) errors.password = 'Kata sandi minimal 8 karakter.'

      if (!values.password_confirmation)
        errors.password_confirmation = 'Konfirmasi kata sandi wajib diisi.'
      else if (values.password !== values.password_confirmation)
        errors.password_confirmation = 'Konfirmasi kata sandi tidak cocok.'

      return errors
    },
    onSubmit: async (values) => {
      const payload = await apiClient('/api/users', {
        method: 'POST',
        body: {
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(),
          password: values.password,
          password_confirmation: values.password_confirmation,
          role: values.role,
          ...(values.role === 'company' ? { company_name: values.company_name.trim() } : {}),
        },
      })
      navigate('/admin/users', { replace: true, state: { flash: payload?.message ?? 'Pengguna baru berhasil dibuat.' } })
      return payload
    },
  })

  const hasFieldErrors = Object.keys(form.errors).length > 0
  const generalError = form.error && !hasFieldErrors ? describeError(form.error) : null

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <PageHeader
        title="Buat pengguna baru"
        description="Tentukan role pengguna. Akun perusahaan wajib menyertakan nama perusahaan."
        actions={
          <Link
            to="/admin/users"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#e3ddcf] bg-white px-5 text-sm font-semibold text-[#10251f]/70 transition hover:border-[#0f2a23]/30 hover:text-[#10251f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
          >
            <span aria-hidden="true">←</span> Daftar pengguna
          </Link>
        }
      />

      <form
        className="mt-2 space-y-5 rounded-2xl border border-border bg-card p-5 sm:p-6"
        noValidate
        onSubmit={form.handleSubmit}
      >
        {generalError ? (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          >
            <span aria-hidden="true" className="mt-0.5 font-bold">
              !
            </span>
            <p>{generalError}</p>
          </div>
        ) : null}

        <TextField
          id="name"
          name="name"
          type="text"
          label="Nama lengkap"
          placeholder="Nama pengguna"
          autoComplete="off"
          required
          value={form.values.name}
          onChange={form.handleChange}
          error={form.errors.name}
        />

        <TextField
          id="email"
          name="email"
          type="email"
          label="Email"
          placeholder="nama@email.com"
          autoComplete="off"
          required
          value={form.values.email}
          onChange={form.handleChange}
          error={form.errors.email}
        />

        <FormField label="Role" htmlFor="role" error={form.errors.role}>
          <select
            id="role"
            name="role"
            value={form.values.role}
            onChange={form.handleChange}
            aria-invalid={form.errors.role ? 'true' : undefined}
            aria-describedby={form.errors.role ? 'role-error' : undefined}
            className={SELECT_CLASS}
          >
            {ROLE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </FormField>

        {form.values.role === 'company' ? (
          <TextField
            id="company_name"
            name="company_name"
            type="text"
            label="Nama perusahaan"
            placeholder="PT Contoh Sejahtera"
            autoComplete="organization"
            required
            value={form.values.company_name}
            onChange={form.handleChange}
            error={form.errors.company_name}
          />
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            label="Kata sandi"
            placeholder="Minimal 8 karakter"
            autoComplete="new-password"
            required
            value={form.values.password}
            onChange={form.handleChange}
            error={form.errors.password}
            trailing={
              <PasswordToggle
                visible={showPassword}
                onToggle={() => setShowPassword((visible) => !visible)}
              />
            }
          />

          <TextField
            id="password_confirmation"
            name="password_confirmation"
            type={showConfirmation ? 'text' : 'password'}
            label="Ulangi kata sandi"
            placeholder="Ketik ulang kata sandi"
            autoComplete="new-password"
            required
            value={form.values.password_confirmation}
            onChange={form.handleChange}
            error={form.errors.password_confirmation}
            trailing={
              <PasswordToggle
                visible={showConfirmation}
                onToggle={() => setShowConfirmation((visible) => !visible)}
              />
            }
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#ece7db] pt-5">
          <Link
            to="/admin/users"
            className="inline-flex min-h-11 items-center rounded-full border border-[#e3ddcf] bg-white px-5 text-sm font-semibold text-[#10251f]/70 transition hover:border-[#0f2a23]/30 hover:text-[#10251f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={form.submitting}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#0f2a23] px-6 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] disabled:cursor-not-allowed disabled:opacity-60"
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
              'Buat pengguna'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
