import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16 text-center">
      <h1 className="text-4xl font-bold text-slate-900">Temukan pekerjaan impianmu</h1>
      <p className="mt-3 text-slate-600">Cari lowongan terbaru dan lamar langsung dari satu tempat.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link to="/jobs" className="rounded-md bg-blue-600 px-5 py-2.5 text-white">
          Cari Lowongan
        </Link>
        <Link to="/login" className="rounded-md border px-5 py-2.5">
          Masuk
        </Link>
      </div>
    </section>
  )
}
