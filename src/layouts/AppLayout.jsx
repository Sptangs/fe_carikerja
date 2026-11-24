import { IconDashboard, IconFileText, IconUser } from '../components/icons'
import DashboardLayout from './DashboardLayout'

const NAV_ITEMS = [
  { to: '/company/dashboard', label: 'Dashboard', icon: IconDashboard, end: true },
  { to: '/company/jobs', label: 'Lowongan', icon: IconFileText },
  { to: '/company/profile', label: 'Profil Perusahaan', icon: IconUser },
]

const PAGE_TITLES = {
  '/company/dashboard': 'Dashboard',
  '/company/jobs': 'Kelola Lowongan',
  '/company/jobs/new': 'Buat Lowongan',
  '/company/profile': 'Profil Perusahaan',
}

function getPageTitle(pathname) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  if (/^\/company\/jobs\/[^/]+\/edit$/.test(pathname)) return 'Ubah Lowongan'
  if (/^\/company\/jobs\/[^/]+\/applicants$/.test(pathname)) return 'Pelamar'
  return 'Panel Perusahaan'
}

export default function AppLayout() {
  return (
    <DashboardLayout
      badge="Perusahaan"
      roleLabel="Perusahaan"
      navItems={NAV_ITEMS}
      getPageTitle={getPageTitle}
      headerLink={{ to: '/', label: 'Situs publik' }}
      footerTitle="Panel perusahaan."
      footerNote="Kelola profil, lowongan, dan pelamar dari satu tempat."
    />
  )
}
