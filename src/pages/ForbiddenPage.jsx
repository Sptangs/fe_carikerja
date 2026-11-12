import { Link } from 'react-router-dom'

export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-5xl font-bold text-slate-900">403</p>
      <p className="mt-2 text-slate-600">Kamu tidak punya akses ke halaman ini.</p>
      <Link to="/" className="mt-6 inline-block rounded-md bg-blue-600 px-5 py-2.5 text-white">
        Kembali ke Beranda
      </Link>
    </div>
  )
}
