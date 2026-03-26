/**
 * ScrollFloat
 * Splits text into characters and floats each one up as the element enters
 * the viewport — inspired by the ReactBits ScrollFloat animation.
 *
 * Props:
 *   children          – plain string (required)
 *   animationDuration – seconds per char   (default 1)
 *   stagger           – delay between chars (default 0.03 s)
 *   triggered         – if provided, the animation fires when this becomes true
 *                       instead of on IntersectionObserver
 */
import { useEffect, useRef } from "react"

const STYLE_ID = "scroll-float-keyframes"

function injectKeyframes() {
  if (document.getElementById(STYLE_ID)) return
  const style = document.createElement("style")
  style.id = STYLE_ID
  style.textContent = `
    @keyframes sfFloat {
      0%   { opacity: 0; transform: translateY(0.9em) rotateX(-90deg); }
      60%  { opacity: 1; }
      100% { opacity: 1; transform: translateY(0)     rotateX(0deg);   }
    }
    .sf-char {
      display:            inline-block;
      opacity:            0;
      transform:          translateY(0.9em) rotateX(-90deg);
      animation-fill-mode: both;
      will-change:         transform, opacity;
    }
  `
  document.head.appendChild(style)
}

export function ScrollFloat({
  children,
  animationDuration = 1,
  stagger           = 0.03,
  triggered,        /* optional boolean — fires animation when it turns true */
  style,
  className,
}) {
  const containerRef = useRef(null)
  const firedRef     = useRef(false)

  /* Split text into characters, preserving spaces as non-breaking spaces */
  const chars = (typeof children === "string" ? children : "").split("")

  const fire = () => {
    if (firedRef.current) return
    firedRef.current = true
    const el = containerRef.current
    if (!el) return
    el.querySelectorAll(".sf-char").forEach((span, i) => {
      span.style.animation = [
        `sfFloat`,
        `${animationDuration}s`,
        /* back.out approximation — spring overshoot */
        `cubic-bezier(0.34, 1.56, 0.64, 1)`,
        `${(i * stagger).toFixed(3)}s`,
        `both`,
      ].join(" ")
    })
  }

  /* Mode 1 – fire when `triggered` prop turns true */
  useEffect(() => {
    if (triggered === undefined) return   /* not in controlled mode */
    if (triggered) fire()
  }, [triggered])

  /* Mode 2 – fire when element enters viewport (no `triggered` prop) */
  useEffect(() => {
    if (triggered !== undefined) return   /* controlled mode, skip observer */
    injectKeyframes()
    const el = containerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) fire() },
      { threshold: 0.25 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => { injectKeyframes() }, [])

  return (
    <span
      ref={containerRef}
      className={className}
      style={{
        display:           "inline-block",
        perspective:       "600px",
        perspectiveOrigin: "50% 50%",
        ...style,
      }}
    >
      {chars.map((ch, i) => (
        <span key={i} className="sf-char">
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </span>
  )
}
