import { motion, useInView } from "framer-motion"
import { useRef } from "react"

/* ─── Ease map: converts GSAP-style strings to framer-motion compatible ─── */
const EASE_MAP = {
  "power3.out":     [0.215, 0.61, 0.355, 1],
  "power3.inOut":   [0.645, 0.045, 0.355, 1],
  "power2.out":     [0.25, 0.46, 0.45, 0.94],
  "back.out(1.7)":  [0.34, 1.56, 0.64, 1],
  "easeOut":        "easeOut",
  "easeInOut":      "easeInOut",
}

/**
 * SplitText – animates each character (or word) into view with a stagger.
 *
 * Props:
 *   text                  – string to animate
 *   className             – applied to the wrapper element
 *   delay                 – ms between each unit (default 50)
 *   baseDelay             – ms before the FIRST unit starts (default 0)
 *   duration              – seconds per unit animation (default 1.25)
 *   ease                  – easing string (default "power3.out")
 *   splitType             – "chars" | "words" (default "chars")
 *   from                  – initial motion values   (default {opacity:0, y:40})
 *   to                    – animate-to motion values (default {opacity:1, y:0})
 *   threshold             – IntersectionObserver amount (default 0.1)
 *   rootMargin            – IntersectionObserver margin (default "-100px")
 *   textAlign             – CSS text-align on wrapper
 *   onLetterAnimationComplete – callback after last unit finishes
 *   as                    – HTML tag for wrapper (default "span")
 */
export function SplitText({
  text,
  className = "",
  delay = 50,
  baseDelay = 0,
  duration = 1.25,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to   = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "left",
  onLetterAnimationComplete,
  as: Tag = "span",
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: threshold, margin: rootMargin })

  const resolvedEase = EASE_MAP[ease] ?? ease

  const units =
    splitType === "chars"
      ? text.split("")
      : text.split(/(\s+)/)

  return (
    <Tag
      ref={ref}
      className={className}
      style={{ textAlign, display: "block" }}
      aria-label={text}
    >
      {units.map((unit, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          initial={from}
          animate={isInView ? to : from}
          transition={{
            duration,
            delay: baseDelay / 1000 + i * (delay / 1000),
            ease: resolvedEase,
          }}
          style={{ display: "inline-block" }}
          onAnimationComplete={
            i === units.length - 1 && onLetterAnimationComplete
              ? onLetterAnimationComplete
              : undefined
          }
        >
          {unit === " " ? "\u00A0" : unit}
        </motion.span>
      ))}
    </Tag>
  )
}
