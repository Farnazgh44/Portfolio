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
  const { navigate } = useRouter()

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

  // With min-h-[200vh], range = 300vh. Sticky phase runs from s≈0.333 to s≈0.667
  // giving ~100vh of sticky scroll (≈5 scrolls at 20vh each).
  //
  // Timeline:
  //  0.333–0.39  "Behind the design" fades in  (~1 scroll)
  //  0.39–0.46   title fully visible / stable  (~1 scroll)
  //  0.37–0.63   cards slide in from ±90vw     (~3 scrolls of visible movement)
  //  0.63–0.667  everything settled, 1 scroll to exit

  const titleOpacity =
    scrollProgress < 0.333 ? 0
    : scrollProgress < 0.39  ? (scrollProgress - 0.333) / 0.057
    : scrollProgress < 0.46  ? 1
    : scrollProgress < 0.56  ? 1 - (scrollProgress - 0.46) / 0.10
    : 0

  // Cards slide in from ±90vw (closer start so they become visible sooner)
  const convergence =
    scrollProgress < 0.37 ? 0
    : scrollProgress < 0.63 ? (scrollProgress - 0.37) / 0.26
    : 1

  // Tilt only activates once the cards have fully settled
  const tiltActive = convergence >= 1

  // Content opacity is applied ONLY to the inner content, never to the
  // GlassCard wrapper — because opacity < 1 on a parent creates an offscreen
  // compositing layer that prevents backdrop-filter from seeing through to the
  // real page content, causing the blur to silently disappear.
  const contentOpacity =
    scrollProgress < 0.37 ? 0
    : scrollProgress < 0.53 ? (scrollProgress - 0.37) / 0.16
    : 1

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[300vh] w-full"
      id="about"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
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

          {/* "Behind the Design" title — fades in, then fades out as cards converge */}
          <h2
            className="absolute text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center z-10 pointer-events-none text-balance"
            style={{ opacity: titleOpacity }}
          >
            Behind the design
          </h2>

          {/* Left: About text card
              IMPORTANT: opacity is NOT on this wrapper — it's inside the card.
              Putting opacity here would create a compositing layer that breaks
              backdrop-filter on the GlassCard child. */}
          <div
            style={{
              transform: `translateX(${(1 - convergence) * -120}vw)`,
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
                  <div>
                    <h3 className="text-white text-[11px] sm:text-lg md:text-xl font-semibold mb-1 sm:mb-4 leading-tight">About me</h3>
                    <p className="text-white/70 text-[9px] sm:text-sm leading-snug sm:leading-relaxed">
                      {"I'm a New Media Design and Web Development student at BCIT with a strong background in art and a focus on UI/UX design. I enjoy creating clean, modern digital experiences that are both visually engaging and easy to use."}
                    </p>
                    <p className="hidden sm:block text-white/70 text-sm leading-relaxed mt-3">
                      {"I'm especially interested in the intersection of design, technology, and storytelling\u2014where thoughtful visuals meet practical, user-centered solutions. I love turning ideas into meaningful digital experiences that not only look good, but work well for real people."}
                    </p>
                  </div>
                  <div className="mt-1 sm:mt-4 flex-shrink-0" />
                </div>
              </GlassCard>
            </TiltWrapper>
          </div>

          {/* Gap between cards */}
          <div className="w-2 sm:w-4 md:w-8 flex-shrink-0" />

          {/* Right: Photo card — same pattern, no opacity on wrapper */}
          <div
            style={{
              transform: `translateX(${(1 - convergence) * 120}vw)`,
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
              bottom:     "-64px",
              left:       "50%",
              transform:  "translateX(-50%)",
              opacity:    contentOpacity,
              zIndex:     10,
            }}
          >
            <BlobButton
              onClick={() => navigate("about")}
              className="pill-btn-hover inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-medium text-white/90 cursor-pointer"
              style={{
                background:     "rgba(255,255,255,0.12)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border:         "1px solid rgba(255,255,255,0.22)",
                whiteSpace:     "nowrap",
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
