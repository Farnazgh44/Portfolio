import { useEffect, useRef, useCallback } from "react"

/**
 * Solid-color blob cursor that stretches based on movement physics.
 * Hides itself when hovering over interactive elements (links, buttons, etc.)
 * so the native pointer/hand cursor shows instead.
 */
export function BlobCursor({ size = 14 }) {
  const canvasRef = useRef(null)
  const mouse = useRef({ x: -100, y: -100 })
  const pos = useRef({ x: -100, y: -100 })
  const visible = useRef(true)
  const animFrame = useRef(null)

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")

    const prevX = pos.current.x
    const prevY = pos.current.y
    pos.current.x += (mouse.current.x - pos.current.x) * 0.18
    pos.current.y += (mouse.current.y - pos.current.y) * 0.18

    const dx = pos.current.x - prevX
    const dy = pos.current.y - prevY
    const speed = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx)
    const stretch = Math.min(speed * 0.08, 0.7)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (visible.current) {
      ctx.save()
      ctx.translate(pos.current.x, pos.current.y)
      ctx.rotate(angle)
      ctx.scale(1 + stretch, 1 - stretch * 0.35)

      /* Solid blob */
      ctx.beginPath()
      ctx.arc(0, 0, size, 0, Math.PI * 2)
      ctx.fillStyle = "#c084fc"
      ctx.fill()

      /* Tiny highlight dot for depth */
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

    /* Only show on pointer devices */
    const mq = window.matchMedia("(pointer: fine)")
    if (!mq.matches) return

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    function onMouseMove(e) {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    window.addEventListener("mousemove", onMouseMove)

    /* Check if we're hovering an interactive element */
    const INTERACTIVE = "a, button, input, textarea, select, [role='button'], .cursor-grab, .cursor-pointer, [onclick], [data-blob-text-letter], h1, h2, h3, h4, h5, h6, p, li, blockquote"

    const TEXT_ELEMENTS = "h1, h2, h3, h4, h5, h6, p, li, blockquote"

    function onMouseOver(e) {
      const target = e.target
      if (target.closest(INTERACTIVE)) {
        visible.current = false
        // Show I-beam for text elements, pointer/auto for interactive
        if (target.closest(TEXT_ELEMENTS) && !target.closest("a, button, [role='button']")) {
          document.body.style.cursor = "text"
        } else {
          document.body.style.cursor = "auto"
        }
      }
    }

    function onMouseOut(e) {
      const target = e.target
      if (target.closest(INTERACTIVE)) {
        visible.current = true
        document.body.style.cursor = "none"
      }
    }

    document.addEventListener("mouseover", onMouseOver)
    document.addEventListener("mouseout", onMouseOut)

    animFrame.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseover", onMouseOver)
      document.removeEventListener("mouseout", onMouseOut)
      if (animFrame.current) cancelAnimationFrame(animFrame.current)
      document.body.style.cursor = "none"
    }
  }, [draw])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[999] pointer-events-none"
    />
  )
}
