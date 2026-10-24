import { useMemo } from 'react'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function makeWallTexture() {
  const w = 1024
  const h = 1024
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#f3ebe1')
  g.addColorStop(0.45, '#ebe1d4')
  g.addColorStop(1, '#ddd0bf')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  // Soft plant / leaf shadows on the left (like the reference)
  ctx.save()
  ctx.globalAlpha = 0.12
  ctx.fillStyle = '#6a5a48'
  const drawLeaf = (x: number, y: number, len: number, ang: number, wdt: number) => {
    ctx.save()
    ctx.translate(x, y)
    ctx.rotate(ang)
    ctx.beginPath()
    ctx.ellipse(0, 0, wdt, len, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
  for (let i = 0; i < 18; i++) {
    drawLeaf(
      80 + (i % 5) * 55 + Math.sin(i * 1.7) * 30,
      180 + Math.floor(i / 5) * 90 + Math.cos(i) * 40,
      70 + (i % 4) * 18,
      -0.6 - (i % 5) * 0.18,
      14 + (i % 3) * 4,
    )
  }
  ctx.globalAlpha = 0.07
  ctx.fillStyle = '#8a7460'
  for (let i = 0; i < 12; i++) {
    drawLeaf(
      40 + i * 40,
      420 + Math.sin(i * 2) * 60,
      50 + (i % 3) * 20,
      -0.9 + i * 0.05,
      10,
    )
  }
  ctx.restore()

  // Fine wall grain
  const img = ctx.getImageData(0, 0, w, h)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 8
    img.data[i] = Math.min(255, Math.max(0, img.data[i] + n))
    img.data[i + 1] = Math.min(255, Math.max(0, img.data[i + 1] + n))
    img.data[i + 2] = Math.min(255, Math.max(0, img.data[i + 2] + n))
  }
  ctx.putImageData(img, 0, 0)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

function makeMarbleTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  ctx.fillStyle = '#f7f4ef'
  ctx.fillRect(0, 0, size, size)

  // Soft grey veins
  for (let i = 0; i < 28; i++) {
    ctx.beginPath()
    const x0 = Math.random() * size
    const y0 = Math.random() * size
    ctx.moveTo(x0, y0)
    for (let s = 0; s < 5; s++) {
      ctx.quadraticCurveTo(
        x0 + (Math.random() - 0.5) * 180,
        y0 + s * 40 + Math.random() * 30,
        x0 + (Math.random() - 0.5) * 220,
        y0 + (s + 1) * 55,
      )
    }
    ctx.strokeStyle = `rgba(140, 140, 145, ${0.08 + Math.random() * 0.12})`
    ctx.lineWidth = 1 + Math.random() * 2.5
    ctx.stroke()
  }

  // Warm speckles
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    ctx.fillStyle = `rgba(180, 170, 155, ${Math.random() * 0.08})`
    ctx.fillRect(x, y, 1.5, 1.5)
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(2, 2)
  tex.anisotropy = 8
  return tex
}

function GlowRing({
  position,
  radius = 2.35,
}: {
  position: [number, number, number]
  radius?: number
}) {
  return (
    <group position={position}>
      {/* Soft outer bloom disc */}
      <mesh>
        <ringGeometry args={[radius * 0.82, radius * 1.28, 96]} />
        <meshBasicMaterial
          color="#FF9A4A"
          transparent
          opacity={0.18}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Bright ring core */}
      <mesh>
        <torusGeometry args={[radius, 0.045, 16, 120]} />
        <meshStandardMaterial
          color="#FFB56A"
          emissive="#FF6A1A"
          emissiveIntensity={2.4}
          roughness={0.35}
          metalness={0.2}
          toneMapped={false}
        />
      </mesh>
      {/* Inner soft fill glow */}
      <mesh>
        <circleGeometry args={[radius * 0.78, 64]} />
        <meshBasicMaterial
          color="#FFE4C4"
          transparent
          opacity={0.12}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight
        intensity={1.1}
        distance={8}
        decay={2}
        color="#FF8A3D"
        position={[0, 0, 0.3]}
      />
    </group>
  )
}

function MarblePedestal() {
  const marble = useMemo(() => makeMarbleTexture(), [])
  const marbleSide = useMemo(() => {
    const t = marble.clone()
    t.repeat.set(3, 1)
    return t
  }, [marble])

  return (
    <group position={[0, -1.42, 0]}>
      {/* Top disc */}
      <mesh castShadow receiveShadow position={[0, 0.38, 0]}>
        <cylinderGeometry args={[1.45, 1.45, 0.08, 64]} />
        <meshStandardMaterial
          map={marble}
          roughness={0.28}
          metalness={0.08}
          color="#ffffff"
        />
      </mesh>
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, 0.08, 0]}>
        <cylinderGeometry args={[1.35, 1.48, 0.55, 64]} />
        <meshStandardMaterial
          map={marbleSide}
          roughness={0.32}
          metalness={0.06}
          color="#f5f2ec"
        />
      </mesh>
      {/* Gold rings */}
      <mesh position={[0, 0.28, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.38, 0.018, 12, 80]} />
        <meshStandardMaterial
          color="#C9A24A"
          metalness={0.92}
          roughness={0.28}
          emissive="#7a5a20"
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh position={[0, 0.12, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.42, 0.016, 12, 80]} />
        <meshStandardMaterial
          color="#D4AF57"
          metalness={0.94}
          roughness={0.25}
          emissive="#7a5a20"
          emissiveIntensity={0.12}
        />
      </mesh>
      {/* Soft light under pedestal edge */}
      <pointLight
        position={[0, 0.5, 0]}
        intensity={0.25}
        distance={3}
        color="#fff2df"
      />
    </group>
  )
}

/**
 * Warm gallery studio inspired by a premium product render:
 * beige wall, glow ring, marble pedestal with gold bands.
 */
export function StudioEnvironment() {
  const wall = useMemo(() => makeWallTexture(), [])
  const floorMarble = useMemo(() => makeMarbleTexture(), [])

  return (
    <group>
      {/* Warm beige backdrop */}
      <mesh position={[0, 0.6, -4.4]} receiveShadow>
        <planeGeometry args={[22, 14]} />
        <meshStandardMaterial
          map={wall}
          roughness={0.95}
          metalness={0}
          color="#ffffff"
        />
      </mesh>

      <GlowRing position={[0, 0.55, -3.55]} radius={2.55} />

      {/* Marble floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.72, 0.6]}
        receiveShadow
      >
        <planeGeometry args={[24, 18]} />
        <meshStandardMaterial
          map={floorMarble}
          roughness={0.35}
          metalness={0.12}
          color="#ffffff"
        />
      </mesh>

      <MarblePedestal />

      <ContactShadows
        position={[0, -1.71, 0]}
        opacity={0.4}
        scale={14}
        blur={2.6}
        far={5}
        color="#5a4a3a"
      />
    </group>
  )
}

export function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.55} color="#fff5ea" />
      {/* Key from upper right — matches reference */}
      <directionalLight
        castShadow
        position={[4.2, 6.2, 3.5]}
        intensity={1.35}
        color="#fff4e6"
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.00025}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-6, 6, 6, -6, 0.5, 28]}
        />
      </directionalLight>
      {/* Soft left fill */}
      <directionalLight
        position={[-3.5, 2.8, 2]}
        intensity={0.35}
        color="#f0e4d4"
      />
      {/* Warm back wash */}
      <spotLight
        position={[0, 3.5, -2]}
        angle={0.7}
        penumbra={0.85}
        intensity={0.65}
        color="#FFB06A"
        distance={16}
      />
      <pointLight position={[2.5, 1.5, 2]} intensity={0.28} color="#ffe8c8" />
    </>
  )
}
