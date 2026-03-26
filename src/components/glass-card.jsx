import { cn } from "../lib/utils"

/**
 * Glassmorphism card with guaranteed blur.
 *
 * We use inline styles instead of Tailwind's backdrop-blur-* classes because
 * Chrome has a known rendering bug: backdrop-filter drops silently when an
 * ancestor element has a CSS transform (e.g. the translateX scroll animation
 * in AboutPreview). Inline backdropFilter + WebkitBackdropFilter + willChange
 * forces the browser to always allocate a compositing layer for the effect.
 */

const intensityStyles = {
  light: {
    background: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
    borderColor: "rgba(255, 255, 255, 0.13)",
  },
  medium: {
    background: "rgba(255, 255, 255, 0.13)",
    backdropFilter: "blur(22px)",
    WebkitBackdropFilter: "blur(22px)",
    borderColor: "rgba(255, 255, 255, 0.20)",
  },
  strong: {
    background: "rgba(255, 255, 255, 0.18)",
    backdropFilter: "blur(36px)",
    WebkitBackdropFilter: "blur(36px)",
    borderColor: "rgba(255, 255, 255, 0.26)",
  },
}

export function GlassCard({ children, className, intensity = "medium", style, ...props }) {
  const iv = intensityStyles[intensity] ?? intensityStyles.medium

  return (
    <div
      className={cn("rounded-2xl border shadow-lg", className)}
      style={{
        ...iv,
        // willChange tells the browser to always maintain a compositing layer
        // for backdrop-filter — prevents the blur from dropping when a parent
        // element has an active CSS transform (the translateX scroll animation).
        willChange: "backdrop-filter",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}
