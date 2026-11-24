import { useState } from 'react'
import { Link, Navigate, useLocation, useSearchParams } from 'react-router-dom'
import FullPageLoader from '../../components/FullPageLoader'
import TextField from '../../components/TextField'
import { authErrorMessage } from '../../auth/errors'
import { roleHome } from '../../auth/roles'
import { useAuth } from '../../auth/useAuth'
import { useForm } from '../../hooks/useForm'
import AuthShell from './AuthShell'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const ROLES = [
  {
    value: 'job_seeker',
    label: 'Pencari kerja',
    description: 'Cari, simpan, dan lamar lowongan.',
  },
  {
    value: 'company',
    label: 'Perusahaan',
    description: 'Pasang lowongan dan temukan talenta.',
  },
]

function EyeIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6A2 2 0 0 0 13.4 13.4" />
      <path d="M9.1 5.5A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a17.7 17.7 0 0 1-4.2 5.2" />
      <path d="M6.2 6.1A17.8 17.8 0 0 0 2 12s3.5 7 10 7a10.8 10.8 0 0 0 6.1-2" />
    </svg>
  )
}

function PasswordToggle({ visible, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
      aria-pressed={visible}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-[#0f2a23]/60 transition hover:bg-[#0f2a23]/5 hover:text-[#0f2a23] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
    >
      {visible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
    </button>
  )
}

export default function RegisterPage() {
  const { register, user, restoring } = useAuth()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const defaultRole = searchParams.get('role') === 'company' ? 'company' : 'job_seeker'
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const form = useForm({
    initialValues: {
      name: '',
      email: '',
      role: defaultRole,
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
    onSubmit: (values) =>
      register({
        ...values,
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        company_name: values.company_name.trim(),
      }),
  })

  if (restoring) return <FullPageLoader label="Memeriksa sesi..." />

  if (user) {
    const from = location.state?.from?.pathname
    const target = from && from !== '/login' && from !== '/register' ? from : roleHome(user.role)
    return <Navigate to={target} replace />
  }

  const hasFieldErrors = Object.keys(form.errors).length > 0
  const generalError = form.error && !hasFieldErrors ? authErrorMessage(form.error) : null

  return (
    <AuthShell
      variant="register"
      title="Buat akun baru"
      description="Pilih peranmu dan mulai dalam hitungan menit."
      footer={
        <>
          Sudah punya akun?{' '}
          <Link
            to="/login"
            className="font-semibold text-[#0f2a23] underline decoration-[#e8623a] decoration-2 underline-offset-4 transition hover:text-[#e8623a]"
          >
            Masuk di sini
          </Link>
        </>
      }
    >
      <form className="space-y-5" noValidate onSubmit={form.handleSubmit}>
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
          placeholder="Nama kamu"
          autoComplete="name"
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
          autoComplete="email"
          required
          value={form.values.email}
          onChange={form.handleChange}
          error={form.errors.email}
        />

        <fieldset>
          <legend className="block text-sm font-medium text-slate-900">Daftar sebagai</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {ROLES.map((option) => {
              const active = form.values.role === option.value
              return (
                <label
                  key={option.value}
                  className={`cursor-pointer rounded-xl border p-4 transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#e8623a] has-[:focus-visible]:ring-offset-2 ${
                    active
                      ? 'border-[#0f2a23] bg-[#0f2a23]/5 shadow-sm'
                      : 'border-[#ded8ca] bg-white hover:border-[#0f2a23]/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={option.value}
                    checked={active}
                    onChange={form.handleChange}
                    className="sr-only"
                  />
                  <span className="block text-sm font-semibold text-[#10251f]">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-[#6b7671]">
                    {option.description}
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>

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

        <button
          type="submit"
          disabled={form.submitting}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f2a23] px-5 py-3.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {form.submitting ? (
            <>
              <span
                aria-hidden="true"
                className="h-4 w-4 animate-spin rounded-full border-2 border-[#f3efe4]/30 border-t-[#f3efe4]"
              />
              Memproses...
            </>
          ) : (
            <>
              Buat akun
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </>
          )}
        </button>
      </form>
    </AuthShell>
  )
}
