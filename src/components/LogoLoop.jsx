import { useState } from "react"

/**
 * LogoLoop – infinite horizontal marquee that pauses on container hover
 * and pops each logo up individually on mouse-enter.
 *
 * Props:
 *   logos        – array of { name, image, desc? }
 *   speed        – CSS animation duration in seconds (lower = faster). Default 30.
 *   logoSize     – width & height of each logo box in px. Default 80.
 *   gap          – gap between logos in px. Default 16.
 *   fadeOut      – show fade-out gradient on left/right edges. Default true.
 *   className    – extra classes on the outer wrapper
 *   renderItem   – optional custom renderer: (logo, isHovered) => ReactNode
 *                  If omitted, renders logo.image as <img>.
 */
export function LogoLoop({
  logos = [],
  speed = 30,
  logoSize = 80,
  gap = 16,
  fadeOut = true,
  className = "",
  renderItem,
}) {
  const [paused, setPaused] = useState(false)
  const [hoveredIdx, setHoveredIdx] = useState(null)

  /* Double the array for the seamless CSS translateX(-50%) loop */
  const doubled = [...logos, ...logos]

  return (
    <div
      className={`relative overflow-hidden w-full ${className}`}
      style={{ height: logoSize + 24 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); setHoveredIdx(null) }}
    >
      {/* Edge fades */}
      {fadeOut && (
        <>
          <div
            className="absolute left-0 top-0 h-full w-10 z-20 pointer-events-none"
            style={{ background: "linear-gradient(to right, rgba(0,0,0,0.6), transparent)" }}
          />
          <div
            className="absolute right-0 top-0 h-full w-10 z-20 pointer-events-none"
            style={{ background: "linear-gradient(to left, rgba(0,0,0,0.6), transparent)" }}
          />
        </>
      )}

      {/* Scrolling track */}
      <div
        className="flex items-center animate-scroll-left"
        style={{
          gap,
          width: "max-content",
          animationPlayState: paused ? "paused" : "running",
          alignItems: "center",
          height: "100%",
        }}
      >
        {doubled.map((logo, i) => {
          const realIdx = i % logos.length
          const isHovered = hoveredIdx === realIdx

          return (
            <div
              key={i}
              className="flex-shrink-0 relative flex items-center justify-center"
              style={{
                width: logoSize,
                height: logoSize,
                transition: "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
                transform: isHovered ? "scale(1.45) translateY(-4px)" : "scale(1)",
                zIndex: isHovered ? 30 : 1,
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredIdx(realIdx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {renderItem
                ? renderItem(logo, isHovered)
                : logo.image
                  ? <img
                      src={logo.image}
                      alt={logo.name || ""}
                      style={{
                        width: logoSize * 0.7,
                        height: logoSize * 0.7,
                        objectFit: "contain",
                      }}
                    />
                  : null
              }

              {/* Blob popup tooltip */}
              <BlobTooltip
                label={logo.name}
                desc={logo.desc}
                visible={isHovered}
                size={logoSize}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Blob-shaped tooltip that morphs open on hover ─── */
function BlobTooltip({ label, desc, visible, size }) {
  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{
        bottom: `calc(100% + 6px)`,
        left: "50%",
        transform: `translateX(-50%) scale(${visible ? 1 : 0})`,
        transition: visible
          ? "transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)"
          : "transform 0.2s ease-in",
        transformOrigin: "50% 100%",
        minWidth: Math.max(size * 1.6, 100),
        maxWidth: 200,
      }}
    >
      <div
        className="blob-tooltip-inner px-3 py-2 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(80,40,200,0.95), rgba(180,50,180,0.95))",
          backdropFilter: "blur(16px)",
          borderRadius: "45% 55% 52% 48% / 50% 48% 52% 50%",
          boxShadow: "0 8px 32px rgba(100,40,220,0.45)",
          animation: visible ? "blob-tooltip-morph 2.5s ease-in-out infinite" : "none",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <p className="text-white text-xs font-semibold leading-tight">{label}</p>
        {desc && (
          <p
            className="text-white/75 leading-tight mt-0.5"
            style={{ fontSize: "9px", maxWidth: 180 }}
          >
            {desc}
          </p>
        )}
      </div>
    </div>
  )
}
