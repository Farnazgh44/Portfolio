import { useRef, useEffect } from "react"

/**
 * ChromaGrid
 *
 * Canvas-based proximity spotlight grid.
 * Colored rounded cells light up around the cursor, fading with distance.
 * Mouse movement is smoothly damped for a fluid, organic feel.
 *
 * Props:
 *   containerRef  — ref of the element to listen for mousemove / mouseleave
 *   radius        — px distance at which the effect reaches full strength (default 300)
 *   damping       — 0–1 lerp factor per frame; lower = smoother/slower (default 0.45)
 *   fadeOut       — exponent controlling how sharply cells fade at the radius edge (default 0.6)
 *   cellSize      — px size of each grid cell (default 56)
 *   maxOpacity    — peak opacity of a cell directly under the cursor (default 0.55)
 *   colors        — array of [r, g, b] tuples used for cells (cycles deterministically)
 */
export function ChromaGrid({
  containerRef,
  radius     = 300,
  damping    = 0.45,
  fadeOut    = 0.6,
  cellSize   = 56,
  maxOpacity = 0.55,
  colors = [
    [139,  92, 246],  // purple
    [168,  85, 247],  // violet
    [236,  72, 153],  // pink
    [ 59, 130, 246],  // blue
    [ 99, 102, 241],  // indigo
    [217,  70, 239],  // fuchsia
    [244, 114, 182],  // rose
    [ 96, 165, 250],  // sky-blue
  ],
}) {
  const canvasRef  = useRef(null)
  const mouseRef   = useRef({ x: -9999, y: -9999 })
  const smoothRef  = useRef({ x: -9999, y: -9999 })
  const rafRef     = useRef(null)
  const activeRef  = useRef(false)   // true while mouse is inside container

  useEffect(() => {
    const canvas    = canvasRef.current
    const container = containerRef?.current
    if (!canvas || !container) return

    /* ── Size canvas to match container ── */
    const resize = () => {
      const r = container.getBoundingClientRect()
      canvas.width  = r.width
      canvas.height = r.height
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    /* ── Mouse tracking ── */
    const onMove = (e) => {
      const r = container.getBoundingClientRect()
      mouseRef.current  = { x: e.clientX - r.left, y: e.clientY - r.top }
      activeRef.current = true
    }
    const onLeave = () => {
      activeRef.current = false
      /* Don't snap — let the smooth position drift off-screen naturally */
      mouseRef.current = { x: -9999, y: -9999 }
    }
    container.addEventListener("mousemove", onMove)
    container.addEventListener("mouseleave", onLeave)

    /* ── Draw loop ── */
    const draw = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) { rafRef.current = requestAnimationFrame(draw); return }

      const W = canvas.width
      const H = canvas.height

      /* Damp smooth position toward real mouse */
      smoothRef.current.x += (mouseRef.current.x - smoothRef.current.x) * damping
      smoothRef.current.y += (mouseRef.current.y - smoothRef.current.y) * damping

      ctx.clearRect(0, 0, W, H)

      /* Only draw when mouse is somewhere reasonable */
      if (smoothRef.current.x < -500) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      const cols = Math.ceil(W / cellSize) + 1
      const rows = Math.ceil(H / cellSize) + 1
      const gap  = 4
      const br   = 8   /* border-radius of each cell */

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cx   = c * cellSize + cellSize / 2
          const cy   = r * cellSize + cellSize / 2
          const dist = Math.hypot(smoothRef.current.x - cx, smoothRef.current.y - cy)
          if (dist >= radius) continue

          const t       = 1 - dist / radius
          const opacity = Math.pow(t, 1 / fadeOut) * maxOpacity

          /* Deterministic colour per cell so the pattern is stable */
          const [cr, cg, cb] = colors[(r * 7 + c * 3) % colors.length]
          ctx.fillStyle = `rgba(${cr},${cg},${cb},${opacity})`

          /* Rounded rectangle */
          const x = c * cellSize + gap
          const y = r * cellSize + gap
          const w = cellSize - gap * 2
          const h = cellSize - gap * 2

          ctx.beginPath()
          ctx.moveTo(x + br, y)
          ctx.lineTo(x + w - br, y)
          ctx.quadraticCurveTo(x + w, y,     x + w, y + br)
          ctx.lineTo(x + w, y + h - br)
          ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h)
          ctx.lineTo(x + br, y + h)
          ctx.quadraticCurveTo(x, y + h,     x, y + h - br)
          ctx.lineTo(x, y + br)
          ctx.quadraticCurveTo(x, y,         x + br, y)
          ctx.closePath()
          ctx.fill()
        }
      }

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      container.removeEventListener("mousemove", onMove)
      container.removeEventListener("mouseleave", onLeave)
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [containerRef, radius, damping, fadeOut, cellSize, maxOpacity]) // eslint-disable-line

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:      "absolute",
        inset:         0,
        width:         "100%",
        height:        "100%",
        pointerEvents: "none",
        borderRadius:  "inherit",
        zIndex:        1,
      }}
    />
  )
}
