import { IconDashboard, IconUsers } from '../components/icons'
import DashboardLayout from './DashboardLayout'

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: IconDashboard, end: true },
  { to: '/admin/users', label: 'Manajemen Pengguna', icon: IconUsers },
]

const PAGE_TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/users': 'Manajemen Pengguna',
  '/admin/users/new': 'Tambah Pengguna',
}

function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/admin/users/')) return 'Detail Pengguna'
  return 'Panel Admin'
}

export default function AdminLayout() {
  return (
    <DashboardLayout
      badge="Admin"
      roleLabel="Admin"
      navItems={NAV_ITEMS}
      getPageTitle={getPageTitle}
      headerLink={{ to: '/jobs', label: 'Lowongan publik' }}
      footerTitle="Panel admin."
      footerNote="Kelola pengguna dan operasional platform dari satu tempat."
    />
  )
}
