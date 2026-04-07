import { useState, useEffect, useCallback, useRef } from "react"
import { useTheme }    from "../lib/theme-context"
import { useRouter }   from "../lib/router-context"
import { SplitText }   from "./split-text"
import { BlobButton }  from "./blob-button"

/* Layout / sizing / animation data — colours are injected per-theme below  */
const INITIAL_BLOBS = [
  { id: 0, x: 50, y: 45, w: 320, h: 300, anim: "blob-float-1", dur: 12 },
  { id: 1, x: 75, y: 15, w: 140, h: 130, anim: "blob-float-3", dur: 10 },
  { id: 2, x: 85, y: 30, w: 60,  h: 55,  anim: "blob-float-2", dur: 8  },
  { id: 3, x: 25, y: 65, w: 35,  h: 30,  anim: "blob-float-4", dur: 9  },
  { id: 4, x: 70, y: 75, w: 80,  h: 75,  anim: "blob-float-5", dur: 11 },
]

/* Mobile only shows 1 blob — reduces visual clutter on small screens */
const MOBILE_BLOB_IDS = new Set([0])

/* Hero blob colour gradients — one set per theme.
   Deliberately DEEPER / RICHER than the background SideBlobs so the two
   layers read as distinct: vivid bg dots → richer draggable hero blobs.  */
const HERO_THEME_COLORS = {
  /* Deep blue-purples, saturated violets, rich roses                        */
  pink: [
    "linear-gradient(135deg, #3344cc, #aa22dd, #dd1166)",
    "linear-gradient(135deg, #5522cc, #cc2299)",
    "linear-gradient(135deg, #cc3366, #ee5588)",
    "linear-gradient(135deg, #6633cc, #3366cc)",
    "linear-gradient(135deg, #cc1144, #aa22dd, #3344cc)",
  ],
  /* Deep navy, strong azure, rich cobalt, dark teal                         */
  blue: [
    "linear-gradient(135deg, #003399, #0066bb, #0099cc)",
    "linear-gradient(135deg, #002299, #0055bb)",
    "linear-gradient(135deg, #005588, #0088aa)",
    "linear-gradient(135deg, #222299, #004488)",
    "linear-gradient(135deg, #003388, #0066aa, #004477)",
  ],
  /* Dark forest, rich jade, deep olive-lime, dark teal-green                */
  green: [
    "linear-gradient(135deg, #006622, #009944, #449900)",
    "linear-gradient(135deg, #007733, #00aa44)",
    "linear-gradient(135deg, #006644, #009955)",
    "linear-gradient(135deg, #335500, #557700)",
    "linear-gradient(135deg, #005522, #008833, #446600)",
  ],
  /* Burnt sienna, deep amber, rich rust, dark tangerine                     */
  orange: [
    "linear-gradient(135deg, #992200, #bb5500, #cc8800)",
    "linear-gradient(135deg, #aa3300, #cc6600)",
    "linear-gradient(135deg, #993300, #bb6600)",
    "linear-gradient(135deg, #881100, #aa4400)",
    "linear-gradient(135deg, #882200, #bb4400, #cc7700)",
  ],
}

/* Glow colour used in boxShadow — matches each theme so the filter edge
   outline is always harmonious rather than a fixed purple.               */
const HERO_GLOW_COLORS = {
  pink:   "rgba(150,  80, 255, 0.30)",
  blue:   "rgba(  0, 110, 220, 0.32)",
  green:  "rgba(  0, 160,  80, 0.32)",
  orange: "rgba(200,  80,   0, 0.32)",
}

function DraggableBlob({ blob, containerRef }) {
  const { themeName } = useTheme()
  const glowColor = HERO_GLOW_COLORS[themeName] ?? HERO_GLOW_COLORS.pink
  const blobRef = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [stretch, setStretch] = useState({ scaleX: 1, scaleY: 1, rotate: 0 })
  const prevPos = useRef({ x: 0, y: 0 })
  const animFrame = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPos({
      x: (blob.x / 100) * rect.width - blob.w / 2,
      y: (blob.y / 100) * rect.height - blob.h / 2,
    })
  }, [blob, containerRef])

  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragging(true)
    const blobRect = blobRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    setOffset({
      x: e.clientX - (blobRect.left - containerRect.left),
      y: e.clientY - (blobRect.top - containerRect.top),
    })
    prevPos.current = { x: pos.x, y: pos.y }
  }, [pos, containerRef])

  const handleTouchStart = useCallback((e) => {
    e.preventDefault()   // prevent page scroll taking over the drag
    e.stopPropagation()
    const touch = e.touches[0]
    setDragging(true)
    const blobRect = blobRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()
    setOffset({
      x: touch.clientX - (blobRect.left - containerRect.left),
      y: touch.clientY - (blobRect.top - containerRect.top),
    })
    prevPos.current = { x: pos.x, y: pos.y }
  }, [pos, containerRef])

  useEffect(() => {
    if (!dragging) return

    const handleMove = (clientX, clientY) => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current)
      animFrame.current = requestAnimationFrame(() => {
        const newX = clientX - offset.x
        const newY = clientY - offset.y
        const dx = newX - prevPos.current.x
        const dy = newY - prevPos.current.y
        const speed = Math.sqrt(dx * dx + dy * dy)
        const angle = Math.atan2(dy, dx) * (180 / Math.PI)
        const stretchAmount = Math.min(speed * 0.015, 0.4)

        setStretch({
          scaleX: 1 + stretchAmount,
          scaleY: 1 - stretchAmount * 0.5,
          rotate: angle,
        })

        prevPos.current = { x: newX, y: newY }
        setPos({ x: newX, y: newY })
      })
    }

    const onMouseMove = (e) => handleMove(e.clientX, e.clientY)
    const onTouchMove = (e) => {
      e.preventDefault()  // prevent scroll while dragging a blob on mobile
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }

    const onEnd = () => {
      setDragging(false)
      setStretch({ scaleX: 1, scaleY: 1, rotate: 0 })
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onEnd)
    window.addEventListener("touchmove", onTouchMove, { passive: false }) // non-passive so preventDefault works
    window.addEventListener("touchend", onEnd)

    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onEnd)
      window.removeEventListener("touchmove", onTouchMove)
      window.removeEventListener("touchend", onEnd)
      if (animFrame.current) cancelAnimationFrame(animFrame.current)
    }
  }, [dragging, offset])

  return (
    <div
      ref={blobRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      className="absolute cursor-grab active:cursor-grabbing select-none"
      style={{
        width: blob.w,
        height: blob.h,
        left: pos.x,
        top: pos.y,
        background: blob.color,
        borderRadius: "40% 60% 55% 45% / 55% 45% 60% 40%",
        boxShadow: `0 0 ${blob.w * 0.2}px ${glowColor}`,
        animation: dragging ? "none" : `${blob.anim} ${blob.dur}s ease-in-out infinite`,
        transform: dragging
          ? `rotate(${stretch.rotate}deg) scaleX(${stretch.scaleX}) scaleY(${stretch.scaleY})`
          : undefined,
        transition: dragging ? "none" : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
        zIndex: dragging ? 50 : 1,
        filter: dragging ? "brightness(1.2)" : "none",
        touchAction: "none",
      }}
    />
  )
}

/* Desktop blob container — has its own ref so blobs size correctly to the flex column */
function DesktopBlobs() {
  const { themeName } = useTheme()
  const heroColors    = HERO_THEME_COLORS[themeName] ?? HERO_THEME_COLORS.pink
  const ref = useRef(null)
  return (
    <div ref={ref} className="absolute inset-0 w-full h-full">
      {INITIAL_BLOBS.map((blob, i) => (
        <DraggableBlob
          key={blob.id}
          blob={{ ...blob, color: heroColors[i] }}
          containerRef={ref}
        />
      ))}
    </div>
  )
}

export function HeroSection() {
  const { themeName } = useTheme()
  const heroColors = HERO_THEME_COLORS[themeName] ?? HERO_THEME_COLORS.pink
  const { navigate } = useRouter()
  const blobContainerRef = useRef(null)

  /* 1920px detection — drives inline-style overrides */
  const [isWide, setIsWide] = useState(() => window.innerWidth >= 1920)
  useEffect(() => {
    const check = () => setIsWide(window.innerWidth >= 1920)
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  /* Mobile detection — phone-only font/layout overrides */
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  /* Animation phase:
     0 = waiting  1 = "Hello, I'm"  2 = "Farnaz"
     3 = subtitle  4 = description  5 = buttons visible */
  const [phase, setPhase] = useState(0)
  const [showButtons, setShowButtons] = useState(false)

  /* Kick off the chain shortly after mount.
     Hero only mounts after intro completes, so no extra delay needed. */
  useEffect(() => {
    const t = setTimeout(() => setPhase(1), 50)
    return () => clearTimeout(t)
  }, [])

  /* Show buttons shortly after description fades in */
  useEffect(() => {
    if (phase >= 4) {
      const t = setTimeout(() => setShowButtons(true), 400)
      return () => clearTimeout(t)
    }
  }, [phase])

  return (
    <section className="relative h-[75vh] sm:h-screen flex items-center pt-20 overflow-hidden">
      <style>{`
        @keyframes heroArrowBounce {
          0%, 100% { transform: translateY(0);    opacity: 0.55; }
          50%       { transform: translateY(10px); opacity: 1;    }
        }
        @keyframes heroArrowGlow {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(255,255,255,0.35)) drop-shadow(0 0 10px rgba(200,160,255,0.25)); }
          50%       { filter: drop-shadow(0 0 10px rgba(255,255,255,0.75)) drop-shadow(0 0 22px rgba(200,160,255,0.55)); }
        }
        @keyframes heroArrowFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0);     }
        }
      `}</style>

      {/* ── Mobile only: blobs float freely behind text ── */}
      <div
        ref={blobContainerRef}
        className="sm:hidden absolute inset-0 w-full h-full"
        style={{ filter: "url(#gooey)", zIndex: 0 }}
      >
        {INITIAL_BLOBS.filter(b => MOBILE_BLOB_IDS.has(b.id)).map((blob, i) => (
          <DraggableBlob
            key={blob.id}
            blob={{ ...blob, color: heroColors[blob.id] }}
            containerRef={blobContainerRef}
          />
        ))}
      </div>

      {/* content-wrap — shifted up slightly so text sits above the vertical centre */}
      <div className="content-wrap w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 md:gap-10 lg:gap-16"
        style={{ marginTop: isMobile ? "3rem" : "-3rem" }}
      >

        {/* ── Left: text column ── */}
        <div className="hero-text-content relative z-10 min-w-0 w-full sm:flex-1 pl-6 sm:pl-0">

          {/* "Hello, I'm" */}
          <SplitText
            text="Hello, I'm"
            className="text-white/90 text-base sm:text-base md:text-lg mb-0"
            style={isWide ? { fontSize: "2.5rem", marginBottom: "0" } : { marginBottom: "0", ...(isMobile ? { fontSize: "1.1rem" } : {}) }}
            delay={22}
            duration={0.4}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 20 }}
            to={{ opacity: 1, y: 0 }}
            trigger={phase >= 1}
            onLetterAnimationComplete={() => setPhase(p => Math.max(p, 2))}
          />

          {/* "Farnaz" */}
          <SplitText
            text="Farnaz"
            className="font-bold text-white mb-2"
            style={isWide
              ? { fontSize: "10rem", marginBottom: "1.5rem", marginTop: "-0.35em" }
              : isMobile
                ? { fontSize: "3.8rem", marginTop: "-0.28em" }
                : { fontSize: "clamp(2.2rem, 7vw, 6rem)", marginTop: "-0.28em" }
            }
            delay={45}
            duration={0.5}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 35 }}
            to={{ opacity: 1, y: 0 }}
            trigger={phase >= 2}
            onLetterAnimationComplete={() => setPhase(p => Math.max(p, 3))}
          />

          {/* "UI/UX & Digital Designer" */}
          <SplitText
            text="UI/UX & Digital Designer"
            className="text-lg sm:text-lg md:text-xl font-semibold text-white/90 mb-3"
            style={isWide
              ? { fontSize: "3rem", marginBottom: "1.5rem", whiteSpace: "nowrap" }
              : isMobile ? { fontSize: "1.15rem" } : {}
            }
            delay={18}
            duration={0.4}
            ease="power3.out"
            splitType="chars"
            from={{ opacity: 0, y: 18 }}
            to={{ opacity: 1, y: 0 }}
            trigger={phase >= 3}
            onLetterAnimationComplete={() => setPhase(p => Math.max(p, 4))}
          />

          {/* Description — block fade-in (body text looks best as a unit, not per-char) */}
          <p
            className="text-white/70 text-sm sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 max-w-[80%] sm:max-w-md"
            style={{
              opacity:   phase >= 4 ? 1 : 0,
              transform: phase >= 4 ? "translateY(0)" : "translateY(14px)",
              transition: "opacity 0.45s cubic-bezier(0.215,0.61,0.355,1), transform 0.45s cubic-bezier(0.215,0.61,0.355,1)",
              ...(isWide ? { fontSize: "1.6rem", lineHeight: "2.2", maxWidth: "680px", marginBottom: "3rem" } : {}),
              ...(isMobile ? { fontSize: "0.88rem", maxWidth: "100%" } : {}),
            }}
          >
            Based in Vancouver, creating visually engaging and user-centered digital experiences.
          </p>

          {/* CTA buttons — always in DOM, opacity/transform only so no layout shift */}
          <div
            style={{
              display: "flex",
              gap: isMobile ? "12px" : "16px",
              flexWrap: "wrap",
              opacity: showButtons ? 1 : 0,
              transform: showButtons ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s cubic-bezier(0.215,0.61,0.355,1), transform 0.7s cubic-bezier(0.215,0.61,0.355,1)",
              willChange: "opacity, transform",
            }}
          >
            <BlobButton
              onClick={() => navigate("projects")}
              className="pill-btn-hover px-5 sm:px-8 py-2 sm:py-2.5 rounded-full text-sm font-medium text-white/80"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                ...(isWide ? { fontSize: "1.3rem", padding: "18px 52px" } : {}),
              }}
            >
              View Projects
            </BlobButton>
            <BlobButton
              onClick={() => navigate("about")}
              className="pill-btn-hover px-5 sm:px-8 py-2 sm:py-2.5 rounded-full text-sm font-medium text-white/80"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                ...(isWide ? { fontSize: "1.3rem", padding: "18px 52px" } : {}),
              }}
            >
              About Me
            </BlobButton>
          </div>

          {/* ── Scroll-down arrow — always in DOM to avoid layout shift ── */}
          <div style={{
            marginTop:  isMobile ? "32px" : "48px",
            display:    "flex",
            alignItems: "center",
            gap:        "10px",
            opacity:    showButtons ? 1 : 0,
            transition: "opacity 0.7s cubic-bezier(0.23,1,0.32,1) 0.5s",
            willChange: "opacity",
          }}>
            <div style={{
              animation: showButtons
                ? "heroArrowBounce 1.8s ease-in-out infinite, heroArrowGlow 1.8s ease-in-out infinite"
                : "none",
            }}>
              <svg width={isMobile ? "30" : "38"} height={isMobile ? "30" : "38"} viewBox="0 0 38 38" fill="none">
                <path d="M8 12L19 26L30 12" stroke="rgba(255,255,255,0.85)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <span style={{
              color:         "rgba(255,255,255,0.45)",
              fontSize:      isMobile ? "0.72rem" : "0.82rem",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
              fontWeight:    500,
            }}>
              Scroll
            </span>
          </div>
        </div>

        {/* ── Right: draggable lava blobs (desktop/tablet only) ── */}
        <div
          className="hidden sm:block flex-shrink-0 relative
                     sm:flex-1 sm:h-[380px]
                     md:h-[480px] lg:h-[580px]"
          style={{ filter: "url(#gooey)" }}
        >
          <DesktopBlobs />
        </div>

        {/* SVG gooey filter for blob merging */}
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            <filter id="gooey">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix
                in="blur"
                type="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
                result="goo"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>
        </svg>
      </div>
    </section>
  )
}
