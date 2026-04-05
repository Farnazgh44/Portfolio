/**
 * Space Shipper — Game UI Case Study Page
 */
import { useState, useRef, useEffect } from "react"
import { useRouter } from "../lib/router-context"
import { SideBlobs } from "../components/side-blobs"
import { Footer }    from "../components/footer"

/* ─── Accent colours (electric cyan) ────────────────────────────────────── */
const CYAN     = "rgba(99,210,255,1)"
const CYAN_DIM = "rgba(99,210,255,0.18)"
const CYAN_MID = "rgba(99,210,255,0.45)"

/* ─── Design process layout constants ───────────────────────────────────── */
const STEP_BOX_H     = 472
const STEP_CONTENT_H = 420

/* ─── Toolkit ────────────────────────────────────────────────────────────── */
const TOOLS = [
  { name: "Figma",      icon: "/images/toolkit-figma.png"        },
  { name: "Canva",      icon: "/images/toolkit-canva.png"        },
  { name: "Photoshop",  icon: "/images/toolkit-photoshop.png"    },
  { name: "AI",         icon: "/images/toolkit-illustrator.png"  },
]

/* ─── Design process steps (6 placeholders) ─────────────────────────────── */
const STEPS = [
  {
    number: 1,
    title:  "Project Overview",
    visual: "/images/Game.png",
    content: [
      { type: "para", text: "Content coming soon." },
    ],
  },
  {
    number: 2,
    title:  "Research & Inspiration",
    visual: "/images/Game.png",
    content: [
      { type: "para", text: "Content coming soon." },
    ],
  },
  {
    number: 3,
    title:  "UI Design",
    visual: "/images/Game.png",
    content: [
      { type: "para", text: "Content coming soon." },
    ],
  },
  {
    number: 4,
    title:  "Art Direction",
    visual: "/images/Game.png",
    content: [
      { type: "para", text: "Content coming soon." },
    ],
  },
  {
    number: 5,
    title:  "Prototyping & Testing",
    visual: "/images/Game.png",
    content: [
      { type: "para", text: "Content coming soon." },
    ],
  },
  {
    number: 6,
    title:  "Outcome & Reflection",
    visual: "/images/Game.png",
    content: [
      { type: "para", text: "Content coming soon." },
    ],
  },
]

/* ─── Tool icon ──────────────────────────────────────────────────────────── */
function ToolIcon({ name, icon, animDelay = "0s" }) {
  return (
    <div
      title={name}
      style={{
        animation:            `gmPopIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${animDelay} both`,
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
        cursor:               "default",
      }}
    >
      {icon
        ? <img src={icon} alt={name} style={{ width: 32, height: 32, objectFit: "contain" }} />
        : <span style={{ color: "rgba(255,255,255,0.80)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.04em" }}>{name}</span>
      }
    </div>
  )
}

/* ─── Step content renderer ──────────────────────────────────────────────── */
function StepContent({ blocks }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {blocks.map((block, i) => {
        if (block.type === "heading") return (
          <p key={i} style={{ margin: 0, color: CYAN, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {block.text}
          </p>
        )
        if (block.type === "para") return (
          <p key={i} style={{ margin: 0, color: "rgba(255,255,255,0.80)", fontSize: "clamp(0.87rem,1.15vw,0.97rem)", lineHeight: 1.75 }}>
            {block.text}
          </p>
        )
        if (block.type === "bullets") return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {block.items.map((item, j) => (
              <div key={j} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ color: CYAN, fontSize: "0.75rem", marginTop: "4px", flexShrink: 0 }}>◆</span>
                <span style={{ color: "rgba(255,255,255,0.78)", fontSize: "clamp(0.85rem,1.1vw,0.93rem)", lineHeight: 1.65 }}>{item}</span>
              </div>
            ))}
          </div>
        )
        if (block.type === "highlight") return (
          <div key={i} style={{
            padding: "12px 16px", borderRadius: "12px",
            background: CYAN_DIM, border: `1px solid ${CYAN_MID}`,
            borderLeft: `4px solid ${CYAN}`,
            backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ color: CYAN, fontSize: "1rem", flexShrink: 0, marginTop: "1px" }}>✦</span>
              <span style={{ color: "#fff", fontSize: "clamp(0.87rem,1.15vw,0.95rem)", fontWeight: 600, lineHeight: 1.65 }}>
                {block.text}
              </span>
            </div>
          </div>
        )
        return null
      })}
    </div>
  )
}

/* ─── Right-panel glass visual ───────────────────────────────────────────── */
function StepVisual({ step, isMobile }) {
  const [visible,  setVisible]  = useState(true)
  const [imgAnim,  setImgAnim]  = useState(true)
  const prevStep                = useRef(step)

  useEffect(() => {
    if (prevStep.current?.number !== step?.number) {
      setVisible(false)
      setImgAnim(false)
      const t = setTimeout(() => { prevStep.current = step; setVisible(true); setImgAnim(true) }, 180)
      return () => clearTimeout(t)
    }
  }, [step])

  const s      = prevStep.current
  const slides = s?.visuals ?? (s?.visual ? [s.visual] : [])

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
      flexDirection:        "column",
      alignItems:           "center",
      justifyContent:       "center",
      height:               isMobile ? "220px" : `${STEP_BOX_H}px`,
      minHeight:            isMobile ? "220px" : `${STEP_BOX_H}px`,
    }}>
      <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "40px" }}>
        {slides[0] && (
          <img
            src={slides[0]}
            alt={`Step ${s?.number}`}
            style={{
              maxWidth:   "100%",
              maxHeight:  `${STEP_BOX_H - 80}px`,
              width:      "auto",
              height:     "auto",
              objectFit:  "contain",
              display:    "block",
              filter:     "drop-shadow(0 8px 28px rgba(0,0,0,0.40))",
              opacity:    imgAnim ? 1 : 0,
              transform:  imgAnim ? "scale(1)" : "scale(0.97)",
              transition: "opacity 0.25s ease, transform 0.25s ease",
            }}
          />
        )}
      </div>
    </div>
  )
}

/* ─── Collapsed step row ─────────────────────────────────────────────────── */
function CollapsedStepRow({ step, isLast, onClick, grow }) {
  const [hov, setHov] = useState(false)
  return (
    <div style={{ display: "flex", flex: grow ? 1 : undefined, marginBottom: grow ? 0 : (isLast ? 0 : "10px") }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "48px", flexShrink: 0 }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%",
          border:     `2px solid ${hov ? CYAN_MID : "rgba(255,255,255,0.22)"}`,
          background: hov ? CYAN_DIM : "rgba(255,255,255,0.06)",
          color:      hov ? CYAN : "rgba(255,255,255,0.50)",
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
      <div style={{ flex: 1, marginLeft: "16px", display: "flex", alignItems: "center" }}>
        <button
          onClick={onClick}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            width: "100%", display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: "12px",
            padding: "14px 18px", borderRadius: "14px",
            background:     hov ? CYAN_DIM : "rgba(255,255,255,0.05)",
            border:         `1px solid ${hov ? "rgba(99,210,255,0.28)" : "rgba(255,255,255,0.10)"}`,
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            cursor: "pointer", textAlign: "left",
            transition: "background 0.28s ease, border-color 0.28s ease",
          }}
        >
          <span style={{
            color: hov ? "#fff" : "rgba(255,255,255,0.85)",
            fontSize: "clamp(0.93rem,1.3vw,1.05rem)", fontWeight: 500, letterSpacing: "0.01em",
            transition: "color 0.28s ease",
          }}>
            {step.title}
          </span>
          <div style={{
            width: "26px", height: "26px", borderRadius: "50%",
            background: hov ? CYAN_DIM : "rgba(255,255,255,0.07)",
            border:     `1px solid ${hov ? "rgba(99,210,255,0.30)" : "rgba(255,255,255,0.12)"}`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            transition: "all 0.28s ease",
          }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M4 2l3 3-3 3" stroke={hov ? CYAN : "rgba(255,255,255,0.55)"}
                strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
      </div>
    </div>
  )
}

/* ─── Open step box ──────────────────────────────────────────────────────── */
function OpenStepBox({ step }) {
  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "48px", flexShrink: 0 }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%",
          border: `2px solid ${CYAN}`,
          background: CYAN_DIM, color: CYAN,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.80rem", fontWeight: 700, flexShrink: 0,
        }}>
          {step.number}
        </div>
        <div style={{
          flex: 1, width: "2px", minHeight: "16px", marginTop: "4px",
          background: `linear-gradient(to bottom, ${CYAN}, rgba(99,210,255,0.10))`,
        }} />
      </div>
      <div style={{
        flex: 1, marginLeft: "16px", borderRadius: "14px",
        background:           CYAN_DIM,
        border:               `1px solid ${CYAN_MID}`,
        backdropFilter:       "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        overflow:             "hidden",
      }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid rgba(99,210,255,0.22)` }}>
          <span style={{ color: "#fff", fontSize: "clamp(0.93rem,1.3vw,1.05rem)", fontWeight: 700 }}>
            {step.title}
          </span>
        </div>
        <div style={{
          height: `${STEP_CONTENT_H}px`, overflowY: "auto",
          padding: "16px 20px 20px",
          scrollbarWidth: "thin",
          scrollbarColor: `rgba(99,210,255,0.4) rgba(255,255,255,0.05)`,
        }}>
          <StepContent blocks={step.content} />
        </div>
      </div>
    </div>
  )
}

/* ─── Close arrow ────────────────────────────────────────────────────────── */
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
            border:     `2px solid ${hov ? CYAN : CYAN_MID}`,
            background: hov ? "rgba(99,210,255,0.25)" : CYAN_DIM,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.25s ease",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2.5 8.5l5-5 5 5" stroke={CYAN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export function GamePage() {
  const { navigate } = useRouter()
  const [heroIn,    setHeroIn]    = useState(false)
  const [openIndex, setOpenIndex] = useState(null)
  const [isMobile,  setIsMobile]  = useState(() => window.innerWidth < 640)
  const [hdVisible, setHdVisible] = useState(false)
  const headingRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setHeroIn(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

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

  const openStep  = (i) => setOpenIndex(i)
  const closeStep = () => setOpenIndex(null)

  return (
    <>
      <style>{`
        @keyframes gmSlideLeft {
          from { opacity: 0; transform: translateX(-52px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        @keyframes gmPopIn {
          from { opacity: 0; transform: scale(0.45); }
          to   { opacity: 1; transform: scale(1);    }
        }
      `}</style>

      <SideBlobs />

      <main style={{ minHeight: "100vh", overflowX: "clip" }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section style={{
          display:  "flex",
          width:    "100vw",
          height:   "100vh",
          position: "relative",
        }}>

          {/* ← Back */}
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
            opacity:        heroIn ? 1 : 0,
            transform:      heroIn ? "translateX(0)" : "translateX(-50px)",
            transition:     "opacity 0.8s ease, transform 0.8s ease",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

              {/* Icon */}
              <div style={{ animation: "gmSlideLeft 0.70s cubic-bezier(0.25,0.46,0.45,0.94) 0.10s both", alignSelf: "flex-start" }}>
                <div style={{
                  width: "clamp(64px,8vw,96px)", height: "clamp(64px,8vw,96px)",
                  borderRadius: "22px", background: CYAN_DIM, border: `1px solid rgba(99,210,255,0.30)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "clamp(28px,4vw,44px)",
                }}>🎮</div>
              </div>

              {/* Title */}
              <h1 style={{
                margin: 0, color: "#fff",
                fontSize: "clamp(1.8rem,3.2vw,2.9rem)", fontWeight: 700, lineHeight: 1.05,
                animation: "gmSlideLeft 0.70s cubic-bezier(0.25,0.46,0.45,0.94) 0.25s both",
              }}>
                Space Shipper
              </h1>

              {/* Category badge */}
              <div style={{
                display: "inline-flex", alignSelf: "flex-start",
                padding: "5px 16px", borderRadius: "999px",
                background: CYAN_DIM, border: `1px solid rgba(99,210,255,0.40)`,
                color: CYAN, fontSize: "0.75rem", fontWeight: 600,
                letterSpacing: "0.09em", textTransform: "uppercase",
                animation: "gmSlideLeft 0.70s cubic-bezier(0.25,0.46,0.45,0.94) 0.40s both",
              }}>
                Game UI
              </div>

              {/* Divider */}
              <div style={{ width: "44px", height: "2px", background: "rgba(255,255,255,0.22)", borderRadius: "2px", animation: "gmSlideLeft 0.55s ease 0.52s both" }} />

              {/* Toolkit */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
                {TOOLS.map((t, i) => (
                  <ToolIcon key={t.name} {...t} animDelay={`${0.58 + i * 0.10}s`} />
                ))}
              </div>

            </div>
          </div>

          {/* ── RIGHT PANEL — project image ── */}
          <div style={{
            flex: 1, position: "relative", height: "100%", overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity:    heroIn ? 1 : 0,
            transform:  heroIn ? "translateX(0)" : "translateX(60px)",
            transition: "opacity 0.8s 0.12s ease, transform 0.8s 0.12s ease",
          }}>
            <img
              src="/images/Game.png"
              alt="Space Shipper"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
            />
          </div>

        </section>

        {/* ══ DESIGN PROCESS ════════════════════════════════════════════════ */}
        <div style={{
          width: "100%", boxSizing: "border-box",
          paddingTop: "80px", paddingBottom: "32px",
          paddingLeft:  isMobile ? "16px" : "clamp(32px, 5vw, 72px)",
          paddingRight: isMobile ? "16px" : "clamp(32px, 5vw, 72px)",
        }}>
          {/* Section heading */}
          <div ref={headingRef} style={{ marginBottom: isMobile ? "24px" : "52px", textAlign: isMobile ? "center" : "left" }}>
            <div style={{
              display: "inline-block", padding: "5px 18px", borderRadius: "999px",
              background: CYAN_DIM, border: `1px solid ${CYAN_MID}`,
              color: CYAN, fontSize: "0.72rem", fontWeight: 600,
              letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: "14px",
              ...hdAnim("0s"),
            }}>
              Case Study
            </div>
            <h2 style={{
              margin: 0, color: "#fff",
              fontSize: isMobile ? "1.3rem" : "clamp(1.6rem,3vw,2.4rem)",
              fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.1,
              ...hdAnim("0.15s"),
            }}>
              Design Process
            </h2>
            <p style={{
              margin: "8px 0 0", color: "rgba(255,255,255,0.45)",
              fontSize: isMobile ? "0.78rem" : "clamp(0.88rem,1.2vw,0.98rem)",
              ...hdAnim("0.28s"),
            }}>
              Tap any step to explore the full story.
            </p>
          </div>

          {/* Two-column layout */}
          <div style={{
            display:       "flex",
            flexDirection: isMobile ? "column" : "row",
            gap:           isMobile ? "16px" : "clamp(20px,3vw,48px)",
            alignItems:    "flex-start",
          }}>

            {/* Glass visual — right on desktop, top on mobile */}
            <div style={{
              order:   isMobile ? -1 : 1,
              flex:    isMobile ? "none" : 1,
              width:   isMobile ? "100%" : undefined,
              minWidth: isMobile ? undefined : 0,
              opacity:    hdVisible ? 1 : 0,
              transform:  hdVisible ? "translateX(0)" : "translateX(48px)",
              transition: "opacity 0.65s ease 0.48s, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) 0.48s",
            }}>
              <StepVisual
                step={openIndex !== null ? STEPS[openIndex] : STEPS[0]}
                isMobile={isMobile}
              />
            </div>

            {/* Steps list — left on desktop, bottom on mobile */}
            <div style={{
              order:    0,
              flex:     isMobile ? "none" : "0 0 48%",
              width:    isMobile ? "100%" : undefined,
              maxWidth: isMobile ? undefined : "48%",
              opacity:    hdVisible ? 1 : 0,
              transform:  hdVisible ? "translateX(0)" : "translateX(-48px)",
              transition: "opacity 0.65s ease 0.38s, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) 0.38s",
            }}>
              {openIndex === null ? (
                <div style={{
                  display: "flex", flexDirection: "column",
                  height: isMobile ? "auto" : `${STEP_BOX_H}px`,
                  gap:    isMobile ? "6px" : 0,
                }}>
                  {STEPS.map((step, i) => (
                    <CollapsedStepRow
                      key={step.number}
                      step={step}
                      isLast={i === STEPS.length - 1}
                      onClick={() => openStep(i)}
                      grow={!isMobile}
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

          </div>
        </div>

      </main>

      <Footer />
    </>
  )
}
