import { useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import FullPageLoader from '../../components/FullPageLoader'
import TextField from '../../components/TextField'
import { authErrorMessage } from '../../auth/errors'
import { roleHome } from '../../auth/roles'
import { useAuth } from '../../auth/useAuth'
import { useForm } from '../../hooks/useForm'
import AuthShell from './AuthShell'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

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

export default function LoginPage() {
  const { login, user, restoring } = useAuth()
  const location = useLocation()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm({
    initialValues: { email: '', password: '' },
    validate: (values) => {
      const errors = {}
      if (!values.email.trim()) errors.email = 'Email wajib diisi.'
      else if (!EMAIL_PATTERN.test(values.email.trim()))
        errors.email = 'Format email tidak valid.'
      if (!values.password) errors.password = 'Kata sandi wajib diisi.'
      return errors
    },
    onSubmit: (values) =>
      login({ email: values.email.trim().toLowerCase(), password: values.password }),
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
      variant="login"
      title="Masuk ke akunmu"
      description="Lanjutkan perjalanan kariermu dari tempat terakhir."
      footer={
        <>
          Belum punya akun?{' '}
          <Link
            to="/register"
            className="font-semibold text-[#0f2a23] underline decoration-[#e8623a] decoration-2 underline-offset-4 transition hover:text-[#e8623a]"
          >
            Daftar sekarang
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

        <TextField
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Kata sandi"
          placeholder="Masukkan kata sandi"
          autoComplete="current-password"
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
              Masuk
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
