import { useRef, useEffect, useState } from "react"
import { useRouter }   from "../lib/router-context"
import { GlassCard }   from "./glass-card"
import { BlobButton }  from "./blob-button"

/* ── Tilt-on-hover wrapper ───────────────────────────────────────────────────
   Tracks mouse position relative to the card and applies a perspective
   rotateX / rotateY so the card tilts toward the cursor.
   Only activates when `active` is true (i.e. cards have finished sliding in).
   ─────────────────────────────────────────────────────────────────────────── */
function TiltWrapper({ children, active, amplitude = 12 }) {
  const ref = useRef(null)
  const [rot, setRot] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const onMove = (e) => {
    if (!active || !ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const nx = ((e.clientX - left) / width  - 0.5) * 2  // –1 … +1
    const ny = ((e.clientY - top)  / height - 0.5) * 2  // –1 … +1
    setRot({ x: -ny * amplitude, y: nx * amplitude })
  }

  const onLeave = () => {
    setHovered(false)
    setRot({ x: 0, y: 0 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => active && setHovered(true)}
      onMouseLeave={onLeave}
      style={{
        /* perspective must wrap the element being rotated */
        perspective: "900px",
        /* pass transformStyle through so children stay in the same 3-D plane */
        transformStyle: "preserve-3d",
      }}
    >
      <div
        style={{
          transform: active
            ? `rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale(${hovered ? 1.04 : 1})`
            : "none",
          transition: hovered
            ? "transform 0.08s linear"
            : "transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)",
          willChange: "transform",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  )
}

export function AboutPreview() {
  const sectionRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [titleVisible, setTitleVisible]     = useState(false)
  const titleVisibleRef = useRef(false)
  const { navigate } = useRouter()

  // Trigger "A Little About Me" slide-in as soon as section enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !titleVisibleRef.current) {
          titleVisibleRef.current = true
          setTitleVisible(true)
        }
      },
      { threshold: 0.01 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    function handleScroll() {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const sectionHeight = sectionRef.current.offsetHeight
      const viewportHeight = window.innerHeight
      const progress = Math.max(0, Math.min(1, (viewportHeight - rect.top) / (sectionHeight + viewportHeight)))
      setScrollProgress(progress)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Cards converge in the first half of the sticky phase (0.15 → 0.52),
  // then stay FULLY LOCKED for the rest (~60vh of dwell) before the section exits.
  // This ensures cards are settled and still before the page scrolls on.
  const convergence =
    scrollProgress < 0.15 ? 0
    : scrollProgress < 0.52 ? (scrollProgress - 0.15) / 0.37
    : 1

  const tiltActive = convergence >= 1

  const contentOpacity =
    scrollProgress < 0.15 ? 0
    : scrollProgress < 0.42 ? (scrollProgress - 0.15) / 0.27
    : 1

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[220vh] w-full"
      id="about"
    >
      <style>{`
        @keyframes aboutTitleSlideIn {
          from { opacity: 0; transform: translateX(calc(-50% - 72px)); }
          to   { opacity: 1; transform: translateX(-50%);               }
        }
        @keyframes aboutTitleShine {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .about-title-animated {
          background: linear-gradient(
            120deg,
            rgba(255,255,255,0.45) 30%,
            rgba(255,255,255,1.00) 50%,
            rgba(255,255,255,0.45) 70%
          );
          background-size:         250% auto;
          -webkit-background-clip: text;
          background-clip:         text;
          -webkit-text-fill-color: transparent;
          animation:
            aboutTitleSlideIn 0.7s cubic-bezier(0.215,0.61,0.355,1) both,
            aboutTitleShine   3.5s linear infinite 0.7s;
        }
      `}</style>

      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

        {/* "A Little About Me" — slides in from left, stays fixed at upper-left */}
        <h2
          className={`absolute font-bold pointer-events-none select-none${titleVisible ? " about-title-animated" : ""}`}
          style={{
            left: "50%",
            top:  "clamp(90px, 11vh, 120px)",
            whiteSpace: "nowrap",
            fontSize:   "clamp(2rem, 3.2vw, 3rem)",
            lineHeight: 1.1,
            zIndex:     25,
            opacity:    titleVisible ? undefined : 0,
          }}
        >
          A Little About Me
        </h2>

        <div className="relative w-[90%] max-w-6xl flex items-center justify-center">
          {/* Decorative blobs */}
          <div
            className="absolute top-[-60px] left-[40%] w-40 h-40 opacity-30 blur-[50px] pointer-events-none"
            style={{
              background: "var(--blob-3)",
              borderRadius: "40% 60% 50% 50%",
              animation: "blob-float-4 20s ease-in-out infinite",
            }}
          />
          <div
            className="absolute bottom-[10%] right-[-5%] w-28 h-28 opacity-20 blur-[40px] pointer-events-none"
            style={{
              background: "var(--blob-1)",
              borderRadius: "55% 45% 50% 50%",
              animation: "blob-float-2 18s ease-in-out infinite",
            }}
          />

          {/* Left: About text card
              IMPORTANT: opacity is NOT on this wrapper — it's inside the card.
              Putting opacity here would create a compositing layer that breaks
              backdrop-filter on the GlassCard child. */}
          <div
            style={{
              transform: `translateX(${(1 - convergence) * -90}vw)`,
              flex: "0 0 auto",
            }}
          >
            <TiltWrapper active={tiltActive} amplitude={10}>
              <GlassCard
                intensity="medium"
                className="p-3 sm:p-6 md:p-8
                           w-[43vw] sm:w-[280px] md:w-[340px] lg:w-[420px]
                           h-[68vw] sm:h-[320px] md:h-[380px] lg:h-[440px]
                           flex flex-col justify-between"
              >
                {/* Opacity lives here — inside the glass card, not on its parent */}
                <div
                  className="flex flex-col justify-between h-full"
                  style={{ opacity: contentOpacity }}
                >
                  <div className="flex flex-col gap-3 sm:gap-4">
                    <h3 className="text-white text-[13px] sm:text-xl md:text-2xl font-semibold leading-tight">
                      Hi, I'm Farnaz
                    </h3>
                    <p className="text-white/80 text-[10px] sm:text-base leading-snug sm:leading-relaxed">
                      A New Media Design student at BCIT who loves art, UI/UX, and digital design.
                    </p>
                    <p className="hidden sm:block text-white/70 text-[10px] sm:text-base leading-relaxed">
                      I'm passionate about creating modern, interactive experiences — because let's be honest, no one stays focused on something that isn't engaging anymore.
                    </p>
                    <p className="hidden sm:block text-white/70 text-[10px] sm:text-base leading-relaxed">
                      I enjoy blending design, technology, and storytelling to turn ideas into visuals that not only look good, but actually <span className="text-white/90 font-medium">connect with people.</span>
                    </p>
                    <p className="hidden sm:block text-white/50 text-[9px] sm:text-sm leading-relaxed italic mt-1">
                      Curious to know more? Explore my About page ↓
                    </p>
                  </div>
                </div>
              </GlassCard>
            </TiltWrapper>
          </div>

          {/* Gap between cards */}
          <div className="w-2 sm:w-4 md:w-8 flex-shrink-0" />

          {/* Right: Photo card — same pattern, no opacity on wrapper */}
          <div
            style={{
              transform: `translateX(${(1 - convergence) * 90}vw)`,
              flex: "0 0 auto",
            }}
          >
            <TiltWrapper active={tiltActive} amplitude={10}>
              <GlassCard
                intensity="light"
                className="overflow-hidden
                           w-[43vw] sm:w-[280px] md:w-[340px] lg:w-[420px]
                           h-[68vw] sm:h-[320px] md:h-[380px] lg:h-[440px]"
              >
                {/* Photo fades in separately — opacity is on this wrapper, not on
                    the GlassCard itself, so backdrop-filter is unaffected */}
                <div className="w-full h-full" style={{ opacity: contentOpacity }}>
                  <img
                    src="/images/about-portrait.png"
                    alt="Portrait of Farnaz"
                    className="w-full h-full object-cover"
                  />
                </div>
              </GlassCard>
            </TiltWrapper>
          </div>

          {/* "About me" button — centred below both cards */}
          <div
            style={{
              position:   "absolute",
              bottom:     "-140px",
              left:       "50%",
              transform:  "translateX(-50%)",
              opacity:    contentOpacity,
              zIndex:     10,
            }}
          >
            <BlobButton
              onClick={() => navigate("about")}
              className="pill-btn-hover inline-flex items-center gap-2 rounded-full cursor-pointer"
              style={{
                background:     "rgba(255,255,255,0.12)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border:         "1px solid rgba(255,255,255,0.22)",
                whiteSpace:     "nowrap",
                padding:        "11px 26px",
                borderRadius:   "999px",
                fontSize:       "0.85rem",
                fontWeight:     500,
                lineHeight:     "1.4",
                color:          "rgba(255,255,255,0.90)",
              }}
            >
              About me
            </BlobButton>
          </div>
        </div>
      </div>
    </section>
  )
}