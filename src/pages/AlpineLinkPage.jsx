/**
 * AlpineLink — Project Case Study Page
 * Same structure as RedditPage: hero (left info + right phone stack) + 6-step stepper
 * Accent colour: sky blue  rgba(56,189,248,1)
 */
import { useState, useRef, useEffect } from "react"
import { useRouter } from "../lib/router-context"
import { SideBlobs } from "../components/side-blobs"
import { Footer }    from "../components/footer"

const BLUE   = "rgba(56,189,248,1)"    /* sky blue — primary accent */
const BLUE12 = "rgba(56,189,248,0.12)"
const BLUE30 = "rgba(56,189,248,0.30)"

const TOOLS = [
  { name: "Figma",        icon: "/images/toolkit-figma.png"        },
  { name: "After Effects",icon: "/images/toolkit-aftereffects.png" },
]

/* ─── Tool icon (square, icon-only, pop-in animation) ────────────────────────── */
function ToolIcon({ name, icon, animDelay = "0s" }) {
  return (
    <div
      title={name}
      style={{
        animation:            `alPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${animDelay} both`,
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

/* ─── Stepper data (placeholder — content to be filled) ──────────────────────── */
const STEPS = [
  {
    number: 1,
    title:  "Project Overview",
    visual: "/images/AlpineLinkSplash.png",
    content: [
      { type: "para",    text: "AlpineLink is an all-season outdoor adventure app designed for hiking, skiing, biking, and snowboarding enthusiasts. The goal was to create a unified platform where users can discover trails, track weather conditions, log activities, and connect with fellow adventurers." },
      { type: "para",    text: "The project involved end-to-end UX research, user flows, UI design, and interactive prototyping — crafting an experience that feels as natural and refreshing as the outdoors itself." },
      { type: "meta",    items: [
        "Project Type: Mobile App Design",
        "Role: UX Researcher & UI Designer",
        "Tools: Figma, After Effects",
        "Platform: Mobile App (iOS & Android)",
      ]},
      { type: "heading", text: "Design goals:" },
      { type: "bullets", items: [
        "Clarity — surface the right trail or weather data with minimal friction",
        "Safety — keep critical conditions front and center",
        "Community — help adventurers share routes and experiences",
      ]},
    ],
  },
  {
    number: 2,
    title:  "User Research",
    visual: "/images/AlpineLinkHome.png",
    content: [
      { type: "para",    text: "Research was conducted through user interviews and competitive analysis of existing outdoor apps. Key pain points across existing solutions were identified to guide the redesign." },
      { type: "heading", text: "Key Pain Points" },
      { type: "bullets", items: [
        "Fragmented Experience — users juggle multiple apps for maps, weather, and community",
        "Overwhelming Data — too many stats with no clear hierarchy",
        "Offline Limitations — most apps require constant connectivity on the trail",
        "Weak Personalization — no adaptive content based on activity type or skill level",
      ]},
      { type: "heading", text: "User Persona — Alex Torres" },
      { type: "meta",    items: [
        "Age: 29 · Location: Whistler, BC",
        "Occupation: Software Developer & Weekend Adventurer",
        "Alex spends weekends hiking and skiing and needs a single app for planning and safety.",
      ]},
      { type: "heading", text: "Goals" },
      { type: "bullets", items: [
        "Plan safe routes based on real-time weather",
        "Log and share activities with friends",
        "Discover new trails nearby",
        "Access key data offline",
      ]},
    ],
  },
  {
    number: 3,
    title:  "User Interface",
    visual: "/images/AlpineLinkHome.png",
    content: [
      { type: "para",    text: "The UI was built around four core screens: Home, Map, Weather, and Profile. Each screen was designed to surface the most relevant information for an active outdoor session." },
      { type: "heading", text: "Home Screen" },
      { type: "meta",    items: ["A personalized dashboard showing today's conditions, recent activity, and nearby trail highlights."] },
      { type: "heading", text: "Map Screen" },
      { type: "meta",    items: ["Interactive trail map with elevation profiles, difficulty ratings, and real-time condition overlays."] },
      { type: "heading", text: "Weather Screen" },
      { type: "meta",    items: ["Hour-by-hour forecasts with alpine-specific metrics: snowpack, wind chill, and avalanche risk."] },
      { type: "heading", text: "Profile Screen" },
      { type: "meta",    items: ["Activity log, personal bests, badges earned, and followed trails — all in one glanceable view."] },
    ],
  },
  {
    number: 4,
    title:  "Brand Identity",
    visual: "/images/AlpineLinkSplash.png",
    content: [
      { type: "para",    text: "The brand identity draws inspiration from crisp alpine skies and mountain landscapes, balancing energy with clarity." },
      { type: "heading", text: "Color Palette" },
      { type: "para",    text: "Sky blue anchors the primary palette, conveying openness and trust. Dark neutrals ground the UI while allowing vivid data overlays to stand out." },
      { type: "heading", text: "Typography & Icons" },
      { type: "bullets", items: [
        "Clean sans-serif type for legibility at a glance",
        "Rounded icons that feel approachable and outdoorsy",
        "High contrast for visibility in bright sunlight",
      ]},
      { type: "heading", text: "Design Principles" },
      { type: "bullets", items: ["Bold", "Clear", "Trustworthy", "Adventure-ready"] },
    ],
  },
  {
    number: 5,
    title:  "User Experience",
    visual: "/images/AlpineLinkMap.png",
    content: [
      { type: "para",    text: "The UX focuses on reducing cognitive load during high-intensity outdoor activities where glancing at a phone needs to be fast and safe." },
      { type: "heading", text: "User Journey" },
      { type: "bullets", items: [
        "Plan — User checks weather and maps the night before",
        "Launch — Splash screen loads instantly with cached data",
        "Navigate — Map view with offline tiles guides the route",
        "Monitor — Weather widget updates conditions in real time",
        "Log — Activity is auto-saved and shared to profile",
      ]},
      { type: "heading", text: "UX Improvements" },
      { type: "bullets", items: [
        "One-thumb navigation for glove-friendly use",
        "Offline-first architecture for connectivity-dead zones",
        "Adaptive data density based on activity speed",
        "Emergency SOS shortcut always accessible",
      ]},
    ],
  },
  {
    number: 6,
    title:  "Outcome",
    visual: "/images/AlpineLinkHome.png",
    content: [
      { type: "para",    text: "AlpineLink successfully consolidates trail, weather, and community features into a single cohesive experience designed for the outdoors." },
      { type: "heading", text: "Key Achievements" },
      { type: "bullets", items: [
        "Unified Platform — replaced 3+ separate apps with one seamless experience",
        "Safety-First Design — critical weather data always one tap away",
        "Community Layer — trail sharing increased simulated engagement by 40%",
        "Offline-Ready — full map and recent activity accessible without signal",
      ]},
    ],
  },
]

/* ─── Rich text renderer ──────────────────────────────────────────────────────── */
function StepContent({ blocks }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {blocks.map((block, i) => {
        if (block.type === "para") return (
          <p key={i} style={{ margin: 0, color: "rgba(255,255,255,0.80)", fontSize: "clamp(0.87rem,1.15vw,0.97rem)", lineHeight: 1.75 }}>
            {block.text}
          </p>
        )
        if (block.type === "heading") return (
          <p key={i} style={{ margin: 0, color: "rgba(56,189,248,0.95)", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", marginTop: "4px" }}>
            {block.text}
          </p>
        )
        if (block.type === "meta") return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {block.items.map((item, j) => (
              <p key={j} style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: "0.82rem", lineHeight: 1.55 }}>{item}</p>
            ))}
          </div>
        )
        if (block.type === "bullets") return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {block.items.map((item, j) => (
              <div key={j} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ color: "rgba(56,189,248,0.9)", fontSize: "0.75rem", marginTop: "4px", flexShrink: 0 }}>◆</span>
                <span style={{ color: "rgba(255,255,255,0.78)", fontSize: "clamp(0.85rem,1.1vw,0.93rem)", lineHeight: 1.65 }}>{item}</span>
              </div>
            ))}
          </div>
        )
        return null
      })}
    </div>
  )
}

/* Fixed heights shared by step box and visual panel */
const STEP_CONTENT_H = 420
const STEP_BOX_H     = 472

/* ─── Right-panel visual: shows the step's hero image in a glass card ─────────── */
function StepVisual({ step }) {
  const [visible, setVisible] = useState(true)
  const prevStep              = useRef(step)

  useEffect(() => {
    if (prevStep.current?.number !== step?.number) {
      setVisible(false)
      const t = setTimeout(() => { prevStep.current = step; setVisible(true) }, 180)
      return () => clearTimeout(t)
    }
  }, [step])

  const s = prevStep.current

  return (
    <div style={{
      position:             "sticky",
      top:                  "120px",
      borderRadius:         "24px",
      background:           "rgba(255,255,255,0.08)",
      backdropFilter:       "blur(22px)",
      WebkitBackdropFilter: "blur(22px)",
      border:               "1px solid rgba(255,255,255,0.14)",
      boxShadow:            "0 24px 64px rgba(0,0,0,0.35)",
      overflow:             "hidden",
      opacity:              visible ? 1 : 0,
      transform:            visible ? "translateY(0)" : "translateY(10px)",
      transition:           "opacity 0.3s ease, transform 0.3s ease",
      display:              "flex",
      alignItems:           "center",
      justifyContent:       "center",
      height:               `${STEP_BOX_H}px`,
      minHeight:            `${STEP_BOX_H}px`,
    }}>
      <img
        src={s?.visual}
        alt={`Step ${s?.number}`}
        style={{
          width:      "100%",
          height:     "100%",
          objectFit:  "contain",
          display:    "block",
          padding:    "32px",
          filter:     "drop-shadow(0 12px 40px rgba(0,0,0,0.45))",
        }}
      />
    </div>
  )
}

/* ─── Collapsed step row ──────────────────────────────────────────────────────── */
function CollapsedStepRow({ step, isLast, onClick, grow }) {
  const [hov, setHov] = useState(false)

  return (
    <div style={{ display: "flex", flex: grow ? 1 : undefined, marginBottom: grow ? 0 : (isLast ? 0 : "10px") }}>
      {/* Circle + connector */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "48px", flexShrink: 0 }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%",
          border:     `2px solid ${hov ? "rgba(56,189,248,0.55)" : "rgba(255,255,255,0.22)"}`,
          background: hov ? "rgba(56,189,248,0.12)" : "rgba(255,255,255,0.06)",
          color:      hov ? BLUE : "rgba(255,255,255,0.50)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.80rem", fontWeight: 700, flexShrink: 0,
          transition: "all 0.28s ease",
        }}>
          {step.number}
        </div>
        {!isLast && (
          <div style={{ flex: 1, width: "2px", minHeight: "10px", marginTop: "4px", background: "rgba(255,255,255,0.10)" }} />
        )}
      </div>

      {/* Title button */}
      <div style={{ flex: 1, marginLeft: "16px", display: "flex", alignItems: "center" }}>
        <button
          onClick={onClick}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            width: "100%", display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: "12px",
            padding: "14px 18px", borderRadius: "14px",
            background:     hov ? "rgba(56,189,248,0.08)" : "rgba(255,255,255,0.05)",
            border:         `1px solid ${hov ? "rgba(56,189,248,0.28)" : "rgba(255,255,255,0.10)"}`,
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            cursor: "pointer", textAlign: "left",
            transition: "background 0.28s ease, border-color 0.28s ease",
          }}
        >
          <span style={{
            color:      hov ? "#fff" : "rgba(255,255,255,0.85)",
            fontSize:   "clamp(0.93rem,1.3vw,1.05rem)",
            fontWeight: 500, letterSpacing: "0.01em",
            transition: "color 0.28s ease",
          }}>
            {step.title}
          </span>
          <div style={{
            width: "26px", height: "26px", borderRadius: "50%",
            background: hov ? "rgba(56,189,248,0.15)" : "rgba(255,255,255,0.07)",
            border:     `1px solid ${hov ? "rgba(56,189,248,0.30)" : "rgba(255,255,255,0.12)"}`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            transition: "all 0.28s ease",
          }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M4 2l3 3-3 3" stroke={hov ? "rgba(56,189,248,0.9)" : "rgba(255,255,255,0.55)"}
                strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
      </div>
    </div>
  )
}

/* ─── Open step box ───────────────────────────────────────────────────────────── */
function OpenStepBox({ step }) {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "48px", flexShrink: 0 }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%",
          border: `2px solid ${BLUE}`,
          background: "rgba(56,189,248,0.18)", color: BLUE,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.80rem", fontWeight: 700, flexShrink: 0,
        }}>
          {step.number}
        </div>
        <div style={{
          flex: 1, width: "2px", minHeight: "16px", marginTop: "4px",
          background: `linear-gradient(to bottom, ${BLUE}, rgba(56,189,248,0.10))`,
        }} />
      </div>

      <div style={{
        flex: 1, marginLeft: "16px", borderRadius: "14px",
        background:           "rgba(56,189,248,0.10)",
        border:               "1px solid rgba(56,189,248,0.32)",
        backdropFilter:       "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        overflow:             "hidden",
      }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(56,189,248,0.18)" }}>
          <span style={{ color: "#fff", fontSize: "clamp(0.93rem,1.3vw,1.05rem)", fontWeight: 700, letterSpacing: "0.01em" }}>
            {step.title}
          </span>
        </div>
        <div style={{
          height: `${STEP_CONTENT_H}px`, overflowY: "auto",
          padding: "16px 20px 20px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(56,189,248,0.4) rgba(255,255,255,0.05)",
        }}>
          <StepContent blocks={step.content} />
        </div>
      </div>
    </div>
  )
}

/* ─── Close arrow ─────────────────────────────────────────────────────────────── */
function CloseArrow({ onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div style={{ display: "flex", marginTop: "12px" }}>
      <div style={{ width: "48px", display: "flex", justifyContent: "center", flexShrink: 0 }}>
        <button
          onClick={onClick}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          title="Back to all steps"
          style={{
            width: "38px", height: "38px", borderRadius: "50%",
            border:     `2px solid ${hov ? BLUE : "rgba(56,189,248,0.55)"}`,
            background: hov ? "rgba(56,189,248,0.25)" : "rgba(56,189,248,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.25s ease",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2.5 8.5l5-5 5 5" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

/* ─── Full stepper wrapper ────────────────────────────────────────────────────── */
function CaseStudyStepper() {
  const [openIndex, setOpenIndex] = useState(null)
  const [hdVisible, setHdVisible] = useState(false)
  const headingRef = useRef(null)
  const openStep   = (i) => setOpenIndex(i)
  const closeStep  = ()  => setOpenIndex(null)

  useEffect(() => {
    const el = headingRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHdVisible(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const hdAnim = (delay) => ({
    opacity:    hdVisible ? 1 : 0,
    transform:  hdVisible ? "translateX(0)" : "translateX(-48px)",
    transition: `opacity 0.65s ease ${delay}, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}`,
  })

  return (
    <div style={{
      width:         "100%",
      boxSizing:     "border-box",
      paddingTop:    "80px",
      paddingBottom: "120px",
      paddingLeft:   "clamp(32px, 5vw, 72px)",
      paddingRight:  "clamp(32px, 5vw, 72px)",
    }}>
      {/* Section heading */}
      <div ref={headingRef} style={{ marginBottom: "52px", textAlign: "left" }}>
        <div style={{
          display: "inline-block", padding: "5px 18px", borderRadius: "999px",
          background: BLUE12, border: `1px solid ${BLUE30}`,
          color: BLUE, fontSize: "0.72rem", fontWeight: 600,
          letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: "14px",
          ...hdAnim("0s"),
        }}>
          Case Study
        </div>
        <h2 style={{ margin: 0, color: "#fff", fontSize: "clamp(1.6rem,3vw,2.4rem)", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.1, ...hdAnim("0.15s") }}>
          Design Process
        </h2>
        <p style={{ margin: "12px 0 0", color: "rgba(255,255,255,0.45)", fontSize: "clamp(0.88rem,1.2vw,0.98rem)", ...hdAnim("0.28s") }}>
          Click any step to explore the full story.
        </p>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "flex", gap: "clamp(20px,3vw,48px)", alignItems: "flex-start" }}>

        {/* LEFT — steps list */}
        <div style={{
          flex: "0 0 48%", maxWidth: "48%",
          opacity:    hdVisible ? 1 : 0,
          transform:  hdVisible ? "translateX(0)" : "translateX(-48px)",
          transition: "opacity 0.65s ease 0.38s, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) 0.38s",
        }}>
          {openIndex === null ? (
            <div style={{ display: "flex", flexDirection: "column", height: `${STEP_BOX_H}px` }}>
              {STEPS.map((step, i) => (
                <CollapsedStepRow
                  key={step.number}
                  step={step}
                  isLast={i === STEPS.length - 1}
                  onClick={() => openStep(i)}
                  grow
                />
              ))}
            </div>
          ) : (
            <>
              <OpenStepBox step={STEPS[openIndex]} />
              <CloseArrow onClick={closeStep} />
            </>
          )}
        </div>

        {/* RIGHT — glass visual */}
        <div style={{
          flex: 1, minWidth: 0,
          opacity:    hdVisible ? 1 : 0,
          transform:  hdVisible ? "translateX(0)" : "translateX(48px)",
          transition: "opacity 0.65s ease 0.48s, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) 0.48s",
        }}>
          <StepVisual step={openIndex !== null ? STEPS[openIndex] : STEPS[0]} />
        </div>

      </div>
    </div>
  )
}

/* ─── Interactive hero phone stack ───────────────────────────────────────────── */
function HeroPhoneStack() {
  const [centerIdx, setCenterIdx] = useState(0)
  const [dragging,  setDragging]  = useState(false)
  const [dragDelta, setDragDelta] = useState(0)

  const startX  = useRef(null)
  const didDrag = useRef(false)
  const idxRef  = useRef(0)
  const DRAG_THRESHOLD = 50

  const PHONES = [
    { src: "/images/AlpineLinkSplash.png",  label: "Splash"  },
    { src: "/images/AlpineLinkHome.png",    label: "Home"    },
    { src: "/images/AlpineLinkWeather.png", label: "Weather" },
    { src: "/images/AlpineLinkProfile.png", label: "Profile" },
    { src: "/images/AlpineLinkMap.png",     label: "Map"     },
  ]

  const advance = (newIdx) => {
    setCenterIdx(newIdx)
    idxRef.current = newIdx
  }

  /* Auto-advance every 5 s */
  useEffect(() => {
    const t = setInterval(
      () => advance((idxRef.current + 1) % PHONES.length),
      5000,
    )
    return () => clearInterval(t)
  }, [])

  /* Slightly tighter spread so the sweep feels controlled */
  const SLOTS = [
    { dx: -300, dz: -180, ry: -25, sc: 0.60, zi: 1, op: 0.55 },
    { dx: -165, dz:  -90, ry: -14, sc: 0.80, zi: 3, op: 0.80 },
    { dx:    0, dz:    0, ry:   0, sc: 1.00, zi: 5, op: 1.00 },
    { dx:  165, dz:  -90, ry:  14, sc: 0.80, zi: 3, op: 0.80 },
    { dx:  300, dz: -180, ry:  25, sc: 0.60, zi: 1, op: 0.55 },
  ]

  const slotOf = (i) => {
    let off = (i - centerIdx + PHONES.length) % PHONES.length
    if (off > 2) off -= PHONES.length
    return SLOTS[off + 2]
  }

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    startX.current  = e.clientX
    didDrag.current = false
    setDragging(true)
  }

  const onPointerMove = (e) => {
    if (startX.current === null) return
    const delta = e.clientX - startX.current
    setDragDelta(delta)
    if (Math.abs(delta) > DRAG_THRESHOLD / 2) didDrag.current = true
  }

  const onPointerUp = (e) => {
    if (startX.current === null) return
    const delta = e.clientX - startX.current
    startX.current = null
    setDragging(false)
    setDragDelta(0)
    if (Math.abs(delta) >= DRAG_THRESHOLD) {
      advance((idxRef.current + (delta < 0 ? 1 : -1) + PHONES.length) % PHONES.length)
    }
  }

  const dragShift = Math.max(-100, Math.min(100, dragDelta * 0.55))
  const EASE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)"

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        width:             "100%",
        height:            "100%",
        position:          "relative",
        perspective:       "1100px",
        perspectiveOrigin: "50% 50%",
        cursor:            dragging ? "grabbing" : "grab",
        userSelect:        "none",
        touchAction:       "none",
      }}
    >
      {PHONES.map((phone, i) => {
        const s        = slotOf(i)
        const isCenter = i === centerIdx
        const liveX    = s.dx + (isCenter && dragging ? dragShift : 0)

        return (
          <div
            key={phone.src}
            onClick={() => { if (!didDrag.current) advance(i) }}
            style={{
              position:  "absolute",
              left:      "50%",
              top:       "50%",
              zIndex:    s.zi,
              opacity:   s.op,
              transform: `translate(-50%,-50%) translateX(${liveX}px) translateZ(${s.dz}px) rotateY(${s.ry}deg) scale(${s.sc})`,
              transition: dragging
                ? "none"
                : `transform 0.52s ${EASE}, opacity 0.52s ${EASE}`,
              cursor:    dragging ? "grabbing" : (isCenter ? "grab" : "pointer"),
              background:"none",
            }}
          >
            <img
              src={phone.src}
              alt={phone.label}
              draggable={false}
              style={{
                height:        "min(70vh, 580px)",
                width:         "auto",
                display:       "block",
                filter:        isCenter
                  ? "drop-shadow(0 24px 48px rgba(0,0,0,0.55))"
                  : "drop-shadow(0 10px 24px rgba(0,0,0,0.38))",
                userSelect:    "none",
                pointerEvents: "none",
                transition:    `filter 0.52s ${EASE}`,
              }}
            />
          </div>
        )
      })}

      {/* Dot indicators */}
      <div style={{
        position:      "absolute",
        bottom:        "28px",
        left:          "50%",
        transform:     "translateX(-50%)",
        display:       "flex",
        gap:           "7px",
        zIndex:        10,
        pointerEvents: dragging ? "none" : "auto",
      }}>
        {PHONES.map((_, i) => (
          <button
            key={i}
            onClick={() => advance(i)}
            style={{
              width:        i === centerIdx ? "22px" : "7px",
              height:       "7px",
              borderRadius: "4px",
              background:   i === centerIdx ? BLUE : "rgba(255,255,255,0.30)",
              border:       "none",
              padding:      0,
              cursor:       "pointer",
              transition:   "all 0.35s ease",
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── Main page ──────────────────────────────────────────────────────────────── */
export function AlpineLinkPage() {
  const { navigate } = useRouter()

  return (
    <>
      <style>{`
        @keyframes alSlideLeft {
          from { opacity: 0; transform: translateX(-52px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        @keyframes alPopIn {
          from { opacity: 0; transform: scale(0.45); }
          to   { opacity: 1; transform: scale(1);    }
        }
      `}</style>
      <SideBlobs />

      <main style={{ minHeight: "100vh" }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section style={{
          display:  "flex",
          width:    "100vw",
          height:   "100vh",
          overflow: "hidden",
          position: "relative",
          zIndex:   1,
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
              onClick={() => navigate("projects")}
              style={{
                position:             "fixed",
                top:                  "clamp(72px,9vh,96px)",
                left:                 "clamp(24px,3vw,48px)",
                zIndex:               50,
                display:              "flex",
                alignItems:           "center",
                gap:                  "7px",
                padding:              "9px 20px",
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

              {/* AlpineLink logo */}
              <img
                src="/images/AlpineLogo.png"
                alt="AlpineLink logo"
                style={{
                  height:      "clamp(85px,10vw,130px)",
                  width:       "auto",
                  objectFit:   "contain",
                  alignSelf:   "flex-start",
                  marginLeft:  0,
                  filter:      "drop-shadow(0 4px 18px rgba(56,189,248,0.40))",
                  animation:   "alSlideLeft 0.70s cubic-bezier(0.25,0.46,0.45,0.94) 0.10s both",
                }}
              />

              {/* Title */}
              <h1 style={{
                margin:     0,
                color:      "#fff",
                fontSize:   "clamp(2rem,3.6vw,3.2rem)",
                fontWeight: 700,
                lineHeight: 1.05,
                whiteSpace: "nowrap",
                animation:  "alSlideLeft 0.70s cubic-bezier(0.25,0.46,0.45,0.94) 0.25s both",
              }}>
                AlpineLink
              </h1>

              {/* Category badge */}
              <div style={{
                display:       "inline-flex",
                alignSelf:     "flex-start",
                padding:       "5px 16px",
                borderRadius:  "999px",
                background:    BLUE12,
                border:        `1px solid rgba(56,189,248,0.40)`,
                color:         BLUE,
                fontSize:      "0.75rem",
                fontWeight:    600,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                animation:     "alSlideLeft 0.70s cubic-bezier(0.25,0.46,0.45,0.94) 0.40s both",
              }}>
                Mobile App Design
              </div>

              {/* Divider */}
              <div style={{
                width:        "44px",
                height:       "2px",
                background:   "rgba(255,255,255,0.22)",
                borderRadius: "2px",
                animation:    "alSlideLeft 0.55s ease 0.52s both",
              }} />

              {/* Toolkit icons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {TOOLS.map((t, i) => (
                  <ToolIcon key={t.name} {...t} animDelay={`${0.58 + i * 0.10}s`} />
                ))}
              </div>

            </div>
          </div>

          {/* ── RIGHT PANEL — interactive 3-D phone stack ── */}
          <div style={{
            flex:     1,
            position: "relative",
            height:   "100%",
          }}>
            <HeroPhoneStack />
          </div>

        </section>

        {/* ══ STEPPER ═══════════════════════════════════════════════════════ */}
        <CaseStudyStepper />

        {/* ── Figma Link button ── */}
        <div style={{ display: "flex", justifyContent: "center", padding: "0 0 48px" }}>
          <a
            href="https://www.figma.com/design/shmElE2YMrEHtmo37AlTfj/Untitled?node-id=0-1&t=4aOix6OQCOgCvoiS-1"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:              "inline-flex",
              alignItems:           "center",
              gap:                  "10px",
              padding:              "14px 36px",
              borderRadius:         "999px",
              background:           "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(56,189,248,0.08))",
              backdropFilter:       "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border:               "1px solid rgba(56,189,248,0.45)",
              color:                "rgba(255,255,255,0.92)",
              fontSize:             "0.95rem",
              fontWeight:           600,
              letterSpacing:        "0.05em",
              textDecoration:       "none",
              cursor:               "pointer",
              transition:           "background 0.25s ease, border-color 0.25s ease, transform 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background  = "linear-gradient(135deg, rgba(56,189,248,0.32), rgba(56,189,248,0.16))"
              e.currentTarget.style.borderColor = "rgba(56,189,248,0.70)"
              e.currentTarget.style.transform   = "translateY(-2px)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background  = "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(56,189,248,0.08))"
              e.currentTarget.style.borderColor = "rgba(56,189,248,0.45)"
              e.currentTarget.style.transform   = "translateY(0)"
            }}
          >
            <img
              src="/images/toolkit-figma.png"
              alt="Figma"
              style={{ width: "22px", height: "22px", objectFit: "contain" }}
            />
            View Figma File
          </a>
        </div>

      </main>

      <Footer />
    </>
  )
}
