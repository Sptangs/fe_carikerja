import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
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

/* ---------- Motion helpers ---------- */

const EASE = [0.22, 1, 0.36, 1]

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: EASE } },
}

function stagger(gap = 0.09, delay = 0) {
  return { hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }
}

const VIEWPORT = { once: true, amount: 0.25 }

function Reveal({ children, className, delay = 0, y = 32 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.75, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

// Parallax vertikal: progress 0..1 -> from..to (dimatikan jika reduce motion)
function useParallax(progress, from, to) {
  const reduce = useReducedMotion()
  return useTransform(progress, [0, 1], reduce ? [0, 0] : [from, to])
}

// Gerak naik-turun pelan yang berulang
function Floating({ children, amplitude = 10, duration = 6, delay = 0, rotate = 0 }) {
  return (
    <motion.div
      animate={{
        y: [0, -amplitude, 0],
        rotate: [rotate, rotate + 1.2, rotate],
      }}
      transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Icons ---------- */

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

/* ---------- Hero visual ---------- */

function HeroVisual() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const blobA = useParallax(scrollYProgress, 60, -60)
  const blobB = useParallax(scrollYProgress, -40, 50)
  const cardY = useParallax(scrollYProgress, 30, -30)
  const chipA = useParallax(scrollYProgress, 70, -50)
  const chipB = useParallax(scrollYProgress, 10, -80)

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          style={{ y: blobA }}
          className="absolute -right-10 top-6 h-56 w-56 rounded-full bg-[#e8623a]/20 blur-3xl"
        />
        <motion.div
          style={{ y: blobB }}
          className="absolute -bottom-10 -left-8 h-64 w-64 rounded-full bg-[#9dc36b]/30 blur-3xl"
        />
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(#0f2a23 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
      </div>

      {/* Kartu utama */}
      <motion.div style={{ y: cardY }} className="relative">
        <motion.div
          initial={{ opacity: 0, y: 48, rotate: -6 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: 1, ease: EASE, delay: 0.25 }}
        >
          <Floating amplitude={8} duration={6.5} rotate={-2}>
            <div className="rounded-[28px] border border-[#e3ddcf] bg-white p-6 shadow-[0_40px_90px_-50px_rgba(16,37,31,0.6)]">
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
          </Floating>
        </motion.div>
      </motion.div>

      {/* Chip: lamaran terkirim */}
      <motion.div
        aria-hidden="true"
        style={{ y: chipA }}
        className="absolute -right-2 top-[-1.75rem] sm:-right-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 0.9 }}
        >
          <Floating amplitude={12} duration={5} delay={0.4} rotate={4}>
            <div className="flex items-center gap-2 rounded-2xl border border-[#e3ddcf] bg-[#f3efe4] px-4 py-3 shadow-[0_20px_40px_-28px_rgba(16,37,31,0.7)]">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#9dc36b] text-[#0f2a23]">
                <IconCheck className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[11px] font-bold text-[#10251f]">Lamaran terkirim</p>
                <p className="text-[10px] text-[#6b7671]">Menunggu tinjauan</p>
              </div>
            </div>
          </Floating>
        </motion.div>
      </motion.div>

      {/* Chip: jadwal */}
      <motion.div
        aria-hidden="true"
        style={{ y: chipB }}
        className="absolute -bottom-6 left-[-0.5rem] sm:left-[-2rem]"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18, delay: 1.1 }}
        >
          <Floating amplitude={9} duration={5.8} delay={1.2} rotate={-3}>
            <div className="rounded-2xl border border-[#e3ddcf] bg-white px-4 py-3 shadow-[0_20px_40px_-28px_rgba(16,37,31,0.7)]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e8623a]">
                Jadwal
              </p>
              <p className="mt-1 text-[11px] font-bold text-[#10251f]">Wawancara · Kamis, 10.00</p>
            </div>
          </Floating>
        </motion.div>
      </motion.div>
    </div>
  )
}

/* ---------- Headline (mask reveal per baris) ---------- */

function HeadlineLine({ children, delay }) {
  return (
    <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
      <motion.span
        className="block"
        initial={{ y: '105%' }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay }}
      >
        {children}
      </motion.span>
    </span>
  )
}

function Headline() {
  return (
    <h1 className="mt-6 font-display text-[2.75rem] font-bold leading-[0.98] tracking-tight text-[#10251f] sm:text-6xl lg:text-[4.2rem]">
      <HeadlineLine delay={0.15}>Temukan kerja yang</HeadlineLine>
      <HeadlineLine delay={0.28}>
        <span className="relative inline-block text-[#e8623a]">
          berarti
          <svg
            aria-hidden="true"
            viewBox="0 0 200 12"
            className="absolute -bottom-1 left-0 w-full text-[#e8623a]/40"
            preserveAspectRatio="none"
          >
            <motion.path
              d="M2 8c40-6 90-7 196-3"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.95 }}
            />
          </svg>
        </span>
        , bukan sekadar daftar.
      </HeadlineLine>
    </h1>
  )
}

/* ---------- CTA perusahaan ---------- */

function CompanyCta() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const blobA = useParallax(scrollYProgress, 50, -70)
  const blobB = useParallax(scrollYProgress, -50, 60)

  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-10">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 56, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: EASE }}
        className="relative mx-auto w-full max-w-[1240px] overflow-hidden rounded-[32px] bg-[#0f2a23] px-6 py-14 text-[#f3efe4] sm:px-10 lg:px-14 lg:py-16"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <motion.div
            style={{ y: blobA }}
            className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#e8623a]/25 blur-3xl"
          />
          <motion.div
            style={{ y: blobB }}
            className="absolute -bottom-24 left-10 h-72 w-72 rounded-full bg-[#9dc36b]/20 blur-3xl"
          />
          <div
            className="absolute inset-0 opacity-[0.1]"
            style={{
              backgroundImage: 'radial-gradient(#f3efe4 1px, transparent 1px)',
              backgroundSize: '26px 26px',
            }}
          />
        </div>

        <motion.div
          variants={stagger(0.1, 0.2)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end"
        >
          <div className="max-w-xl">
            <motion.p
              variants={fadeUp}
              className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9dc36b]"
            >
              Untuk perusahaan
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl"
            >
              Sedang mencari talenta yang tepat?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="mt-3 max-w-md text-sm leading-relaxed text-[#f3efe4]/65"
            >
              Pasang lowongan, kelola pelamar, dan temukan kandidat terbaik. Semua dalam satu
              panel yang rapi.
            </motion.p>
          </div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/for-companies"
                className="inline-flex items-center gap-2 rounded-full bg-[#f3efe4] px-6 py-3 text-sm font-semibold text-[#0f2a23] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
              >
                Pelajari untuk perusahaan
                <IconArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-[#f3efe4]/80 transition-colors hover:border-[#f3efe4]/50 hover:text-[#f3efe4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
              >
                Masuk panel
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

/* ---------- Page ---------- */

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
    <MotionConfig reducedMotion="user">
      <div>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto grid w-full max-w-[1240px] items-center gap-16 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10 lg:pb-28 lg:pt-16">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="inline-flex items-center gap-2 rounded-full border border-[#e3ddcf] bg-white/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#4b5b55]"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#9dc36b]" />
                Platform karier untuk semua orang
              </motion.span>

              <Headline />

              <motion.div
                variants={stagger(0.1, 0.55)}
                initial="hidden"
                animate="show"
              >
                <motion.p
                  variants={fadeUp}
                  className="mt-6 max-w-lg text-base leading-relaxed text-[#4b5b55] sm:text-lg"
                >
                  Cari lowongan yang sesuai dengan keahlianmu, lamar dengan percaya diri, dan
                  pantau setiap langkah kariermu dari satu tempat.
                </motion.p>

                <motion.form
                  variants={fadeUp}
                  onSubmit={handleSubmit}
                  className="mt-8 rounded-2xl border border-[#e3ddcf] bg-white/80 p-2.5 shadow-[0_24px_60px_-42px_rgba(16,37,31,0.6)] backdrop-blur transition-[border-color,box-shadow] duration-300 focus-within:border-[#0f2a23]/30 focus-within:shadow-[0_28px_70px_-40px_rgba(16,37,31,0.75)] sm:flex sm:items-center sm:gap-2"
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

                  <motion.button
                    type="submit"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f2a23] px-5 py-3 text-sm font-semibold text-[#f3efe4] transition-colors hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] sm:mt-0 sm:w-auto"
                  >
                    Cari lowongan
                    <IconArrowUpRight className="h-4 w-4" />
                  </motion.button>
                </motion.form>

                <motion.div
                  variants={fadeUp}
                  className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#6b7671]"
                >
                  {['Lowongan terkurasi', 'Tanpa biaya', 'CV aman'].map((item) => (
                    <span key={item} className="inline-flex items-center gap-1.5">
                      <IconCheck className="h-4 w-4 text-[#3f5a2a]" />
                      {item}
                    </span>
                  ))}
                </motion.div>

                <motion.p variants={fadeUp} className="mt-6 text-xs text-[#6b7671]">
                  Kamu perusahaan?{' '}
                  <Link
                    to="/for-companies"
                    className="font-semibold text-[#0f2a23] underline decoration-[#e8623a] decoration-2 underline-offset-4 transition-colors hover:text-[#e8623a]"
                  >
                    Lihat solusi rekrutmen
                  </Link>
                </motion.p>
              </motion.div>
            </div>

            <div className="lg:pl-6">
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* Kategori */}
        <section className="border-y border-[#e3ddcf] bg-[#efeadb]">
          <div className="mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="flex flex-wrap items-end justify-between gap-4"
            >
              <div>
                <motion.p
                  variants={fadeUp}
                  className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8623a]"
                >
                  Jelajahi
                </motion.p>
                <motion.h2
                  variants={fadeUp}
                  className="mt-3 max-w-xl font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl"
                >
                  Mulai dari bidang yang kamu kuasai.
                </motion.h2>
              </div>
              <motion.div variants={fadeUp}>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f2a23] transition-colors hover:text-[#e8623a]"
                >
                  Lihat semua lowongan
                  <IconArrowUpRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              variants={stagger(0.07, 0.1)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {CATEGORIES.map((category, index) => (
                <motion.div
                  key={category.label}
                  variants={fadeUp}
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                >
                  <Link
                    to={`/jobs?search=${encodeURIComponent(category.query)}`}
                    className="group flex items-center justify-between rounded-2xl border border-[#e3ddcf] bg-[#f3efe4] p-5 transition-[border-color,box-shadow] duration-300 hover:border-[#0f2a23]/25 hover:shadow-[0_24px_50px_-38px_rgba(16,37,31,0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
                  >
                    <div className="flex items-center gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-white font-display text-sm font-bold text-[#0f2a23] transition-colors duration-300 group-hover:bg-[#0f2a23] group-hover:text-[#f3efe4]">
                        0{index + 1}
                      </span>
                      <div>
                        <p className="font-display text-lg font-bold tracking-tight text-[#10251f]">
                          {category.label}
                        </p>
                        <p className="text-xs text-[#6b7671]">{category.note}</p>
                      </div>
                    </div>
                    <IconArrowUpRight className="h-4 w-4 text-[#7a857f] transition duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#e8623a]" />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Cara kerja */}
        <section className="mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="lg:sticky lg:top-28 lg:self-start"
            >
              <motion.p
                variants={fadeUp}
                className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8623a]"
              >
                Cara kerja
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="mt-3 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl"
              >
                Tiga langkah, satu tujuan.
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-4 max-w-sm text-sm leading-relaxed text-[#4b5b55]"
              >
                Kami merapikan proses melamar kerja supaya kamu bisa fokus pada hal yang paling
                penting: menemukan tempat yang tepat.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8 inline-block">
                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-full bg-[#e8623a] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d2542f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f2a23]"
                  >
                    Mulai sekarang
                    <IconArrowUpRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            <ol className="space-y-4">
              {STEPS.map((step, index) => (
                <motion.li
                  key={step.title}
                  initial={{ opacity: 0, y: 48 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.8, ease: EASE }}
                  whileHover={{ y: -4 }}
                  className="flex gap-5 rounded-2xl border border-[#e3ddcf] bg-white/60 p-6"
                >
                  <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
                    className="font-display text-3xl font-bold leading-none text-[#9dc36b]"
                  >
                    0{index + 1}
                  </motion.span>
                  <div>
                    <h3 className="font-display text-xl font-bold tracking-tight text-[#10251f]">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-[#4b5b55]">{step.body}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        <CompanyCta />
      </div>
    </MotionConfig>
  )
}