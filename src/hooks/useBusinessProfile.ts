import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_PROFILE,
  STORAGE_KEY,
  type BusinessProfile,
  type ServiceItem,
} from '../types'

function loadProfile(): BusinessProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_PROFILE
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) } as BusinessProfile
  } catch {
    return DEFAULT_PROFILE
  }
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function useBusinessProfile() {
  const [profile, setProfile] = useState<BusinessProfile>(loadProfile)
  const [savedFlash, setSavedFlash] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
  }, [profile])

  const update = useCallback(<K extends keyof BusinessProfile>(key: K, value: BusinessProfile[K]) => {
    setProfile((p) => ({ ...p, [key]: value }))
  }, [])

  const updateSocial = useCallback((key: keyof BusinessProfile['socials'], value: string) => {
    setProfile((p) => ({
      ...p,
      socials: { ...p.socials, [key]: value },
    }))
  }, [])

  const setLogo = useCallback((dataUrl: string | null) => {
    setProfile((p) => ({ ...p, logoDataUrl: dataUrl }))
  }, [])

  const addService = useCallback(() => {
    setProfile((p) => ({
      ...p,
      services: [...p.services, { id: uid(), label: 'New Service' }],
    }))
  }, [])

  const updateService = useCallback((id: string, label: string) => {
    setProfile((p) => ({
      ...p,
      services: p.services.map((s) => (s.id === id ? { ...s, label } : s)),
    }))
  }, [])

  const removeService = useCallback((id: string) => {
    setProfile((p) => ({
      ...p,
      services: p.services.filter((s) => s.id !== id),
    }))
  }, [])

  const moveService = useCallback((from: number, to: number) => {
    setProfile((p) => {
      const next = [...p.services]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return { ...p, services: next }
    })
  }, [])

  const saveChanges = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    window.dispatchEvent(new Event('inoventics-profile-updated'))
    setSavedFlash(true)
    window.setTimeout(() => setSavedFlash(false), 1800)
  }, [profile])

  const resetProfile = useCallback(() => {
    setProfile(DEFAULT_PROFILE)
  }, [])

  return {
    profile,
    setProfile,
    update,
    updateSocial,
    setLogo,
    addService,
    updateService,
    removeService,
    moveService,
    saveChanges,
    resetProfile,
    savedFlash,
  }
}

export type BusinessProfileApi = ReturnType<typeof useBusinessProfile>

export type { ServiceItem }
