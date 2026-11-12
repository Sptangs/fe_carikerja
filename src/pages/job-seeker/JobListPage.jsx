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
  const { data, loading, error, setPage, filters, setFilters } = usePaginated(
    '/api/job-seeker/jobs',
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
    <div className="mx-auto w-full max-w-[1240px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
      <div className="max-w-2xl">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8623a]">
          Cari lowongan
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-[#10251f] sm:text-4xl">
          Temukan tempat yang paling cocok untukmu.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#4b5b55]">
          Saring lowongan berdasarkan kata kunci dan lokasi, lalu buka detailnya untuk melamar.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-7 rounded-2xl border border-[#e3ddcf] bg-white/80 p-2.5 shadow-[0_24px_60px_-42px_rgba(16,37,31,0.6)] sm:flex sm:items-center sm:gap-2"
      >
        <div className="flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5">
          <IconSearch className="h-5 w-5 shrink-0 text-[#7a857f]" />
          <label htmlFor="seeker-job-search" className="sr-only">
            Kata kunci
          </label>
          <input
            id="seeker-job-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Posisi, keahlian, atau perusahaan"
            className="w-full bg-transparent text-sm text-[#10251f] placeholder:text-[#9aa39e] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2.5 border-t border-[#ece7db] px-3 py-2.5 sm:border-l sm:border-t-0">
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#e8623a]" />
          <label htmlFor="seeker-job-location" className="sr-only">
            Lokasi
          </label>
          <input
            id="seeker-job-location"
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

      <div className="mt-8 mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold tracking-tight text-[#10251f]">
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
            <JobCard key={job.id} job={job} to={`/job-seeker/jobs/${job.id}`} />
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
    </div>
  )
}
