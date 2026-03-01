import { useRef, useEffect, useState } from "react"
import { useRouter } from "../lib/router-context"
import { GlassCard } from "./glass-card"

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

  const titleOpacity =
    scrollProgress < 0.05 ? 0
    : scrollProgress < 0.20 ? (scrollProgress - 0.05) / 0.15
    : scrollProgress < 0.35 ? 1
    : scrollProgress < 0.45 ? 1 - (scrollProgress - 0.35) / 0.1
    : 0

  const convergence =
    scrollProgress < 0.20 ? 0
    : scrollProgress < 0.70 ? (scrollProgress - 0.20) / 0.50
    : 1

  const contentOpacity =
    scrollProgress < 0.20 ? 0
    : scrollProgress < 0.40 ? (scrollProgress - 0.20) / 0.20
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

          {/* "Behind the Design" title */}
          <h2
            className="absolute text-3xl md:text-5xl lg:text-6xl font-bold text-white text-center z-10 pointer-events-none text-balance"
            style={{ opacity: titleOpacity }}
          >
            Behind the design
          </h2>

          {/* Left: About text card
              Width: viewport-relative on xs → fixed px on sm+ → larger on lg  */}
          <div
            style={{
              transform: `translateX(${(1 - convergence) * -120}vw)`,
              opacity: contentOpacity,
              flex: "0 0 auto",
            }}
          >
            <GlassCard
              intensity="medium"
              className="p-3 sm:p-6 md:p-8
                         w-[43vw] sm:w-[280px] md:w-[340px] lg:w-[420px]
                         h-[68vw] sm:h-[320px] md:h-[380px] lg:h-[440px]
                         flex flex-col justify-between"
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
              <div className="mt-1 sm:mt-4 flex-shrink-0">
                <button
                  onClick={() => navigate("about")}
                  className="pill-btn-hover inline-block px-3 sm:px-8 py-1 sm:py-2.5 rounded-full text-[9px] sm:text-sm font-medium text-white/80 cursor-pointer"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                  }}
                >
                  About me
                </button>
              </div>
            </GlassCard>
          </div>

          {/* Gap between cards */}
          <div className="w-2 sm:w-4 md:w-8 flex-shrink-0" />

          {/* Right: Photo card */}
          <div
            style={{
              transform: `translateX(${(1 - convergence) * 120}vw)`,
              opacity: contentOpacity,
              flex: "0 0 auto",
            }}
          >
            <GlassCard
              intensity="light"
              className="overflow-hidden
                         w-[43vw] sm:w-[280px] md:w-[340px] lg:w-[420px]
                         h-[68vw] sm:h-[320px] md:h-[380px] lg:h-[440px]"
            >
              <img
                src="/images/about-portrait.png"
                alt="Portrait of Farnaz"
                className="w-full h-full object-cover"
              />
            </GlassCard>
          </div>
        </div>
      </div>
    </section>
  )
}
