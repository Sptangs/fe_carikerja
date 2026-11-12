import { Link } from 'react-router-dom'

export default function ForbiddenPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-24 text-center">
      <p className="font-display text-7xl font-bold tracking-tight text-[#0f2a23]">
        4<span className="text-[#e8623a]">0</span>3
      </p>
      <p className="mt-4 text-sm leading-relaxed text-[#4b5b55]">
        Kamu tidak punya akses ke halaman ini.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#0f2a23] px-6 py-3 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31]"
      >
        Kembali ke beranda
      </Link>
    </div>
  )
}
