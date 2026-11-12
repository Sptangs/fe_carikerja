import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import EmptyState from '../../components/EmptyState'
import ErrorAlert from '../../components/ErrorAlert'
import JobCard from '../../components/JobCard'
import LoadingSkeleton from '../../components/LoadingSkeleton'
import Pagination from '../../components/Pagination'
import { IconSearch } from '../../components/icons'
import { usePaginated } from '../../hooks/usePaginated'

export default function JobListPage() {
  const [searchParams] = useSearchParams()
  const { data, meta, loading, error, setPage, filters, setFilters } = usePaginated(
    '/api/jobs',
    {
      search: searchParams.get('search') ?? '',
      location: searchParams.get('location') ?? '',
    },
  )
  const [search, setSearch] = useState(filters.search)
  const [location, setLocation] = useState(filters.location)

  function handleSubmit(event) {
    event.preventDefault()
    setFilters({ search: search.trim(), location: location.trim() })
  }

  function handleReset() {
    setSearch('')
    setLocation('')
    setFilters({ search: '', location: '' })
  }

  const paginator = Array.isArray(data) ? null : data
  const jobs = paginator ? (Array.isArray(paginator.data) ? paginator.data : []) : (data ?? [])
  const total = paginator?.total ?? jobs.length

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[#e3ddcf] bg-[#efeadb]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#e8623a]/15 blur-3xl" />
          <div className="absolute -bottom-28 left-0 h-72 w-72 rounded-full bg-[#9dc36b]/25 blur-3xl" />
        </div>

        <div className="relative mx-auto w-full max-w-[1240px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8623a]">
            Daftar lowongan
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-4xl font-bold leading-[1.02] tracking-tight text-[#10251f] sm:text-5xl">
            Peran berikutnya mungkin ada di sini.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#4b5b55] sm:text-base">
            Saring lowongan terbuka berdasarkan kata kunci dan lokasi. Semua lowongan sudah
            terkurasi dari perusahaan yang aktif merekrut.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 rounded-2xl border border-[#e3ddcf] bg-white/85 p-2.5 shadow-[0_24px_60px_-42px_rgba(16,37,31,0.6)] backdrop-blur sm:flex sm:items-center sm:gap-2"
          >
            <div className="flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5">
              <IconSearch className="h-5 w-5 shrink-0 text-[#7a857f]" />
              <label htmlFor="job-search" className="sr-only">
                Kata kunci
              </label>
              <input
                id="job-search"
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Posisi, keahlian, atau perusahaan"
                className="w-full bg-transparent text-sm text-[#10251f] placeholder:text-[#9aa39e] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2.5 border-t border-[#ece7db] px-3 py-2.5 sm:border-l sm:border-t-0">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#e8623a]" />
              <label htmlFor="job-location" className="sr-only">
                Lokasi
              </label>
              <input
                id="job-location"
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Lokasi"
                className="w-full bg-transparent text-sm text-[#10251f] placeholder:text-[#9aa39e] focus:outline-none sm:w-36"
              />
            </div>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f2a23] px-5 py-3 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] sm:mt-0 sm:w-auto"
            >
              Cari
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl font-bold tracking-tight text-[#10251f]">
            {loading ? 'Memuat lowongan...' : `${total} lowongan ditemukan`}
          </h2>
          {filters.search || filters.location ? (
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e8623a] transition hover:text-[#0f2a23]"
            >
              Hapus filter
            </button>
          ) : null}
        </div>

        {error ? <ErrorAlert message="Gagal memuat lowongan. Coba lagi sebentar." /> : null}

        {loading ? (
          <LoadingSkeleton rows={4} />
        ) : jobs.length > 0 ? (
          <div className="grid gap-4">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Belum ada lowongan yang cocok"
            description="Coba ubah kata kunci atau lokasi pencarianmu."
            action={
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31]"
              >
                Reset pencarian
              </button>
            }
          />
        )}

        <Pagination meta={paginator} onPageChange={setPage} />
        {meta?.locations?.length ? (
          <p className="mt-6 text-xs text-[#7a857f]">
            Lokasi tersedia: {meta.locations.join(', ')}
          </p>
        ) : null}
      </section>
    </div>
  )
}
