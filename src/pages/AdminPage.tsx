import { ExternalLink, LogOut, Save } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { AdminSidebar } from '../components/admin/AdminSidebar'
import { AdminPanel } from '../components/admin/AdminPanel'
import { useAuth } from '../context/AuthContext'
import { useBusinessProfile } from '../hooks/useBusinessProfile'

/** Admin editor at `/admin` — changes apply to the public site at `/` */
export function AdminPage() {
  const api = useBusinessProfile()
  const { username, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-[100dvh] bg-[#f4f2ef]">
      <AdminSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-black/5 bg-white/90 px-4 py-3.5 backdrop-blur-md sm:px-6">
          <div>
            <h1 className="text-lg font-extrabold tracking-tight text-[#101820] sm:text-xl">
              Business Profile
            </h1>
            <p className="mt-0.5 text-xs text-[#7a7a7a] sm:text-sm">
              Signed in as{' '}
              <span className="font-semibold text-[#101820]">{username}</span>
              {' · '}
              Public site:{' '}
              <Link to="/" className="font-semibold text-[#FF5A0A] hover:underline">
                /
              </Link>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs font-semibold text-[#333] transition hover:bg-black/[0.03]"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              Open Website
            </Link>
            <button
              type="button"
              onClick={api.saveChanges}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#FF5A0A] px-3.5 py-2 text-xs font-bold text-white shadow-[0_6px_18px_-8px_rgba(255,90,10,0.8)] transition hover:bg-[#e84f08]"
            >
              <Save className="h-3.5 w-3.5" aria-hidden />
              {api.savedFlash ? 'Saved!' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 bg-white px-3.5 py-2 text-xs font-semibold text-[#555] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden />
              Logout
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          <AdminPanel api={api} />
        </main>
      </div>
    </div>
  )
}
