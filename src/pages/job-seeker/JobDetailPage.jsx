import { Link } from 'react-router-dom'
import PageHeader from '../../components/PageHeader'

export default function JobDetailPage() {
  return (
    <div>
      <PageHeader
        title="Detail Lowongan"
        actions={
          <Link to="apply" className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">
            Lamar
          </Link>
        }
      />
    </div>
  )
}
