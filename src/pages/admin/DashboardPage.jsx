import { Link } from 'react-router-dom'
import ErrorAlert from '../../components/ErrorAlert'
import PageHeader from '../../components/PageHeader'
import StatCard from '../../components/admin/StatCard'
import { Button } from '../../components/ui/button'
import { Skeleton } from '../../components/ui/skeleton'
import {
  IconBuilding,
  IconBriefcase,
  IconInbox,
  IconUsers,
} from '../../components/icons'
import useApi from '../../hooks/useApi'

const STAT_ITEMS = [
  {
    key: 'user_count',
    label: 'Total pengguna',
    note: 'Semua akun terdaftar',
    icon: IconUsers,
  },
  {
    key: 'company_count',
    label: 'Total perusahaan',
    note: 'Akun perusahaan',
    icon: IconBuilding,
  },
  {
    key: 'job_posting_count',
    label: 'Total lowongan',
    note: 'Lowongan di platform',
    icon: IconBriefcase,
  },
  {
    key: 'application_count',
    label: 'Total lamaran',
    note: 'Total lamaran masuk',
    icon: IconInbox,
  },
]

export default function DashboardPage() {
  const { data, loading, error, refetch } = useApi('/api/admin/dashboard')

  return (
    <div className="mx-auto w-full max-w-[1240px]">
      <PageHeader
        title="Dashboard admin"
        description="Pantau aktivitas platform dan kelola akun pengguna dari satu tempat."
      />

      {error ? (
        <div className="mb-6">
          <ErrorAlert message="Gagal memuat statistik admin. Coba muat ulang data." />
          <Button
            type="button"
            onClick={() => refetch().catch(() => {})}
            className="mt-4 min-h-11 rounded-full bg-[#0f2a23] px-5 font-semibold text-[#f3efe4] hover:bg-[#173b31]"
          >
            Coba lagi
          </Button>
        </div>
      ) : null}

      <section aria-label="Statistik platform" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? STAT_ITEMS.map((item) => (
              <div key={item.key} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-11 w-11 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                </div>
              </div>
            ))
          : STAT_ITEMS.map((item) => (
              <StatCard
                key={item.key}
                icon={item.icon}
                label={item.label}
                note={item.note}
                value={data?.[item.key]}
              />
            ))}
      </section>

      <section aria-label="Pintasan" className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg font-bold tracking-tight text-[#10251f]">
          Pintasan
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            render={<Link to="/admin/users" />}
            className="min-h-11 rounded-full bg-[#0f2a23] px-6 font-semibold text-[#f3efe4] hover:bg-[#173b31]"
          >
            Kelola pengguna
          </Button>
          <Button
            render={<Link to="/admin/users/new" />}
            variant="outline"
            className="min-h-11 rounded-full border-[#e3ddcf] bg-white px-6 font-semibold text-[#0f2a23] hover:border-[#0f2a23]/30 hover:text-[#0f2a23]"
          >
            Buat pengguna baru
          </Button>
        </div>
      </section>
    </div>
  )
}
