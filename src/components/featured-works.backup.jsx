import { useRef, useEffect, useState } from "react"
import { useRouter } from "../lib/router-context"

/* ── App screenshots for the scrolling strips ── */
const REDDIT_SCREENS = [
  "/images/reddit_small (1).png",
  "/images/reddit_small (2).png",
  "/images/reddit_small (3).png",
  "/images/reddit_small (4).png",
  "/images/reddit_small (5).png",
]

const ALPINE_SCREENS = [
  "/images/Alpine_Small (1).png",
  "/images/Alpine_Small (2).png",
  "/images/Alpine_Small (3).png",
  "/images/Alpine_Small (4).png",
  "/images/Alpine_Small (5).png",
]

/* ── Single horizontal scrolling row of images (like the project row) ──
   Images are repeated 4× then doubled (8× total) so each "half" is wide
   enough to fill any viewport without ever showing a gap.               ── */
function StripRow({ images, direction = "left" }) {
  const base   = [...images, ...images, ...images, ...images]  // 4× original
  const filled = [...base, ...base]                            // doubled for seamless -50% loop
  return (
    <div style={{ overflow: "hidden", width: "100%" }}>
      <div
        className={direction === "left" ? "animate-scroll-left" : "animate-scroll-right"}
        style={{ display: "flex", gap: "10px", width: "max-content" }}
      >
        {filled.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            style={{
              height: "120px",
              width: "auto",
              objectFit: "cover",
              borderRadius: "10px",
              flexShrink: 0,
              display: "block",
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ── Pause icon overlay (shown on hover) ── */
function PauseOverlay({ visible, radius = "50%" }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      display: "flex", alignItems: "center", justifyContent: "center",
      borderRadius: radius,
      opacity: visible ? 1 : 0,
      transition: "opacity 0.2s ease",
      pointerEvents: "none",
      zIndex: 20,
    }}>
      <div style={{
        width: "44px", height: "44px",
        borderRadius: "50%",
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid rgba(255,255,255,0.25)",
      }}>
        {/* Pause bars */}
        <div style={{ display: "flex", gap: "5px" }}>
          <div style={{ width: "4px", height: "16px", background: "white", borderRadius: "2px" }} />
          <div style={{ width: "4px", height: "16px", background: "white", borderRadius: "2px" }} />
        </div>
      </div>
    </div>
  )
}

/* ── Phone composite: frame + video only ── */
function PhoneComposite({ videoRef, videoSrc, hovered, onMouseEnter, onMouseLeave }) {
  return (
    <div style={{ width: "min(20vw, 190px)", position: "relative" }}>

      {/* ── Phone frame + video ── */}
      <div
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        style={{
          position: "relative",
          aspectRatio: "489 / 979",
          zIndex: 2,
          cursor: "pointer",
          pointerEvents: "auto",
        }}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          loop
          muted
          playsInline
          style={{
            position: "absolute",
            left: "6.95%", top: "2.66%",
            width: "86.71%", height: "94.28%",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
        <img
          src="/images/phone-frame-keyed.png"
          alt=""
          style={{
            position: "absolute",
            inset: 0, width: "100%", height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(0 14px 30px rgba(120,60,200,0.45))",
          }}
        />
        {/* Pause overlay – centered on the screen area of the phone */}
        <div style={{
          position: "absolute",
          left: "6.95%", top: "2.66%",
          width: "86.71%", height: "94.28%",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "8px",
          pointerEvents: "none",
        }}>
          <PauseOverlay visible={hovered} />
        </div>
      </div>
    </div>
  )
}

/* ─── Featured Works ──────────────────────────────────────────────────────── */
export function FeaturedWorks() {
  const { navigate }       = useRouter()
  const sectionRef         = useRef(null)
  const laptopVideoRef     = useRef(null)
  const redditVideoRef     = useRef(null)
  const alpineVideoRef     = useRef(null)
  const [scrollProgress,   setScrollProgress]   = useState(0)
  const [laptopHovered,    setLaptopHovered]     = useState(false)
  const [redditHovered,    setRedditHovered]     = useState(false)
  const [alpineHovered,    setAlpineHovered]     = useState(false)

  /* ── Scroll tracking ── */
  useEffect(() => {
    function handleScroll() {
      if (!sectionRef.current) return
      const rect  = sectionRef.current.getBoundingClientRect()
      const total = sectionRef.current.offsetHeight - window.innerHeight
      if (total <= 0) return
      setScrollProgress(Math.max(0, Math.min(1, -rect.top / total)))
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  /* ── Video playback (scroll-driven + hover-to-pause) ── */
  useEffect(() => {
    const vid = laptopVideoRef.current
    if (!vid) return
    if (scrollProgress >= 0.28 && !laptopHovered) {
      vid.play?.().catch(() => {})
    } else {
      vid.pause?.()
      if (scrollProgress < 0.28) vid.currentTime = 0
    }
  }, [scrollProgress >= 0.28, laptopHovered])

  useEffect(() => {
    const r = redditVideoRef.current
    const a = alpineVideoRef.current
    const shouldPlay = scrollProgress >= 0.55
    if (r) (shouldPlay && !redditHovered) ? r.play?.().catch(() => {}) : (r.pause?.(), (!shouldPlay && (r.currentTime = 0)))
    if (a) (shouldPlay && !alpineHovered) ? a.play?.().catch(() => {}) : (a.pause?.(), (!shouldPlay && (a.currentTime = 0)))
  }, [scrollProgress >= 0.55, redditHovered, alpineHovered])

  /* ── Phase 1: laptop rises (0 → 0.30) ── */
  const riseProgress  = Math.min(1, scrollProgress / 0.30)
  const easedRise     = 1 - Math.pow(1 - riseProgress, 3)
  const laptopY       = (1 - easedRise) * 55 - easedRise * 2
  const laptopScale   = 0.82 + easedRise * 0.18
  const laptopOpacity = Math.min(1, riseProgress * 2.5)

  /* ── Phase 2: phones + strips slide in (0.30 → 0.60) ── */
  const phoneProgress = Math.max(0, Math.min(1, (scrollProgress - 0.30) / 0.30))
  const easedPhone    = 1 - Math.pow(1 - phoneProgress, 3)
  const phoneOpacity  = Math.min(1, phoneProgress * 2.2)
  const phoneScale    = 0.72 + easedPhone * 0.28

  /* ── Phase 3: text + button (0.60 → 0.80) ── */
  const textProgress = Math.max(0, Math.min(1, (scrollProgress - 0.60) / 0.20))
  const easedText    = 1 - Math.pow(1 - textProgress, 2)
  const textOpacity  = easedText
  const textY        = (1 - easedText) * 40

  /* ── "Work" title ── */
  const workIn      = Math.min(1, scrollProgress / 0.12)
  const workOut     = scrollProgress > 0.12 ? Math.max(0, 1 - (scrollProgress - 0.12) / 0.20) : 1
  const workOpacity = workIn * workOut

  /* Phone X offset — positioned flush outside the laptop edges */
  const phoneOffsetCalc = `calc(${easedPhone} * (min(43vw, 410px) + min(10vw, 100px) + 24px))`
  const sharedPhoneTransformY = `translateY(calc(${laptopY}% - 6vh)) scale(${phoneScale})`

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: "350vh" }}
      id="projects"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">

        {/* Glassmorphism background */}
        <div
          className="absolute rounded-3xl border border-white/10"
          style={{
            inset: "16px 0",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.15)",
            zIndex: 0,
          }}
        />

        {/* "Work" title */}
        <h2
          className="absolute top-8 md:top-12 left-8 md:left-12 text-5xl md:text-7xl lg:text-8xl font-bold text-white pointer-events-none font-sans"
          style={{ opacity: workOpacity, zIndex: 2 }}
        >
          Work
        </h2>

        {/* ── STRIP LEFT: Reddit images scroll from center → left edge ─── */}
        <div
          className="absolute pointer-events-none hidden md:block"
          style={{
            opacity: phoneOpacity,
            left: 0,
            right: "50%",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          <StripRow images={REDDIT_SCREENS} direction="left" />
        </div>

        {/* ── STRIP RIGHT: Alpine images scroll from center → right edge ── */}
        <div
          className="absolute pointer-events-none hidden md:block"
          style={{
            opacity: phoneOpacity,
            left: "50%",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 1,
            overflow: "hidden",
          }}
        >
          <StripRow images={ALPINE_SCREENS} direction="right" />
        </div>

        {/* ── LEFT: Reddit phone ────────────────────────────────────────── */}
        <div
          className="absolute hidden md:block"
          style={{
            opacity: phoneOpacity,
            transform: `translateX(calc(-1 * ${phoneOffsetCalc})) ${sharedPhoneTransformY}`,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <PhoneComposite
            videoRef={redditVideoRef}
            videoSrc="/videos/Reddit.mp4"
            hovered={redditHovered}
            onMouseEnter={() => setRedditHovered(true)}
            onMouseLeave={() => setRedditHovered(false)}
          />
        </div>

        {/* ── CENTER: Laptop + Video ────────────────────────────────────── */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "min(86vw, 820px)",
            transform: `translateY(calc(${laptopY}% - 6vh)) scale(${laptopScale})`,
            zIndex: 10,
          }}
        >
          <div style={{ opacity: laptopOpacity }}>
            <div className="relative" style={{ aspectRatio: "1 / 1" }}>
              <video
                ref={laptopVideoRef}
                src="/videos/Video.mp4"
                loop
                muted
                playsInline
                style={{
                  position: "absolute",
                  left: "15.28%", top: "30.93%",
                  width: "69.35%", height: "43.06%",
                  objectFit: "cover",
                  borderRadius: "2px",
                }}
              />
              <img
                src="/images/laptop-frame-keyed.png"
                alt=""
                style={{
                  position: "absolute",
                  inset: 0, width: "100%", height: "100%",
                  objectFit: "contain",
                  filter: "drop-shadow(0 20px 48px rgba(160,80,255,0.45))",
                }}
              />
              {/* Laptop hover area + pause overlay — covers the screen area */}
              <div
                onMouseEnter={() => setLaptopHovered(true)}
                onMouseLeave={() => setLaptopHovered(false)}
                style={{
                  position: "absolute",
                  left: "15.28%", top: "30.93%",
                  width: "69.35%", height: "43.06%",
                  borderRadius: "2px",
                  cursor: "pointer",
                  pointerEvents: "auto",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <PauseOverlay visible={laptopHovered} />
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: AlpineLink phone ───────────────────────────────────── */}
        <div
          className="absolute hidden md:block"
          style={{
            opacity: phoneOpacity,
            transform: `translateX(${phoneOffsetCalc}) ${sharedPhoneTransformY}`,
            zIndex: 5,
            pointerEvents: "none",
          }}
        >
          <PhoneComposite
            videoRef={alpineVideoRef}
            videoSrc="/videos/Alpinelink.mp4"
            hovered={alpineHovered}
            onMouseEnter={() => setAlpineHovered(true)}
            onMouseLeave={() => setAlpineHovered(false)}
          />
        </div>

        {/* ── Text + button ─────────────────────────────────────────────── */}
        <div
          className="absolute bottom-[4vh] md:bottom-[5vh] flex flex-col items-center gap-3"
          style={{ opacity: textOpacity, transform: `translateY(${textY}px)`, zIndex: 20 }}
        >
          <p className="text-white/80 text-base md:text-lg lg:text-xl font-medium italic text-center">
            Explore the Featured Projects
          </p>
          <button
            onClick={() => navigate("projects")}
            className="pill-btn-hover px-8 py-2.5 rounded-full text-sm font-medium text-white/80 cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            All Projects
          </button>
        </div>

      </div>
    </section>
  )
}
