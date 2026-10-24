import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { cardDragState } from '../lib/cardDrag'
import type { CardControlState, CardSide } from '../types'

const CARD_W = 3.5
const CARD_H = 2
const CARD_D = 0.055
const FLIP_DURATION = 0.72

interface BusinessCard3DProps {
  state: CardControlState
  onSideChange: (side: CardSide) => void
  reducedMotion: boolean
}

export function BusinessCard3D({
  state,
  onSideChange,
  reducedMotion,
}: BusinessCard3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const { camera, gl } = useThree()

  const [frontMap, backMap] = useTexture([
    '/textures/card-front.png?v=2',
    '/textures/card-back.png?v=2',
  ])

  const flipAnim = useRef({
    active: false,
    elapsed: 0,
    from: 0,
    to: 0,
  })

  const floatPhase = useRef(0)
  const lastFlipToken = useRef(state.flipToken)
  const lastResetToken = useRef(state.resetToken)
  const lastReportedSide = useRef<CardSide>('front')
  const velocity = useRef({ y: 0, x: 0 })
  const frontNormal = useMemo(() => new THREE.Vector3(), [])
  const toCamera = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    const maxAniso = gl.capabilities.getMaxAnisotropy()
    for (const tex of [frontMap, backMap]) {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = Math.min(16, maxAniso)
      tex.minFilter = THREE.LinearMipmapLinearFilter
      tex.magFilter = THREE.LinearFilter
      tex.generateMipmaps = true
      tex.needsUpdate = true
    }
  }, [frontMap, backMap, gl])

  const frontMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: frontMap,
        roughness: 0.86,
        metalness: 0.02,
        envMapIntensity: 0.3,
      }),
    [frontMap],
  )

  const backMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: backMap,
        roughness: 0.86,
        metalness: 0.02,
        envMapIntensity: 0.3,
      }),
    [backMap],
  )

  const edgeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e6e8eb',
        roughness: 0.94,
        metalness: 0.02,
      }),
    [],
  )

  useEffect(() => {
    return () => {
      frontMat.dispose()
      backMat.dispose()
      edgeMat.dispose()
    }
  }, [frontMat, backMat, edgeMat])

  useEffect(() => {
    if (state.flipToken === lastFlipToken.current) return
    lastFlipToken.current = state.flipToken
    const group = groupRef.current
    if (!group) return

    velocity.current = { x: 0, y: 0 }
    flipAnim.current = {
      active: true,
      elapsed: 0,
      from: group.rotation.y,
      to: group.rotation.y + Math.PI,
    }
  }, [state.flipToken])

  useEffect(() => {
    if (state.resetToken === lastResetToken.current) return
    lastResetToken.current = state.resetToken
    const group = groupRef.current
    if (!group) return
    flipAnim.current.active = false
    velocity.current = { x: 0, y: 0 }
    group.rotation.set(0.1, -0.25, 0)
    group.position.set(0, 0, 0)
    lastReportedSide.current = 'front'
    onSideChange('front')
  }, [state.resetToken, onSideChange])

  useFrame((_, delta) => {
    const group = groupRef.current
    if (!group) return

    if (cardDragState.active) {
      flipAnim.current.active = false
      const sensY = 0.0075
      const sensX = 0.0045
      group.rotation.y += cardDragState.dx * sensY
      group.rotation.x = THREE.MathUtils.clamp(
        group.rotation.x + cardDragState.dy * sensX,
        -0.55,
        0.55,
      )
      velocity.current.y = cardDragState.dx * sensY * 60
      velocity.current.x = cardDragState.dy * sensX * 60
    } else if (flipAnim.current.active) {
      flipAnim.current.elapsed += delta
      const progress = Math.min(1, flipAnim.current.elapsed / FLIP_DURATION)
      const eased = 1 - Math.pow(1 - progress, 3)
      group.rotation.y =
        flipAnim.current.from +
        (flipAnim.current.to - flipAnim.current.from) * eased
      if (progress >= 1) {
        flipAnim.current.active = false
        group.rotation.y = flipAnim.current.to
        velocity.current = { x: 0, y: 0 }
      }
    } else {
      // Keep the orientation the user left — only apply light inertia, then stop
      if (
        Math.abs(velocity.current.y) > 0.002 ||
        Math.abs(velocity.current.x) > 0.002
      ) {
        group.rotation.y += velocity.current.y * delta
        group.rotation.x = THREE.MathUtils.clamp(
          group.rotation.x + velocity.current.x * delta,
          -0.55,
          0.55,
        )
        velocity.current.y *= Math.pow(0.92, delta * 60)
        velocity.current.x *= Math.pow(0.92, delta * 60)
      } else if (state.autoRotate && !state.isInteracting && !reducedMotion) {
        group.rotation.y += delta * 0.28
      }
    }

    if (!reducedMotion && !state.isInteracting && !flipAnim.current.active) {
      floatPhase.current += delta
      const floatY = Math.sin(floatPhase.current * 0.9) * 0.03
      group.position.y = THREE.MathUtils.lerp(group.position.y, floatY, 0.08)
    } else {
      group.position.y = THREE.MathUtils.lerp(group.position.y, 0, 0.12)
    }

    frontNormal.set(0, 0, 1).applyQuaternion(group.quaternion)
    toCamera.copy(camera.position).sub(group.position).normalize()
    const side: CardSide = frontNormal.dot(toCamera) > 0 ? 'front' : 'back'
    if (side !== lastReportedSide.current) {
      lastReportedSide.current = side
      onSideChange(side)
    }
  })

  return (
    <group ref={groupRef} rotation={[0.1, -0.25, 0]} castShadow receiveShadow>
      <mesh castShadow receiveShadow material={edgeMat}>
        <boxGeometry args={[CARD_W - 0.002, CARD_H - 0.002, CARD_D]} />
      </mesh>

      <mesh
        position={[0, 0, CARD_D / 2 + 0.0005]}
        castShadow
        receiveShadow
        material={frontMat}
      >
        <planeGeometry args={[CARD_W, CARD_H]} />
      </mesh>

      <mesh
        position={[0, 0, -(CARD_D / 2 + 0.0005)]}
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
        material={backMat}
      >
        <planeGeometry args={[CARD_W, CARD_H]} />
      </mesh>
    </group>
  )
}
