import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Lock, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { BrandMark } from '../components/BrandMark'

export function LoginPage() {
  const { authenticated, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from || '/admin'

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (authenticated) {
    return <Navigate to="/admin" replace />
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const ok = login(username, password)
    setSubmitting(false)
    if (!ok) {
      setError('Invalid username or password.')
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#f4f2ef] px-4">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% 0%, rgba(255,90,10,0.1), transparent 55%)',
        }}
      />

      <div className="relative w-full max-w-md rounded-3xl border border-black/5 bg-white p-7 shadow-[0_20px_50px_-28px_rgba(0,0,0,0.25)] sm:p-8">
        <div className="mb-7 flex flex-col items-center text-center">
          <BrandMark size={56} className="mb-3" />
          <h1 className="text-xl font-extrabold text-[#101820]">Admin Login</h1>
          <p className="mt-1.5 text-sm text-[#7a7a7a]">
            Sign in to manage your business profile
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="mb-1.5 block text-xs font-semibold text-[#6b6b6b]"
            >
              Username
            </label>
            <input
              id="username"
              autoComplete="username"
              className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-3.5 py-2.5 text-sm outline-none transition focus:border-[#FF5A0A]/50 focus:bg-white focus:ring-2 focus:ring-[#FF5A0A]/15"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold text-[#6b6b6b]"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#b0b0b0]"
                aria-hidden
              />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-black/10 bg-[#fafafa] py-2.5 pr-3.5 pl-10 text-sm outline-none transition focus:border-[#FF5A0A]/50 focus:bg-white focus:ring-2 focus:ring-[#FF5A0A]/15"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error ? (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF5A0A] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#e84f08] disabled:opacity-70"
          >
            <LogIn className="h-4 w-4" aria-hidden />
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#8a8a8a]">
          <Link to="/" className="font-semibold text-[#FF5A0A] hover:underline">
            ← Back to public website
          </Link>
        </p>
      </div>
    </div>
  )
}
