/**
 * Cat Phone Holder — Project Case Study Page
 * Hero : left info panel + right Three.js GLB viewer  (same pattern as PerfumePage)
 * Below: Design Process stepper + sticky glass visual  (same pattern as SugarCloud)
 */
import { useState, useRef, useEffect } from "react"
import { useRouter } from "../lib/router-context"
import { SideBlobs } from "../components/side-blobs"
import { Footer }    from "../components/footer"
import * as THREE from "three"
import { GLTFLoader }    from "three/examples/jsm/loaders/GLTFLoader"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

/* ── Update this to match your actual GLB filename in public/images/ ─── */
const GLB_PATH = "/images/Cat_Holder.glb"

/* ── Accent colours ─────────────────────────────────────────────────────── */
const ACCENT     = "#DBC7AC"
const ACCENT_DIM = "rgba(219,199,172,0.18)"
const ACCENT_MID = "rgba(219,199,172,0.45)"

/* ── Toolkit ─────────────────────────────────────────────────────────────── */
const TOOLS = [
  { name: "Tinkercad", icon: "/images/toolkit-tinkercad.png" },
]

/* ── Design-process steps ────────────────────────────────────────────────── */
const STEPS = [
  {
    number: 1,
    title:  "Project Overview",
    visual: "/images/Cat_feature.png",
    content: [
      { type: "heading", text: "The Project" },
      { type: "para",    text: "Cat Phone Holder is a 3D-designed desk accessory that combines everyday utility with personality. The goal was simple: design a functional phone stand that also brings a little joy to any workspace." },
      { type: "heading", text: "What Was Built" },
      { type: "para",    text: "A fully modelled, print-ready cat figure whose body doubles as a stable phone cradle. Every curve and proportion was shaped in Tinkercad to balance aesthetics with practical phone-holding geometry." },
      { type: "highlight", text: "Designed to be 3D-printed at home — no supports required, minimal post-processing, and sized for both standard and larger smartphones." },
    ],
  },
  {
    number: 2,
    title:  "Problem & Goal",
    visual: "/images/project-phone-holder.png",
    content: [
      { type: "heading", text: "The Problem" },
      { type: "para",    text: "Most phone stands on the market are purely functional — flat, generic, and forgettable. They hold a phone, nothing more. There is a missed opportunity to make a desk accessory that people actually want to display." },
      { type: "heading", text: "The Goal" },
      { type: "bullets", items: [
        "Design a phone holder that is genuinely fun to have on a desk",
        "Keep the silhouette immediately recognisable — unmistakably a cat",
        "Ensure the cradle angle is practical: comfortable for video calls, reading, and notifications",
        "Make the model printable without complex support structures",
      ]},
      { type: "highlight", text: "The brief pushed beyond pure function — the holder needed to be an object people choose to keep, not just one they tolerate." },
    ],
  },
  {
    number: 3,
    title:  "Modelling Process",
    visual: "/images/project-phoneholder-pro.png",
    content: [
      { type: "heading", text: "Tool of Choice: Tinkercad" },
      { type: "para",    text: "Tinkercad was chosen for its shape-combination workflow, which is ideal for organic silhouettes built from geometric primitives. By layering and subtracting basic shapes, the cat body, ears, and tail were sculpted iteratively." },
      { type: "heading", text: "Key Modelling Decisions" },
      { type: "bullets", items: [
        "Body cavity angle set at 75° — the sweet spot between upright and reclined viewing",
        "Ear geometry kept simple: two slightly angled triangular prisms for clean printing",
        "Tail curves outward as a rear stabiliser, preventing the model from tipping back",
        "Base footprint sized generously for stability on smooth surfaces",
      ]},
      { type: "heading", text: "Iterations" },
      { type: "para",    text: "Three rounds of refinement addressed wall thickness, cradle width for larger phones, and tail attachment strength before the final model was locked." },
    ],
  },
  {
    number: 4,
    title:  "Outcome",
    visual: "/images/Cat_feature.png",
    content: [
      { type: "heading", text: "Final Model" },
      { type: "para",    text: "The finished design is a clean, printable STL — tested at 0.2 mm layer height with 20% infill, giving the piece enough weight to sit firmly while keeping material use minimal." },
      { type: "heading", text: "What This Project Demonstrated" },
      { type: "bullets", items: [
        "3D modelling is a powerful design tool even without complex CAD software",
        "Constraint-driven design — printability requirements shaped every aesthetic choice",
        "Physical iteration matters: digital reviews alone missed the stability issues the tail solves",
      ]},
      { type: "highlight", text: "A reminder that the best functional objects do not just solve problems — they make people smile every time they pick up their phone." },
    ],
  },
]

const STEP_BOX_H     = 472
const STEP_CONTENT_H = 420

/* ════════════════════════════════════════════════════════════════════════════
   THREE.JS VIEWER
════════════════════════════════════════════════════════════════════════════ */
function CatViewer3D() {
  const mountRef = useRef(null)
  const [status, setStatus] = useState("loading")
  const [hint,   setHint]   = useState(true)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, el.clientWidth / el.clientHeight, 0.01, 2000)
    camera.position.set(0, 0, 8)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(el.clientWidth, el.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled   = true
    renderer.shadowMap.type      = THREE.PCFSoftShadowMap
    renderer.outputColorSpace    = THREE.SRGBColorSpace
    renderer.toneMapping         = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4
    el.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const key = new THREE.DirectionalLight(0xffffff, 2.2)
    key.position.set(4, 8, 6); key.castShadow = true; key.shadow.mapSize.set(2048, 2048)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xdbc7ac, 1.0)
    rim.position.set(-5, 4, -4); scene.add(rim)
    const fill = new THREE.DirectionalLight(0xe8d9c2, 0.6)
    fill.position.set(3, -3, 5); scene.add(fill)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true; controls.dampingFactor = 0.06
    controls.enableZoom = true; controls.zoomSpeed = 0.8; controls.enablePan = false
    controls.minDistance = 0.5; controls.maxDistance = 40
    controls.autoRotate = true; controls.autoRotateSpeed = 1.2
    controls.target.set(0, 0, 0)

    let resumeTimer = null
    const pauseRotate    = () => { controls.autoRotate = false; clearTimeout(resumeTimer) }
    const scheduleResume = () => { resumeTimer = setTimeout(() => { controls.autoRotate = true }, 3000) }
    controls.addEventListener("start", pauseRotate)
    controls.addEventListener("end",   scheduleResume)

    const loader = new GLTFLoader()
    loader.load(
      GLB_PATH,
      (gltf) => {
        const model = gltf.scene
        const box    = new THREE.Box3().setFromObject(model)
        const centre = box.getCenter(new THREE.Vector3())
        const size   = box.getSize(new THREE.Vector3())
        const scale  = 3.5 / Math.max(size.x, size.y, size.z)
        model.scale.setScalar(scale)
        model.position.set(-centre.x * scale, -centre.y * scale, -centre.z * scale)
        model.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true; child.receiveShadow = true
            const mats = Array.isArray(child.material) ? child.material : [child.material]
            mats.forEach(m => { if (m.isMeshStandardMaterial || m.isMeshPhysicalMaterial) { m.envMapIntensity = 1.2; m.needsUpdate = true } })
          }
        })
        scene.add(model)
        const vFovRad = camera.fov * (Math.PI / 180)
        const hFovRad = 2 * Math.atan(Math.tan(vFovRad / 2) * camera.aspect)
        const dist = Math.max((size.y * scale / 2) / Math.tan(vFovRad / 2), (size.x * scale / 2) / Math.tan(hFovRad / 2)) * 1.65 + size.z * scale / 2
        camera.position.set(0, 0, dist)
        controls.minDistance = dist * 0.3; controls.maxDistance = dist * 4; controls.update()
        setStatus("ready")
        setTimeout(() => setHint(false), 4000)
      },
      () => {},
      (err) => { console.error("[CatViewer3D]", err); setStatus("error") }
    )

    const onResize = () => {
      if (!el) return
      camera.aspect = el.clientWidth / el.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(el.clientWidth, el.clientHeight)
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(el)

    let animId
    const animate = () => { animId = requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera) }
    animate()

    return () => {
      cancelAnimationFrame(animId); clearTimeout(resumeTimer)
      controls.removeEventListener("start", pauseRotate)
      controls.removeEventListener("end",   scheduleResume)
      controls.dispose(); renderer.dispose()
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
      ro.disconnect()
    }
  }, [])

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%", display: "block" }} />

      {status === "loading" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", pointerEvents: "none" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "3px solid rgba(219,199,172,0.15)", borderTop: "3px solid rgba(219,199,172,1)", animation: "chSpin 0.9s linear infinite" }} />
          <span style={{ color: "rgba(219,199,172,0.70)", fontSize: "0.82rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>Loading 3D model…</span>
        </div>
      )}

      {status === "error" && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px", pointerEvents: "none" }}>
          <span style={{ fontSize: "4rem" }}>🐱</span>
          <span style={{ color: "rgba(255,100,100,0.7)", fontSize: "0.85rem", textAlign: "center", padding: "0 32px" }}>
            Could not load 3D model — rename your GLB file to <strong>Cat_Holder.glb</strong> and place it in <strong>public/images/</strong>
          </span>
        </div>
      )}

      {status === "ready" && hint && (
        <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: "10px", padding: "7px 18px", borderRadius: "999px", background: "rgba(0,0,0,0.40)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(219,199,172,0.20)", pointerEvents: "none", animation: "chFadeOut 1s ease 3.2s both" }}>
          <span style={{ color: "rgba(255,255,255,0.60)", fontSize: "0.72rem", letterSpacing: "0.07em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Drag to rotate · Scroll to zoom</span>
        </div>
      )}

      {status === "ready" && !hint && (
        <div style={{ position: "absolute", bottom: "28px", left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.22)", fontSize: "0.68rem", letterSpacing: "0.07em", textTransform: "uppercase", pointerEvents: "none", whiteSpace: "nowrap" }}>
          Drag · Scroll to zoom
        </div>
      )}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   RICH-TEXT STEP CONTENT RENDERER
════════════════════════════════════════════════════════════════════════════ */
function StepContent({ blocks }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {blocks.map((block, i) => {
        if (block.type === "para") return (
          <p key={i} style={{ margin: 0, color: "rgba(255,255,255,0.80)", fontSize: "clamp(0.87rem,1.15vw,0.97rem)", lineHeight: 1.75 }}>{block.text}</p>
        )
        if (block.type === "heading") return (
          <p key={i} style={{ margin: 0, color: ACCENT, fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", marginTop: "4px" }}>{block.text}</p>
        )
        if (block.type === "bullets") return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {block.items.map((item, j) => (
              <div key={j} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ color: ACCENT, fontSize: "0.75rem", marginTop: "4px", flexShrink: 0 }}>◆</span>
                <span style={{ color: "rgba(255,255,255,0.78)", fontSize: "clamp(0.85rem,1.1vw,0.93rem)", lineHeight: 1.65 }}>{item}</span>
              </div>
            ))}
          </div>
        )
        if (block.type === "highlight") return (
          <div key={i} style={{ marginTop: "8px", padding: "14px 18px", borderRadius: "12px", background: "rgba(219,199,172,0.12)", border: "1px solid rgba(219,199,172,0.38)", borderLeft: "4px solid rgba(219,199,172,1)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ color: ACCENT, fontSize: "1rem", flexShrink: 0, marginTop: "1px" }}>✦</span>
              <span style={{ color: "#fff", fontSize: "clamp(0.87rem,1.15vw,0.95rem)", fontWeight: 600, lineHeight: 1.65 }}>{block.text}</span>
            </div>
          </div>
        )
        return null
      })}
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   STEP VISUAL
════════════════════════════════════════════════════════════════════════════ */
function StepVisual({ step, openLightbox }) {
  const [visible, setVisible] = useState(true)
  const prevStep = useRef(step)

  useEffect(() => {
    if (prevStep.current?.number !== step?.number) {
      setVisible(false)
      const t = setTimeout(() => { prevStep.current = step; setVisible(true) }, 180)
      return () => clearTimeout(t)
    }
  }, [step])

  const s      = prevStep.current
  const imgSrc = s?.visual ?? null

  return (
    <div style={{ position: "sticky", top: "120px", borderRadius: "24px", background: "rgba(255,255,255,0.08)", backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)", border: "1px solid rgba(255,255,255,0.14)", boxShadow: "0 24px 64px rgba(0,0,0,0.35)", overflow: "hidden", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition: "opacity 0.3s ease, transform 0.3s ease", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: `${STEP_BOX_H}px`, minHeight: `${STEP_BOX_H}px` }}>
      <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "40px" }}>
        {imgSrc && (
          <img src={imgSrc} alt={`Step ${s?.number}`}
            onClick={() => openLightbox && openLightbox({ type: "image", src: imgSrc })}
            style={{ maxWidth: "100%", maxHeight: `${STEP_BOX_H - 80}px`, width: "auto", height: "auto", objectFit: "contain", display: "block", filter: "drop-shadow(0 8px 28px rgba(0,0,0,0.40))", transition: "opacity 0.25s ease, transform 0.25s ease", cursor: "zoom-in" }}
          />
        )}
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   STEPPER SUB-COMPONENTS
════════════════════════════════════════════════════════════════════════════ */
function CollapsedStepRow({ step, isLast, onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "48px", flexShrink: 0 }}>
        <div style={{ width: "38px", height: "38px", borderRadius: "50%", border: `2px solid ${hov ? ACCENT_MID : "rgba(255,255,255,0.22)"}`, background: hov ? ACCENT_DIM : "rgba(255,255,255,0.06)", color: hov ? ACCENT : "rgba(255,255,255,0.50)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.80rem", fontWeight: 700, flexShrink: 0, transition: "all 0.28s ease" }}>
          {step.number}
        </div>
        {!isLast && <div style={{ width: "2px", height: "10px", marginTop: "4px", background: "rgba(255,255,255,0.10)" }} />}
      </div>
      <div style={{ flex: 1, marginLeft: "16px", display: "flex", alignItems: "center" }}>
        <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
          style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", padding: "14px 18px", borderRadius: "14px", background: hov ? ACCENT_DIM : "rgba(255,255,255,0.05)", border: `1px solid ${hov ? "rgba(219,199,172,0.28)" : "rgba(255,255,255,0.10)"}`, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", cursor: "pointer", textAlign: "left", transition: "background 0.28s ease, border-color 0.28s ease" }}>
          <span style={{ color: hov ? "#fff" : "rgba(255,255,255,0.85)", fontSize: "clamp(0.93rem,1.3vw,1.05rem)", fontWeight: 500, letterSpacing: "0.01em", transition: "color 0.28s ease" }}>{step.title}</span>
          <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: hov ? ACCENT_DIM : "rgba(255,255,255,0.07)", border: `1px solid ${hov ? "rgba(219,199,172,0.30)" : "rgba(255,255,255,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.28s ease" }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M4 2l3 3-3 3" stroke={hov ? ACCENT : "rgba(255,255,255,0.55)"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </button>
      </div>
    </div>
  )
}

function OpenStepBox({ step }) {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "48px", flexShrink: 0 }}>
        <div style={{ width: "38px", height: "38px", borderRadius: "50%", border: `2px solid ${ACCENT}`, background: ACCENT_DIM, color: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.80rem", fontWeight: 700 }}>{step.number}</div>
        <div style={{ flex: 1, width: "2px", minHeight: "16px", marginTop: "4px", background: `linear-gradient(to bottom, ${ACCENT}, rgba(219,199,172,0.10))` }} />
      </div>
      <div style={{ flex: 1, marginLeft: "16px", borderRadius: "14px", background: ACCENT_DIM, border: `1px solid ${ACCENT_MID}`, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(219,199,172,0.22)" }}>
          <span style={{ color: "#fff", fontSize: "clamp(0.93rem,1.3vw,1.05rem)", fontWeight: 700 }}>{step.title}</span>
        </div>
        <div style={{ height: `${STEP_CONTENT_H}px`, overflowY: "auto", padding: "16px 20px 20px", scrollbarWidth: "thin", scrollbarColor: "rgba(219,199,172,0.4) rgba(255,255,255,0.05)" }}>
          <StepContent blocks={step.content} />
        </div>
      </div>
    </div>
  )
}

function CloseArrow({ onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div style={{ display: "flex", marginTop: "12px" }}>
      <div style={{ width: "48px", display: "flex", justifyContent: "center" }}>
        <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
          style={{ width: "38px", height: "38px", borderRadius: "50%", border: `2px solid ${hov ? ACCENT : ACCENT_MID}`, background: hov ? "rgba(219,199,172,0.25)" : ACCENT_DIM, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.25s ease" }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 8.5l5-5 5 5" stroke={ACCENT} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   CASE STUDY STEPPER
════════════════════════════════════════════════════════════════════════════ */
function CaseStudyStepper({ openLightbox }) {
  const [openIndex, setOpenIndex] = useState(null)
  const [hdVisible, setHdVisible] = useState(false)
  const headingRef = useRef(null)

  useEffect(() => {
    const el = headingRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setHdVisible(true); obs.disconnect() } }, { threshold: 0.2 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const hdAnim = (delay) => ({ opacity: hdVisible ? 1 : 0, transform: hdVisible ? "translateX(0)" : "translateX(-48px)", transition: `opacity 0.65s ease ${delay}, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}` })

  return (
    <div style={{ width: "100%", boxSizing: "border-box", paddingTop: "80px", paddingBottom: "80px", paddingLeft: "clamp(32px, 5vw, 72px)", paddingRight: "clamp(32px, 5vw, 72px)" }}>
      <div ref={headingRef} style={{ marginBottom: "52px" }}>
        <div style={{ display: "inline-block", padding: "5px 18px", borderRadius: "999px", background: ACCENT_DIM, border: `1px solid ${ACCENT_MID}`, color: ACCENT, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: "14px", ...hdAnim("0s") }}>Case Study</div>
        <h2 style={{ margin: 0, color: "#fff", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.1, ...hdAnim("0.15s") }}>Design Process</h2>
        <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.45)", fontSize: "clamp(0.88rem,1.2vw,0.98rem)", ...hdAnim("0.28s") }}>Click any step to explore the full story.</p>
      </div>

      <div style={{ display: "flex", gap: "clamp(20px,3vw,48px)", alignItems: "flex-start" }}>
        <div style={{ flex: "0 0 48%", maxWidth: "48%", opacity: hdVisible ? 1 : 0, transform: hdVisible ? "translateX(0)" : "translateX(-48px)", transition: "opacity 0.65s ease 0.38s, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) 0.38s" }}>
          {openIndex === null ? (
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px", height: `${STEP_BOX_H}px` }}>
              {STEPS.map((step, i) => <CollapsedStepRow key={step.number} step={step} isLast={i === STEPS.length - 1} onClick={() => setOpenIndex(i)} />)}
            </div>
          ) : (
            <><OpenStepBox step={STEPS[openIndex]} /><CloseArrow onClick={() => setOpenIndex(null)} /></>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0, opacity: hdVisible ? 1 : 0, transform: hdVisible ? "translateX(0)" : "translateX(48px)", transition: "opacity 0.65s ease 0.48s, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) 0.48s" }}>
          <StepVisual step={openIndex !== null ? STEPS[openIndex] : STEPS[0]} openLightbox={openLightbox} />
        </div>
      </div>
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   LIGHTBOX
════════════════════════════════════════════════════════════════════════════ */
function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return
    const onKey = (e) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = "" }
  }, [item, onClose])

  if (!item) return null
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.88)", backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)", animation: "fadeIn 0.25s ease", cursor: "zoom-out" }}>
      <button onClick={onClose} style={{ position: "absolute", top: "clamp(16px,3vh,28px)", right: "clamp(16px,3vw,28px)", width: "44px", height: "44px", borderRadius: "50%", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)", color: "#fff", fontSize: "20px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.24)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
      >✕</button>
      <img src={item.src} alt="" onClick={e => e.stopPropagation()} style={{ maxWidth: "90vw", maxHeight: "85vh", borderRadius: "16px", objectFit: "contain", boxShadow: "0 30px 80px rgba(0,0,0,0.65)", cursor: "default", animation: "lightboxPop 0.3s cubic-bezier(0.34,1.56,0.64,1)" }} />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   TOOL ICON
════════════════════════════════════════════════════════════════════════════ */
function ToolIcon({ name, icon, animDelay = "0s" }) {
  return (
    <div title={name} style={{ animation: `chPopIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${animDelay} both`, width: "54px", height: "54px", borderRadius: "14px", background: "rgba(255,255,255,0.10)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s ease, border-color 0.2s ease" }}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.18)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)" }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.10)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)" }}
    >
      <img src={icon} alt={name} style={{ width: 32, height: 32, objectFit: "contain" }} />
    </div>
  )
}

/* ════════════════════════════════════════════════════════════════════════════
   MAIN PAGE
════════════════════════════════════════════════════════════════════════════ */
export function CatHolderPage() {
  const { navigate }                    = useRouter()
  const [lightboxItem, setLightboxItem] = useState(null)
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
        @keyframes chSlideLeft {
          from { opacity: 0; transform: translateX(-52px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes chPopIn {
          from { opacity: 0; transform: scale(0.45); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes chSpin { to { transform: rotate(360deg); } }
        @keyframes chFadeOut { to { opacity: 0; } }
      `}</style>

      <SideBlobs />

      <main style={{ minHeight: "100vh", overflowX: "clip" }}>

        {/* ══ HERO ════════════════════════════════════════════════════════ */}
        <section style={{ display: "flex", width: "100vw", height: "100vh", position: "relative" }}>

          {/* LEFT PANEL */}
          <div style={{ width: "32vw", minWidth: "300px", flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 clamp(36px,5vw,72px)", position: "relative", zIndex: 2 }}>

            <button ref={backBtnRef} onClick={() => navigate("projects")}
              style={{ position: "fixed", top: "clamp(72px,9vh,96px)", zIndex: 50, display: "flex", alignItems: "center", gap: "7px", padding: "11px 26px", borderRadius: "999px", background: "rgba(255,255,255,0.10)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)", border: "1px solid rgba(255,255,255,0.22)", color: "rgba(255,255,255,0.88)", fontSize: "0.85rem", fontWeight: 500, cursor: "pointer", letterSpacing: "0.04em", transition: "background 0.2s ease" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.10)"}
            >← Back</button>

            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

              <div style={{ animation: "chSlideLeft 0.70s cubic-bezier(0.25,0.46,0.45,0.94) 0.10s both", alignSelf: "flex-start" }}>
                <div style={{ width: "clamp(64px,8vw,96px)", height: "clamp(64px,8vw,96px)", borderRadius: "22px", background: ACCENT_DIM, border: `1px solid ${ACCENT_MID}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(28px,4vw,44px)", filter: "drop-shadow(0 4px 18px rgba(219,199,172,0.40))" }}>
                  🐱
                </div>
              </div>

              <h1 style={{ margin: 0, color: "#fff", fontSize: "clamp(1.8rem,3.2vw,2.9rem)", fontWeight: 700, lineHeight: 1.05, animation: "chSlideLeft 0.70s cubic-bezier(0.25,0.46,0.45,0.94) 0.25s both" }}>
                Cat Phone<br/>Holder
              </h1>

              <div style={{ display: "inline-flex", alignSelf: "flex-start", padding: "5px 16px", borderRadius: "999px", background: ACCENT_DIM, border: "1px solid rgba(219,199,172,0.40)", color: ACCENT, fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.09em", textTransform: "uppercase", animation: "chSlideLeft 0.70s cubic-bezier(0.25,0.46,0.45,0.94) 0.40s both" }}>
                3D Design
              </div>

              <div style={{ width: "44px", height: "2px", background: "rgba(255,255,255,0.22)", borderRadius: "2px", animation: "chSlideLeft 0.55s ease 0.52s both" }} />

              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {TOOLS.map((t, i) => <ToolIcon key={t.name} {...t} animDelay={`${0.58 + i * 0.10}s`} />)}
              </div>

              <div style={{ animation: "chSlideLeft 0.60s cubic-bezier(0.25,0.46,0.45,0.94) 0.82s both", display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: "8px", padding: "8px 16px", borderRadius: "12px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.55)", fontSize: "0.78rem", letterSpacing: "0.04em" }}>
                <span style={{ color: ACCENT, fontWeight: 700 }}>✦</span>
                Interactive 3D model — drag to explore
              </div>

            </div>
          </div>

          {/* RIGHT PANEL — 3D viewer */}
          <div style={{ flex: 1, position: "relative", height: "100%" }}>
            <CatViewer3D />
          </div>

        </section>

        {/* ══ DESIGN PROCESS ══════════════════════════════════════════════ */}
        <CaseStudyStepper openLightbox={(item) => setLightboxItem(item)} />

      </main>

      <Footer />

      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  )
}
