# Frontend CariKerjaWeb — React + Vite

## 1. Tujuan dan Asumsi

- Frontend berupa aplikasi **React + Vite** terpisah di `frontend/`, mengonsumsi API Laravel.
- Backend tetap sumber kebenaran: persistensi, validasi, otorisasi, dan aturan bisnis.
- Base URL API lewat `VITE_API_BASE_URL` (contoh dev `http://localhost:8000`, prefix `/api`).
- Autentikasi memakai **bearer token Sanctum** karena deployment frontend (Vercel/host lain) dan backend berada di origin berbeda.
- UI berbahasa Indonesia. Blade yang ada tidak dihapus/diubah.
- Tidak memakai Inertia, Vue, atau akses database langsung dari browser.
- **Shuttle di luar scope** frontend.

## 2. Persona dan Alur

### Publik

Landing publik -> daftar lowongan publik -> detail lowongan -> daftar/masuk untuk melamar. Informasi untuk perusahaan tersedia di halaman publik tersendiri, bukan digabung ke panel pencari kerja.

### Job Seeker

Daftar/masuk -> dashboard di `/job-seeker/dashboard` -> cari & filter lowongan di area seeker -> detail -> lamar (wajib CV) -> riwayat lamaran -> profil & CV. Setelah login, seeker tetap berada di area dengan navigasi dan route khusus role; halaman publik tidak menggantikan dashboard seeker.

### Company

Halaman pengenalan publik `/for-companies` -> daftar/masuk -> panel company di `/company/*` -> profil perusahaan -> kelola lowongan (buat/ubah/tutup) -> lihat pelamar per lowongan -> terima/tolak -> unduh CV -> unduh laporan Excel.

### Admin

Masuk -> dashboard statistik -> daftar user (cari/filter role) -> detail user -> buat user.

### Arah Tampilan per Area

- **Admin:** gunakan pola dashboard admin pada umumnya: navigasi panel yang jelas, ringkasan statistik, tabel, filter, dan aksi pengelolaan user. Prioritaskan kepadatan informasi dan efisiensi kerja.
- **Company:** gunakan pola panel operasional yang familier seperti admin, tetapi seluruh navigasi dan kontennya khusus untuk profil perusahaan, lowongan, dan pelamar. Informasi/pengenalan untuk perusahaan ditempatkan di halaman publik `/for-companies`, terpisah dari panel ini. Jangan tampilkan menu atau data administrasi user platform.
- **Job seeker:** gunakan area khusus `/job-seeker/*` untuk dashboard, pencarian, detail, proses lamaran, riwayat, dan profil. Halaman publik `/jobs` tetap untuk pengunjung umum dan tidak menggantikan halaman atau navigasi seeker setelah login.
- **Publik/global:** landing `/` memperkenalkan CariKerja dan menyediakan jalur yang jelas serta terpisah untuk pencari kerja dan perusahaan. Bagian pencari kerja mengarahkan ke lowongan; bagian perusahaan mengarahkan ke `/for-companies`. Kembangkan pengenalan website secara iteratif tanpa mencampur konten panel role.
- Gunakan fondasi visual bersama seperlunya, tetapi pertahankan shell, navigasi, konteks, dan konten yang berbeda untuk admin, company, job seeker, dan publik. Komponen lintas area hanya dipakai jika pola serta maknanya memang sama.

## 3. Halaman dan Navigasi

| Route | Akses | Aksi utama |
|---|---|---|
| `/` | Publik | Landing umum, pengenalan CariKerja, jalur pencari kerja dan perusahaan |
| `/for-companies` | Publik | Informasi khusus perusahaan dan CTA daftar/masuk company |
| `/jobs` | Publik | Daftar lowongan, search + filter lokasi, paginasi |
| `/jobs/:id` | Publik | Detail lowongan, CTA melamar |
| `/login` | Publik | Masuk |
| `/register` | Publik | Daftar sebagai job seeker/company |
| `/job-seeker/dashboard` | job_seeker | Ringkasan, lowongan terbaru, lamaran terbaru |
| `/job-seeker/jobs` | job_seeker | Cari lowongan dari area seeker |
| `/job-seeker/jobs/:id` | job_seeker | Detail + status sudah melamar |
| `/job-seeker/jobs/:id/apply` | job_seeker | Form lamaran (cover letter), wajib memiliki CV |
| `/job-seeker/applications` | job_seeker | Riwayat lamaran |
| `/job-seeker/profile` | job_seeker | Profil + upload/hapus CV |
| `/company/dashboard` | company | Statistik + pelamar terbaru |
| `/company/profile` | company | Profil perusahaan |
| `/company/jobs` | company | Daftar lowongan |
| `/company/jobs/new` | company | Buat lowongan |
| `/company/jobs/:id/edit` | company | Ubah lowongan |
| `/company/jobs/:id/applicants` | company | Pelamar + terima/tolak + unduh CV |
| `/admin/dashboard` | admin | Statistik |
| `/admin/users` | admin | Daftar user |
| `/admin/users/new` | admin | Buat user |
| `/admin/users/:id` | admin | Detail user |
| `*` | Publik | 404 |

Guard: `RequireRole` membaca `user.role`; salah role -> `/forbidden`; belum login -> `/login`. Setelah login, arahkan pengguna ke dashboard sesuai role (`/job-seeker/dashboard`, `/company/dashboard`, atau `/admin/dashboard`), bukan ke landing publik.

Route publik `/jobs` dan `/jobs/:id` dapat dijelajahi tanpa login. Alur seeker yang sudah login tetap memakai route `/job-seeker/*` agar halaman publik tidak tercampur dengan dashboard dan navigasi role. Prefix `/api/job-seeker` digunakan oleh endpoint backend.

## 4. Peta Integrasi API

Envelope umum: sukses `{ "data": ... }`, pesan `{ "message": "...", "data": ... }`.

### Auth

| Method | Path | Akses | Input | Response |
|---|---|---|---|---|
| POST | `/api/auth/register` | Publik | `name`, `email`, `password`, `password_confirmation`, `role` (`job_seeker`/`company`), `company_name` (wajib jika company) | 201 `{message, data:{user, token}}` |
| POST | `/api/auth/login` | Publik | `email`, `password` | 200 `{message, data:{user, token}}`; 401 |
| POST | `/api/auth/logout` | Bearer | - | 200 `{message}` |
| GET | `/api/user` | Bearer | - | Objek user (`id`, `name`, `email`, `role`) |

### Lowongan Publik (perlu ditambah di backend)

| Method | Path | Akses | Input | Response |
|---|---|---|---|---|
| GET | `/api/jobs` | Publik | `search`, `location`, `page` | `{data: paginator, meta:{locations, search, location}}`, hanya `open` |
| GET | `/api/jobs/{job}` | Publik | - | `{data:{job}}` dengan `company`; 404 jika closed/tidak ada |

### Job Seeker

| Method | Path | Input | Response / Catatan |
|---|---|---|---|
| GET | `/api/job-seeker/dashboard` | - | `{data:{has_cv, total_applications, open_jobs_count, latest_jobs, recent_applications}}` |
| GET | `/api/job-seeker/jobs` | `search`, `location` | `{data: paginator, meta:{locations, search, location}}` |
| GET | `/api/job-seeker/jobs/{job}` | - | `{data:{job, has_applied}}` |
| GET | `/api/job-seeker/jobs/{job}/application` | - | `{data:{job, can_apply}}`; 422 tanpa CV; 409 sudah melamar |
| POST | `/api/job-seeker/jobs/{job}/applications` | `cover_letter` (30–5000) | 201; 409 lowongan tutup/sudah melamar |
| GET | `/api/job-seeker/applications` | `page` | `{data: paginator}` |
| GET | `/api/job-seeker/profile` | - | `{data:{user, profile, has_cv}}` |
| PUT | `/api/job-seeker/profile` | `name`, `email`, `phone`, `address`, `education`, `cv` (pdf/doc/docx maks 5 MB) | `{message, data:{user, profile, has_cv}}`; multipart |
| GET | `/api/job-seeker/profile/cv` | - | Binary (butuh bearer) |
| DELETE | `/api/job-seeker/profile/cv` | - | `{message, data:{has_cv:false}}` |

### Company

| Method | Path | Input | Response / Catatan |
|---|---|---|---|
| GET | `/api/company/dashboard` | - | `{data:{total_jobs, active_jobs, total_applications, pending_applications, latest_applications}}` |
| GET | `/api/company/profile` | - | `{data:{user, company}}` |
| PUT | `/api/company/profile` | `name`, `email`, `company_name`, `description`, `address` | `{message, data:{user, company}}` |
| GET | `/api/company/jobs` | `page` | `{data: paginator}` (15/halaman) |
| POST | `/api/company/jobs` | `title`, `location`, `employment_type`, `salary_min`, `salary_max`, `description`, `requirements`, `status` | 201 `{message, data}` |
| GET | `/api/company/jobs/{jobPosting}` | - | `{data: job}`; 403 jika bukan miliknya |
| PUT | `/api/company/jobs/{jobPosting}` | Field lowongan | `{message, data}` |
| PATCH | `/api/company/jobs/{jobPosting}/close` | - | `{message, data}` |
| GET | `/api/company/jobs/{jobPosting}/applications` | `page` | `{data: paginator}` (15/halaman) |
| PATCH | `/api/company/applications/{application}/status` | `status` (`accepted`/`rejected`) | `{message, data}` |
| GET | `/api/company/applications/{application}/cv` | - | Binary (butuh bearer) |
| GET | `/api/company/reports/applications` | - | File `.xlsx` (butuh bearer) |

### Admin

| Method | Path | Input | Response |
|---|---|---|---|
| GET | `/api/admin/dashboard` | - | `{data:{user_count, company_count, job_posting_count, application_count}}` |
| GET | `/api/admin/users` | `search`, `role`, `page` | `{data: paginator}` (15/halaman) |
| GET | `/api/users/{id}` | - | `{message, data:user}` |
| POST | `/api/users` | `name`, `email`, `password`, `password_confirmation`, `role`, `company_name` | 201 `{message, data}` |

Catatan gap: tidak ada endpoint agregat lamaran lintas-lowongan untuk company; tidak ada update/delete user admin; tidak ada delete shuttle (di luar scope).

### Bentuk Paginator Laravel

`current_page`, `data[]`, `first_page_url`, `from`, `last_page`, `last_page_url`, `links[]`, `next_page_url`, `path`, `per_page`, `prev_page_url`, `to`, `total`.

### Error

- 401 `{message:"Unauthenticated. Please log in to continue."}`
- 403 `{message:"You are not authorized to access this page."}`
- 404 default Laravel
- 409 `{message}` (sudah melamar / lowongan tutup)
- 422 `{message, errors:{field:[...]}}`
- 429 rate limit (login 5/menit, register 10/menit)
- 500/network error

## 5. Struktur Frontend

```text
frontend/
  index.html
  vite.config.js
  .env.example            # VITE_API_BASE_URL=http://localhost:8000
  src/
    main.jsx
    App.jsx
    router.jsx
    lib/
      apiClient.js        # fetch + bearer + normalisasi error + 401
      download.js         # fetch blob + trigger download
      format.js           # rupiah, tanggal, label status
    auth/
      AuthProvider.jsx
      useAuth.js
      RequireRole.jsx
    layouts/
      PublicLayout.jsx
      AppLayout.jsx       # panel company
      AdminLayout.jsx     # panel admin
      JobSeekerLayout.jsx # area job seeker
    components/
      PageHeader.jsx
      Pagination.jsx
      StatusBadge.jsx
      EmptyState.jsx
      LoadingSkeleton.jsx
      ErrorAlert.jsx
      ConfirmDialog.jsx
      FormField.jsx
    pages/
      public/{LandingPage,ForCompaniesPage,JobListPage,JobDetailPage}.jsx
      auth/{LoginPage,RegisterPage}.jsx
      job-seeker/{DashboardPage,JobListPage,JobDetailPage,ApplyPage,ApplicationsPage,ProfilePage}.jsx
      company/{DashboardPage,ProfilePage,JobListPage,JobFormPage,ApplicantsPage}.jsx
      admin/{DashboardPage,UserListPage,UserDetailPage,UserCreatePage}.jsx
      NotFoundPage.jsx
      ForbiddenPage.jsx
```

- Router: `react-router-dom`.
- Gunakan layout terpisah untuk publik, company, admin, dan job seeker; jangan menumpuk konten atau navigasi antar-role dalam satu dashboard.
- Data fetching: `fetch` + hook `useApi`/`usePaginated` (TanStack Query hanya jika disetujui).
- Dev: Vite proxy `/api` -> `http://localhost:8000` (opsional) atau langsung ke `VITE_API_BASE_URL`.
- Tailwind CSS 4 via `@tailwindcss/vite`.

## 6. Autentikasi dan Keamanan

- Token dari login/register disimpan di **memori + `sessionStorage`** (bukan `localStorage`).
- `apiClient` mengirim `Authorization: Bearer <token>`; response 401 -> hapus sesi + redirect `/login`.
- Saat app dimuat, panggil `GET /api/user` untuk memulihkan user dan role.
- Logout: `POST /api/auth/logout` (revoke token), lalu bersihkan storage.
- File (CV, Excel) diunduh via `fetch` + blob + `Authorization` (bukan `<a href>`).
- Upload CV: `FormData`; kirim `POST` dengan `_method=PUT` karena multipart pada `PUT` tidak andal di PHP — verifikasi saat implementasi.
- Mitigasi XSS: CSP header di host frontend, hindari `dangerouslySetInnerHTML`, token tidak di URL.
- CORS: default Laravel `allowed_origins: ['*']`, `supports_credentials: false` -> bearer aman. Saran produksi: publish `config/cors.php` dan batasi origin frontend.
- Saran backend opsional: set masa berlaku token di `config/sanctum.php` (`expiration`).

## 7. Responsif, Aksesibilitas, dan Error State

- Mobile-first Tailwind, target sentuh minimal 44px, fokus ring terlihat.
- Form: label eksplisit, `aria-describedby` untuk error, `aria-invalid`, `lang="id"`.
- Modal/dialog: focus trap, tutup dengan Esc, kembalikan fokus.
- State per layar data: loading skeleton, empty state, 422 per-field, 401, 403, 404, 409, 429, 500/network.
- Konfirmasi untuk aksi destruktif: hapus CV, tutup lowongan, terima/tolak pelamar.
- Feedback sukses via toast/inline.

## 8. Fase Implementasi dan Kriteria Selesai

1. **Verifikasi kontrak API**: cek endpoint public jobs & CORS dengan curl. Selesai bila response sesuai tabel.
2. **Scaffold**: Vite + React + Tailwind + router + `apiClient` + layout. Selesai bila app jalan dan halaman placeholder tampil.
3. **Auth**: login/register/logout, guard role, restore sesi. Selesai bila redirect per role benar dan 401/403 tertangani.
4. **Publik**: landing, daftar lowongan (search/filter/paginasi), detail. Selesai bila data dari `/api/jobs` tampil dan state lengkap.
5. **Job seeker**: dashboard, lamar, riwayat, profil/CV. Selesai bila upload/unduh/hapus CV dan lamaran berjalan.
6. **Company**: dashboard, profil, CRUD lowongan, pelamar, terima/tolak, unduh CV, export Excel. Selesai bila otorisasi kepemilikan terjaga.
7. **Admin**: dashboard, daftar/detail/buat user. Selesai bila filter role/pagination berjalan.
8. **Polish & build**: a11y, responsif, error state, `npm run build`. Selesai bila build sukses dan alur utama lolos uji manual.

## 9. Pertanyaan Terbuka dan Dependensi Backend

- **Wajib**: tambah `GET /api/jobs` dan `GET /api/jobs/{job}` publik (hanya `open`, dengan `company`, plus `meta.locations`).
- Opsional: endpoint agregat lamaran company, update/delete user admin.
- Kebijakan masa berlaku token dan origin produksi untuk CORS.
- Konfirmasi perilaku upload CV via `_method=PUT`.
