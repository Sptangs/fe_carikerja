import { useEffect, useState } from "react";
import FormField from "../../components/FormField";
import TextField from "../../components/TextField";
import { IconCheck } from "../../components/icons";
import { useAuth } from "../../auth/useAuth";
import useApi from "../../hooks/useApi";
import useForm from "../../hooks/useForm";
import apiClient from "../../lib/apiClient";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const INPUT_CLASS =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm text-[#10251f] outline-none transition placeholder:text-[#9aa39e] focus:ring-4 focus:ring-[#0f2a23]/10";

function validate(values) {
  const next = {};

  if (!values.name?.trim()) next.name = "Nama lengkap wajib diisi.";
  else if (values.name.trim().length < 2)
    next.name = "Nama minimal 2 karakter.";

  if (!values.email?.trim()) next.email = "Email wajib diisi.";
  else if (!EMAIL_PATTERN.test(values.email.trim()))
    next.email = "Format email tidak valid.";

  if (!values.company_name?.trim())
    next.company_name = "Nama perusahaan wajib diisi.";
  else if (values.company_name.trim().length < 2)
    next.company_name = "Nama perusahaan minimal 2 karakter.";

  if (values.description && values.description.length > 5000) {
    next.description = "Deskripsi terlalu panjang.";
  }
  if (values.address && values.address.length > 5000)
    next.address = "Alamat terlalu panjang.";

  return next;
}

export default function ProfilePage() {
  const { refreshUser } = useAuth();
  const { data, loading, error, refetch } = useApi("/api/company/profile");
  const [success, setSuccess] = useState(null);

  const {
    values,
    errors,
    formError,
    submitting,
    setValues,
    handleChange,
    handleSubmit,
  } = useForm({
    initialValues: {
      name: "",
      email: "",
      company_name: "",
      description: "",
      address: "",
    },
    validate,
    onSubmit: async (formValues) => {
      setSuccess(null);
      const payload = await apiClient("/api/company/profile", {
        method: "PUT",
        body: {
          name: formValues.name.trim(),
          email: formValues.email.trim(),
          company_name: formValues.company_name.trim(),
          description: formValues.description?.trim() ?? "",
          address: formValues.address?.trim() ?? "",
        },
      });
      setSuccess(payload?.message ?? "Profil perusahaan berhasil diperbarui.");
      await Promise.allSettled([refetch(), refreshUser()]);
      return payload;
    },
  });

  useEffect(() => {
    if (!data) return;
    setValues({
      name: data.user?.name ?? "",
      email: data.user?.email ?? "",
      company_name: data.company?.company_name ?? data.company?.name ?? "",
      description: data.company?.description ?? "",
      address: data.company?.address ?? "",
    });
  }, [data, setValues]);

  if (loading && !data) {
    return (
      <div className="mx-auto w-full max-w-[900px]">
        <div className="h-6 w-40 animate-pulse rounded bg-[#e3ddcf]" />
        <div className="mt-6 h-72 animate-pulse rounded-2xl bg-[#e6e0d2]" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="mx-auto w-full max-w-[900px]">
        <div
          role="alert"
          className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center"
        >
          <p className="font-semibold text-rose-800">
            Profil perusahaan belum bisa dimuat.
          </p>
          <p className="mt-1 text-sm text-rose-700">
            {error.message ?? "Periksa koneksi lalu coba lagi."}
          </p>
          <button
            type="button"
            onClick={() => refetch().catch(() => {})}
            className="mt-4 rounded-full bg-[#0f2a23] px-5 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173a31]"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <header>
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#e8623a]">
          Profil perusahaan
        </p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#10251f] sm:text-4xl">
          Perkenalkan perusahaanmu.
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#4b5b55]">
          Informasi ini membantu kandidat mengenal perusahaan sebelum melamar.
        </p>
      </header>

      <form
        className="mt-6 space-y-5 rounded-2xl border border-[#e3ddcf] bg-white/70 p-5 sm:p-6"
        noValidate
        onSubmit={handleSubmit}
      >
        {formError ? (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          >
            <span aria-hidden="true" className="mt-0.5 font-bold">
              !
            </span>
            <p>{formError}</p>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="name"
            name="name"
            label="Nama penanggung jawab"
            placeholder="Nama pengelola akun"
            value={values.name}
            onChange={handleChange}
            error={errors.name}
            autoComplete="name"
            required
          />
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="nama@email.com"
            value={values.email}
            onChange={handleChange}
            error={errors.email}
            autoComplete="email"
            required
          />
        </div>

        <TextField
          id="company_name"
          name="company_name"
          label="Nama perusahaan"
          placeholder="PT Contoh Sejahtera"
          value={values.company_name}
          onChange={handleChange}
          error={errors.company_name}
          autoComplete="organization"
          required
        />

        <FormField
          label="Deskripsi perusahaan"
          htmlFor="description"
          error={errors.description}
          hint="Ringkasan budaya, industri, atau keunggulan perusahaan."
        >
          <textarea
            id="description"
            name="description"
            rows={5}
            value={values.description}
            onChange={handleChange}
            placeholder="Ceritakan singkat tentang perusahaanmu…"
            aria-invalid={errors.description ? "true" : undefined}
            className={`${INPUT_CLASS} resize-y ${
              errors.description
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                : "border-[#ded8ca] focus:border-[#0f2a23]"
            }`}
          />
        </FormField>

        <FormField
          label="Alamat"
          htmlFor="address"
          error={errors.address}
          hint="Alamat kantor atau domisili utama."
        >
          <textarea
            id="address"
            name="address"
            rows={3}
            value={values.address}
            onChange={handleChange}
            placeholder="Jl. Contoh No. 1, Jakarta"
            aria-invalid={errors.address ? "true" : undefined}
            className={`${INPUT_CLASS} resize-y ${
              errors.address
                ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
                : "border-[#ded8ca] focus:border-[#0f2a23]"
            }`}
          />
        </FormField>

        {success ? (
          <p
            role="status"
            className="flex items-start gap-2 rounded-xl border border-[#9dc36b]/45 bg-[#9dc36b]/15 px-4 py-3 text-sm font-medium text-[#0f2a23]"
          >
            <IconCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {success}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#ece7db] pt-5">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0f2a23] px-6 py-2.5 text-sm font-semibold text-[#f3efe4] transition hover:bg-[#173b31] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8623a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <span
                  aria-hidden="true"
                  className="h-4 w-4 animate-spin rounded-full border-2 border-[#f3efe4]/30 border-t-[#f3efe4]"
                />
                Menyimpan...
              </>
            ) : (
              "Simpan perubahan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
