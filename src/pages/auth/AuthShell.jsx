import { Link } from 'react-router-dom'

const COPY = {
  login: {
    kicker: 'Selamat datang kembali',
    headline: 'Peluang berikutnya dimulai dari sini.',
    body: 'Masuk untuk melanjutkan lamaran, memantau status, dan mengelola lowonganmu.',
  },
  register: {
    kicker: 'Mulai langkah baru',
    headline: 'Satu akun, banyak kemungkinan.',
    body: 'Pencari kerja menemukan peran yang tepat. Perusahaan menemukan talenta yang tepat.',
  },
}

export default function AuthShell({ variant = 'login', title, description, children, footer }) {
  const copy = COPY[variant] ?? COPY.login
  const contentWidth = 'w-full max-w-[980px] lg:max-w-[1050px] xl:max-w-[1120px]'

  return (
    <div className="min-h-svh bg-[#f3efe4] text-[#10251f]">
      <div className="mx-auto grid min-h-svh w-full max-w-[1700px] xl:grid-cols-[0.94fr_1.06fr]">
        <aside className="relative hidden overflow-hidden bg-[#0f2a23] px-10 py-10 text-[#f3efe4] xl:flex xl:flex-col xl:justify-between xl:px-16 xl:py-14">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#e8623a]/30 blur-3xl" />
            <div className="absolute -bottom-40 -left-24 h-[28rem] w-[28rem] rounded-full bg-[#9dc36b]/20 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage: 'radial-gradient(#f3efe4 1px, transparent 1px)',
                backgroundSize: '26px 26px',
              }}
            />
          </div>

          <Link to="/" className="relative inline-flex w-fit items-baseline gap-1">
            <span className="font-display text-2xl font-bold tracking-tight">CariKerja</span>
            <span className="text-2xl font-bold text-[#e8623a]">.</span>
          </Link>

          <div className="relative max-w-md">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9dc36b]">
              {copy.kicker}
            </p>
            <h2 className="mt-5 font-display text-5xl font-bold leading-[1.02] tracking-tight xl:text-6xl">
              {copy.headline}
            </h2>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-[#f3efe4]/70">{copy.body}</p>
          </div>

          <div className="relative flex flex-wrap gap-x-8 gap-y-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#f3efe4]/45">
            <span>Lowongan terkurasi</span>
            <span>CV aman</span>
            <span>Tanpa biaya</span>
          </div>
        </aside>

        <main className="flex min-h-svh items-center justify-center px-4 py-8 sm:px-8 lg:px-10 xl:px-12">
          <div className={`auth-rise w-full ${contentWidth}`}>
            <Link to="/" className="mb-8 inline-flex items-baseline gap-1 xl:hidden">
              <span className="font-display text-2xl font-bold tracking-tight">CariKerja</span>
              <span className="text-2xl font-bold text-[#e8623a]">.</span>
            </Link>

            <div className="rounded-[30px] border border-[#e3ddcf] bg-white/80 p-6 shadow-[0_24px_80px_-38px_rgba(16,37,31,0.52)] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_30px_90px_-36px_rgba(16,37,31,0.62)] sm:p-8 lg:p-10 xl:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#e8623a]">
                {variant === 'register' ? 'Daftar' : 'Masuk'}
              </p>
              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
                {title}
              </h1>
              {description ? <p className="mt-2 text-sm text-[#4b5b55]">{description}</p> : null}

              <div className="mt-7">{children}</div>

              {footer ? (
                <div className="mt-6 border-t border-[#e3ddcf] pt-5 text-sm text-[#4b5b55]">
                  {footer}
                </div>
              ) : null}
            </div>

            <p className="mt-6 text-center text-xs text-[#7a857f]">
              Dengan melanjutkan, kamu menyetujui ketentuan penggunaan CariKerja.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
