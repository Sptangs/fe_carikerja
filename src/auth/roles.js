const HOME_BY_ROLE = {
  job_seeker: '/job-seeker/dashboard',
  company: '/company/dashboard',
  admin: '/admin/dashboard',
}

export function roleHome(role) {
  return HOME_BY_ROLE[role] ?? '/'
}

export const ROLE_LABELS = {
  job_seeker: 'Pencari Kerja',
  company: 'Perusahaan',
  admin: 'Admin',
}
