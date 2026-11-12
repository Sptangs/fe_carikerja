import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconArrowUpRight, IconSearch } from '../../components/icons'

const CATEGORIES = [
  { label: 'Teknologi', note: 'Engineering, data, produk', query: 'teknologi' },
  { label: 'Desain', note: 'UI/UX, grafis, riset', query: 'desain' },
  { label: 'Pemasaran', note: 'Growth, konten, brand', query: 'pemasaran' },
  { label: 'Keuangan', note: 'Akuntansi, analis, pajak', query: 'keuangan' },
  { label: 'Operasional', note: 'Supply chain, admin', query: 'operasional' },
  { label: 'Pendidikan', note: 'Pengajar, kurikulum', query: 'pendidikan' },
]

const STEPS = [
  {
    title: 'Buat akun',
    body: 'Daftar sebagai pencari kerja dalam hitungan detik. Tanpa biaya, tanpa langkah berbelit.',
  },
  {
    title: 'Temukan lowongan',
    body: 'Saring berdasarkan kata kunci dan lokasi, lalu simpan peran yang paling cocok untukmu.',
  },
  {
    title: 'Lamar dengan tenang',
    body: 'Kirim lamaran dan pantau statusnya. Semua riwayat ada dalam satu tempat.',
  },
]

function IconCheck({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  )
}

function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-10 top-6 h-56 w-56 rounded-full bg-[#e8623a]/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-8 h-64 w-64 rounded-full bg-[#9dc36b]/30 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(#0f2a23 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
      </div>

      <div
        className="public-float relative rounded-[28px] border border-[#e3ddcf] bg-white p-6 shadow-[0_40px_90px_-50px_rgba(16,37,31,0.6)]"
        style={{ '--tilt': '-2deg' }}
      >
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[#0f2a23] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f3efe4]">
            Rekomendasi
          </span>
          <span className="text-[11px] font-semibold text-[#7a857f]">Baru hari ini</span>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#9dc36b]/30 font-display text-lg font-bold text-[#3f5a2a]">
            P
          </span>
          <div>
            <p className="font-display text-lg font-bold tracking-tight text-[#10251f]">
              Product Designer
            </p>
            <p className="text-xs text-[#6b7671]">Perusahaan teknologi · Jakarta</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {['Full-time', 'Remote', 'Desain produk'].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#e3ddcf] bg-[#f8f6ef] px-3 py-1 text-[11px] font-medium text-[#4b5b55]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[#ece7db] pt-4">
          <p className="text-sm font-semibold text-[#0f2a23]">Rp 12jt – 18jt</p>
          <span className="rounded-full bg-[#0f2a23] px-4 py-2 text-xs font-semibold text-[#f3efe4]">
            Lamar
          </span>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="public-float absolute -right-2 top-[-1.75rem] flex items-center gap-2 rounded-2xl border border-[#e3ddcf] bg-[#f3efe4] px-4 py-3 shadow-[0_20px_40px_-28px_rgba(16,37,31,0.7)] sm:-right-6"
        style={{ '--tilt': '4deg', animationDelay: '0.6s' }}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#9dc36b] text-[#0f2a23]">
          <IconCheck className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[11px] font-bold text-[#10251f]">Lamaran terkirim</p>
          <p className="text-[10px] text-[#6b7671]">Menunggu tinjauan</p>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="public-float absolute -bottom-6 left-[-0.5rem] rounded-2xl border border-[#e3ddcf] bg-white px-4 py-3 shadow-[0_20px_40px_-28px_rgba(16,37,31,0.7)] sm:left-[-2rem]"
        style={{ '--tilt': '-3deg', animationDelay: '1.4s' }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e8623a]">
          Jadwal
        </p>
        <p className="mt-1 text-[11px] font-bold text-[#10251f]">Wawancara · Kamis, 10.00</p>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (search.trim()) params.set('search', search.trim())
    if (location.trim()) params.set('location', location.trim())
    const query = params.toString()
    navigate(query ? `/jobs?${query}` : '/jobs')
  }

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1240px] items-center gap-16 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10 lg:pb-28 lg:pt-16">
          <div className="public-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e3ddcf] bg-white/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#4b5b55]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#9dc36b]" />
              Platform karier untuk semua orang
            </span>

            <h1 className="mt-6 font-display text-[2.75rem] font-bold leading-[0.98] tracking-tight text-[#10251f] sm:text-6xl lg:text-[4.2rem]">
              Temukan kerja yang{' '}
              <span className="relative inline-block text-[#e8623a]">
                berarti
                <svg
                  aria-hidden="true"
                  viewBox="0 0 200 12"
                  className="absolute -bottom-1 left-0 w-full text-[#e8623a]/40"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8c40-6 90-7 196-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              , bukan sekadar daftar.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-[#4b5b55] sm:text-lg">
              Cari lowongan yang sesuai dengan keahlianmu, lamar dengan percaya diri, dan pantau
              setiap langkah kariermu dari satu tempat.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 rounded-2xl border border-[#e3ddcf] bg-white/80 p-2.5 shadow-[0_24px_60px_-42px_rgba(16,37,31,0.6)] backdrop-blur sm:flex sm:items-center sm:gap-2"
            >
              <div className="flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2.5">
                <IconSearch className="h-5 w-5 shrink-0 text-[#7a857f]" />
                <label htmlFor="hero-search" className="sr-only">
                  Kata kunci
                </label>
                <input
                  id="hero-search"
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Posisi, keahlian, atau perusahaan"
                  className="w-full bg-transparent text-sm text-[#10251f] placeholder:text-[#9aa39e] focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2.5 border-t border-[#ece7db] px-3 py-2.5 sm:border-l sm:border-t-0">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#e8623a]" />
                <label htmlFor="hero-location" className="sr-only">
                  Lokasi
                </label>
                <input
                  id="hero-location"
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Lokasi"
                  className="w-full bg-transparent text-sm text-[#10251f] placeholder:text-[#9aa39e] focus:outline-none sm:w-32"
                />
              </div>

              <button
                type="submit"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f2a23] px-5 py-3 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] sm:mt-0 sm:w-auto"
              >
                Cari lowongan
                <IconArrowUpRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#6b7671]">
              {['Lowongan terkurasi', 'Tanpa biaya', 'CV aman'].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <IconCheck className="h-4 w-4 text-[#3f5a2a]" />
                  {item}
                </span>
              ))}
            </div>

            <p className="mt-6 text-xs text-[#6b7671]">
              Kamu perusahaan?{' '}
              <Link
                to="/for-companies"
                className="font-semibold text-[#0f2a23] underline decoration-[#e8623a] decoration-2 underline-offset-4 transition hover:text-[#e8623a]"
              >
                Lihat solusi rekrutmen
              </Link>
            </p>
          </div>

          <div className="public-rise lg:pl-6" style={{ animationDelay: '0.15s' }}>
            <HeroVisual />
          </div>
        </div>
      </section>

      <section className="border-y border-[#e3ddcf] bg-[#efeadb]">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8623a]">
                Jelajahi
              </p>
              <h2 className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl">
                Mulai dari bidang yang kamu kuasai.
              </h2>
            </div>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f2a23] transition hover:text-[#e8623a]"
            >
              Lihat semua lowongan
              <IconArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((category, index) => (
              <Link
                key={category.label}
                to={`/jobs?search=${encodeURIComponent(category.query)}`}
                className="group flex items-center justify-between rounded-2xl border border-[#e3ddcf] bg-[#f3efe4] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#0f2a23]/25 hover:shadow-[0_24px_50px_-38px_rgba(16,37,31,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-white font-display text-sm font-bold text-[#0f2a23]">
                    0{index + 1}
                  </span>
                  <div>
                    <p className="font-display text-lg font-bold tracking-tight text-[#10251f]">
                      {category.label}
                    </p>
                    <p className="text-xs text-[#6b7671]">{category.note}</p>
                  </div>
                </div>
                <IconArrowUpRight className="h-4 w-4 text-[#7a857f] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#e8623a]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8623a]">
              Cara kerja
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl">
              Tiga langkah, satu tujuan.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#4b5b55]">
              Kami merapikan proses melamar kerja supaya kamu bisa fokus pada hal yang paling
              penting: menemukan tempat yang tepat.
            </p>
            <Link
              to="/register"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#e8623a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#d2542f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f2a23]"
            >
              Mulai sekarang
              <IconArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <ol className="space-y-4">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="flex gap-5 rounded-2xl border border-[#e3ddcf] bg-white/60 p-6"
              >
                <span className="font-display text-3xl font-bold leading-none text-[#9dc36b]">
                  0{index + 1}
                </span>
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight text-[#10251f]">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#4b5b55]">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6 lg:px-10">
        <div className="relative mx-auto w-full max-w-[1240px] overflow-hidden rounded-[32px] bg-[#0f2a23] px-6 py-14 text-[#f3efe4] sm:px-10 lg:px-14 lg:py-16">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#e8623a]/25 blur-3xl" />
            <div className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-[#9dc36b]/20 blur-3xl" />
            <div
              className="absolute inset-0 opacity-[0.1]"
              style={{
                backgroundImage: 'radial-gradient(#f3efe4 1px, transparent 1px)',
                backgroundSize: '26px 26px',
              }}
            />
          </div>

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9dc36b]">
                Untuk perusahaan
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Sedang mencari talenta yang tepat?
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#f3efe4]/65">
                Pasang lowongan, kelola pelamar, dan temukan kandidat terbaik. Semua dalam satu
                panel yang rapi.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/for-companies"
                className="inline-flex items-center gap-2 rounded-full bg-[#f3efe4] px-6 py-3 text-sm font-semibold text-[#0f2a23] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
              >
                Pelajari untuk perusahaan
                <IconArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-[#f3efe4]/80 transition hover:border-[#f3efe4]/50 hover:text-[#f3efe4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
              >
                Masuk panel
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
