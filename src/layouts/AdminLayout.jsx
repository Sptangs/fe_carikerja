import { useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ChevronDownIcon } from 'lucide-react'
import { useAuth } from '../auth/useAuth'
import {
  IconBriefcase,
  IconBuilding,
  IconClose,
  IconDashboard,
  IconInbox,
  IconLogout,
  IconMenu,
  IconUsers,
} from '../components/icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '../components/ui/sheet'

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: IconDashboard, end: true },
  { to: '/admin/users', label: 'Pengguna', icon: IconUsers },
  { to: '/admin/companies', label: 'Perusahaan', icon: IconBuilding },
  { to: '/admin/jobs', label: 'Lowongan', icon: IconBriefcase },
  { to: '/admin/applications', label: 'Lamaran', icon: IconInbox },
]

const PAGE_TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/users': 'Daftar Pengguna',
  '/admin/users/new': 'Buat Pengguna',
  '/admin/companies': 'Manajemen Perusahaan',
  '/admin/jobs': 'Manajemen Lowongan',
  '/admin/applications': 'Manajemen Lamaran',
}

function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/admin/users/')) return 'Detail Pengguna'
  if (pathname.startsWith('/admin/companies/')) return 'Detail Perusahaan'
  if (pathname.startsWith('/admin/jobs/')) return 'Detail Lowongan'
  return 'Panel Admin'
}

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2)
  if (parts.length === 0) return 'A'
  return parts.map((part) => part[0]).join('').toUpperCase()
}

function NavList({ onNavigate }) {
  return (
    <ul className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon
        return (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] ${
                  isActive
                    ? 'bg-[#f3efe4] text-[#0f2a23] shadow-[0_10px_30px_-18px_rgba(0,0,0,0.9)]'
                    : 'text-[#f3efe4]/65 hover:bg-white/5 hover:text-[#f3efe4]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
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
  )
}

function SidebarBrand({ badge = 'Admin' }) {
  return (
    <Link
      to="/admin/dashboard"
      className="inline-flex items-baseline gap-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
    >
      <span className="font-display text-xl font-bold tracking-tight">CariKerja</span>
      <span className="text-xl font-bold text-[#e8623a]">.</span>
      <span className="ml-2 rounded-full border border-[#f3efe4]/20 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#f3efe4]/60">
        {badge}
      </span>
    </Link>
  )
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sheetOpen, setSheetOpen] = useState(false)

  const title = useMemo(() => getPageTitle(location.pathname), [location.pathname])
  const year = new Date().getFullYear()
  const name = user?.name ?? 'Admin'
  const email = user?.email ?? ''
  const initials = getInitials(name)

  async function handleLogout() {
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

      <aside
        aria-label="Navigasi admin"
        className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col overflow-y-auto bg-[#0f2a23] text-[#f3efe4] lg:flex"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#e8623a]/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#9dc36b]/15 blur-3xl" />
        </div>

        <div className="relative flex h-20 shrink-0 items-center px-6">
          <SidebarBrand />
        </div>

        <nav aria-label="Menu utama" className="relative flex-1 px-3 py-4">
          <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#f3efe4]/35">
            Menu
          </p>
          <NavList />
        </nav>
      </aside>

      <div className="flex min-h-svh flex-col lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-[#e3ddcf] bg-[#f3efe4]/85 backdrop-blur">
          <div className="flex h-20 items-center gap-4 px-4 sm:px-6 lg:px-10">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger
                aria-label="Buka menu navigasi"
                className="rounded-xl border border-[#e3ddcf] bg-white/70 p-2.5 text-[#0f2a23] transition hover:border-[#0f2a23]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] lg:hidden"
              >
                <IconMenu className="h-5 w-5" aria-hidden="true" />
              </SheetTrigger>
              <SheetContent
                side="left"
                showCloseButton={false}
                className="w-72 max-w-none border-r-0 bg-[#0f2a23] p-0 text-[#f3efe4]"
              >
                <SheetTitle className="sr-only">Menu admin</SheetTitle>
                <div className="flex h-20 shrink-0 items-center justify-between px-6">
                  <SidebarBrand />
                  <button
                    type="button"
                    onClick={() => setSheetOpen(false)}
                    aria-label="Tutup menu"
                    className="rounded-lg p-2.5 text-[#f3efe4]/60 transition hover:bg-white/10 hover:text-[#f3efe4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
                  >
                    <IconClose className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                <nav aria-label="Menu utama" className="flex-1 px-3 py-4">
                  <p className="px-3 pb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#f3efe4]/35">
                    Menu
                  </p>
                  <NavList onNavigate={() => setSheetOpen(false)} />
                </nav>
              </SheetContent>
            </Sheet>

            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#e8623a]">
                Panel Admin
              </p>
              <h1 className="truncate font-display text-xl font-bold tracking-tight sm:text-2xl">
                {title}
              </h1>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger
                  aria-label={`Menu profil ${name}`}
                  className="flex items-center gap-3 rounded-full border border-[#e3ddcf] bg-white/70 py-1.5 pl-1.5 pr-3 transition hover:border-[#0f2a23]/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] sm:pr-4"
                >
                  <span
                    aria-hidden="true"
                    className="grid h-9 w-9 place-items-center rounded-full bg-[#0f2a23] text-xs font-bold text-[#f3efe4]"
                  >
                    {initials}
                  </span>
                  <span className="hidden min-w-0 text-left sm:block">
                    <span className="block max-w-[10rem] truncate text-xs font-semibold">
                      {name}
                    </span>
                    <span className="block text-[10px] uppercase tracking-[0.16em] text-[#7a857f]">
                      Admin
                    </span>
                  </span>
                  <ChevronDownIcon
                    aria-hidden="true"
                    className="hidden h-4 w-4 text-[#7a857f] sm:block"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="min-w-56">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-medium text-[#10251f]">
                      <span className="block truncate">{name}</span>
                      <span className="block truncate text-xs font-normal text-[#6b7671]">
                        {email}
                      </span>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer gap-2.5 px-3 py-2.5 text-sm font-semibold text-[#a63f1f] focus:bg-[#e8623a]/10 focus:text-[#a63f1f]"
                    >
                      <IconLogout className="h-4 w-4" aria-hidden="true" />
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          <Outlet />
        </main>

        <footer className="border-t border-[#e3ddcf] px-4 py-6 sm:px-6 lg:px-10">
          <p className="text-xs text-[#7a857f]">© {year} CariKerja. Panel admin.</p>
        </footer>
      </div>
    </div>
  )
}
