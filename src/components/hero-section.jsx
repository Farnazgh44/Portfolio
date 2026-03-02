import { useState, useEffect, useCallback, useRef } from "react"
import { motion } from "framer-motion"
import { useTheme } from "../lib/theme-context"
import { useRouter } from "../lib/router-context"
import { SplitText } from "./SplitText"

/* ── Blob data ── */
const INITIAL_BLOBS = [
  { id: 0, x: 50, y: 45, w: 320, h: 300, color: "linear-gradient(135deg, #4466ff, #cc33ff, #ff3388)", anim: "blob-float-1", dur: 12 },
  { id: 1, x: 75, y: 15, w: 140, h: 130, color: "linear-gradient(135deg, #6644ff, #ff44aa)", anim: "blob-float-3", dur: 10 },
  { id: 2, x: 85, y: 30, w: 60,  h: 55,  color: "linear-gradient(135deg, #ff5588, #ff88aa)", anim: "blob-float-2", dur: 8  },
  { id: 3, x: 25, y: 65, w: 35,  h: 30,  color: "linear-gradient(135deg, #8855ff, #5588ff)", anim: "blob-float-4", dur: 9  },
  { id: 4, x: 70, y: 75, w: 80,  h: 75,  color: "linear-gradient(135deg, #ff3366, #cc44ff, #5566ff)", anim: "blob-float-5", dur: 11 },
]

/* ── Draggable blob ── */
function DraggableBlob({ blob, containerRef }) {
  const blobRef   = useRef(null)
  const [dragging, setDragging] = useState(false)
  const [pos,      setPos]      = useState({ x: 0, y: 0 })
  const [offset,   setOffset]   = useState({ x: 0, y: 0 })
  const [stretch,  setStretch]  = useState({ scaleX: 1, scaleY: 1, rotate: 0 })
  const prevPos   = useRef({ x: 0, y: 0 })
  const animFrame = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPos({
      x: (blob.x / 100) * rect.width  - blob.w / 2,
      y: (blob.y / 100) * rect.height - blob.h / 2,
    })
  }, [blob, containerRef])

  const handleMouseDown = useCallback((e) => {
    e.preventDefault(); e.stopPropagation()
    setDragging(true)
    const br = blobRef.current.getBoundingClientRect()
    const cr = containerRef.current.getBoundingClientRect()
    setOffset({ x: e.clientX - (br.left - cr.left), y: e.clientY - (br.top - cr.top) })
    prevPos.current = { x: pos.x, y: pos.y }
  }, [pos, containerRef])

  const handleTouchStart = useCallback((e) => {
    e.stopPropagation()
    const t = e.touches[0]
    setDragging(true)
    const br = blobRef.current.getBoundingClientRect()
    const cr = containerRef.current.getBoundingClientRect()
    setOffset({ x: t.clientX - (br.left - cr.left), y: t.clientY - (br.top - cr.top) })
    prevPos.current = { x: pos.x, y: pos.y }
  }, [pos, containerRef])

  useEffect(() => {
    if (!dragging) return
    const move = (cx, cy) => {
      if (animFrame.current) cancelAnimationFrame(animFrame.current)
      animFrame.current = requestAnimationFrame(() => {
        const nx = cx - offset.x, ny = cy - offset.y
        const dx = nx - prevPos.current.x, dy = ny - prevPos.current.y
        const speed = Math.sqrt(dx * dx + dy * dy)
        const angle = Math.atan2(dy, dx) * (180 / Math.PI)
        const s = Math.min(speed * 0.015, 0.4)
        setStretch({ scaleX: 1 + s, scaleY: 1 - s * 0.5, rotate: angle })
        prevPos.current = { x: nx, y: ny }
        setPos({ x: nx, y: ny })
      })
    }
    const onMM = (e) => move(e.clientX, e.clientY)
    const onTM = (e) => { const t = e.touches[0]; move(t.clientX, t.clientY) }
    const onEnd = () => { setDragging(false); setStretch({ scaleX: 1, scaleY: 1, rotate: 0 }) }
    window.addEventListener("mousemove", onMM)
    window.addEventListener("mouseup", onEnd)
    window.addEventListener("touchmove", onTM, { passive: true })
    window.addEventListener("touchend", onEnd)
    return () => {
      window.removeEventListener("mousemove", onMM)
      window.removeEventListener("mouseup", onEnd)
      window.removeEventListener("touchmove", onTM)
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
        width: blob.w, height: blob.h,
        left: pos.x,   top:  pos.y,
        background: blob.color,
        borderRadius: "40% 60% 55% 45% / 55% 45% 60% 40%",
        boxShadow: `0 0 ${blob.w * 0.2}px rgba(150,80,255,0.3)`,
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

/* Desktop blob container — separate ref so blobs size correctly */
function DesktopBlobs() {
  const ref = useRef(null)
  return (
    <div ref={ref} className="absolute inset-0 w-full h-full">
      {INITIAL_BLOBS.map((blob) => (
        <DraggableBlob key={blob.id} blob={blob} containerRef={ref} />
      ))}
    </div>
  )
}

/* ── Hero Section ── */
export function HeroSection() {
  const { theme }   = useTheme()
  const { navigate } = useRouter()
  const blobContainerRef = useRef(null)
  const [showButtons, setShowButtons] = useState(false)

  /* Show buttons after all text has animated in (~3.5 s) */
  useEffect(() => {
    const t = setTimeout(() => setShowButtons(true), 3500)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="relative h-screen flex items-center pt-20 overflow-hidden">

      {/* ── Mobile: blobs float behind text ── */}
      <div
        ref={blobContainerRef}
        className="sm:hidden absolute inset-0 w-full h-full"
        style={{ filter: "url(#gooey)", zIndex: 0 }}
      >
        {INITIAL_BLOBS.map((blob) => (
          <DraggableBlob key={blob.id} blob={blob} containerRef={blobContainerRef} />
        ))}
      </div>

      <div className="content-wrap w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 md:gap-10 lg:gap-16">

        {/* ── Left: animated text ── */}
        <div className="relative z-10 min-w-0 w-full sm:flex-1">

          {/* "Hello, I'm" */}
          <SplitText
            text="Hello, I'm"
            as="p"
            className="text-white/90 text-sm sm:text-base md:text-lg mb-1"
            delay={45}
            baseDelay={300}
            duration={0.9}
            ease="power3.out"
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="0px"
          />

          {/* "Farnaz" */}
          <SplitText
            text="Farnaz"
            as="h1"
            className="font-bold text-white mb-2"
            style={{ fontSize: "clamp(2.2rem, 7vw, 6rem)" }}
            delay={80}
            baseDelay={900}
            duration={1.1}
            ease="power3.out"
            from={{ opacity: 0, y: 50 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="0px"
          />

          {/* "UI/UX & Digital Designer" */}
          <SplitText
            text="UI/UX & Digital Designer"
            as="h2"
            className="text-base sm:text-lg md:text-xl font-semibold text-white/90 mb-3"
            delay={30}
            baseDelay={1600}
            duration={0.85}
            ease="power3.out"
            from={{ opacity: 0, y: 25 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="0px"
          />

          {/* Description — word split so it flows naturally */}
          <SplitText
            text="Based in Vancouver, creating visually engaging and user-centered digital experiences."
            as="p"
            className="text-white/70 text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 max-w-[75%] sm:max-w-md"
            splitType="words"
            delay={60}
            baseDelay={2400}
            duration={0.7}
            ease="power2.out"
            from={{ opacity: 0, y: 18 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin="0px"
          />

          {/* Buttons — fade in after text */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={showButtons ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, ease: [0.215, 0.61, 0.355, 1] }}
            className="flex gap-3 sm:gap-4 flex-wrap"
          >
            <button
              onClick={() => navigate("projects")}
              className="pill-btn-hover px-5 sm:px-8 py-2 sm:py-2.5 rounded-full text-sm font-medium text-white/80"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              View Projects
            </button>
            <button
              onClick={() => navigate("about")}
              className="pill-btn-hover px-5 sm:px-8 py-2 sm:py-2.5 rounded-full text-sm font-medium text-white/80"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              About Me
            </button>
          </motion.div>
        </div>

        {/* ── Right: draggable blobs (desktop/tablet only) ── */}
        <div
          className="hidden sm:block flex-shrink-0 relative sm:flex-1 sm:h-[380px] md:h-[480px] lg:h-[580px]"
          style={{ filter: "url(#gooey)" }}
        >
          <DesktopBlobs />
        </div>

        {/* SVG gooey filter */}
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            <filter id="gooey">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix
                in="blur" type="matrix"
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
