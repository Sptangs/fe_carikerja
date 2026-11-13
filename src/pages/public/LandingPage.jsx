import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  MotionConfig,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion'
import { IconArrowUpRight } from '../../components/icons'

const ABOUT_POINTS = [
  {
    number: '01',
    title: 'Langkah yang lebih jelas',
    body: 'Pencari kerja dapat melihat lowongan, mengirim lamaran, lalu mengikuti statusnya di satu akun.',
  },
  {
    number: '02',
    title: 'Proses rekrutmen tertata',
    body: 'Perusahaan mengelola lowongan dan meninjau pelamar berdasarkan posisi yang dibuka.',
  },
  {
    number: '03',
    title: 'Informasi dalam satu tempat',
    body: 'Profil, CV, lowongan, dan aktivitas lamaran tersusun sesuai kebutuhan tiap pengguna.',
  },
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

const COMPANY_FEATURES = [
  { title: 'Publikasikan lowongan', body: 'Atur posisi, lokasi, tipe kerja, dan informasi gaji.' },
  { title: 'Tinjau pelamar', body: 'Kelola lamaran dan CV berdasarkan lowongan.' },
  { title: 'Rekap aktivitas', body: 'Unduh laporan lamaran untuk kebutuhan tim.' },
]

const COMPANY_STEPS = [
  'Buat akun dan lengkapi profil perusahaan.',
  'Publikasikan lowongan dengan informasi yang jelas.',
  'Tinjau pelamar dan perbarui status lamaran.',
]

const TESTIMONIALS = [
  {
    quote: 'Saya bisa memantau lamaran dan memperbarui profil dari satu tempat.',
    name: 'Contoh pencari kerja',
    role: 'Konten demo',
  },
  {
    quote: 'Daftar pelamar per posisi membantu tim kami meninjau kandidat dengan lebih teratur.',
    name: 'Contoh tim rekrutmen',
    role: 'Konten demo',
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
    <section id="solusi-perusahaan" className="scroll-mt-24 px-4 pb-20 sm:px-6 lg:px-10">
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
              Susun kebutuhan rekrutmen, tinjau pelamar per posisi, dan ikuti proses seleksi dari
              panel perusahaan.
            </motion.p>
          </div>

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register?role=company"
                className="inline-flex items-center gap-2 rounded-full bg-[#f3efe4] px-6 py-3 text-sm font-semibold text-[#0f2a23] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
              >
                Buat akun perusahaan
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
        <div className="relative mx-auto mt-5 grid w-full max-w-[1240px] gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
          {COMPANY_FEATURES.map((feature) => (
            <article key={feature.title} className="bg-[#0f2a23]/90 p-5 sm:p-6">
              <h3 className="font-display text-lg font-bold text-[#f3efe4]">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#f3efe4]/60">{feature.body}</p>
            </article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}

/* ---------- Page ---------- */

export default function LandingPage() {
  return (
    <MotionConfig reducedMotion="user">
      <div>
        {/* Hero */}
        <section id="beranda" className="scroll-mt-24 relative overflow-hidden">
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
                  CariKerja membantu pencari kerja mengelola perjalanan lamaran dan membantu
                  perusahaan menata proses rekrutmen dalam satu platform.
                </motion.p>

                <motion.div
                  variants={fadeUp}
                  className="mt-8 flex flex-wrap gap-3"
                >
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-full bg-[#0f2a23] px-6 py-3 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
                  >
                    Mulai sebagai pencari kerja
                    <IconArrowUpRight className="h-4 w-4" />
                  </Link>
                  <a
                    href="#solusi-perusahaan"
                    className="inline-flex items-center gap-2 rounded-full border border-[#0f2a23]/20 bg-white/60 px-6 py-3 text-sm font-semibold text-[#10251f] transition hover:border-[#0f2a23]/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
                  >
                    Solusi perusahaan
                  </a>
                </motion.div>
              </motion.div>
            </div>

            <div className="lg:pl-6">
              <HeroVisual />
            </div>
          </div>
        </section>

        {/* Tentang Kami */}
        <section id="tentang-kami" className="scroll-mt-24 border-y border-[#e3ddcf] bg-[#efeadb]">
          <div className="mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
            <Reveal className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8623a]">
                Tentang Kami
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl">
                Proses karier yang terasa lebih terarah.
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#4b5b55] sm:text-base">
                CariKerja mempertemukan kebutuhan pencari kerja dan perusahaan lewat alur yang
                mudah dipahami. Setiap orang mendapat ruang kerja yang sesuai dengan perannya.
              </p>
            </Reveal>

            <motion.div
              variants={stagger(0.1, 0.12)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="mt-10 grid gap-4 md:grid-cols-3"
            >
              {ABOUT_POINTS.map((point) => (
                <motion.div
                  key={point.number}
                  variants={fadeUp}
                  className="border-t-2 border-[#0f2a23] bg-[#f7f4eb] p-6 sm:p-7"
                >
                  <p className="font-display text-sm font-bold text-[#e8623a]">{point.number}</p>
                  <h3 className="mt-5 font-display text-xl font-bold tracking-tight text-[#10251f]">
                    {point.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#4b5b55]">{point.body}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Cara kerja */}
        <section id="cara-kerja" className="scroll-mt-24 mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
            <motion.div
              variants={stagger(0.1)}
              initial="hidden"
              whileInView="show"
              viewport={VIEWPORT}
              className="self-start"
            >
              <motion.p
                variants={fadeUp}
                className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8623a]"
              >
                Cara Kerja
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="mt-3 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl"
              >
                Alur yang jelas untuk tiap peran.
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="mt-4 max-w-sm text-sm leading-relaxed text-[#4b5b55]"
              >
                Pencari kerja dan perusahaan menjalani langkah yang berbeda, dengan status proses
                yang tetap mudah diikuti.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-8 inline-block">
                <motion.div whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-full bg-[#e8623a] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#d2542f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f2a23]"
                  >
                    Buat akun pencari kerja
                    <IconArrowUpRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>

            <div className="space-y-10">
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

              <div className="border-t border-[#e3ddcf] pt-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8623a]">
                Untuk perusahaan
              </p>
              <ol className="mt-5 space-y-3">
                {COMPANY_STEPS.map((step, index) => (
                  <li key={step} className="flex items-start gap-4">
                    <span className="font-display text-lg font-bold text-[#0f2a23]">
                      0{index + 1}
                    </span>
                    <p className="pt-0.5 text-sm leading-relaxed text-[#4b5b55]">{step}</p>
                  </li>
                ))}
              </ol>
              </div>
            </div>
          </div>
        </section>

        <CompanyCta />

        <section id="testimoni" className="scroll-mt-24 border-t border-[#e3ddcf] bg-[#efeadb]">
          <div className="mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
            <Reveal className="flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8623a]">
                  Testimoni
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl">
                  Cerita dari pengguna.
                </h2>
              </div>
              <p className="max-w-sm text-xs leading-relaxed text-[#6b7671]">
                Konten berikut adalah contoh desain. Ganti dengan testimoni terverifikasi sebelum
                dipublikasikan.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {TESTIMONIALS.map((testimonial, index) => (
                <Reveal key={testimonial.name} delay={index * 0.1}>
                  <figure className="flex h-full flex-col justify-between border border-[#e3ddcf] bg-[#f7f4eb] p-6 sm:p-8">
                    <blockquote className="font-display text-xl font-semibold leading-relaxed text-[#10251f] sm:text-2xl">
                      “{testimonial.quote}”
                    </blockquote>
                    <figcaption className="mt-8 flex items-center justify-between gap-4 border-t border-[#e3ddcf] pt-4">
                      <div>
                        <p className="text-sm font-bold text-[#10251f]">{testimonial.name}</p>
                        <p className="mt-1 text-xs text-[#6b7671]">{testimonial.role}</p>
                      </div>
                      <span className="font-display text-4xl leading-none text-[#e8623a]" aria-hidden="true">
                        ”
                      </span>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </div>
    </MotionConfig>
  )
}