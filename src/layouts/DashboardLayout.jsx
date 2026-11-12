import { useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { IconArrowUpRight, IconClose, IconLogout, IconMenu } from '../components/icons'

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
  if (parts.length === 0) return 'P'
  return parts.map((part) => part[0]).join('').toUpperCase()
}

export default function DashboardLayout({
  badge = 'Panel',
  roleLabel = 'Pengguna',
  navItems = [],
  getPageTitle,
  headerLink,
  footerTitle,
  footerNote,
  navLabel = 'Menu',
}) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const title = useMemo(
    () => (getPageTitle ? getPageTitle(location.pathname) : 'Dashboard'),
    [getPageTitle, location.pathname],
  )
  const year = new Date().getFullYear()
  const name = user?.name ?? roleLabel
  const email = user?.email ?? ''
  const initials = getInitials(name)
  const homePath = navItems[0]?.to ?? '/'

  function closeSidebar() {
    setSidebarOpen(false)
  }

  async function handleLogout() {
    closeSidebar()
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-svh bg-[#f3efe4] text-[#10251f]">
      <a
        href="#main-content"
        className="sr-only rounded-lg bg-[#0f2a23] px-4 py-2 text-sm font-semibold text-[#f3efe4] focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]"
      >
        Lewati ke konten
      </a>

      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Tutup menu navigasi"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-[#0a1f19]/60 backdrop-blur-sm lg:hidden"
        />
      ) : null}

      <aside
        aria-label={`Navigasi ${roleLabel}`}
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto bg-[#0f2a23] text-[#f3efe4] transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#e8623a]/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#9dc36b]/15 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: 'radial-gradient(#f3efe4 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        <div className="relative flex h-20 shrink-0 items-center justify-between px-6">
          <Link to={homePath} onClick={closeSidebar} className="inline-flex items-baseline gap-1">
            <span className="font-display text-xl font-bold tracking-tight">CariKerja</span>
            <span className="text-xl font-bold text-[#e8623a]">.</span>
            <span className="ml-2 rounded-full border border-[#f3efe4]/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#f3efe4]/60">
              {badge}
            </span>
          </Link>
          <button
            type="button"
            onClick={closeSidebar}
            aria-label="Tutup menu"
            className="rounded-lg p-2 text-[#f3efe4]/60 transition hover:bg-white/10 hover:text-[#f3efe4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] lg:hidden"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <nav aria-label="Menu utama" className="relative flex-1 px-3 py-4">
          <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#f3efe4]/35">
            {navLabel}
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={closeSidebar}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] ${
                        isActive
                          ? 'bg-[#f3efe4] text-[#0f2a23] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.9)]'
                          : 'text-[#f3efe4]/65 hover:bg-white/5 hover:text-[#f3efe4]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon className="h-5 w-5 shrink-0" />
                        <span className="truncate">{item.label}</span>
                        {isActive ? (
                          <span
                            aria-hidden="true"
                            className="ml-auto h-1.5 w-1.5 rounded-full bg-[#e8623a]"
                          />
                        ) : null}
                      </>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>

          <div className="mt-8 px-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#f3efe4]/50 transition hover:text-[#9dc36b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
            >
              Lihat situs publik
              <IconArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </nav>

        <div className="relative shrink-0 border-t border-white/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#9dc36b] text-sm font-bold text-[#0f2a23]">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs text-[#f3efe4]/50">{email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-[#f3efe4]/75 transition hover:border-[#e8623a]/60 hover:bg-[#e8623a]/10 hover:text-[#f3efe4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
          >
            <IconLogout className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </aside>

      <div className="flex min-h-svh flex-col lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-[#e3ddcf] bg-[#f3efe4]/85 backdrop-blur">
          <div className="flex h-20 items-center gap-4 px-4 sm:px-6 lg:px-10">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu navigasi"
              aria-expanded={sidebarOpen}
              className="rounded-xl border border-[#e3ddcf] bg-white/70 p-2.5 text-[#0f2a23] transition hover:border-[#0f2a23]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] lg:hidden"
            >
              <IconMenu className="h-5 w-5" />
            </button>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e8623a]">
                Panel {roleLabel}
              </p>
              <h1 className="truncate font-display text-xl font-bold tracking-tight sm:text-2xl">
                {title}
              </h1>
            </div>

            <div className="ml-auto flex items-center gap-3">
              {headerLink ? (
                <Link
                  to={headerLink.to}
                  className="hidden items-center gap-1.5 rounded-full border border-[#e3ddcf] bg-white/60 px-4 py-2 text-xs font-semibold text-[#0f2a23]/70 transition hover:border-[#0f2a23]/30 hover:text-[#0f2a23] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] sm:inline-flex"
                >
                  {headerLink.label}
                  <IconArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              ) : null}

              <div className="flex items-center gap-3 rounded-full border border-[#e3ddcf] bg-white/70 py-1.5 pl-1.5 pr-3 sm:pr-4">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0f2a23] text-xs font-bold text-[#f3efe4]">
                  {initials}
                </span>
                <div className="hidden min-w-0 text-left sm:block">
                  <p className="max-w-[10rem] truncate text-xs font-semibold">{name}</p>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-[#7a857f]">
                    {roleLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </main>

        <footer className="border-t border-[#e3ddcf] px-4 py-6 sm:px-6 lg:px-10">
          <div className="flex flex-col gap-2 text-xs text-[#7a857f] sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} CariKerja. {footerTitle}
            </p>
            <p>{footerNote}</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
