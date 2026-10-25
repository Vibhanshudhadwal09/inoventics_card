import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  getSessionUser,
  isAuthenticated,
  login as authLogin,
  logout as authLogout,
} from '../lib/auth'

interface AuthContextValue {
  authenticated: boolean
  username: string | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated())
  const [username, setUsername] = useState<string | null>(() => getSessionUser())

  const login = useCallback((user: string, password: string) => {
    const ok = authLogin(user, password)
    if (ok) {
      setAuthenticated(true)
      setUsername(getSessionUser())
    }
    return ok
  }, [])

  const logout = useCallback(() => {
    authLogout()
    setAuthenticated(false)
    setUsername(null)
  }, [])

  const value = useMemo(
    () => ({ authenticated, username, login, logout }),
    [authenticated, username, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
