import { useEffect } from "react"

/* CSS cubic-bezier equivalents for common GSAP ease names */
const EASE_MAP = {
  "power1.out":    "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  "power2.out":    "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  "power3.out":    "cubic-bezier(0.215, 0.61, 0.355, 1)",
  "power4.out":    "cubic-bezier(0.165, 0.84, 0.44, 1)",
  "expo.out":      "cubic-bezier(0.19, 1, 0.22, 1)",
  "back.out(1.7)": "cubic-bezier(0.34, 1.56, 0.64, 1)",
}

/**
 * SplitText
 * Animates text letter-by-letter or word-by-word using CSS keyframe animations.
 * Each character gets its own animation-delay, which is handled entirely by the
 * browser's compositor — no React state, no setTimeout batching issues.
 *
 * animation-fill-mode: both  →  characters stay hidden BEFORE their delay fires,
 *                                and stay visible AFTER the animation ends.
 *
 * Props:
 *   text        — the string to animate
 *   className   — Tailwind/CSS classes on the root block span
 *   style       — extra inline styles on the root span
 *   delay       — ms stagger between each unit (default 50)
 *   duration    — seconds for each unit's animation (default 0.8)
 *   ease        — GSAP-style ease name or a CSS easing string
 *   splitType   — "chars" | "words"
 *   from        — start state { opacity, y }
 *   trigger     — animation plays the moment this becomes true
 *   onLetterAnimationComplete — called after the last unit finishes
 */
export function SplitText({
  text = "",
  className = "",
  style = {},
  delay = 50,
  duration = 0.8,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  trigger = false,
  onLetterAnimationComplete,
}) {
  const easing = EASE_MAP[ease] || ease
  const units  = splitType === "words" ? text.split(" ") : text.split("")

  /* Fire completion callback after the very last character finishes */
  useEffect(() => {
    if (!trigger || !onLetterAnimationComplete) return
    const totalMs = (units.length - 1) * delay + duration * 1000
    const t = setTimeout(onLetterAnimationComplete, totalMs)
    return () => clearTimeout(t)
  }, [trigger]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span
      className={className}
      aria-label={text}
      style={{ display: "block", ...style }}
    >
      {units.map((unit, i) => (
        <span
          key={i}
          style={{
            display:    "inline-block",
            whiteSpace: "pre",
            /* Before trigger: stay at the "from" state */
            opacity:   trigger ? undefined : (from.opacity ?? 0),
            transform: trigger ? undefined : `translateY(${from.y ?? 40}px)`,
            /* Once trigger fires: play the keyframe animation */
            animation: trigger
              ? `splittext-in ${duration}s ${easing} ${i * delay}ms both`
              : "none",
            /* CSS custom prop so the keyframe can read the starting Y */
            "--from-y": `${from.y ?? 40}px`,
          }}
        >
          {unit === " " || unit === "" ? "\u00A0" : unit}
          {splitType === "words" && i < units.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  )
}
