import { useState, useEffect, useCallback, useRef } from "react"
import { useTheme } from "../lib/theme-context"
import { useRouter } from "../lib/router-context"

function useTypingEffect(text, speed = 40, delay = 0) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(delayTimer)
  }, [delay])

  useEffect(() => {
    if (!started) return
    if (displayed.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayed(text.slice(0, displayed.length + 1))
      }, speed)
      return () => clearTimeout(timer)
    } else {
      setDone(true)
    }
  }, [displayed, text, speed, started])

  return { displayed, done }
}

const INITIAL_BLOBS = [
  { id: 0, x: 50, y: 45, w: 320, h: 300, color: "linear-gradient(135deg, #4466ff, #cc33ff, #ff3388)", anim: "blob-float-1", dur: 12 },
  { id: 1, x: 75, y: 15, w: 140, h: 130, color: "linear-gradient(135deg, #6644ff, #ff44aa)", anim: "blob-float-3", dur: 10 },
  { id: 2, x: 85, y: 30, w: 60, h: 55, color: "linear-gradient(135deg, #ff5588, #ff88aa)", anim: "blob-float-2", dur: 8 },
  { id: 3, x: 25, y: 65, w: 35, h: 30, color: "linear-gradient(135deg, #8855ff, #5588ff)", anim: "blob-float-4", dur: 9 },
  { id: 4, x: 70, y: 75, w: 80, h: 75, color: "linear-gradient(135deg, #ff3366, #cc44ff, #5566ff)", anim: "blob-float-5", dur: 11 },
]

function DraggableBlob({ blob, containerRef }) {
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
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }

    const onEnd = () => {
      setDragging(false)
      setStretch({ scaleX: 1, scaleY: 1, rotate: 0 })
    }

    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onEnd)
    window.addEventListener("touchmove", onTouchMove, { passive: true })
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
        boxShadow: `0 0 ${blob.w * 0.2}px rgba(150, 80, 255, 0.3)`,
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
  const ref = useRef(null)
  return (
    <div ref={ref} className="absolute inset-0 w-full h-full">
      {INITIAL_BLOBS.map((blob) => (
        <DraggableBlob key={blob.id} blob={blob} containerRef={ref} />
      ))}
    </div>
  )
}

export function HeroSection() {
  const { theme } = useTheme()
  const { navigate } = useRouter()
  const blobContainerRef = useRef(null)

  const line1 = useTypingEffect("Hello, I'm", 50, 300)
  const line2 = useTypingEffect("Farnaz", 60, 900)
  const line3 = useTypingEffect("UI/UX & Digital Designer", 35, 1600)
  const line4 = useTypingEffect(
    "Based in Vancouver, creating visually engaging and user-centered digital experiences.",
    20,
    2600
  )
  const [showButtons, setShowButtons] = useState(false)

  useEffect(() => {
    if (line4.done) {
      const timer = setTimeout(() => setShowButtons(true), 200)
      return () => clearTimeout(timer)
    }
  }, [line4.done])

  return (
    <section className="relative h-screen flex items-center pt-20 overflow-hidden">

      {/* ── Mobile only: blobs float freely behind text as full-section background ── */}
      <div
        ref={blobContainerRef}
        className="sm:hidden absolute inset-0 w-full h-full"
        style={{ filter: "url(#gooey)", zIndex: 0 }}
      >
        {INITIAL_BLOBS.map((blob) => (
          <DraggableBlob key={blob.id} blob={blob} containerRef={blobContainerRef} />
        ))}
      </div>

      {/* content-wrap constrains inner content to max 1080px; section bg stays full-bleed */}
      <div className="content-wrap w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 md:gap-10 lg:gap-16">

        {/* Left: Text content — full width on mobile so it aligns with the navbar logo */}
        <div className="relative z-10 min-w-0 w-full sm:flex-1">
          <p className="text-white/90 text-sm sm:text-base md:text-lg mb-1 min-h-[1.5em]">
            {line1.displayed}
            {!line1.done && <span className="typing-cursor" />}
          </p>
          {/* Responsive headline: clamp scales smoothly from mobile → 4K */}
          <h1
            className="font-bold text-white mb-2 min-h-[1.2em]"
            style={{ fontSize: "clamp(2.2rem, 7vw, 6rem)" }}
          >
            {line2.displayed}
            {line1.done && !line2.done && <span className="typing-cursor" />}
          </h1>
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white/90 mb-3 min-h-[1.5em]">
            {line3.displayed}
            {line2.done && !line3.done && <span className="typing-cursor" />}
          </h2>
          <p className="text-white/70 text-xs sm:text-sm md:text-base leading-relaxed mb-6 sm:mb-8 min-h-[3em] max-w-[75%] sm:max-w-md">
            {line4.displayed}
            {line3.done && !line4.done && <span className="typing-cursor" />}
          </p>
          <div
            className={`flex gap-3 sm:gap-4 flex-wrap transition-all duration-700 ${
              showButtons ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
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
          </div>
        </div>

        {/* Right: Draggable interactive lava blobs — desktop/tablet only (sm+) */}
        <div
          className="hidden sm:block flex-shrink-0 relative
                     sm:flex-1 sm:h-[380px]
                     md:h-[480px] lg:h-[580px]"
          style={{ filter: "url(#gooey)" }}
        >
          {/* We render a separate desktop blob container; mobile uses the absolute one above */}
          <DesktopBlobs />
        </div>

        {/* SVG gooey filter for blob merging effect */}
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
