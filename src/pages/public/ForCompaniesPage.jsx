import { Link } from 'react-router-dom'
import { IconArrowUpRight, IconCheck } from '../../components/icons'

const FEATURES = [
  {
    title: 'Pasang lowongan',
    body: 'Publikasikan posisi yang sedang dibuka dan jangkau kandidat yang relevan.',
  },
  {
    title: 'Kelola pelamar',
    body: 'Lihat lamaran per lowongan, tinjau CV, lalu terima atau tolak dengan rapi.',
  },
  {
    title: 'Unduh laporan',
    body: 'Ekspor data lamaran ke Excel untuk kebutuhan rekap tim rekrutmen.',
  },
]

const STEPS = [
  {
    title: 'Buat akun perusahaan',
    body: 'Daftar dengan nama perusahaan, lalu lengkapi profil dan deskripsi singkat.',
  },
  {
    title: 'Pasang lowongan',
    body: 'Tentukan posisi, lokasi, tipe kerja, dan rentang gaji yang kamu tawarkan.',
  },
  {
    title: 'Temukan kandidat',
    body: 'Pantau pelamar masuk, tinjau CV, dan tentukan kandidat yang paling cocok.',
  },
]

function HeroPanel() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-10 top-6 h-56 w-56 rounded-full bg-[#e8623a]/20 blur-3xl" />
        <div className="absolute -bottom-10 -left-8 h-64 w-64 rounded-full bg-[#9dc36b]/30 blur-3xl" />
      </div>

      <div className="public-float relative rounded-[28px] border border-[#e3ddcf] bg-white p-6 shadow-[0_40px_90px_-50px_rgba(16,37,31,0.6)]">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-[#0f2a23] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f3efe4]">
            Ringkasan lowongan
          </span>
          <span className="text-[11px] font-semibold text-[#7a857f]">Aktif</span>
        </div>

        <p className="mt-6 font-display text-xl font-bold tracking-tight text-[#10251f]">
          Frontend Engineer
        </p>
        <p className="mt-1 text-xs text-[#6b7671]">Full-time · Jakarta · Rp 10jt – 16jt</p>

        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[#ece7db] pt-5 text-center">
          {[
            { label: 'Pelamar', value: '24' },
            { label: 'Ditinjau', value: '11' },
            { label: 'Lolos', value: '4' },
          ].map((item) => (
            <div key={item.label}>
              <p className="font-display text-2xl font-bold text-[#0f2a23]">{item.value}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#7a857f]">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="public-float absolute -bottom-6 left-[-0.5rem] flex items-center gap-2 rounded-2xl border border-[#e3ddcf] bg-[#f3efe4] px-4 py-3 shadow-[0_20px_40px_-28px_rgba(16,37,31,0.7)] sm:left-[-2rem]"
        style={{ '--tilt': '-3deg', animationDelay: '1.2s' }}
      >
        <span className="grid h-7 w-7 place-items-center rounded-full bg-[#9dc36b] text-[#0f2a23]">
          <IconCheck className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[11px] font-bold text-[#10251f]">Kandidat baru</p>
          <p className="text-[10px] text-[#6b7671]">Menunggu tinjauan</p>
        </div>
      </div>
    </div>
  )
}

export default function ForCompaniesPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1240px] items-center gap-16 px-4 pb-20 pt-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10 lg:pb-24 lg:pt-16">
          <div className="public-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e3ddcf] bg-white/60 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#4b5b55]">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#9dc36b]" />
              Untuk perusahaan
            </span>

            <h1 className="mt-6 font-display text-[2.75rem] font-bold leading-[0.98] tracking-tight text-[#10251f] sm:text-6xl">
              Temukan talenta yang{' '}
              <span className="relative inline-block text-[#e8623a]">tepat</span>, tanpa ribet.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-[#4b5b55] sm:text-lg">
              Pasang lowongan, kelola pelamar, dan ambil keputusan rekrutmen dari satu panel yang
              rapi. Fokus pada kandidat, bukan pada proses administrasi.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register?role=company"
                className="inline-flex items-center gap-2 rounded-full bg-[#0f2a23] px-6 py-3 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
              >
                Daftar sebagai perusahaan
                <IconArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-full border border-[#e3ddcf] bg-white/60 px-6 py-3 text-sm font-semibold text-[#10251f]/75 transition hover:border-[#0f2a23]/30 hover:text-[#10251f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
              >
                Masuk panel
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#6b7671]">
              {['Kelola pelamar', 'Unduh CV', 'Laporan Excel'].map((item) => (
                <span key={item} className="inline-flex items-center gap-1.5">
                  <IconCheck className="h-4 w-4 text-[#3f5a2a]" />
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="public-rise lg:pl-6" style={{ animationDelay: '0.15s' }}>
            <HeroPanel />
          </div>
        </div>
      </section>

      <section className="border-y border-[#e3ddcf] bg-[#efeadb]">
        <div className="mx-auto w-full max-w-[1240px] px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e8623a]">
              Alat rekrutmen
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl">
              Semua yang dibutuhkan tim rekrutmen.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-[#e3ddcf] bg-[#f3efe4] p-6"
              >
                <span className="font-display text-2xl font-bold text-[#9dc36b]">
                  0{index + 1}
                </span>
                <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-[#10251f]">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4b5b55]">{feature.body}</p>
              </div>
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
              Mulai merekrut dalam tiga langkah.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#4b5b55]">
              Tidak perlu proses berbelit. Buat akun, pasang lowongan, lalu temukan kandidat yang
              sesuai dengan kebutuhan timmu.
            </p>
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
          </div>

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9dc36b]">
                Siap mulai?
              </p>
              <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Bangun tim terbaikmu bersama CariKerja.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-[#f3efe4]/65">
                Buat akun perusahaan dan pasang lowongan pertamamu hari ini.
              </p>
            </div>

            <Link
              to="/register?role=company"
              className="inline-flex items-center gap-2 rounded-full bg-[#f3efe4] px-6 py-3 text-sm font-semibold text-[#0f2a23] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
            >
              Daftar perusahaan
              <IconArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
