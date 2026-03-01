import { useRef, useEffect, useState } from "react"
import { useRouter } from "../lib/router-context"

/* ─── Featured Works ───
   Glass box fills the viewport.
   Phase 1 (0 - 0.30): Laptop rises from below the glass box to the center.
   Phase 2 (0.30 - 0.60): LeftSide (Reddit composite) slides out from behind
     laptop to the left; RightSide (Alpine composite) slides out to the right.
   Phase 3 (0.60 - 0.80): "Explore the Featured Projects" + "All Projects" button
     fades in from below.
   ─── */

export function FeaturedWorks() {
  const { navigate } = useRouter()
  const sectionRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    function handleScroll() {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const sectionHeight = sectionRef.current.offsetHeight - window.innerHeight
      if (sectionHeight <= 0) return
      const scrolled = -rect.top
      const progress = Math.max(0, Math.min(1, scrolled / sectionHeight))
      setScrollProgress(progress)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  /* ── Phase 1: Laptop rises (0 -> 0.30) ── */
  const riseEnd = 0.30
  const riseProgress = Math.min(1, scrollProgress / riseEnd)
  const easedRise = 1 - Math.pow(1 - riseProgress, 3)

  // Laptop starts at translateY(50%) (half visible at bottom), rises to slightly above center
  const laptopY = (1 - easedRise) * 50 - easedRise * 3
  const laptopScale = 0.9 + easedRise * 0.1
  const laptopOpacity = 1 // always visible once section is in view

  /* ── Phase 2: Side mockups slide out (0.30 -> 0.60) ── */
  const phoneStart = 0.30
  const phoneEnd = 0.60
  const phoneProgress =
    scrollProgress < phoneStart ? 0
    : scrollProgress > phoneEnd ? 1
    : (scrollProgress - phoneStart) / (phoneEnd - phoneStart)
  const easedPhone = 1 - Math.pow(1 - phoneProgress, 2)

  // Left side (Reddit) slides to the left to cover screen edge
  const leftX = easedPhone * -58
  const leftY = easedPhone * -3
  const leftScale = 0.3 + easedPhone * 0.55

  // Right side (Alpine) slides to the right to cover screen edge
  const rightX = easedPhone * 58
  const rightY = easedPhone * -3
  const rightScale = 0.3 + easedPhone * 0.55

  const sideOpacity = Math.min(1, phoneProgress * 2.5)

  /* ── Phase 3: Text + button fade in (0.60 -> 0.80) ── */
  const textStart = 0.60
  const textEnd = 0.80
  const textProgress =
    scrollProgress < textStart ? 0
    : scrollProgress > textEnd ? 1
    : (scrollProgress - textStart) / (textEnd - textStart)
  const easedText = 1 - Math.pow(1 - textProgress, 2)
  const textOpacity = easedText
  const textY = (1 - easedText) * 40

  /* ── "Work" title: smooth fade in at start, smooth fade out as laptop rises ── */
  const workFadeIn = Math.min(1, scrollProgress / 0.12)
  const workFadeOut = scrollProgress > 0.12 ? Math.max(0, 1 - (scrollProgress - 0.12) / 0.20) : 1
  const workOpacity = workFadeIn * workFadeOut

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: "350vh", marginTop: 0 }}
      id="projects"
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Glassmorphism box */}
        <div
          className="absolute rounded-3xl border border-white/15 shadow-lg overflow-hidden"
          style={{
            inset: "16px 0",
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow:
              "inset 0 1px 0 0 rgba(255,255,255,0.10), 0 8px 32px rgba(0,0,0,0.20)",
          }}
        >
          {/* Everything happens inside the glass box */}
          <div className="relative w-full h-full flex items-center justify-center">

            {/* "Work" title at top -- same size as "Farnaz", fades in then out */}
            <h2
              className="absolute top-8 md:top-12 left-8 md:left-12 text-5xl md:text-7xl lg:text-8xl font-bold text-white z-20 pointer-events-none font-sans"
              style={{
                opacity: workOpacity,
                transition: "opacity 0.3s ease",
              }}
            >
              Work
            </h2>

            {/* LeftSide Reddit composite -- starts behind laptop, slides left */}
            <div
              className="absolute pointer-events-none z-[5]"
              style={{
                opacity: sideOpacity,
                transform: `translate(${leftX}%, ${leftY}%) scale(${leftScale})`,
                transition: "none",
              }}
            >
              <img
                src="/images/mockup-leftside-reddit.png"
                alt="Reddit Redesign screens"
                className="h-[38vh] sm:h-[50vh] md:h-[65vh] lg:h-[72vh] object-contain drop-shadow-2xl"
              />
            </div>

            {/* RightSide Alpine composite -- starts behind laptop, slides right */}
            <div
              className="absolute pointer-events-none z-[5]"
              style={{
                opacity: sideOpacity,
                transform: `translate(${rightX}%, ${rightY}%) scale(${rightScale})`,
                transition: "none",
              }}
            >
              <img
                src="/images/mockup-rightside-alpine.png"
                alt="AlpineLink screens"
                className="h-[38vh] sm:h-[50vh] md:h-[65vh] lg:h-[72vh] object-contain drop-shadow-2xl"
              />
            </div>

            {/* Laptop (center) -- rises from below the glass box */}
            <div
              className="relative z-10 pointer-events-none"
              style={{
                opacity: laptopOpacity,
                transform: `translateY(${laptopY}%) scale(${laptopScale})`,
                transition: "none",
              }}
            >
              <img
                src="/images/mockup-cupcake-laptop.png"
                alt="SugarCloud Cupcakes"
                className="h-[45vh] sm:h-[58vh] md:h-[75vh] lg:h-[85vh] object-contain drop-shadow-2xl"
              />
            </div>

            {/* "Explore the Featured Projects" + All Projects button */}
            <div
              className="absolute bottom-[4vh] md:bottom-[5vh] flex flex-col items-center gap-3 z-20"
              style={{
                opacity: textOpacity,
                transform: `translateY(${textY}px)`,
                transition: "none",
              }}
            >
              <p
                className="text-white/80 text-base md:text-lg lg:text-xl font-medium italic text-center"
              >
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
        </div>
      </div>
    </section>
  )
}
