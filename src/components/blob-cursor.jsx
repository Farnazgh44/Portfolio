import { useEffect, useRef, useCallback } from "react"
import { useTheme } from "../lib/theme-context"

/** Cursor colour per theme — bright pastels for contrast against dark backgrounds */
const CURSOR_COLORS = {
  pink:   "#f0abfc",  // light violet-pink
  blue:   "#93c5fd",  // sky blue
  green:  "#86efac",  // mint green
  orange: "#fde68a",  // light amber
}

/**
 * Solid-colour blob cursor that stretches on movement.
 * - Colour follows the active theme (bright pastel that pops against the dark bg)
 * - Hides itself over interactive / text elements so the native cursor shows
 * - I-beam on text is CSS-driven (globals.css), so it's pixel-accurate to the
 *   element bounding box — NOT spread to the whole page via body.style.cursor
 */
export function BlobCursor({ size = 14 }) {
  const canvasRef  = useRef(null)
  const mouse      = useRef({ x: -100, y: -100 })
  const pos        = useRef({ x: -100, y: -100 })
  const visible    = useRef(true)
  const animFrame  = useRef(null)

  const { themeName } = useTheme()
  const color = CURSOR_COLORS[themeName] ?? CURSOR_COLORS.pink

  // Keep a ref so the RAF loop always reads the latest colour without restarting
  const colorRef = useRef(color)
  useEffect(() => { colorRef.current = color }, [color])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")

    const prevX = pos.current.x
    const prevY = pos.current.y
    // 0.28 lerp = noticeably faster / more responsive than the old 0.18
    pos.current.x += (mouse.current.x - pos.current.x) * 0.28
    pos.current.y += (mouse.current.y - pos.current.y) * 0.28

    const dx      = pos.current.x - prevX
    const dy      = pos.current.y - prevY
    const speed   = Math.sqrt(dx * dx + dy * dy)
    const angle   = Math.atan2(dy, dx)
    const stretch = Math.min(speed * 0.08, 0.7)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (visible.current) {
      ctx.save()
      ctx.translate(pos.current.x, pos.current.y)
      ctx.rotate(angle)
      ctx.scale(1 + stretch, 1 - stretch * 0.35)

      // Subtle white glow so the blob pops against any background colour
      ctx.shadowColor = "rgba(255, 255, 255, 0.28)"
      ctx.shadowBlur  = 10

      ctx.beginPath()
      ctx.arc(0, 0, size, 0, Math.PI * 2)
      ctx.fillStyle = colorRef.current
      ctx.fill()

      // Tiny specular highlight for depth
      ctx.shadowBlur = 0
      ctx.beginPath()
      ctx.arc(-size * 0.25, -size * 0.25, size * 0.25, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255,255,255,0.4)"
      ctx.fill()

      ctx.restore()
    }

    animFrame.current = requestAnimationFrame(draw)
  }, [size])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Only activate on pointer (mouse) devices — skip touch screens
    if (!window.matchMedia("(pointer: fine)").matches) return

    function resize() {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    function onMouseMove(e) {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    window.addEventListener("mousemove", onMouseMove)

    // Elements where the blob should hide so the native cursor takes over.
    // Text elements are included so the CSS I-beam shows cleanly.
    //
    // IMPORTANT: we intentionally do NOT set document.body.style.cursor here.
    // Setting body.style.cursor = "text" via JS is an inline style that spreads
    // the I-beam cursor to the ENTIRE PAGE (body inherits to all children without
    // their own cursor rule). Instead, globals.css declares cursor: text directly
    // on text elements — that rule is element-bound and pixel-accurate.
    const INTERACTIVE =
      "a, button, input, textarea, select, [role='button'], " +
      "h1, h2, h3, h4, h5, h6, p, li, blockquote"

    function onMouseOver(e) {
      if (e.target.closest(INTERACTIVE)) {
        visible.current = false
      }
    }

    function onMouseOut(e) {
      if (e.target.closest(INTERACTIVE)) {
        visible.current = true
      }
    }

    document.addEventListener("mouseover", onMouseOver)
    document.addEventListener("mouseout",  onMouseOut)

    animFrame.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener("resize",    resize)
      window.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseover", onMouseOver)
      document.removeEventListener("mouseout",  onMouseOut)
      if (animFrame.current) cancelAnimationFrame(animFrame.current)
      // Clear any inline body cursor style left by older code versions
      document.body.style.cursor = ""
    }
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[999] pointer-events-none"
    />
  )
}
