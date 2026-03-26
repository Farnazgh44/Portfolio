import { useRef, useMemo, useEffect, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, ContactShadows } from "@react-three/drei"
import * as THREE from "three"

/* ─── Add your video path here once you have a video file ───────────────── */
const VIDEO_SRC = "/videos/laptop_mockup.mp4"

/* ─── MacBook-style dimensions (in Three.js units / metres) ─────────────── */
const BASE_W = 1.42   // base width
const BASE_H = 0.048  // base thickness
const BASE_D = 0.96   // base depth (front-to-back)
const LID_W  = 1.40   // lid width
const LID_T  = 0.020  // lid thickness
const LID_D  = 0.92   // lid depth

/* ─── Instanced keyboard keys ────────────────────────────────────────────── */
function KeyboardKeys() {
  const meshRef = useRef()
  const dummy   = useMemo(() => new THREE.Object3D(), [])

  const keys = useMemo(() => {
    const result = []
    // [z-position along depth, key count, individual key width, key depth]
    const rows = [
      { z:  0.28, n: 14, kw: 0.074, kd: 0.060 },  // fn / number row
      { z:  0.19, n: 14, kw: 0.079, kd: 0.063 },  // QWERTY
      { z:  0.09, n: 13, kw: 0.083, kd: 0.063 },  // ASDF
      { z: -0.01, n: 12, kw: 0.083, kd: 0.063 },  // ZXCV
      { z: -0.11, n: 10, kw: 0.083, kd: 0.063 },  // bottom alpha row
    ]
    const GAP = 0.0075

    rows.forEach(({ z, n, kw, kd }) => {
      const rowW  = n * kw + (n - 1) * GAP
      const startX = -rowW / 2 + kw / 2
      for (let i = 0; i < n; i++) {
        result.push({ x: startX + i * (kw + GAP), z, kw, kd })
      }
    })

    // Space bar row — wide spacebar + modifier keys
    const spaceZ = -0.21
    const spaceGAP = 0.0075
    result.push({ x:  0,     z: spaceZ, kw: 0.48,  kd: 0.063 }) // spacebar
    result.push({ x: -0.365, z: spaceZ, kw: 0.090, kd: 0.063 })
    result.push({ x: -0.267, z: spaceZ, kw: 0.072, kd: 0.063 })
    result.push({ x:  0.367, z: spaceZ, kw: 0.090, kd: 0.063 })
    result.push({ x:  0.269, z: spaceZ, kw: 0.072, kd: 0.063 })

    return result
  }, [])

  useEffect(() => {
    if (!meshRef.current) return
    const Y = BASE_H / 2 + 0.0065 / 2  // key sits on top of base
    keys.forEach((k, i) => {
      dummy.scale.set(k.kw, 1, k.kd)
      dummy.position.set(k.x, Y, k.z)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [keys, dummy])

  return (
    <instancedMesh ref={meshRef} args={[null, null, keys.length]} castShadow>
      <boxGeometry args={[1, 0.0065, 1]} />
      <meshStandardMaterial
        color={new THREE.Color(0.07, 0.09, 0.15)}
        roughness={0.88}
        metalness={0.12}
      />
    </instancedMesh>
  )
}

/* ─── Main laptop scene ──────────────────────────────────────────────────── */
function LaptopScene({ openFraction }) {
  const lidPivot      = useRef()
  const screenLight   = useRef()
  const targetAngle   = useRef(0)
  const videoTexture  = useRef(null)

  /* Lid angle: 0 = flat/closed on keyboard, –PI*0.67 ≈ 120° = fully open */
  useEffect(() => {
    targetAngle.current = -openFraction * Math.PI * 0.67
  }, [openFraction])

  /* Smooth lerp every frame for organic, physics-like hinge motion */
  useFrame(() => {
    if (lidPivot.current) {
      lidPivot.current.rotation.x = THREE.MathUtils.lerp(
        lidPivot.current.rotation.x,
        targetAngle.current,
        0.07   // lower = heavier / more inertia
      )
    }
    if (screenLight.current) {
      const brightness = Math.max(0, (openFraction - 0.28) / 0.72)
      screenLight.current.intensity = THREE.MathUtils.lerp(
        screenLight.current.intensity,
        brightness * 2.8,
        0.07
      )
    }
  })

  /* ── Video texture ── */
  useEffect(() => {
    if (!VIDEO_SRC) return
    const vid  = document.createElement("video")
    vid.src    = VIDEO_SRC
    vid.loop   = true
    vid.muted  = true
    vid.playsInline = true
    videoTexture.current = new THREE.VideoTexture(vid)
    return () => { vid.src = ""; videoTexture.current?.dispose() }
  }, [])

  useEffect(() => {
    if (!videoTexture.current) return
    const vid = videoTexture.current.image
    if (openFraction > 0.5) vid.play?.().catch(() => {})
    else vid.pause?.()
  }, [openFraction > 0.5])

  /* ── Materials ── */
  const bodyMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color:                      new THREE.Color(0.78, 0.87, 0.99),
    metalness:                  0.93,
    roughness:                  0.08,
    iridescence:                0.92,
    iridescenceIOR:             1.38,
    iridescenceThicknessRange:  [100, 540],
    envMapIntensity:            2.4,
    clearcoat:                  0.85,
    clearcoatRoughness:         0.04,
  }), [])

  const trackpadMat = useMemo(() => new THREE.MeshPhysicalMaterial({
    color:      new THREE.Color(0.60, 0.78, 0.96),
    metalness:  0.55,
    roughness:  0.14,
    iridescence:0.35,
    clearcoat:  0.7,
  }), [])

  const bezelMat = useMemo(() => new THREE.MeshStandardMaterial({
    color:    new THREE.Color(0.05, 0.05, 0.08),
    roughness:0.82,
    metalness:0.05,
  }), [])

  const screenBrightness = Math.max(0, (openFraction - 0.26) / 0.74)

  const screenMat = useMemo(() => new THREE.MeshStandardMaterial({
    color:              new THREE.Color(0.02, 0.02, 0.05),
    roughness:          0.03,
    metalness:          0.0,
    emissive:           new THREE.Color(0.55, 0.74, 1.0),
    emissiveIntensity:  screenBrightness * 0.5,
    ...(videoTexture.current ? { map: videoTexture.current, emissiveMap: videoTexture.current } : {}),
  }), [screenBrightness])

  const kbHousingMat = useMemo(() => new THREE.MeshStandardMaterial({
    color:    new THREE.Color(0.06, 0.08, 0.13),
    roughness:0.90,
  }), [])

  /* ── Geometry ── */
  return (
    <group position={[0, -0.30, 0]} rotation={[0, 0.08, 0]}>

      {/* ══ BASE ══ */}
      <mesh material={bodyMat} castShadow receiveShadow>
        <boxGeometry args={[BASE_W, BASE_H, BASE_D]} />
      </mesh>

      {/* Slightly raised rim around keyboard housing */}
      <mesh position={[0, BASE_H / 2 + 0.0008, 0.035]}>
        <boxGeometry args={[BASE_W * 0.855, 0.0015, BASE_D * 0.72]} />
        <meshStandardMaterial color={new THREE.Color(0.10, 0.12, 0.20)} roughness={0.88} />
      </mesh>

      {/* Dark keyboard housing inset */}
      <mesh material={kbHousingMat} position={[0, BASE_H / 2 + 0.0005, 0.035]}>
        <boxGeometry args={[BASE_W * 0.840, 0.0010, BASE_D * 0.70]} />
      </mesh>

      {/* Keys */}
      <KeyboardKeys />

      {/* Trackpad */}
      <mesh material={trackpadMat} position={[0, BASE_H / 2 + 0.0015, BASE_D * 0.305]} castShadow>
        <boxGeometry args={[BASE_W * 0.305, 0.0025, BASE_D * 0.185]} />
      </mesh>

      {/* Trackpad click-line (physical button seam) */}
      <mesh position={[0, BASE_H / 2 + 0.0025, BASE_D * 0.395]}>
        <boxGeometry args={[BASE_W * 0.305, 0.0010, 0.0018]} />
        <meshStandardMaterial color={new THREE.Color(0.38, 0.55, 0.78)} roughness={0.3} />
      </mesh>

      {/* Front-edge chamfer strip */}
      <mesh material={bodyMat} position={[0, 0, BASE_D / 2 + 0.005]} rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[BASE_W, 0.012, 0.012]} />
      </mesh>

      {/* ══ LID PIVOT — exactly at the hinge (back top edge of base) ══
           When rotation.x = 0   → lid lies flat, covering keyboard (closed)
           When rotation.x = –PI*0.67 → lid at ~120° open angle            */}
      <group ref={lidPivot} position={[0, BASE_H / 2, -BASE_D / 2]}>

        {/* Lid shell — extends forward (toward +Z) from hinge */}
        <mesh material={bodyMat} position={[0, LID_T / 2, LID_D / 2]} castShadow>
          <boxGeometry args={[LID_W, LID_T, LID_D]} />
        </mesh>

        {/* Screen bezel (black frame inside the lid face) */}
        <mesh material={bezelMat} position={[0, 0.0005, LID_D / 2]}>
          <boxGeometry args={[LID_W * 0.965, 0.0015, LID_D * 0.962]} />
        </mesh>

        {/* Screen surface — emissive + optional video texture */}
        <mesh material={screenMat} position={[0, 0.0015, LID_D / 2]}>
          <boxGeometry args={[LID_W * 0.828, 0.0010, LID_D * 0.828]} />
        </mesh>

        {/* Screen glow bloom — slightly larger emissive plane for soft halo */}
        {screenBrightness > 0.05 && (
          <mesh position={[0, 0.001, LID_D / 2]}>
            <boxGeometry args={[LID_W * 0.86, 0.0005, LID_D * 0.86]} />
            <meshStandardMaterial
              color={new THREE.Color(0, 0, 0)}
              emissive={new THREE.Color(0.4, 0.65, 1.0)}
              emissiveIntensity={screenBrightness * 0.25}
              transparent
              opacity={0.6}
            />
          </mesh>
        )}

        {/* Screen light — illuminates the keyboard with a soft blue glow */}
        <pointLight
          ref={screenLight}
          position={[0, 0.18, LID_D / 2]}
          color={new THREE.Color(0.60, 0.80, 1.0)}
          intensity={0}
          distance={3.8}
          decay={2}
        />

        {/* Webcam dot */}
        <mesh position={[0, LID_T / 2 + 0.0025, LID_D - 0.042]}>
          <cylinderGeometry args={[0.0085, 0.0085, 0.006, 20]} />
          <meshStandardMaterial color="#0d0d14" roughness={0.18} metalness={0.6} />
        </mesh>

        {/* Webcam ring */}
        <mesh position={[0, LID_T / 2 + 0.0025, LID_D - 0.042]}>
          <torusGeometry args={[0.013, 0.003, 8, 24]} />
          <meshStandardMaterial color={new THREE.Color(0.3, 0.4, 0.6)} metalness={0.7} roughness={0.2} />
        </mesh>

        {/* Lid back-edge chamfer (visible at hinge) */}
        <mesh material={bodyMat} position={[0, LID_T / 2, 0.006]} rotation={[Math.PI / 4, 0, 0]}>
          <boxGeometry args={[LID_W, 0.012, 0.012]} />
        </mesh>
      </group>

      {/* Hinge bar (visible centre notch) */}
      <mesh material={bodyMat} position={[0, BASE_H / 2 + 0.005, -BASE_D / 2 + 0.005]}>
        <boxGeometry args={[LID_W * 0.14, 0.010, 0.018]} />
      </mesh>

      {/* Base bottom edge chamfer */}
      <mesh material={bodyMat} position={[0, -BASE_H / 2, BASE_D / 2 - 0.01]} rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[BASE_W, 0.010, 0.010]} />
      </mesh>

      {/* Rubber feet */}
      {[[-0.58, -BASE_D / 2 + 0.06], [0.58, -BASE_D / 2 + 0.06],
        [-0.58,  BASE_D / 2 - 0.06], [0.58,  BASE_D / 2 - 0.06]].map(([x, z], i) => (
        <mesh key={i} position={[x, -BASE_H / 2 - 0.007, z]}>
          <cylinderGeometry args={[0.028, 0.028, 0.014, 16]} />
          <meshStandardMaterial color="#111" roughness={0.98} />
        </mesh>
      ))}
    </group>
  )
}

/* ─── Canvas wrapper exported to featured-works ──────────────────────────── */
export function LaptopModel({ openFraction = 0 }) {
  return (
    <div style={{ width: "100%", height: "60vh", position: "relative" }}>
      <Canvas
        shadows
        gl={{
          antialias:          true,
          alpha:              true,
          toneMapping:        THREE.ACESFilmicToneMapping,
          toneMappingExposure:1.15,
        }}
        camera={{ position: [0, 0.95, 2.65], fov: 36 }}
        style={{ background: "transparent" }}
      >
        {/* Lighting — two-tone to bring out the iridescent finish */}
        <ambientLight intensity={0.22} color={new THREE.Color(0.82, 0.89, 1.0)} />

        {/* Key light — warm, from upper-right front */}
        <directionalLight
          position={[2.0, 3.5, 2.5]}
          intensity={1.45}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-near={0.5}
          shadow-camera-far={12}
          shadow-camera-left={-3}
          shadow-camera-right={3}
          shadow-camera-top={3}
          shadow-camera-bottom={-3}
          color={new THREE.Color(1.0, 0.96, 0.90)}
        />

        {/* Fill light — cool, from upper-left back */}
        <directionalLight
          position={[-2.2, 1.8, -1.5]}
          intensity={0.52}
          color={new THREE.Color(0.65, 0.80, 1.0)}
        />

        {/* Rim light — cyan edge pop from below-right */}
        <pointLight
          position={[1.6, -0.5, 1.0]}
          intensity={0.35}
          color={new THREE.Color(0.40, 0.85, 1.0)}
        />

        {/* Studio HDR environment for iridescence reflections */}
        <Suspense fallback={null}>
          <Environment preset="studio" />
        </Suspense>

        <LaptopScene openFraction={openFraction} />

        {/* Ground shadow */}
        <ContactShadows
          position={[0, -0.56, 0]}
          opacity={0.50}
          scale={4.5}
          blur={2.6}
          far={1.4}
          color="#0d1a30"
        />
      </Canvas>
    </div>
  )
}
