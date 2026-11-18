import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../../components/ConfirmDialog'
import ErrorAlert from '../../components/ErrorAlert'
import FormField from '../../components/FormField'
import TextField from '../../components/TextField'
import { IconArrowUpRight, IconCheck } from '../../components/icons'
import useApi from '../../hooks/useApi'
import useForm from '../../hooks/useForm'
import apiClient from '../../lib/apiClient'
import { formatDate } from '../../lib/format'

const INPUT_CLASS =
  'w-full rounded-xl border border-[#ded8ca] bg-white px-4 py-3 text-sm text-[#10251f] outline-none transition placeholder:text-[#9aa39e] focus:border-[#0f2a23] focus:ring-4 focus:ring-[#0f2a23]/10'

function DetailRow({ label, value }) {
  return (
    <div className="border-b border-[#ece7db] py-4 last:border-0">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#7a857f]">
        {label}
      </dt>
      <dd className="mt-1.5 text-sm text-[#10251f]">{value ?? '—'}</dd>
    </div>
  )
}

export default function CompanyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, loading, error, refetch } = useApi(`/api/admin/companies/${id}`)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [actionError, setActionError] = useState(null)
  const [actionSuccess, setActionSuccess] = useState(null)

  const form = useForm({
    initialValues: {
      company_name: '',
      description: '',
      address: '',
    },
    validate: (values) => {
      const errors = {}
      if (!values.company_name.trim()) errors.company_name = 'Nama perusahaan wajib diisi.'
      else if (values.company_name.trim().length > 255)
        errors.company_name = 'Nama perusahaan maksimal 255 karakter.'
      if (values.description.length > 10000)
        errors.description = 'Deskripsi maksimal 10.000 karakter.'
      if (values.address.length > 5000)
        errors.address = 'Alamat maksimal 5.000 karakter.'
      return errors
    },
    onSubmit: async (values) => {
      const payload = await apiClient(`/api/admin/companies/${id}`, {
        method: 'PUT',
        body: {
          company_name: values.company_name.trim(),
          description: values.description.trim(),
          address: values.address.trim(),
        },
      })
      setActionError(null)
      setActionSuccess(payload?.message ?? 'Profil perusahaan berhasil diperbarui.')
      await refetch().catch(() => {})
      return payload
    },
  })

  useEffect(() => {
    if (!data) return
    const company = data.company ?? data
    form.setValues({
      company_name: company.company_name ?? '',
      description: company.description ?? '',
      address: company.address ?? '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

  async function handleDelete() {
    setDeleteBusy(true)
    setActionError(null)
    setActionSuccess(null)
    try {
      await apiClient(`/api/admin/companies/${id}`, { method: 'DELETE' })
      navigate('/admin/companies', { replace: true })
    } catch (err) {
      setActionError(err?.message ?? 'Gagal menghapus perusahaan. Silakan coba lagi.')
      setDeleteOpen(false)
    } finally {
      setDeleteBusy(false)
    }
  }

  if (loading && !data) {
    return (
      <div className="mx-auto w-full max-w-[900px]">
        <div className="h-6 w-40 animate-pulse rounded bg-[#e3ddcf]" />
        <div className="mt-6 h-40 animate-pulse rounded-2xl bg-[#e6e0d2]" />
        <div className="mt-4 h-[420px] animate-pulse rounded-2xl bg-[#e6e0d2]" />
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="mx-auto w-full max-w-[900px]">
        <ErrorAlert message="Perusahaan tidak ditemukan atau gagal dimuat." />
        <Link
          to="/admin/companies"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4]"
        >
          Kembali ke daftar perusahaan
        </Link>
      </div>
    )
  }

  const company = data?.company ?? data ?? {}
  const owner = company.user ?? null

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <header>
        <Link
          to="/admin/companies"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#6b7671] transition hover:text-[#e8623a]"
        >
          <span aria-hidden="true">←</span> Daftar perusahaan
        </Link>
        <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8623a]">
          Detail perusahaan
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl">
          {company.company_name}
        </h1>
      </header>

      {actionError ? (
        <div className="mt-6">
          <ErrorAlert message={actionError} />
        </div>
      ) : null}
      {actionSuccess ? (
        <p
          role="status"
          className="mt-6 flex items-start gap-2 rounded-xl border border-[#9dc36b]/45 bg-[#9dc36b]/15 px-4 py-3 text-sm font-medium text-[#0f2a23]"
        >
          <IconCheck className="mt-0.5 h-4 w-4 shrink-0" />
          {actionSuccess}
        </p>
      ) : null}

      <section className="mt-6 rounded-2xl border border-[#e3ddcf] bg-white/70 p-6">
        <h2 className="font-display text-lg font-bold tracking-tight text-[#10251f]">
          Ringkasan
        </h2>
        <dl className="mt-2">
          <DetailRow label="ID perusahaan" value={company.id} />
          <DetailRow label="Pemilik akun" value={owner?.name} />
          <DetailRow label="Email pemilik" value={owner?.email} />
          <DetailRow label="Jumlah lowongan" value={company.jobs_count ?? 0} />
          <DetailRow label="Jumlah lamaran" value={company.applications_count ?? 0} />
          <DetailRow label="Terdaftar" value={formatDate(company.created_at)} />
        </dl>
      </section>

      <form
        className="mt-4 space-y-5 rounded-2xl border border-[#e3ddcf] bg-white/70 p-5 sm:p-6"
        noValidate
        onSubmit={form.handleSubmit}
      >
        <h2 className="font-display text-lg font-bold tracking-tight text-[#10251f]">
          Ubah profil perusahaan
        </h2>

        <TextField
          id="company_name"
          name="company_name"
          type="text"
          label="Nama perusahaan"
          placeholder="PT Contoh Sejahtera"
          required
          value={form.values.company_name}
          onChange={form.handleChange}
          error={form.errors.company_name}
        />

        <FormField
          label="Deskripsi"
          htmlFor="description"
          error={form.errors.description}
          hint="Maksimal 10.000 karakter."
        >
          <textarea
            id="description"
            name="description"
            rows={5}
            value={form.values.description}
            onChange={form.handleChange}
            placeholder="Tentang perusahaan, budaya kerja, dan bidang usaha…"
            aria-invalid={form.errors.description ? 'true' : undefined}
            className={`${INPUT_CLASS} resize-y ${
              form.errors.description
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10'
                : ''
            }`}
          />
        </FormField>

        <FormField
          label="Alamat"
          htmlFor="address"
          error={form.errors.address}
          hint="Maksimal 5.000 karakter."
        >
          <textarea
            id="address"
            name="address"
            rows={3}
            value={form.values.address}
            onChange={form.handleChange}
            placeholder="Alamat kantor…"
            aria-invalid={form.errors.address ? 'true' : undefined}
            className={`${INPUT_CLASS} resize-y ${
              form.errors.address
                ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10'
                : ''
            }`}
          />
        </FormField>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#ece7db] pt-5">
          <button
            type="submit"
            disabled={form.submitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0f2a23] px-6 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {form.submitting ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-[#f3efe4]/30 border-t-[#f3efe4]"
                />
                Menyimpan...
              </>
            ) : (
              'Simpan perubahan'
            )}
          </button>
        </div>
      </form>

      <section className="mt-4 rounded-2xl border border-[#e8623a]/30 bg-white/70 p-5 sm:p-6">
        <h2 className="font-display text-lg font-bold tracking-tight text-[#10251f]">
          Zona berbahaya
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#4b5b55]">
          Menghapus perusahaan juga menghapus seluruh lowongan, lamaran terkait, dan akun
          pemiliknya. Aksi ini permanen.
        </p>
        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#e8623a]/40 bg-white px-5 py-2.5 text-sm font-semibold text-[#e8623a] transition hover:bg-[#e8623a]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a]"
        >
          Hapus perusahaan
          <IconArrowUpRight className="h-4 w-4" />
        </button>
      </section>

      <ConfirmDialog
        open={deleteOpen}
        title="Hapus perusahaan?"
        description={`Perusahaan "${company.company_name ?? ''}" beserta seluruh lowongan, lamaran terkait, dan akun pemiliknya akan dihapus permanen.`}
        confirmLabel={deleteBusy ? 'Menghapus...' : 'Hapus permanen'}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  )
}
