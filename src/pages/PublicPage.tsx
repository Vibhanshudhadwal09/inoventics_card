import { useEffect, useState } from 'react'
import { PublicCardPage } from '../components/public/PublicCardPage'
import { DEFAULT_PROFILE, STORAGE_KEY, type BusinessProfile } from '../types'

function readProfile(): BusinessProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PROFILE
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) } as BusinessProfile
  } catch {
    return DEFAULT_PROFILE
  }
}

/** Public digital card — full website at `/` */
export function PublicPage() {
  const [profile, setProfile] = useState<BusinessProfile>(readProfile)

  useEffect(() => {
    const sync = () => setProfile(readProfile())
    window.addEventListener('storage', sync)
    window.addEventListener('focus', sync)
    window.addEventListener('inoventics-profile-updated', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('focus', sync)
      window.removeEventListener('inoventics-profile-updated', sync)
    }
  }, [])

  return <PublicCardPage profile={profile} />
}
