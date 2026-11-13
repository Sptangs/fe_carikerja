import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RequireRole from './auth/RequireRole'

const PublicLayout = lazy(() => import('./layouts/PublicLayout'))
const AppLayout = lazy(() => import('./layouts/AppLayout'))
const AdminLayout = lazy(() => import('./layouts/AdminLayout'))
const JobSeekerLayout = lazy(() => import('./layouts/JobSeekerLayout'))
const LandingPage = lazy(() => import('./pages/public/LandingPage'))
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'))
const JobSeekerDashboardPage = lazy(() => import('./pages/job-seeker/DashboardPage'))
const JobSeekerJobListPage = lazy(() => import('./pages/job-seeker/JobListPage'))
const JobSeekerJobDetailPage = lazy(() => import('./pages/job-seeker/JobDetailPage'))
const ApplicationsPage = lazy(() => import('./pages/job-seeker/ApplicationsPage'))
const JobSeekerProfilePage = lazy(() => import('./pages/job-seeker/ProfilePage'))
const ApplyPage = lazy(() => import('./pages/job-seeker/ApplyPage'))
const CompanyDashboardPage = lazy(() => import('./pages/company/DashboardPage'))
const CompanyProfilePage = lazy(() => import('./pages/company/ProfilePage'))
const CompanyJobListPage = lazy(() => import('./pages/company/JobListPage'))
const CompanyJobFormPage = lazy(() => import('./pages/company/JobFormPage'))
const ApplicantsPage = lazy(() => import('./pages/company/ApplicantsPage'))
const AdminDashboardPage = lazy(() => import('./pages/admin/DashboardPage'))
const UserListPage = lazy(() => import('./pages/admin/UserListPage'))
const UserDetailPage = lazy(() => import('./pages/admin/UserDetailPage'))
const UserCreatePage = lazy(() => import('./pages/admin/UserCreatePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const ForbiddenPage = lazy(() => import('./pages/ForbiddenPage'))

function RouteLoadingFallback() {
  return (
    <main
      className="grid min-h-svh place-items-center bg-[#f3efe4] px-4 text-[#10251f]"
      aria-busy="true"
    >
      <div role="status" aria-live="polite" className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="h-5 w-5 animate-spin rounded-full border-2 border-[#e3ddcf] border-t-[#e8623a] motion-reduce:animate-none"
        />
        <span className="text-sm font-medium">Memuat halaman...</span>
      </div>
    </main>
  )
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoadingFallback />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
          </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route path="*" element={<NotFoundPage />} />

        <Route
          element={
            <RequireRole role="job_seeker">
              <JobSeekerLayout />
            </RequireRole>
          }
        >
          <Route path="/job-seeker/dashboard" element={<JobSeekerDashboardPage />} />
          <Route path="/job-seeker/jobs" element={<JobSeekerJobListPage />} />
          <Route path="/job-seeker/jobs/:id" element={<JobSeekerJobDetailPage />} />
          <Route path="/job-seeker/jobs/:id/apply" element={<ApplyPage />} />
          <Route path="/job-seeker/applications" element={<ApplicationsPage />} />
          <Route path="/job-seeker/profile" element={<JobSeekerProfilePage />} />
        </Route>

        <Route
          element={
            <RequireRole role="company">
              <AppLayout />
            </RequireRole>
          }
        >
          <Route path="/company/dashboard" element={<CompanyDashboardPage />} />
          <Route path="/company/profile" element={<CompanyProfilePage />} />
          <Route path="/company/jobs" element={<CompanyJobListPage />} />
          <Route path="/company/jobs/new" element={<CompanyJobFormPage />} />
          <Route path="/company/jobs/:id/edit" element={<CompanyJobFormPage />} />
          <Route path="/company/jobs/:id/applicants" element={<ApplicantsPage />} />
        </Route>

        <Route
          element={
            <RequireRole role="admin">
              <AdminLayout />
            </RequireRole>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<UserListPage />} />
          <Route path="/admin/users/new" element={<UserCreatePage />} />
          <Route path="/admin/users/:id" element={<UserDetailPage />} />
        </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
