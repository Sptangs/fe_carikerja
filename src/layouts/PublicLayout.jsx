import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { IconArrowUpRight, IconClose, IconLogout, IconMenu } from '../components/icons'

const NAV_ITEMS = [
  { href: '#beranda', label: 'Beranda' },
  { href: '#tentang-kami', label: 'Tentang Kami' },
  { href: '#cara-kerja', label: 'Cara Kerja' },
  { href: '#solusi-perusahaan', label: 'Solusi Perusahaan' },
  { href: '#testimoni', label: 'Testimoni' },
]

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
  if (parts.length === 0) return 'P'
  return parts.map((part) => part[0]).join('').toUpperCase()
}

function BrandMark() {
  return (
    <Link to="/" className="inline-flex items-baseline gap-1">
      <span className="font-display text-xl font-bold tracking-tight text-[#10251f]">CariKerja</span>
      <span className="text-xl font-bold text-[#e8623a]">.</span>
    </Link>
  )
}

export default function PublicLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const initials = getInitials(user?.name)
  const year = new Date().getFullYear()

  async function handleLogout() {
    setMenuOpen(false)
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <div className="flex min-h-svh flex-col bg-[#f3efe4] text-[#10251f]">
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-[#0f2a23] px-4 py-2 text-sm font-semibold text-[#f3efe4] focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]"
      >
        Lewati ke konten
      </a>

      <header className="sticky top-0 z-40 border-b border-[#e3ddcf] bg-[#f3efe4]/85 backdrop-blur">
        <div className="mx-auto flex h-20 w-full max-w-[1240px] items-center gap-4 px-4 sm:px-6 lg:px-10">
          <BrandMark />

          <nav aria-label="Navigasi utama" className="ml-4 hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="rounded-full px-3 py-2 text-xs font-medium text-[#10251f]/70 transition hover:bg-[#0f2a23]/5 hover:text-[#10251f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] lg:px-3.5 lg:text-sm"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {user ? (
              <>
                <div className="hidden items-center gap-2.5 rounded-full border border-[#e3ddcf] bg-white/70 py-1.5 pl-1.5 pr-4 sm:flex">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0f2a23] text-xs font-bold text-[#f3efe4]">
                    {initials}
                  </span>
                  <span className="max-w-[9rem] truncate text-xs font-semibold">{user.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-[#e3ddcf] bg-white/60 px-3 py-2 text-xs font-semibold text-[#10251f]/70 transition hover:border-[#e8623a]/50 hover:text-[#e8623a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] sm:px-4"
                >
                  <IconLogout className="h-4 w-4" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden rounded-full px-4 py-2 text-sm font-semibold text-[#10251f]/70 transition hover:text-[#10251f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] sm:inline-flex"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#0f2a23] px-4 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
                >
                  Daftar
                  <IconArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={menuOpen}
              className="rounded-xl border border-[#e3ddcf] bg-white/70 p-2.5 text-[#0f2a23] transition hover:border-[#0f2a23]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] md:hidden"
            >
              {menuOpen ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-[#e3ddcf] bg-[#f3efe4] px-4 py-4 md:hidden">
            <nav aria-label="Navigasi seluler" className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#10251f]/70 transition hover:bg-[#0f2a23]/5"
                >
                  {item.label}
                </a>
              ))}
              {user ? null : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-[#10251f]/70 transition hover:bg-[#0f2a23]/5"
                >
                  Masuk
                </Link>
              )}
            </nav>
          </div>
        ) : null}
      </header>

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[#e3ddcf] bg-[#0f2a23] text-[#f3efe4]">
        <div className="mx-auto grid w-full max-w-[1240px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
          <div>
            <Link to="/" className="inline-flex items-baseline gap-1">
              <span className="font-display text-2xl font-bold tracking-tight">CariKerja</span>
              <span className="text-2xl font-bold text-[#e8623a]">.</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#f3efe4]/60">
              Menghubungkan pencari kerja dengan perusahaan yang tepat. Tanpa biaya, tanpa ribet.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9dc36b]">
              Jelajahi
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-[#f3efe4]/70">
              <li>
                <a href="#tentang-kami" className="transition hover:text-[#f3efe4]">
                  Tentang Kami
                </a>
              </li>
              <li>
                <Link to="/register" className="transition hover:text-[#f3efe4]">
                  Buat akun
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9dc36b]">
              Untuk perusahaan
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-[#f3efe4]/70">
              <li>
                <a href="#solusi-perusahaan" className="transition hover:text-[#f3efe4]">
                  Solusi perusahaan
                </a>
              </li>
              <li>
                <Link to="/login" className="transition hover:text-[#f3efe4]">
                  Masuk panel
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-2 px-4 py-6 text-xs text-[#f3efe4]/45 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
            <p>© {year} CariKerja. Semua hak dilindungi.</p>
            <p>Dibuat untuk memudahkan langkah kariermu.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
