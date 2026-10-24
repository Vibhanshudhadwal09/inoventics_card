export type CardSide = 'front' | 'back'

export interface CardControlState {
  autoRotate: boolean
  zoom: number
  side: CardSide
  isInteracting: boolean
  flipToken: number
  resetToken: number
}

export interface CardControlActions {
  flip: () => void
  zoomIn: () => void
  zoomOut: () => void
  reset: () => void
  toggleAutoRotate: () => void
  setSide: (side: CardSide) => void
  setInteracting: (value: boolean) => void
}

export const ZOOM_MIN = 3.6
export const ZOOM_MAX = 11
export const ZOOM_DEFAULT = 7.2
export const ZOOM_STEP = 0.55

export const SERVICES = [
  'Web Development',
  'Mobile App Development',
  'DevOps',
  'Custom Software Solutions',
  'Cloud Solutions',
  'IT Consulting',
] as const
