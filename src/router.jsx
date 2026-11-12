import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicLayout from './layouts/PublicLayout'
import AppLayout from './layouts/AppLayout'
import AdminLayout from './layouts/AdminLayout'
import JobSeekerLayout from './layouts/JobSeekerLayout'
import RequireRole from './auth/RequireRole'
import LandingPage from './pages/public/LandingPage'
import ForCompaniesPage from './pages/public/ForCompaniesPage'
import JobListPage from './pages/public/JobListPage'
import JobDetailPage from './pages/public/JobDetailPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import JobSeekerDashboardPage from './pages/job-seeker/DashboardPage'
import JobSeekerJobListPage from './pages/job-seeker/JobListPage'
import JobSeekerJobDetailPage from './pages/job-seeker/JobDetailPage'
import ApplicationsPage from './pages/job-seeker/ApplicationsPage'
import JobSeekerProfilePage from './pages/job-seeker/ProfilePage'
import ApplyPage from './pages/job-seeker/ApplyPage'
import CompanyDashboardPage from './pages/company/DashboardPage'
import CompanyProfilePage from './pages/company/ProfilePage'
import CompanyJobListPage from './pages/company/JobListPage'
import CompanyJobFormPage from './pages/company/JobFormPage'
import ApplicantsPage from './pages/company/ApplicantsPage'
import AdminDashboardPage from './pages/admin/DashboardPage'
import UserListPage from './pages/admin/UserListPage'
import UserDetailPage from './pages/admin/UserDetailPage'
import UserCreatePage from './pages/admin/UserCreatePage'
import NotFoundPage from './pages/NotFoundPage'
import ForbiddenPage from './pages/ForbiddenPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/for-companies" element={<ForCompaniesPage />} />
          <Route path="/jobs" element={<JobListPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/forbidden" element={<ForbiddenPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

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
    </BrowserRouter>
  )
}
