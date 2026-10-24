import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment } from '@react-three/drei'
import * as THREE from 'three'
import { BusinessCard3D } from './BusinessCard3D'
import { cardDragState } from '../lib/cardDrag'
import type { CardControlActions, CardControlState, CardSide } from '../types'
import { ZOOM_MAX, ZOOM_MIN } from '../types'

interface BusinessCardSceneProps {
  state: CardControlState
  actions: CardControlActions
  onZoomChange: (zoom: number) => void
}

function usePrefersReducedMotion() {
  return useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])
}

/** Frame the card and smoothly apply zoom distance from UI / wheel. */
function FitCamera({
  zoom,
  onZoomChange,
}: {
  zoom: number
  onZoomChange: (zoom: number) => void
}) {
  const { camera, size, gl } = useThree()
  const targetDist = useRef(zoom)
  const fittedOnce = useRef(false)
  const portraitRef = useRef(false)

  useEffect(() => {
    targetDist.current = zoom
  }, [zoom])

  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera
    const aspect = Math.max(0.35, size.width / Math.max(1, size.height))
    const portrait = aspect < 0.9
    portraitRef.current = portrait

    cam.fov = portrait ? 48 : 34
    cam.updateProjectionMatrix()

    const vFov = THREE.MathUtils.degToRad(cam.fov)
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect)

    // Extra margin so load state feels zoomed out, not cropped
    const marginW = portrait ? 1.85 : 1.55
    const marginH = portrait ? 2.05 : 1.65
    const distW = (3.5 / 2 / Math.tan(hFov / 2)) * marginW
    const distH = (2 / 2 / Math.tan(vFov / 2)) * marginH
    const fittedDist = Math.min(
      ZOOM_MAX,
      Math.max(ZOOM_MIN, Math.max(distW, distH)),
    )

    if (!fittedOnce.current) {
      fittedOnce.current = true
      targetDist.current = fittedDist
      onZoomChange(fittedDist)
      cam.position.set(0, portrait ? 0.1 : 0.28, fittedDist)
      cam.up.set(0, 1, 0)
      cam.lookAt(0, 0, 0)
    } else {
      // Keep current look; only nudge FOV/aspect on resize
      const next = THREE.MathUtils.clamp(
        Math.max(targetDist.current, fittedDist * 0.92),
        ZOOM_MIN,
        ZOOM_MAX,
      )
      targetDist.current = next
      onZoomChange(next)
    }
  }, [camera, size, onZoomChange])

  useEffect(() => {
    const el = gl.domElement

    const applyZoom = (next: number) => {
      const clamped = THREE.MathUtils.clamp(next, ZOOM_MIN, ZOOM_MAX)
      targetDist.current = clamped
      onZoomChange(clamped)
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const step = e.deltaY > 0 ? 0.35 : -0.35
      applyZoom(targetDist.current + step)
    }

    // Two-finger pinch zoom (mobile)
    let pinchStartDist = 0
    let pinchStartZoom = 0

    const touchDistance = (touches: TouchList) => {
      const a = touches[0]
      const b = touches[1]
      return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
    }

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        cardDragState.pinching = true
        cardDragState.active = false
        cardDragState.dx = 0
        cardDragState.dy = 0
        pinchStartDist = touchDistance(e.touches)
        pinchStartZoom = targetDist.current
      }
    }

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 2 || pinchStartDist <= 0) return
      e.preventDefault()
      cardDragState.pinching = true
      cardDragState.active = false
      const current = touchDistance(e.touches)
      if (current < 1) return
      // Fingers apart → zoom in (smaller camera distance)
      const ratio = pinchStartDist / current
      applyZoom(pinchStartZoom * ratio)
    }

    const endPinch = () => {
      pinchStartDist = 0
      cardDragState.pinching = false
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length < 2) endPinch()
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: false })
    el.addEventListener('touchend', onTouchEnd)
    el.addEventListener('touchcancel', onTouchEnd)

    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
      cardDragState.pinching = false
    }
  }, [gl, onZoomChange])

  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera
    const desired = THREE.MathUtils.clamp(
      targetDist.current,
      ZOOM_MIN,
      ZOOM_MAX,
    )
    const current = cam.position.length()
    if (Math.abs(current - desired) < 0.01) {
      if (Math.abs(current - desired) > 0.0001) {
        cam.position.setLength(desired)
      }
      return
    }
    const next = THREE.MathUtils.lerp(current, desired, 0.14)
    if (cam.position.lengthSq() < 0.0001) {
      cam.position.set(0, portraitRef.current ? 0.1 : 0.28, next)
    } else {
      cam.position.setLength(next)
    }
    cam.lookAt(0, 0, 0)
  })

  return null
}

function DragRotateBridge({
  setInteracting,
}: {
  setInteracting: (v: boolean) => void
}) {
  const { gl } = useThree()
  const dragging = useRef(false)
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const last = useRef({ x: 0, y: 0 })
  const delta = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const el = gl.domElement

    const down = (e: PointerEvent) => {
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

      // One finger only — rotate. Two fingers are handled by pinch zoom.
      if (pointers.current.size === 1 && !cardDragState.pinching) {
        dragging.current = true
        setInteracting(true)
        last.current = { x: e.clientX, y: e.clientY }
        delta.current = { x: 0, y: 0 }
        try {
          el.setPointerCapture(e.pointerId)
        } catch {
          /* ignore */
        }
      } else {
        dragging.current = false
        delta.current = { x: 0, y: 0 }
        setInteracting(true)
      }
    }

    const move = (e: PointerEvent) => {
      if (!pointers.current.has(e.pointerId)) return
      pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })

      if (
        !dragging.current ||
        cardDragState.pinching ||
        pointers.current.size !== 1
      ) {
        return
      }

      const dx = e.clientX - last.current.x
      const dy = e.clientY - last.current.y
      last.current = { x: e.clientX, y: e.clientY }
      delta.current.x += dx
      delta.current.y += dy
    }

    const up = (e: PointerEvent) => {
      pointers.current.delete(e.pointerId)
      try {
        el.releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }

      if (pointers.current.size === 0) {
        dragging.current = false
        setInteracting(false)
        return
      }

      // Resume single-finger rotate if one pointer remains after pinch
      if (pointers.current.size === 1 && !cardDragState.pinching) {
        const remaining = pointers.current.values().next().value
        if (remaining) {
          dragging.current = true
          last.current = { x: remaining.x, y: remaining.y }
          delta.current = { x: 0, y: 0 }
        }
      } else {
        dragging.current = false
        delta.current = { x: 0, y: 0 }
      }
    }

    el.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('pointercancel', up)

    return () => {
      el.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('pointercancel', up)
    }
  }, [gl, setInteracting])

  useFrame(() => {
    const canDrag =
      dragging.current &&
      !cardDragState.pinching &&
      pointers.current.size === 1
    cardDragState.active = canDrag
    cardDragState.dx = canDrag ? delta.current.x : 0
    cardDragState.dy = canDrag ? delta.current.y : 0
    delta.current.x = 0
    delta.current.y = 0
  })

  return null
}

function SceneContent({
  state,
  actions,
  onZoomChange,
}: BusinessCardSceneProps) {
  const reducedMotion = usePrefersReducedMotion()

  const handleSideChange = useCallback(
    (side: CardSide) => {
      actions.setSide(side)
    },
    [actions],
  )

  return (
    <>
      <FitCamera zoom={state.zoom} onZoomChange={onZoomChange} />
      <DragRotateBridge setInteracting={actions.setInteracting} />

      <color attach="background" args={['#0a0e14']} />
      <fog attach="fog" args={['#0a0e14', 14, 28]} />

      <ambientLight intensity={0.5} />
      <directionalLight
        castShadow
        position={[3.5, 5, 4]}
        intensity={1.3}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0002}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-4, 4, 4, -4, 0.5, 20]}
        />
      </directionalLight>
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#9eb6ff" />
      <spotLight
        position={[0, 4, -3]}
        angle={0.5}
        penumbra={0.8}
        intensity={0.45}
        color="#FF5A0A"
      />

      <Suspense fallback={null}>
        <BusinessCard3D
          state={state}
          onSideChange={handleSideChange}
          reducedMotion={reducedMotion}
        />
        <Environment preset="city" environmentIntensity={0.25} />
      </Suspense>

      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.35}
        scale={10}
        blur={2.6}
        far={3.5}
        color="#000000"
      />

      <mesh position={[0, 0.1, -2.8]}>
        <circleGeometry args={[2.2, 48]} />
        <meshBasicMaterial color="#FF5A0A" transparent opacity={0.05} />
      </mesh>
      <mesh position={[0, 0.1, -2.95]}>
        <circleGeometry args={[3.6, 48]} />
        <meshBasicMaterial color="#1a3048" transparent opacity={0.28} />
      </mesh>
    </>
  )
}

function LoaderFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#0a0e14]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-white/15 border-t-[#FF5A0A]" />
        <p className="text-xs tracking-wide text-white/45">Loading card…</p>
      </div>
    </div>
  )
}

export function BusinessCardScene({
  state,
  actions,
  onZoomChange,
}: BusinessCardSceneProps) {
  return (
    <div className="absolute inset-0 h-full w-full touch-none overflow-hidden bg-[#0a0e14]">
      <Suspense fallback={<LoaderFallback />}>
        <Canvas
          shadows
          dpr={[1, 1.75]}
          camera={{ position: [0, 0.25, 7.5], fov: 36, near: 0.1, far: 40 }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance',
          }}
          className="h-full w-full"
          style={{ touchAction: 'none' }}
          onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.05
            gl.setClearColor('#0a0e14')
          }}
        >
          <SceneContent
            state={state}
            actions={actions}
            onZoomChange={onZoomChange}
          />
        </Canvas>
      </Suspense>
    </div>
  )
}
