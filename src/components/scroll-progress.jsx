import { useState, useEffect } from "react"

/**
 * Scroll progress indicator -- glassmorphism box with a full-circle gauge
 * that fills clockwise from the top as the user scrolls (0% -> 100%).
 * At 100% the circle is fully closed. Sits next to the logo in the navbar.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    function handleScroll() {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight <= 0) {
        setProgress(0)
        return
      }
      setProgress(Math.round((scrollTop / docHeight) * 100))
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  /* Full circle geometry */
  const radius = 15
  const cx = 22
  const cy = 22
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference - (circumference * progress) / 100

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip */}
      <span
        className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none transition-all duration-300 text-xs font-medium text-white px-3 py-1 rounded-lg"
        style={{
          top: "calc(100% + 8px)",
          background: "rgba(255,255,255,0.12)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.2)",
          opacity: hovered ? 1 : 0,
          transform: `translate(-50%, ${hovered ? "0" : "-4px"}) scale(${hovered ? 1 : 0.9})`,
        }}
      >
        Scroll to explore
      </span>
      <div
        className="nav-glass-hover w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center rounded-xl cursor-pointer"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.12)",
        }}
      >
      <div className="scroll-progress-ring relative w-8 h-8 sm:w-11 sm:h-11 md:w-12 md:h-12 flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 44 44" className="absolute">
          {/* Background circle track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2.5"
          />
          {/* Foreground circle -- fills clockwise from top */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition: "stroke-dashoffset 0.15s ease-out",
              transform: "rotate(-90deg)",
              transformOrigin: `${cx}px ${cy}px`,
            }}
          />
        </svg>
        {/* Percentage text */}
        <span
          className="text-white font-bold relative z-10 text-[7px] sm:text-[8px]"
          style={{ letterSpacing: "-0.3px" }}
        >
          {progress}%
        </span>
      </div>
      </div>
    </div>
  )
}
