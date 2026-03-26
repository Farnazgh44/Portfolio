import { useRef, useCallback } from "react"

/**
 * SpotlightCard
 *
 * A wrapper that renders a radial-gradient spotlight following the mouse
 * on hover. The spotlight is an absolutely-positioned overlay div so it
 * never interferes with pointer events on child content.
 *
 * Props:
 *   children       — card content
 *   className      — extra classes applied to the outer wrapper
 *   style          — extra inline styles applied to the outer wrapper
 *   spotlightColor — CSS color for the spotlight center (default: rgba(0,229,255,0.18))
 */
export function SpotlightCard({
  children,
  className = "",
  style = {},
  spotlightColor = "rgba(0, 229, 255, 0.18)",
}) {
  const cardRef     = useRef(null)
  const overlayRef  = useRef(null)

  const onMouseMove = useCallback((e) => {
    const card = cardRef.current
    const overlay = overlayRef.current
    if (!card || !overlay) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    overlay.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${spotlightColor}, transparent 60%)`
    overlay.style.opacity = "1"
  }, [spotlightColor])

  const onMouseLeave = useCallback(() => {
    const overlay = overlayRef.current
    if (!overlay) return
    overlay.style.opacity = "0"
  }, [])

  return (
    <div
      ref={cardRef}
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Spotlight overlay — pointer-events:none so it never blocks clicks */}
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position:      "absolute",
          inset:         0,
          borderRadius:  "inherit",
          pointerEvents: "none",
          opacity:       0,
          transition:    "opacity 0.3s ease",
          zIndex:        1,
        }}
      />

      {/* Card content sits above spotlight */}
      <div style={{ position: "relative", zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}
