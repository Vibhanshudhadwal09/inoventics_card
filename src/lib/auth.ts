const SESSION_KEY = 'inoventics-admin-session'
const SESSION_HOURS = 12

export function getAdminCredentials() {
  return {
    username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
    password: import.meta.env.VITE_ADMIN_PASSWORD || 'inoventics2026',
  }
}

interface SessionPayload {
  username: string
  expiresAt: number
}

function readSession(): SessionPayload | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as SessionPayload
    if (!data?.expiresAt || Date.now() > data.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY)
      return null
    }
    return data
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return readSession() !== null
}

export function getSessionUser(): string | null {
  return readSession()?.username ?? null
}

export function login(username: string, password: string): boolean {
  const creds = getAdminCredentials()
  const userOk = username.trim() === creds.username
  const passOk = password === creds.password
  if (!userOk || !passOk) return false

  const payload: SessionPayload = {
    username: creds.username,
    expiresAt: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(payload))
  return true
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
}
