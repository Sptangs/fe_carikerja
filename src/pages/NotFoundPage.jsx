import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <p className="text-5xl font-bold text-slate-900">404</p>
      <p className="mt-2 text-slate-600">Halaman tidak ditemukan.</p>
      <Link to="/" className="mt-6 inline-block rounded-md bg-blue-600 px-5 py-2.5 text-white">
        Kembali ke Beranda
      </Link>
    </div>
  )
}
