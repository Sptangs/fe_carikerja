export function authErrorMessage(error) {
  if (!error) return null
  if (error.status === 401) return 'Email atau kata sandi salah.'
  if (error.status === 403) return 'Kamu tidak punya akses untuk aksi ini.'
  if (error.status === 429) return 'Terlalu banyak percobaan. Coba lagi beberapa menit lagi.'
  if (error.status >= 500) return 'Server sedang bermasalah. Coba lagi nanti.'
  return error.message ?? 'Terjadi kesalahan.'
}
