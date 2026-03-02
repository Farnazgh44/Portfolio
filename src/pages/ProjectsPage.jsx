import { useState, useRef, useEffect } from "react"
import { useRouter } from "../lib/router-context"
import { Footer } from "../components/footer"
import { SideBlobs } from "../components/side-blobs"
import { LogoLoop } from "../components/LogoLoop"

/* ─── Tool icon mapping (reuses toolkit images from About page) ─── */
const TOOL_ICONS = {
  Figma: "/images/toolkit-figma.png",
  Photoshop: "/images/toolkit-photoshop.png",
  Illustrator: "/images/toolkit-illustrator.png",
  InDesign: "/images/toolkit-indesign.png",
  "After Effects": "/images/toolkit-aftereffects.png",
  Canva: "/images/toolkit-canva.png",
  "VS Code": "/images/toolkit-vscode.png",
  Dimension: "/images/toolkit-dimension.png",
  Tinkercad: "/images/toolkit-tinkercad.png",
  Maze: "/images/toolkit-maze.png",
}

/* ─── Showcase project data ─── */
const SHOWCASE_PROJECTS = [
  {
    id: "sugarcloud",
    name: "SugarCloud Cupcakes",
    category: "UI/UX Project",
    label: "Web Design",
    tools: ["Figma", "Photoshop", "Illustrator"],
    desc: "A sweet and modern e-commerce website for a premium cupcake bakery brand.",
    image: "/images/mockup-cupcake-laptop.png",
  },
  {
    id: "alpine",
    name: "Alpine Links",
    category: "UI/UX Project",
    label: "UI/UX Design",
    tools: ["Figma", "After Effects"],
    desc: "A hiking and outdoor adventure companion app with real-time trail information.",
    image: "/images/mockup-alpinelink-phone.png",
  },
  {
    id: "reddit",
    name: "Reddit Redesign",
    category: "UI/UX Project",
    label: "UI/UX Design",
    tools: ["Figma", "Photoshop"],
    desc: "A fresh visual redesign of Reddit focused on readability and modern aesthetics.",
    image: "/images/mockup-reddit-phone.png",
  },
  {
    id: "craigslist",
    name: "Craigslist Redesign",
    category: "UI/UX Project",
    label: "Web Design",
    tools: ["Figma", "Illustrator"],
    desc: "A complete UX overhaul bringing Craigslist into the modern design era.",
    image: "/images/mockup-craigslist-imac.png",
  },
  {
    id: "phone-holder",
    name: "Phone Holder",
    category: "Digital Design",
    label: "Digital Design",
    tools: ["Tinkercad"],
    desc: "A custom 3D-printed phone holder designed in Tinkercad.",
    image: "/images/project-phoneholder-pro.png",
  },
  {
    id: "lighthouse",
    name: "3D Lighthouse",
    category: "Digital Design",
    label: "Digital Design",
    tools: ["Dimension"],
    desc: "A detailed 3D lighthouse scene created with Adobe Dimension.",
    image: "/images/project-lighthouse-pro.png",
  },
  {
    id: "seattle",
    name: "Seattle Illustration",
    category: "Digital Design",
    label: "Digital Design",
    tools: ["Illustrator"],
    desc: "A stylized vector illustration of Seattle's iconic skyline.",
    image: "/images/project-seattle-pro.png",
  },
]

const FILTERS = [
  { label: "All", value: "all" },
  { label: "UI/UX", value: "UI/UX Project" },
  { label: "Digital Design", value: "Digital Design" },
]

/* ─── Blob helpers ─── */
const COLORS = [
  "#f472b6", "#fb923c", "#34d399", "#38bdf8",
  "#a78bfa", "#f9a8d4", "#6ee7b7", "#fbbf24",
]

function lerp(a, b, t) { return a + (b - a) * t }
function lerpAngle(a, b, t) {
  const d = ((b - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI
  return a + d * t
}

function buildBlobPath(cx, cy, rx, ry, phase, wobble, rotation) {
  const pts = 18
  const cosR = Math.cos(rotation)
  const sinR = Math.sin(rotation)
  const coords = []
  for (let i = 0; i < pts; i++) {
    const angle = (i / pts) * Math.PI * 2
    const r1 = 1 + wobble * 0.35 * Math.sin(2 * angle + phase * 1.3)
    const r2 = 1 + wobble * 0.22 * Math.sin(3 * angle - phase * 0.9)
    const r3 = 1 + wobble * 0.15 * Math.sin(5 * angle + phase * 0.6)
    const rFactor = r1 * r2 * r3
    const lx = rx * rFactor * Math.cos(angle)
    const ly = ry * rFactor * Math.sin(angle)
    coords.push([
      cx + lx * cosR - ly * sinR,
      cy + lx * sinR + ly * cosR,
    ])
  }
  const n = coords.length
  let d = ""
  for (let i = 0; i < n; i++) {
    const p0 = coords[(i - 1 + n) % n]
    const p1 = coords[i]
    const p2 = coords[(i + 1) % n]
    const p3 = coords[(i + 2) % n]
    if (i === 0) d += `M ${p1[0].toFixed(1)},${p1[1].toFixed(1)} `
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6
    d += `C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)} `
  }
  return d + "Z"
}

/* ─── Stacked auto-blob hero text: "Scroll" / "To" / "Browse Projects" ─── */
function HeroBlobText({ filter, setFilter }) {
  const containerRef = useRef(null)
  const letterRefs = useRef([])
  const pathRefs = useRef([])
  const blobState = useRef([])
  const colorIdx = useRef(0)
  const rafId = useRef(null)
  const autoAnimDone = useRef(false)
  const [ready, setReady] = useState(false)

  // Each line of text, split by letter
  const lines = ["Scroll", "To", "Browse Projects"]
  const allLetters = lines.flatMap((line) => line.split("").filter((ch) => ch !== " "))
  const totalUnits = allLetters.length

  useEffect(() => {
    if (totalUnits === 0) return

    blobState.current = Array.from({ length: totalUnits }, (_, i) => ({
      curX: -999, curY: -999, curRx: 0, curRy: 0,
      tarX: -999, tarY: -999, tarRx: 0, tarRy: 0,
      phase: Math.random() * Math.PI * 2,
      wobble: 0, tarWobble: 0,
      rotation: 0, tarRotation: Math.random() * Math.PI * 2,
      color: COLORS[i % COLORS.length],
      visible: false,
    }))

    function animate() {
      blobState.current.forEach((b, i) => {
        b.phase += 0.045
        b.curX = lerp(b.curX, b.tarX, 0.14)
        b.curY = lerp(b.curY, b.tarY, 0.14)
        b.curRx = lerp(b.curRx, b.tarRx, 0.10)
        b.curRy = lerp(b.curRy, b.tarRy, 0.10)
        b.wobble = lerp(b.wobble, b.tarWobble, 0.08)
        b.rotation = lerpAngle(b.rotation, b.tarRotation, 0.07)

        const pathEl = pathRefs.current[i]
        if (!pathEl) return

        if (b.curRx < 0.5) {
          pathEl.setAttribute("d", "")
          return
        }
        pathEl.setAttribute(
          "d",
          buildBlobPath(b.curX, b.curY, b.curRx, b.curRy, b.phase, b.wobble, b.rotation)
        )
      })
      rafId.current = requestAnimationFrame(animate)
    }

    rafId.current = requestAnimationFrame(animate)
    setReady(true)
    return () => cancelAnimationFrame(rafId.current)
  }, [totalUnits])

  // Auto-animate on mount: sequentially blob each letter
  useEffect(() => {
    if (!ready || autoAnimDone.current) return
    const timers = []
    allLetters.forEach((_, i) => {
      const showTimer = setTimeout(() => showBlob(i), i * 60)
      timers.push(showTimer)
      const hideTimer = setTimeout(() => {
        hideBlob(i)
        if (i === allLetters.length - 1) autoAnimDone.current = true
      }, i * 60 + 400)
      timers.push(hideTimer)
    })
    return () => timers.forEach(clearTimeout)
  }, [ready])

  function showBlob(i) {
    const span = letterRefs.current[i]
    const container = containerRef.current
    if (!span || !container) return
    const b = blobState.current[i]
    if (!b) return
    const r = span.getBoundingClientRect()
    const cr = container.getBoundingClientRect()
    const cx = r.left - cr.left + r.width / 2
    const cy = r.top - cr.top + r.height / 2

    if (!b.visible) {
      b.curX = cx; b.curY = cy
      b.curRx = r.width * 0.3; b.curRy = r.height * 0.3
    }

    b.tarX = cx; b.tarY = cy
    b.tarRx = r.width * 0.82
    b.tarRy = r.height * 0.68
    b.tarWobble = 1
    b.tarRotation = b.rotation + (Math.random() * Math.PI - Math.PI / 2)

    b.color = COLORS[colorIdx.current % COLORS.length]
    colorIdx.current++
    if (pathRefs.current[i]) pathRefs.current[i].setAttribute("fill", b.color)
    b.visible = true
  }

  function hideBlob(i) {
    const b = blobState.current[i]
    if (!b) return
    b.tarRx = 0; b.tarRy = 0
    b.tarWobble = 0; b.visible = false
  }

  // Build letter spans per line
  let unitIdx = 0
  const renderedLines = lines.map((line, lineIdx) => {
    const chars = line.split("").map((ch, charIdx) => {
      if (ch === " ") {
        return (
          <span key={`s-${lineIdx}-${charIdx}`} className="inline-block w-[0.25em]">
            {"\u00A0"}
          </span>
        )
      }
      const capturedIdx = unitIdx
      unitIdx++
      return (
        <span
          key={`l-${lineIdx}-${charIdx}`}
          className="inline-block relative"
          style={{ zIndex: 10 }}
          data-blob-text-letter
          ref={(el) => { letterRefs.current[capturedIdx] = el }}
          onMouseEnter={() => showBlob(capturedIdx)}
          onMouseLeave={() => hideBlob(capturedIdx)}
        >
          {ch}
        </span>
      )
    })

    return (
      <h1
        key={lineIdx}
        className="text-white text-4xl md:text-6xl lg:text-7xl font-bold leading-none whitespace-nowrap"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {chars}
      </h1>
    )
  })

  return (
    <div className="text-left max-w-4xl px-6 md:px-16 lg:px-24 pt-28 pb-0">
      <div ref={containerRef} className="relative">
        {/* Blob SVG layer */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full"
          style={{ zIndex: 5, overflow: "visible" }}
        >
          <defs>
            <filter id="goo-projects" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
                result="goo"
              />
            </filter>
          </defs>
          <g filter="url(#goo-projects)">
            {Array.from({ length: totalUnits }).map((_, i) => (
              <path
                key={i}
                ref={(el) => { pathRefs.current[i] = el }}
                fill={COLORS[i % COLORS.length]}
              />
            ))}
          </g>
        </svg>

        {/* Stacked lines */}
        <div className="flex flex-col gap-1">
          {renderedLines}
        </div>
      </div>

      {/* Filter buttons -- more spacing from title */}
      <div className="flex gap-3 flex-wrap mt-12">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="pill-btn-hover px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer"
            style={{
              background: filter === f.value ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)",
              color: filter === f.value ? "white" : "rgba(255,255,255,0.6)",
              border: `1px solid ${filter === f.value ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.12)"}`,
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Tool Icon Boxes — LogoLoop with blob hover ─── */
function ToolIcons({ tools }) {
  /* Build logos array from tool names (repeat to ensure seamless loop) */
  const logos = tools.map((name) => ({ name, image: TOOL_ICONS[name] || null }))

  return (
    <div className="w-full overflow-visible" style={{ minHeight: 52 }}>
      <LogoLoop
        logos={logos}
        speed={tools.length <= 2 ? 8 : tools.length <= 3 ? 12 : 18}
        logoSize={38}
        gap={8}
        fadeOut={false}
        renderItem={(logo, isHovered) => (
          <div
            className="w-full h-full rounded-lg flex items-center justify-center relative"
            style={{
              background: isHovered
                ? "rgba(160,100,255,0.25)"
                : "rgba(255,255,255,0.10)",
              backdropFilter: "blur(12px)",
              border: `1px solid ${isHovered ? "rgba(160,100,255,0.5)" : "rgba(255,255,255,0.15)"}`,
              transition: "background 0.3s ease, border-color 0.3s ease",
            }}
          >
            {logo.image ? (
              <img
                src={logo.image}
                alt={logo.name}
                className="w-[65%] h-[65%] object-contain"
                style={{
                  filter: isHovered ? "brightness(1.2) drop-shadow(0 0 4px rgba(180,100,255,0.6))" : "none",
                  transition: "filter 0.3s ease",
                }}
              />
            ) : (
              <span className="text-white/60 text-[9px] font-medium">{logo.name.slice(0, 2)}</span>
            )}
          </div>
        )}
      />
    </div>
  )
}

/* ─── Scroll-Driven Project Showcase (horizontal, no rise) ─── */
function ProjectShowcase({ projects }) {
  const { navigate } = useRouter()
  const sectionRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const numProjects = projects.length

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
  }, [numProjects])

  // Horizontal cycling (full range, no rise phase)
  const cycleEnd = 0.92
  const cycleProgress = Math.min(1, scrollProgress / cycleEnd)

  const currentProjectFloat = cycleProgress * (numProjects - 1)
  const currentProject = Math.min(
    Math.round(currentProjectFloat),
    numProjects - 1
  )

  return (
    <section
      ref={sectionRef}
      className="relative w-full mt-16"
      style={{ height: `${Math.max(300, numProjects * 100 + 50)}vh` }}
    >
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        {/* Full-screen glass box */}
        <div
          className="absolute rounded-3xl border border-white/15 shadow-lg overflow-hidden"
          style={{
            inset: "16px 0",
            background: "rgba(255, 255, 255, 0.10)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            boxShadow:
              "inset 0 1px 0 0 rgba(255,255,255,0.12), 0 8px 32px rgba(0,0,0,0.25)",
          }}
        >
          {/* Layout: left text, right images */}
          <div className="relative w-full h-full flex">
            {/* LEFT: project text info
                Mobile:  48% wide, compact padding + smaller type
                Desktop: 32-35% wide, generous padding + full type  */}
            <div className="relative flex flex-col justify-center w-[48%] md:w-[35%] lg:w-[32%] px-3 md:px-10 lg:px-14 z-10">
              {projects.map((project, i) => {
                const projectShare = 1 / (numProjects - 1 || 1)
                const projectCenter = i * projectShare
                const dist = Math.abs(cycleProgress - projectCenter)
                const opacity = Math.max(0, 1 - dist / (projectShare * 0.5))

                const direction = cycleProgress - projectCenter
                const textOffsetY =
                  direction < 0
                    ? Math.min(40, Math.abs(direction) * 100)
                    : direction > 0
                      ? Math.max(-40, -direction * 100)
                      : 0

                return (
                  <div
                    key={project.id}
                    className="absolute left-0 right-0 px-3 md:px-10 lg:px-14"
                    style={{
                      opacity: Math.max(0, Math.min(1, opacity)),
                      transform: `translateY(${textOffsetY}px)`,
                      transition: "opacity 0.35s ease, transform 0.35s ease",
                      pointerEvents: currentProject === i ? "auto" : "none",
                    }}
                  >
                    <p className="text-white/50 text-[10px] md:text-sm uppercase tracking-widest mb-3 md:mb-2">
                      {project.label}
                    </p>
                    <h3 className="text-white text-sm sm:text-xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-3 text-balance">
                      {project.name}
                    </h3>
                    {/* Description hidden on very small screens to keep layout clean */}
                    <p className="hidden sm:block text-white/60 text-sm md:text-base leading-relaxed mb-3 md:mb-4 max-w-xs">
                      {project.desc}
                    </p>
                    {/* Tool icons */}
                    <div className="mb-5 md:mb-5">
                      <ToolIcons tools={project.tools} />
                    </div>
                    <button
                      onClick={() => navigate(project.viewHref || "#")}
                      className="pill-btn-hover px-4 sm:px-7 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium text-white/80 cursor-pointer"
                      style={{
                        background: "rgba(255,255,255,0.12)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                      }}
                    >
                      View Project
                    </button>
                  </div>
                )
              })}
            </div>

            {/* RIGHT: project images -- horizontal slide, no rise */}
            <div className="relative flex-1 overflow-hidden">
              {projects.map((project, i) => {
                const projectShare = 1 / (numProjects - 1 || 1)
                const projectCenter = i * projectShare
                const dist = cycleProgress - projectCenter

                let translateX = 0
                if (dist < 0) {
                  // Next project: push far off to the right
                  translateX = Math.min(150, Math.abs(dist) * 600)
                } else if (dist > 0) {
                  // Previous project: push far off to the left
                  translateX = Math.max(-150, -dist * 600)
                }
                const absDist = Math.abs(dist)
                const isVisible = absDist < projectShare * 0.7

                return (
                  <div
                    key={project.id}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                      opacity: isVisible ? 1 : 0,
                      transform: `translateX(${translateX}%)`,
                      transition: "transform 0.35s ease, opacity 0.2s ease",
                      zIndex: currentProject === i ? 10 : 1,
                    }}
                  >
                    <img
                      src={project.image}
                      alt={project.name}
                      className="object-contain max-h-[80vh] max-w-[90%] drop-shadow-2xl"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Progress dots — bottom-center horizontal on mobile, right-side vertical on desktop */}
        {/* Mobile */}
        <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-row gap-2 z-30">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className="rounded-full transition-all duration-300"
              style={{
                height: 7,
                width: currentProject === i ? 24 : 7,
                background: currentProject === i ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>
        {/* Desktop */}
        <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col gap-2.5 z-30">
          {projects.map((project, i) => (
            <div
              key={project.id}
              className="rounded-full transition-all duration-300"
              style={{
                width: 8,
                height: currentProject === i ? 28 : 8,
                background: currentProject === i ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Floating Rocket ─── */
function FloatingRocket() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    function handleScroll() { setScrollY(window.scrollY) }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const yOffset = Math.sin(scrollY * 0.003) * 30
  const rotation = Math.sin(scrollY * 0.002) * 8

  return (
    <div className="relative py-20 flex items-center justify-center overflow-hidden">
      <div
        className="absolute w-48 h-48 opacity-25 blur-[60px] pointer-events-none"
        style={{ top: "10%", left: "10%", background: "var(--blob-1)", borderRadius: "50% 40% 60% 50%", animation: "blob-float-3 22s ease-in-out infinite" }}
      />
      <div
        className="absolute w-40 h-40 opacity-20 blur-[50px] pointer-events-none"
        style={{ bottom: "15%", right: "15%", background: "var(--blob-4)", borderRadius: "40% 60% 50% 50%", animation: "blob-float-5 25s ease-in-out infinite" }}
      />
      <img
        src="/images/rocket-3d.jpg"
        alt="3D Rocket ship"
        className="w-48 md:w-64 lg:w-72 h-auto object-contain drop-shadow-2xl relative z-10"
        style={{ transform: `translateY(${yOffset}px) rotate(${rotation}deg)`, transition: "transform 0.15s ease-out" }}
      />
    </div>
  )
}

/* ─── Main Projects Page ─── */
export function ProjectsPage() {
  const [filter, setFilter] = useState("all")

  const filteredProjects = filter === "all"
    ? SHOWCASE_PROJECTS
    : SHOWCASE_PROJECTS.filter((p) => p.category === filter)

  return (
    <>
      <main>
        <SideBlobs />

        {/* Hero: Stacked blob text + filter buttons */}
        <HeroBlobText filter={filter} setFilter={setFilter} />

        {/* Scroll-driven project showcase */}
        <ProjectShowcase projects={filteredProjects} />

        {/* Rocket removed */}
      </main>
      <Footer />
    </>
  )
}
