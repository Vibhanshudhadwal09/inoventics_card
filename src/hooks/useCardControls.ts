import { useCallback, useMemo, useState } from 'react'
import type { CardControlActions, CardControlState, CardSide } from '../types'
import { ZOOM_DEFAULT, ZOOM_MAX, ZOOM_MIN, ZOOM_STEP } from '../types'

function clampZoom(value: number) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value))
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function useCardControls() {
  const [autoRotate, setAutoRotate] = useState(() => !prefersReducedMotion())
  const [zoom, setZoom] = useState(ZOOM_DEFAULT)
  const [side, setSide] = useState<CardSide>('front')
  const [isInteracting, setIsInteracting] = useState(false)
  const [flipToken, setFlipToken] = useState(0)
  const [resetToken, setResetToken] = useState(0)

  const flip = useCallback(() => {
    setFlipToken((t) => t + 1)
  }, [])

  const zoomIn = useCallback(() => {
    setZoom((z) => clampZoom(z - ZOOM_STEP))
  }, [])

  const zoomOut = useCallback(() => {
    setZoom((z) => clampZoom(z + ZOOM_STEP))
  }, [])

  const reset = useCallback(() => {
    setZoom(ZOOM_DEFAULT)
    setAutoRotate(true)
    setSide('front')
    setResetToken((t) => t + 1)
  }, [])

  const toggleAutoRotate = useCallback(() => {
    setAutoRotate((v) => !v)
  }, [])

  const setInteracting = useCallback((value: boolean) => {
    setIsInteracting(value)
  }, [])

  const state: CardControlState = useMemo(
    () => ({
      autoRotate,
      zoom,
      side,
      isInteracting,
      flipToken,
      resetToken,
    }),
    [autoRotate, zoom, side, isInteracting, flipToken, resetToken],
  )

  const actions: CardControlActions = useMemo(
    () => ({
      flip,
      zoomIn,
      zoomOut,
      reset,
      toggleAutoRotate,
      setSide,
      setInteracting,
    }),
    [flip, zoomIn, zoomOut, reset, toggleAutoRotate, setInteracting],
  )

  return { state, actions, setZoom: (z: number) => setZoom(clampZoom(z)) }
}
