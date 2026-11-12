import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import {
  IconClose,
  IconDashboard,
  IconFileText,
  IconLogout,
  IconMenu,
  IconSearch,
  IconUser,
} from '../components/icons'

const NAV_ITEMS = [
  { to: '/job-seeker/dashboard', label: 'Beranda', icon: IconDashboard, end: true },
  { to: '/job-seeker/jobs', label: 'Cari Lowongan', icon: IconSearch },
  { to: '/job-seeker/applications', label: 'Lamaran Saya', icon: IconFileText },
]

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
  if (parts.length === 0) return 'P'
  return parts.map((part) => part[0]).join('').toUpperCase()
}

export default function JobSeekerLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef(null)

  const initials = getInitials(user?.name)
  const year = new Date().getFullYear()

  useEffect(() => {
    if (!accountOpen) return

    function handlePointerDown(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setAccountOpen(false)
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') setAccountOpen(false)
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [accountOpen])

  async function handleLogout() {
    setMenuOpen(false)
    setAccountOpen(false)
    await logout()
    navigate('/login', { replace: true })
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
          <Link to="/job-seeker/dashboard" className="inline-flex items-baseline gap-1">
            <span className="font-display text-xl font-bold tracking-tight text-[#10251f]">
              CariKerja
            </span>
            <span className="text-xl font-bold text-[#e8623a]">.</span>
            <span className="ml-2 rounded-full border border-[#0f2a23]/15 bg-white/60 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#0f2a23]/60">
              Kandidat
            </span>
          </Link>

          <nav aria-label="Navigasi pencari kerja" className="ml-2 hidden items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `rounded-full px-3.5 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] ${
                    isActive
                      ? 'bg-[#0f2a23] text-[#f3efe4]'
                      : 'text-[#10251f]/65 hover:bg-[#0f2a23]/5 hover:text-[#10251f]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div ref={accountRef} className="relative hidden sm:block">
              <button
                type="button"
                onClick={() => setAccountOpen((value) => !value)}
                aria-haspopup="menu"
                aria-expanded={accountOpen}
                aria-label="Informasi akun"
                className="flex items-center gap-2.5 rounded-full border border-[#e3ddcf] bg-white/70 py-1.5 pl-1.5 pr-3 text-left transition hover:border-[#0f2a23]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
              >
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0f2a23] text-xs font-bold text-[#f3efe4]">
                  {initials}
                </span>
                <span className="max-w-[9rem] truncate text-xs font-semibold">
                  {user?.name ?? 'Pencari Kerja'}
                </span>
                <span aria-hidden="true" className="text-[10px] text-[#7a857f]">
                  ▾
                </span>
              </button>

              {accountOpen ? (
                <div
                  role="menu"
                  aria-label="Informasi akun"
                  className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-[#e3ddcf] bg-white p-2 shadow-[0_28px_60px_-36px_rgba(16,37,31,0.55)]"
                >
                  <div className="border-b border-[#ece7db] px-3 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a857f]">
                      Informasi akun
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold text-[#10251f]">
                      {user?.name ?? 'Pencari Kerja'}
                    </p>
                    {user?.email ? (
                      <p className="truncate text-xs text-[#6b7671]">{user.email}</p>
                    ) : null}
                  </div>

                  <Link
                    to="/job-seeker/profile"
                    role="menuitem"
                    onClick={() => setAccountOpen(false)}
                    className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#10251f]/75 transition hover:bg-[#0f2a23]/5 hover:text-[#10251f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
                  >
                    <IconUser className="h-4 w-4" />
                    Profil & CV
                  </Link>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-[#10251f]/75 transition hover:bg-[#e8623a]/10 hover:text-[#e8623a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
                  >
                    <IconLogout className="h-4 w-4" />
                    Keluar
                  </button>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
              aria-expanded={menuOpen}
              className="rounded-xl border border-[#e3ddcf] bg-white/70 p-2.5 text-[#0f2a23] transition hover:border-[#0f2a23]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] lg:hidden"
            >
              {menuOpen ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="border-t border-[#e3ddcf] bg-[#f3efe4] px-4 py-4 lg:hidden">
            <nav aria-label="Navigasi pencari kerja seluler" className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        isActive
                          ? 'bg-[#0f2a23] text-[#f3efe4]'
                          : 'text-[#10251f]/70 hover:bg-[#0f2a23]/5'
                      }`
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {item.label}
                  </NavLink>
                )
              })}

              <div className="mt-2 space-y-1 border-t border-[#e3ddcf] pt-2">
                <NavLink
                  to="/job-seeker/profile"
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-[#0f2a23] text-[#f3efe4]'
                        : 'text-[#10251f]/70 hover:bg-[#0f2a23]/5'
                    }`
                  }
                >
                  <IconUser className="h-5 w-5 shrink-0" />
                  Profil & CV
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#10251f]/70 transition hover:bg-[#e8623a]/10 hover:text-[#e8623a]"
                >
                  <IconLogout className="h-5 w-5 shrink-0" />
                  Keluar
                </button>
              </div>
            </nav>
          </div>
        ) : null}
      </header>

      <main id="main-content" className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-[#e3ddcf] bg-[#0f2a23] text-[#f3efe4]">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-10">
          <div>
            <Link to="/job-seeker/dashboard" className="inline-flex items-baseline gap-1">
              <span className="font-display text-xl font-bold tracking-tight">CariKerja</span>
              <span className="text-xl font-bold text-[#e8623a]">.</span>
            </Link>
            <p className="mt-2 max-w-sm text-xs leading-relaxed text-[#f3efe4]/55">
              Ruang pencari kerja untuk menemukan lowongan, melamar, dan memantau langkah
              kariermu.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-[#f3efe4]/55">
            {NAV_ITEMS.slice(1).map((item) => (
              <Link key={item.to} to={item.to} className="transition hover:text-[#f3efe4]">
                {item.label}
              </Link>
            ))}
            <Link to="/job-seeker/profile" className="transition hover:text-[#f3efe4]">
              Profil & CV
            </Link>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto w-full max-w-[1240px] px-4 py-5 text-xs text-[#f3efe4]/40 sm:px-6 lg:px-10">
            © {year} CariKerja. Panel pencari kerja.
          </div>
        </div>
      </footer>
    </div>
  )
}
