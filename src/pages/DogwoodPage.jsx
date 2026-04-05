/**
 * Dogwood Land & Gardening — Project Case Study Page
 */
import { useState, useRef, useEffect } from "react"
import { useRouter } from "../lib/router-context"
import { SideBlobs } from "../components/side-blobs"
import { Footer }    from "../components/footer"

/* ─── Accent colours (earthy green) ─────────────────────────────────────── */
const GREEN     = "rgba(134,197,120,1)"
const GREEN_DIM = "rgba(134,197,120,0.18)"
const GREEN_MID = "rgba(134,197,120,0.45)"

/* ─── Design process layout constants ───────────────────────────────────── */
const STEP_BOX_H     = 472
const STEP_CONTENT_H = 420

/* ─── Brand gallery constants ────────────────────────────────────────────── */
const ITEM_H             = 300   /* px — card height */
const GALLERY_SCROLL_RATIO = 6

/* ─── Brand gallery items — images go in public/images/, videos in public/videos/ ── */
const BRAND_ITEMS = [
  { type: "image", src: "/images/Dogwood (1).png" },
  { type: "video", src: "/videos/Dogwood (1).mp4" },
  { type: "image", src: "/images/Dogwood (2).png" },
  { type: "image", src: "/images/Dogwood (3).png" },
  { type: "video", src: "/videos/Dogwood (2).mp4" },
  { type: "image", src: "/images/Dogwood (4).png" },
  { type: "video", src: "/videos/Dogwood (3).mp4" },
  { type: "image", src: "/images/Dogwood (5).png" },
]

/* ─── Toolkit ────────────────────────────────────────────────────────────── */
const TOOLS = [
  { name: "Figma",    icon: "/images/toolkit-figma.png"   },
  { name: "Canva",    icon: "/images/toolkit-canva.png"   },
  { name: "React",    icon: null                          },
  { name: "VS Code",  icon: "/images/toolkit-vscode.png" },
]

/* ─── Design process steps ───────────────────────────────────────────────── */
const STEPS = [
  {
    number: 1,
    title:  "Project Overview",
    visual: "/images/Dogwood.png",
    content: [{ type: "para", text: "Content coming soon." }],
  },
  {
    number: 2,
    title:  "Research & Discovery",
    visual: "/images/Dogwood.png",
    content: [{ type: "para", text: "Content coming soon." }],
  },
  {
    number: 3,
    title:  "UX Strategy",
    visual: "/images/Dogwood.png",
    content: [{ type: "para", text: "Content coming soon." }],
  },
  {
    number: 4,
    title:  "Visual Design",
    visual: "/images/Dogwood.png",
    content: [{ type: "para", text: "Content coming soon." }],
  },
  {
    number: 5,
    title:  "Development",
    visual: "/images/Dogwood.png",
    content: [{ type: "para", text: "Content coming soon." }],
  },
  {
    number: 6,
    title:  "Outcome & Reflection",
    visual: "/images/Dogwood.png",
    content: [{ type: "para", text: "Content coming soon." }],
  },
]

/* ─── Tool icon ──────────────────────────────────────────────────────────── */
function ToolIcon({ name, icon, animDelay = "0s" }) {
  return (
    <div title={name} style={{
      animation:            `dwPopIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${animDelay} both`,
      width: "54px", height: "54px", borderRadius: "14px",
      background: "rgba(255,255,255,0.10)",
      backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.15)",
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0, cursor: "default",
    }}>
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
          <p key={i} style={{ margin: 0, color: GREEN, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>{block.text}</p>
        )
        if (block.type === "para") return (
          <p key={i} style={{ margin: 0, color: "rgba(255,255,255,0.80)", fontSize: "clamp(0.87rem,1.15vw,0.97rem)", lineHeight: 1.75 }}>{block.text}</p>
        )
        if (block.type === "bullets") return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {block.items.map((item, j) => (
              <div key={j} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ color: GREEN, fontSize: "0.75rem", marginTop: "4px", flexShrink: 0 }}>◆</span>
                <span style={{ color: "rgba(255,255,255,0.78)", fontSize: "clamp(0.85rem,1.1vw,0.93rem)", lineHeight: 1.65 }}>{item}</span>
              </div>
            ))}
          </div>
        )
        if (block.type === "highlight") return (
          <div key={i} style={{
            padding: "12px 16px", borderRadius: "12px",
            background: GREEN_DIM, border: `1px solid ${GREEN_MID}`,
            borderLeft: `4px solid ${GREEN}`,
            backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ color: GREEN, fontSize: "1rem", flexShrink: 0, marginTop: "1px" }}>✦</span>
              <span style={{ color: "#fff", fontSize: "clamp(0.87rem,1.15vw,0.95rem)", fontWeight: 600, lineHeight: 1.65 }}>{block.text}</span>
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
  const [visible, setVisible] = useState(true)
  const [imgAnim, setImgAnim] = useState(true)
  const prevStep              = useRef(step)

  useEffect(() => {
    if (prevStep.current?.number !== step?.number) {
      setVisible(false); setImgAnim(false)
      const t = setTimeout(() => { prevStep.current = step; setVisible(true); setImgAnim(true) }, 180)
      return () => clearTimeout(t)
    }
  }, [step])

  const s      = prevStep.current
  const slides = s?.visuals ?? (s?.visual ? [s.visual] : [])

  return (
    <div style={{
      position: "sticky", top: "120px",
      borderRadius: "24px",
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)",
      border: "1px solid rgba(255,255,255,0.14)",
      boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
      overflow: "hidden",
      opacity:   visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(10px)",
      transition: "opacity 0.3s ease, transform 0.3s ease",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      height:    isMobile ? "220px" : `${STEP_BOX_H}px`,
      minHeight: isMobile ? "220px" : `${STEP_BOX_H}px`,
    }}>
      <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: "40px" }}>
        {slides[0] && (
          <img src={slides[0]} alt={`Step ${s?.number}`} style={{
            maxWidth: "100%", maxHeight: `${STEP_BOX_H - 80}px`,
            width: "auto", height: "auto", objectFit: "contain", display: "block",
            filter: "drop-shadow(0 8px 28px rgba(0,0,0,0.40))",
            opacity:   imgAnim ? 1 : 0,
            transform: imgAnim ? "scale(1)" : "scale(0.97)",
            transition: "opacity 0.25s ease, transform 0.25s ease",
          }} />
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
          border:     `2px solid ${hov ? GREEN_MID : "rgba(255,255,255,0.22)"}`,
          background: hov ? GREEN_DIM : "rgba(255,255,255,0.06)",
          color:      hov ? GREEN : "rgba(255,255,255,0.50)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.80rem", fontWeight: 700, flexShrink: 0,
          transition: "all 0.28s ease",
        }}>{step.number}</div>
        {!isLast && <div style={{ flex: 1, width: "2px", minHeight: "10px", marginTop: "4px", background: "rgba(255,255,255,0.10)" }} />}
      </div>
      <div style={{ flex: 1, marginLeft: "16px", display: "flex", alignItems: "center" }}>
        <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "12px",
          padding: "14px 18px", borderRadius: "14px",
          background:     hov ? GREEN_DIM : "rgba(255,255,255,0.05)",
          border:         `1px solid ${hov ? "rgba(134,197,120,0.28)" : "rgba(255,255,255,0.10)"}`,
          backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
          cursor: "pointer", textAlign: "left",
          transition: "background 0.28s ease, border-color 0.28s ease",
        }}>
          <span style={{ color: hov ? "#fff" : "rgba(255,255,255,0.85)", fontSize: "clamp(0.93rem,1.3vw,1.05rem)", fontWeight: 500, transition: "color 0.28s ease" }}>
            {step.title}
          </span>
          <div style={{
            width: "26px", height: "26px", borderRadius: "50%",
            background: hov ? GREEN_DIM : "rgba(255,255,255,0.07)",
            border: `1px solid ${hov ? "rgba(134,197,120,0.30)" : "rgba(255,255,255,0.12)"}`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            transition: "all 0.28s ease",
          }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M4 2l3 3-3 3" stroke={hov ? GREEN : "rgba(255,255,255,0.55)"} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
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
          border: `2px solid ${GREEN}`, background: GREEN_DIM, color: GREEN,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.80rem", fontWeight: 700, flexShrink: 0,
        }}>{step.number}</div>
        <div style={{ flex: 1, width: "2px", minHeight: "16px", marginTop: "4px", background: `linear-gradient(to bottom, ${GREEN}, rgba(134,197,120,0.10))` }} />
      </div>
      <div style={{
        flex: 1, marginLeft: "16px", borderRadius: "14px",
        background: GREEN_DIM, border: `1px solid ${GREEN_MID}`,
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        overflow: "hidden",
      }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid rgba(134,197,120,0.22)` }}>
          <span style={{ color: "#fff", fontSize: "clamp(0.93rem,1.3vw,1.05rem)", fontWeight: 700 }}>{step.title}</span>
        </div>
        <div style={{ height: `${STEP_CONTENT_H}px`, overflowY: "auto", padding: "16px 20px 20px", scrollbarWidth: "thin", scrollbarColor: `rgba(134,197,120,0.4) rgba(255,255,255,0.05)` }}>
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
        <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} title="Back to all steps" style={{
          width: "38px", height: "38px", borderRadius: "50%",
          border:     `2px solid ${hov ? GREEN : GREEN_MID}`,
          background: hov ? "rgba(134,197,120,0.25)" : GREEN_DIM,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "all 0.25s ease",
        }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2.5 8.5l5-5 5 5" stroke={GREEN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

/* ─── Lightbox (image + video) ───────────────────────────────────────────── */
function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return
    const onKey = (e) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [item, onClose])

  if (!item) return null

  return (
    <div
      onClick={onClose}
      style={{
        position:             "fixed",
        inset:                0,
        zIndex:               1200,
        display:              "flex",
        alignItems:           "center",
        justifyContent:       "center",
        background:           "rgba(0,0,0,0.88)",
        backdropFilter:       "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        animation:            "dwFadeIn 0.25s ease",
        cursor:               "zoom-out",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position:       "absolute",
          top:            "clamp(16px,3vh,28px)",
          right:          "clamp(16px,3vw,28px)",
          width:          "44px",
          height:         "44px",
          borderRadius:   "50%",
          background:     "rgba(255,255,255,0.12)",
          border:         "1px solid rgba(255,255,255,0.22)",
          backdropFilter: "blur(12px)",
          color:          "#fff",
          fontSize:       "20px",
          lineHeight:     1,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          cursor:         "pointer",
          zIndex:         1201,
          transition:     "background 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.24)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
      >✕</button>

      {item.type === "video" ? (
        <video
          src={item.src}
          autoPlay
          loop
          controls
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth:     "90vw",
            maxHeight:    "85vh",
            borderRadius: "16px",
            boxShadow:    "0 30px 80px rgba(0,0,0,0.65)",
            cursor:       "default",
            animation:    "dwLightboxPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        />
      ) : (
        <img
          src={item.src}
          alt=""
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth:     "90vw",
            maxHeight:    "85vh",
            borderRadius: "16px",
            objectFit:    "contain",
            boxShadow:    "0 30px 80px rgba(0,0,0,0.65)",
            cursor:       "default",
            animation:    "dwLightboxPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        />
      )}
    </div>
  )
}

/* ─── Bringing the Brand to Life — sticky scroll-driven horizontal gallery ── */
function BrandInRealLife({ openLightbox }) {
  const wrapperRef    = useRef(null)
  const trackRef      = useRef(null)
  const currentX      = useRef(0)
  const targetX       = useRef(0)
  const rafId         = useRef(null)
  // Touch drag (mobile)
  const touchStartX      = useRef(null)
  const touchStartTarget = useRef(0)
  // Custom scrollbar
  const sbTrackRef   = useRef(null)
  const sbThumbRef   = useRef(null)
  const sbDragging   = useRef(false)
  const sbDragStartX = useRef(0)
  const sbDragStartT = useRef(0)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  /* Touch drag for mobile */
  const onTouchStart = (e) => {
    touchStartX.current      = e.touches[0].clientX
    touchStartTarget.current = targetX.current
  }
  const onTouchMove = (e) => {
    if (touchStartX.current === null) return
    const delta = e.touches[0].clientX - touchStartX.current
    const track = trackRef.current
    if (!track) return
    const maxShift = -(track.scrollWidth - window.innerWidth + 96)
    targetX.current = Math.max(maxShift, Math.min(0, touchStartTarget.current + delta))
  }
  const onTouchEnd = () => { touchStartX.current = null }

  /* Recompute wrapper height when track resizes */
  useEffect(() => {
    const track   = trackRef.current
    const wrapper = wrapperRef.current
    if (!track || !wrapper) return
    const update = () => {
      const scrollRange = Math.max(0, track.scrollWidth - window.innerWidth + 96)
      wrapper.style.height = `calc(100vh + ${scrollRange * GALLERY_SCROLL_RATIO}px)`
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(track)
    window.addEventListener("resize", update)
    return () => { ro.disconnect(); window.removeEventListener("resize", update) }
  }, [])

  /* Smooth lerp loop — also syncs scrollbar thumb position */
  useEffect(() => {
    const loop = () => {
      currentX.current += (targetX.current - currentX.current) * 0.09
      if (trackRef.current) trackRef.current.style.transform = `translateX(${currentX.current}px)`
      const track   = trackRef.current
      const sbTrack = sbTrackRef.current
      const sbThumb = sbThumbRef.current
      if (track && sbTrack && sbThumb) {
        const maxShift = -(track.scrollWidth - window.innerWidth + 96)
        if (maxShift < 0) {
          const sbW    = sbTrack.offsetWidth
          const thumbW = Math.max(48, sbW * (window.innerWidth / track.scrollWidth))
          const maxTX  = sbW - thumbW
          const prog   = currentX.current / maxShift
          sbThumb.style.width     = `${thumbW}px`
          sbThumb.style.transform = `translateX(${Math.max(0, Math.min(maxTX, prog * maxTX))}px)`
        }
      }
      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId.current)
  }, [])

  /* Map page scroll → gallery X */
  useEffect(() => {
    const onScroll = () => {
      const wrapper = wrapperRef.current
      const track   = trackRef.current
      if (!wrapper || !track) return
      const wRect       = wrapper.getBoundingClientRect()
      const scrollableH = wrapper.offsetHeight - window.innerHeight
      if (scrollableH <= 0) return
      const scrolled = Math.max(0, -wRect.top)
      const progress = Math.min(1, scrolled / scrollableH)
      const maxShift = -(track.scrollWidth - window.innerWidth + 96)
      targetX.current = maxShift * progress
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* Scrollbar thumb drag */
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!sbDragging.current) return
      const delta   = e.clientX - sbDragStartX.current
      const track   = trackRef.current
      const sbTrack = sbTrackRef.current
      const sbThumb = sbThumbRef.current
      if (!track || !sbTrack || !sbThumb) return
      const maxShift = -(track.scrollWidth - window.innerWidth + 96)
      const sbW      = sbTrack.offsetWidth
      const thumbW   = parseFloat(sbThumb.style.width) || 48
      const maxTX    = sbW - thumbW
      const ratio    = maxTX > 0 ? maxShift / maxTX : 0
      targetX.current = Math.max(maxShift, Math.min(0, sbDragStartT.current + delta * ratio))
    }
    const onMouseUp = () => {
      sbDragging.current = false
      if (sbThumbRef.current) {
        sbThumbRef.current.style.background = GREEN
        sbThumbRef.current.style.cursor = "grab"
      }
    }
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup",   onMouseUp)
    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup",   onMouseUp)
    }
  }, [])

  /* Click on scrollbar track — jump to that position */
  const onSbTrackClick = (e) => {
    const sbTrack = sbTrackRef.current
    const sbThumb = sbThumbRef.current
    const track   = trackRef.current
    if (!sbTrack || !sbThumb || !track) return
    const rect     = sbTrack.getBoundingClientRect()
    const clickX   = e.clientX - rect.left
    const sbW      = sbTrack.offsetWidth
    const thumbW   = parseFloat(sbThumb.style.width) || 48
    const maxTX    = sbW - thumbW
    const prog     = Math.max(0, Math.min(1, (clickX - thumbW / 2) / maxTX))
    const maxShift = -(track.scrollWidth - window.innerWidth + 96)
    targetX.current = maxShift * prog
  }

  const PAD    = isMobile ? "16px" : "clamp(32px, 5vw, 72px)"
  const CARD_H = isMobile ? 150 : ITEM_H

  return (
    <div ref={wrapperRef}>
      <section
        onTouchStart={isMobile ? onTouchStart : undefined}
        onTouchMove={isMobile  ? onTouchMove  : undefined}
        onTouchEnd={isMobile   ? onTouchEnd   : undefined}
        style={{
          position: "sticky", top: 0, height: "100vh",
          display: "flex", flexDirection: "column", justifyContent: "center",
          overflow: "hidden",
          touchAction: isMobile ? "pan-y" : undefined,
        }}
      >
        <h2 style={{
          margin: "0 0 36px", paddingLeft: PAD,
          color: "#fff", fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
          fontWeight: 700, letterSpacing: "-0.01em",
        }}>
          Bringing the Brand to Life
        </h2>

        <div ref={trackRef} style={{ display: "flex", gap: isMobile ? "10px" : "16px", paddingLeft: PAD, willChange: "transform" }}>
          {BRAND_ITEMS.map((item, i) =>
            item.type === "video" ? (
              <div key={i} style={{ position: "relative", flexShrink: 0, cursor: "zoom-in" }}
                onClick={() => openLightbox({ type: "video", src: item.src })}>
                <video src={item.src} autoPlay loop muted playsInline
                  style={{
                    height: `${CARD_H}px`, width: "auto", display: "block",
                    borderRadius: "16px", objectFit: "cover",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.40)",
                    pointerEvents: "none",
                  }}
                />
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "16px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0)", transition: "background 0.22s ease",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.28)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0)"}
                >
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.30)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0, transition: "opacity 0.22s ease",
                  }}
                    ref={el => {
                      if (!el) return
                      el.parentElement.addEventListener("mouseenter", () => el.style.opacity = "1")
                      el.parentElement.addEventListener("mouseleave", () => el.style.opacity = "0")
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="white"><path d="M4 2l10 6-10 6V2z"/></svg>
                  </div>
                </div>
              </div>
            ) : (
              <img key={i} src={item.src} alt=""
                onClick={() => openLightbox({ type: "image", src: item.src })}
                style={{
                  height: `${CARD_H}px`, width: "auto", flexShrink: 0,
                  borderRadius: "16px", objectFit: "cover", display: "block",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.40)", cursor: "zoom-in",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.55)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.40)" }}
              />
            )
          )}
        </div>

        {/* ── Custom scrollbar — desktop only ── */}
        {!isMobile && (
          <div style={{ padding: `32px ${PAD} 0`, userSelect: "none" }}>
            <div
              ref={sbTrackRef}
              onClick={onSbTrackClick}
              style={{
                position: "relative", height: "5px", borderRadius: "3px",
                background: "rgba(255,255,255,0.10)", cursor: "pointer",
              }}
            >
              <div
                ref={sbThumbRef}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  sbDragging.current   = true
                  sbDragStartX.current = e.clientX
                  sbDragStartT.current = targetX.current
                  e.currentTarget.style.cursor = "grabbing"
                }}
                style={{
                  position: "absolute", top: "-3px", left: 0,
                  height: "11px", width: "80px", borderRadius: "6px",
                  background: GREEN,
                  cursor: "grab",
                  boxShadow: `0 0 10px ${GREEN_MID}`,
                  transition: "background 0.18s, box-shadow 0.18s",
                }}
                onMouseEnter={e => { if (!sbDragging.current) { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 0 12px rgba(255,255,255,0.45)" } }}
                onMouseLeave={e => { if (!sbDragging.current) { e.currentTarget.style.background = GREEN;  e.currentTarget.style.boxShadow = `0 0 10px ${GREEN_MID}` } }}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
export function DogwoodPage() {
  const { navigate } = useRouter()
  const [heroIn,       setHeroIn]       = useState(false)
  const [openIndex,    setOpenIndex]    = useState(null)
  const [isMobile,     setIsMobile]     = useState(() => window.innerWidth < 640)
  const [hdVisible,    setHdVisible]    = useState(false)
  const [lightboxItem, setLightboxItem] = useState(null)
  const openLightbox = (item) => setLightboxItem(item)
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

  return (
    <>
      <style>{`
        @keyframes dwSlideLeft {
          from { opacity: 0; transform: translateX(-52px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes dwPopIn {
          from { opacity: 0; transform: scale(0.45); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes dwFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes dwLightboxPop {
          from { opacity: 0; transform: scale(0.88); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <SideBlobs />

      <main style={{ minHeight: "100vh", overflowX: "clip" }}>

        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <section style={{
          display: "flex", width: "100vw", height: "100vh", position: "relative",
          /* ↓ shifts content down — change 80px to taste */
          paddingTop: "80px",
        }}>

          {/* ← Back */}
          <button onClick={() => navigate("projects")} style={{
            position: "fixed", top: "clamp(72px,9vh,96px)", left: "clamp(24px,3vw,48px)",
            zIndex: 50, display: "flex", alignItems: "center", gap: "7px",
            padding: "9px 20px", borderRadius: "999px",
            background: "rgba(255,255,255,0.10)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.22)",
            color: "rgba(255,255,255,0.88)", fontSize: "0.85rem", fontWeight: 500,
            cursor: "pointer", letterSpacing: "0.04em", transition: "background 0.2s ease",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.10)"}
          >← Back</button>

          {/* ── LEFT PANEL ── */}
          <div style={{
            width: "32vw", minWidth: "300px", flexShrink: 0,
            display: "flex", flexDirection: "column", justifyContent: "center",
            padding: "0 clamp(36px,5vw,72px)", position: "relative", zIndex: 2,
            opacity:    heroIn ? 1 : 0,
            transform:  heroIn ? "translateX(0)" : "translateX(-50px)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>

              {/* Dogwood logo */}
              <div style={{ animation: "dwSlideLeft 0.70s cubic-bezier(0.25,0.46,0.45,0.94) 0.10s both", alignSelf: "flex-start" }}>
                <img
                  src="/images/DogwoodLogo.png"
                  alt="Dogwood Logo"
                  style={{
                    height: "clamp(100px,12vw,150px)", width: "auto",
                    objectFit: "contain",
                    filter: "drop-shadow(0 4px 18px rgba(134,197,120,0.40))",
                  }}
                />
              </div>

              {/* Title */}
              <h1 style={{
                margin: 0, lineHeight: 1.05,
                animation: "dwSlideLeft 0.70s cubic-bezier(0.25,0.46,0.45,0.94) 0.25s both",
              }}>
                <span style={{ display: "block", color: "#fff", fontSize: "clamp(2.4rem,4vw,3.8rem)", fontWeight: 800, letterSpacing: "-0.01em" }}>
                  Dogwood
                </span>
                <span style={{ display: "block", color: "rgba(255,255,255,0.75)", fontSize: "clamp(1rem,1.6vw,1.4rem)", fontWeight: 500, letterSpacing: "0.02em", marginTop: "2px" }}>
                  Landscaping &amp; Gardening
                </span>
              </h1>

              {/* Category badge */}
              <div style={{
                display: "inline-flex", alignSelf: "flex-start",
                padding: "5px 16px", borderRadius: "999px",
                background: GREEN_DIM, border: `1px solid rgba(134,197,120,0.40)`,
                color: GREEN, fontSize: "0.75rem", fontWeight: 600,
                letterSpacing: "0.09em", textTransform: "uppercase",
                animation: "dwSlideLeft 0.70s cubic-bezier(0.25,0.46,0.45,0.94) 0.40s both",
              }}>
                Web Design & UX Case Study
              </div>

              {/* Divider */}
              <div style={{ width: "44px", height: "2px", background: "rgba(255,255,255,0.22)", borderRadius: "2px", animation: "dwSlideLeft 0.55s ease 0.52s both" }} />

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
              src="/images/Dogwood.png"
              alt="Dogwood Land & Gardening"
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
          <div ref={headingRef} style={{ marginBottom: isMobile ? "24px" : "52px", textAlign: isMobile ? "center" : "left" }}>
            <div style={{
              display: "inline-block", padding: "5px 18px", borderRadius: "999px",
              background: GREEN_DIM, border: `1px solid ${GREEN_MID}`,
              color: GREEN, fontSize: "0.72rem", fontWeight: 600,
              letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: "14px",
              ...hdAnim("0s"),
            }}>Case Study</div>
            <h2 style={{
              margin: 0, color: "#fff",
              fontSize: isMobile ? "1.3rem" : "clamp(1.6rem,3vw,2.4rem)",
              fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.1,
              ...hdAnim("0.15s"),
            }}>Design Process</h2>
            <p style={{
              margin: "8px 0 0", color: "rgba(255,255,255,0.45)",
              fontSize: isMobile ? "0.78rem" : "clamp(0.88rem,1.2vw,0.98rem)",
              ...hdAnim("0.28s"),
            }}>Tap any step to explore the full story.</p>
          </div>

          <div style={{
            display: "flex", flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "16px" : "clamp(20px,3vw,48px)", alignItems: "flex-start",
          }}>
            {/* Glass visual */}
            <div style={{
              order: isMobile ? -1 : 1, flex: isMobile ? "none" : 1,
              width: isMobile ? "100%" : undefined, minWidth: isMobile ? undefined : 0,
              opacity:    hdVisible ? 1 : 0,
              transform:  hdVisible ? "translateX(0)" : "translateX(48px)",
              transition: "opacity 0.65s ease 0.48s, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) 0.48s",
            }}>
              <StepVisual step={openIndex !== null ? STEPS[openIndex] : STEPS[0]} isMobile={isMobile} />
            </div>

            {/* Steps list */}
            <div style={{
              order: 0, flex: isMobile ? "none" : "0 0 48%",
              width: isMobile ? "100%" : undefined, maxWidth: isMobile ? undefined : "48%",
              opacity:    hdVisible ? 1 : 0,
              transform:  hdVisible ? "translateX(0)" : "translateX(-48px)",
              transition: "opacity 0.65s ease 0.38s, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) 0.38s",
            }}>
              {openIndex === null ? (
                <div style={{ display: "flex", flexDirection: "column", height: isMobile ? "auto" : `${STEP_BOX_H}px`, gap: isMobile ? "6px" : 0 }}>
                  {STEPS.map((step, i) => (
                    <CollapsedStepRow key={step.number} step={step} isLast={i === STEPS.length - 1} onClick={() => setOpenIndex(i)} grow={!isMobile} />
                  ))}
                </div>
              ) : (
                <>
                  <OpenStepBox step={STEPS[openIndex]} />
                  <CloseArrow onClick={() => setOpenIndex(null)} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* ══ BRINGING THE BRAND TO LIFE ════════════════════════════════════ */}
        <BrandInRealLife openLightbox={openLightbox} />

      </main>

      <Footer />

      {/* ── Lightbox — renders above everything ──────────────────────── */}
      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  )
}
