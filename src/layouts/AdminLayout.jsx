import {
  IconBuilding,
  IconBriefcase,
  IconDashboard,
  IconInbox,
  IconUsers,
} from '../components/icons'
import DashboardLayout from './DashboardLayout'

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: IconDashboard, end: true },
  { to: '/admin/users', label: 'Pengguna', icon: IconUsers },
  { to: '/admin/companies', label: 'Perusahaan', icon: IconBuilding },
  { to: '/admin/jobs', label: 'Lowongan', icon: IconBriefcase },
  { to: '/admin/applications', label: 'Lamaran', icon: IconInbox },
]

const PAGE_TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/users': 'Manajemen Pengguna',
  '/admin/companies': 'Manajemen Perusahaan',
  '/admin/jobs': 'Manajemen Lowongan',
  '/admin/applications': 'Manajemen Lamaran',
}

function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (pathname.startsWith('/admin/companies/')) return 'Detail Perusahaan'
  if (pathname.startsWith('/admin/jobs/')) return 'Detail Lowongan'
  return 'Panel Admin'
}

export default function AdminLayout() {
  return (
    <DashboardLayout
      badge="Admin"
      roleLabel="Admin"
      navItems={NAV_ITEMS}
      getPageTitle={getPageTitle}
      headerLink={{ to: '/', label: 'Situs publik' }}
      footerTitle="Panel admin."
      footerNote="Kelola pengguna, perusahaan, lowongan, dan lamaran dari satu tempat."
    />
  )
}
