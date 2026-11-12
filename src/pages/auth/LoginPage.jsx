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
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              aria-pressed={showPassword}
              className="rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#0f2a23]/60 transition hover:bg-[#0f2a23]/5 hover:text-[#0f2a23] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
            >
              {showPassword ? 'Sembunyi' : 'Lihat'}
            </button>
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
