/**
 * 3D Perfume Bottle — Project Case Study Page
 * Hero: left info panel (32vw) + right interactive Three.js FBX viewer (flex:1)
 * Accent colour: lavender-pink  rgba(240,171,252,1)
 */
import { useState, useRef, useEffect } from "react"
import { useRouter } from "../lib/router-context"
import { SideBlobs } from "../components/side-blobs"
import { Footer }    from "../components/footer"
import * as THREE from "three"
import { GLTFLoader }     from "three/examples/jsm/loaders/GLTFLoader"
import { OrbitControls }  from "three/examples/jsm/controls/OrbitControls"

/* ─── Accent colours ────────────────────────────────────────────────────────── */
const PINK    = "rgba(240,171,252,1)"
const PINK12  = "rgba(240,171,252,0.12)"
const PINK30  = "rgba(240,171,252,0.30)"

/* ─── Toolkit ────────────────────────────────────────────────────────────────── */
const TOOLS = [
  { name: "Dimension", icon: "/images/toolkit-dimension.png" },
  { name: "Photoshop", icon: "/images/toolkit-photoshop.png" },
]

/* ─── Tool icon (square, pop-in animation) ───────────────────────────────────── */
function ToolIcon({ name, icon, animDelay = "0s" }) {
  return (
    <div
      title={name}
      style={{
        animation:            `pfPopIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${animDelay} both`,
        width:                "54px",
        height:               "54px",
        borderRadius:         "14px",
        background:           "rgba(255,255,255,0.10)",
        backdropFilter:       "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border:               "1px solid rgba(255,255,255,0.15)",
        display:              "flex",
        alignItems:           "center",
        justifyContent:       "center",
        flexShrink:           0,
        transition:           "background 0.2s ease, border-color 0.2s ease",
        cursor:               "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background  = "rgba(255,255,255,0.18)"
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background  = "rgba(255,255,255,0.10)"
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"
      }}
    >
      <img src={icon} alt={name} style={{ width: 32, height: 32, objectFit: "contain" }} />
    </div>
  )
}

/* ─── Interactive Three.js FBX Viewer ───────────────────────────────────────── */
function PerfumeViewer3D() {
  const mountRef  = useRef(null)
  const [status, setStatus] = useState("loading") /* loading | ready | error */
  const [hint,   setHint]   = useState(true)       /* show interaction hint   */

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    /* ── Scene ── */
    const scene = new THREE.Scene()

    /* ── Camera ── */
    const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.01, 2000)
    camera.position.set(0, 0, 8)

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(el.clientWidth, el.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled    = true
    renderer.shadowMap.type       = THREE.PCFSoftShadowMap
    renderer.outputColorSpace     = THREE.SRGBColorSpace
    renderer.toneMapping          = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure  = 1.4
    el.appendChild(renderer.domElement)

    /* ── Lighting ── */
    /* Soft ambient fill */
    scene.add(new THREE.AmbientLight(0xffffff, 0.7))

    /* Main key light */
    const key = new THREE.DirectionalLight(0xffffff, 2.2)
    key.position.set(4, 8, 6)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.near = 0.5
    key.shadow.camera.far  = 100
    scene.add(key)

    /* Rim / fill lights for depth */
    const rim = new THREE.DirectionalLight(0xf0abfc, 1.0)  /* pink rim */
    rim.position.set(-5, 4, -4)
    scene.add(rim)

    const fill = new THREE.DirectionalLight(0xc4b5fd, 0.6) /* soft purple fill */
    fill.position.set(3, -3, 5)
    scene.add(fill)

    /* ── OrbitControls ── */
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping    = true
    controls.dampingFactor    = 0.06
    controls.enableZoom       = true
    controls.zoomSpeed        = 0.8
    controls.enablePan        = false   /* no pan — keeps model centred */
    controls.minDistance      = 0.5
    controls.maxDistance      = 40
    controls.autoRotate       = true
    controls.autoRotateSpeed  = 1.2
    controls.target.set(0, 0, 0)

    /* Pause auto-rotate while user interacts; resume 3 s after they stop */
    let resumeTimer = null
    const pauseRotate = () => {
      controls.autoRotate = false
      clearTimeout(resumeTimer)
    }
    const scheduleResume = () => {
      resumeTimer = setTimeout(() => { controls.autoRotate = true }, 3000)
    }
    controls.addEventListener("start", pauseRotate)
    controls.addEventListener("end",   scheduleResume)

    /* ── Load GLB ── */
    const loader = new GLTFLoader()
    loader.load(
      "/images/Perfume_Btle.glb",

      /* onLoad */
      (gltf) => {
        const model = gltf.scene

        /* Centre & auto-scale to fit camera view */
        const box    = new THREE.Box3().setFromObject(model)
        const centre = box.getCenter(new THREE.Vector3())
        const size   = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const targetSize = 3.5                        /* desired world-unit size */
        const scale  = targetSize / maxDim

        /* Scale first, THEN re-center — order matters because Three.js applies
           scale before position; computing the offset at pre-scale size leaves
           the model off-center after scaling */
        model.scale.setScalar(scale)
        model.position.set(
          -centre.x * scale,
          -centre.y * scale,
          -centre.z * scale,
        )

        /* Traverse: enable shadows & boost material quality */
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow    = true
            child.receiveShadow = true
            if (child.material) {
              const mats = Array.isArray(child.material) ? child.material : [child.material]
              mats.forEach(m => {
                /* GLB PBR materials — boost env reflections if present */
                if (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) {
                  m.envMapIntensity = 1.2
                  m.needsUpdate     = true
                }
              })
            }
          }
        })

        scene.add(model)

        /* Place camera to frame the entire model using FOV-based distance */
        const scaledY = size.y * scale
        const scaledX = size.x * scale
        const scaledZ = size.z * scale

        const vFovRad = camera.fov * (Math.PI / 180)
        const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * camera.aspect)

        /* Minimum distance so the tallest & widest extents fit the frustum */
        const distForH = (scaledY / 2) / Math.tan(vFovRad / 2)
        const distForW = (scaledX / 2) / Math.tan(hFovRad / 2)
        /* Add half the model depth so near-plane doesn't clip front face */
        const dist = Math.max(distForH, distForW) * 1.65 + scaledZ / 2

        camera.position.set(0, 0, dist)
        controls.target.set(0, 0, 0)
        controls.minDistance = dist * 0.3
        controls.maxDistance = dist * 4
        controls.update()

        setStatus("ready")
        /* Hide interaction hint after 4 s */
        setTimeout(() => setHint(false), 4000)
      },

      /* onProgress */
      () => {},

      /* onError */
      (err) => {
        console.error("[PerfumeViewer3D] GLB load error:", err)
        setStatus("error")
      }
    )

    /* ── Resize handler ── */
    const onResize = () => {
      if (!el) return
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(el.clientWidth, el.clientHeight)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(el)

    /* ── Render loop ── */
    let animId
    const animate = () => {
      animId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(animId)
      clearTimeout(resumeTimer)
      controls.removeEventListener("start", pauseRotate)
      controls.removeEventListener("end",   scheduleResume)
      controls.dispose()
      renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
      ro.disconnect()
    }
  }, [])

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      {/* Three.js canvas mount point */}
      <div
        ref={mountRef}
        style={{ width: "100%", height: "100%", display: "block" }}
      />

      {/* Loading overlay */}
      {status === "loading" && (
        <div style={{
          position:       "absolute",
          inset:          0,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          gap:            "16px",
          pointerEvents:  "none",
        }}>
          {/* Spinner */}
          <div style={{
            width:        "40px",
            height:       "40px",
            borderRadius: "50%",
            border:       "3px solid rgba(240,171,252,0.15)",
            borderTop:    `3px solid ${PINK}`,
            animation:    "pfSpin 0.9s linear infinite",
          }} />
          <span style={{
            color:         "rgba(240,171,252,0.70)",
            fontSize:      "0.82rem",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            Loading 3D model…
          </span>
        </div>
      )}

      {/* Error state */}
      {status === "error" && (
        <div style={{
          position:       "absolute",
          inset:          0,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          color:          "rgba(255,100,100,0.7)",
          fontSize:       "0.85rem",
          pointerEvents:  "none",
        }}>
          Could not load model — ensure Perfume_Btle.glb is in public/images/
        </div>
      )}

      {/* Interaction hint — fades out after 4 s */}
      {status === "ready" && hint && (
        <div style={{
          position:      "absolute",
          bottom:        "28px",
          left:          "50%",
          transform:     "translateX(-50%)",
          display:       "flex",
          alignItems:    "center",
          gap:           "10px",
          padding:       "7px 18px",
          borderRadius:  "999px",
          background:    "rgba(0,0,0,0.40)",
          backdropFilter:"blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border:        "1px solid rgba(240,171,252,0.20)",
          pointerEvents: "none",
          animation:     "pfFadeOut 1s ease 3.2s both",
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke={PINK} strokeWidth="1.4" strokeDasharray="3 2"/>
            <path d="M7 4v3l2 1.2" stroke={PINK} strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <span style={{ color: "rgba(255,255,255,0.60)", fontSize: "0.72rem", letterSpacing: "0.07em", textTransform: "uppercase", whiteSpace: "nowrap" }}>
            Drag to rotate · Scroll to zoom
          </span>
        </div>
      )}

      {/* Persistent subtle hint (always visible) */}
      {status === "ready" && !hint && (
        <div style={{
          position:      "absolute",
          bottom:        "28px",
          left:          "50%",
          transform:     "translateX(-50%)",
          color:         "rgba(255,255,255,0.22)",
          fontSize:      "0.68rem",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          pointerEvents: "none",
          whiteSpace:    "nowrap",
        }}>
          Drag · Scroll to zoom
        </div>
      )}
    </div>
  )
}

/* ─── Main page ──────────────────────────────────────────────────────────────── */
export function PerfumePage() {
  const { navigate } = useRouter()
  const backBtnRef = useRef(null)

  useEffect(() => {
    const syncLeft = () => {
      const header = document.querySelector("header")
      const btn    = backBtnRef.current
      if (!header || !btn) return
      btn.style.left = window.getComputedStyle(header).paddingLeft
    }
    syncLeft()
    window.addEventListener("resize", syncLeft)
    return () => window.removeEventListener("resize", syncLeft)
  }, [])

  return (
    <>
      <style>{`
        @keyframes pfSlideLeft {
          from { opacity: 0; transform: translateX(-52px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        @keyframes pfPopIn {
          from { opacity: 0; transform: scale(0.45); }
          to   { opacity: 1; transform: scale(1);    }
        }
        @keyframes pfSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes pfFadeOut {
          to { opacity: 0; }
        }
      `}</style>

      <SideBlobs />

      <main style={{ minHeight: "100vh" }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section style={{
          display:  "flex",
          width:    "100vw",
          height:   "100vh",
          position: "relative",
        }}>

          {/* ── LEFT PANEL ── */}
          <div style={{
            width:          "32vw",
            minWidth:       "300px",
            flexShrink:     0,
            display:        "flex",
            flexDirection:  "column",
            justifyContent: "center",
            padding:        "0 clamp(36px,5vw,72px)",
            position:       "relative",
            zIndex:         2,
          }}>

            {/* ← Back — fixed so always visible while scrolling */}
            <button
              ref={backBtnRef}
              onClick={() => navigate("projects")}
              style={{
                position:             "fixed",
                top:                  "clamp(72px,9vh,96px)",
                zIndex:               50,
                display:              "flex",
                alignItems:           "center",
                gap:                  "7px",
                padding:              "11px 26px",
                borderRadius:         "999px",
                background:           "rgba(255,255,255,0.10)",
                backdropFilter:       "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border:               "1px solid rgba(255,255,255,0.22)",
                color:                "rgba(255,255,255,0.88)",
                fontSize:             "0.85rem",
                fontWeight:           500,
                cursor:               "pointer",
                letterSpacing:        "0.04em",
                transition:           "background 0.2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.10)"}
            >
              ← Back
            </button>

            {/* Info block */}
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

              {/* Perfume icon / logo placeholder */}
              <div style={{
                animation: "pfSlideLeft 0.70s cubic-bezier(0.25,0.46,0.45,0.94) 0.10s both",
                alignSelf: "flex-start",
              }}>
                <div style={{
                  width:        "clamp(64px,8vw,96px)",
                  height:       "clamp(64px,8vw,96px)",
                  borderRadius: "22px",
                  background:   PINK12,
                  border:       `1px solid ${PINK30}`,
                  display:      "flex",
                  alignItems:   "center",
                  justifyContent: "center",
                  fontSize:     "clamp(28px,4vw,44px)",
                  filter:       `drop-shadow(0 4px 18px rgba(240,171,252,0.40))`,
                }}>
                  🧴
                </div>
              </div>

              {/* Title */}
              <h1 style={{
                margin:    0,
                color:     "#fff",
                fontSize:  "clamp(1.8rem,3.2vw,2.9rem)",
                fontWeight:700,
                lineHeight:1.05,
                animation: "pfSlideLeft 0.70s cubic-bezier(0.25,0.46,0.45,0.94) 0.25s both",
              }}>
                3D Perfume<br/>Bottle
              </h1>

              {/* Category badge */}
              <div style={{
                display:       "inline-flex",
                alignSelf:     "flex-start",
                padding:       "5px 16px",
                borderRadius:  "999px",
                background:    PINK12,
                border:        `1px solid rgba(240,171,252,0.40)`,
                color:         PINK,
                fontSize:      "0.75rem",
                fontWeight:    600,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                animation:     "pfSlideLeft 0.70s cubic-bezier(0.25,0.46,0.45,0.94) 0.40s both",
              }}>
                Product Visualisation
              </div>

              {/* Divider */}
              <div style={{
                width:        "44px",
                height:       "2px",
                background:   "rgba(255,255,255,0.22)",
                borderRadius: "2px",
                animation:    "pfSlideLeft 0.55s ease 0.52s both",
              }} />

              {/* Toolkit icons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {TOOLS.map((t, i) => (
                  <ToolIcon key={t.name} {...t} animDelay={`${0.58 + i * 0.10}s`} />
                ))}
              </div>

              {/* 3D badge */}
              <div style={{
                animation:     "pfSlideLeft 0.60s cubic-bezier(0.25,0.46,0.45,0.94) 0.82s both",
                display:       "inline-flex",
                alignSelf:     "flex-start",
                alignItems:    "center",
                gap:           "8px",
                padding:       "8px 16px",
                borderRadius:  "12px",
                background:    "rgba(255,255,255,0.06)",
                border:        "1px solid rgba(255,255,255,0.12)",
                color:         "rgba(255,255,255,0.55)",
                fontSize:      "0.78rem",
                letterSpacing: "0.04em",
              }}>
                <span style={{ color: PINK, fontWeight: 700 }}>✦</span>
                Interactive 3D model — drag to explore
              </div>

            </div>
          </div>

          {/* ── RIGHT PANEL — 3D viewer ── */}
          <div style={{
            flex:     1,
            position: "relative",
            height:   "100%",
          }}>
            <PerfumeViewer3D />
          </div>

        </section>

        {/* ══ CONTENT SECTIONS ══════════════════════════════════════════════ */}
        <div style={{ paddingBottom: "100px" }}>
          {[
            "Overview",
            "Problem & Goal",
            "Design Process",
            "Final Design",
            "Outcome & Reflection",
          ].map(title => (
            <div key={title} style={{
              width:                "clamp(320px,80vw,1100px)",
              margin:               "0 auto 40px",
              padding:              "clamp(28px,4vw,56px) clamp(28px,5vw,72px)",
              borderRadius:         "24px",
              background:           "rgba(255,255,255,0.05)",
              backdropFilter:       "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border:               "1px solid rgba(255,255,255,0.10)",
            }}>
              <h2 style={{
                margin:        "0 0 20px",
                color:         "#fff",
                fontSize:      "clamp(1.1rem,1.8vw,1.4rem)",
                fontWeight:    700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                opacity:       0.55,
              }}>
                {title}
              </h2>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.30)", fontSize: "0.88rem" }}>
                Content coming soon.
              </p>
            </div>
          ))}
        </div>

      </main>

      <Footer />
    </>
  )
}
