/* ─── MetaBalls SideBlobs — Spring-Homing Edition ───────────────────────────
   Physics model: each blob has a "homeEdge" (L / R / T / B).
   A spring force pulls it back toward that edge's band whenever it drifts
   inward.  The free axis (vertical for L/R, horizontal for T/B) gets
   continuous Brownian noise so the path is never periodic and blobs always
   trace slow sinusoidal arcs along their home edge — lava-lamp style.

   Why this eliminates corner-stuck blobs completely:
     • The spring equilibrium is at homeX (or homeY), NOT at the wall corner.
       A blob in the corner is pulled AWAY from the corner toward homeX — it
       can never sit still there.
     • Brownian noise means velocity can never be exactly zero (spd = 0 is
       measure-zero in continuous noise).
     • MIN_SPEED floor is a final safety net.

   Speed calibration — "slow motion / lava lamp":
     MAX_SPEED  0.50 px/frame = 30 px/sec ≈ 2% of screen/sec — clearly
     drifting but very slow.  Each arc takes 8–15 seconds to complete.
─────────────────────────────────────────────────────────────────────────── */
import { useRef, useEffect } from "react"
import { useTheme } from "../lib/theme-context"

/* homeEdge: which wall this blob lives near
   morph:    which CSS border-radius animation (1–5)                        */
const BLOBS = [
  /* Left lane */
  { r: 62, xP: 0.05, yP: 0.20, vx:  0.14, vy:  0.18, homeEdge: "L", morph: 1 },
  { r: 75, xP: 0.07, yP: 0.50, vx:  0.12, vy: -0.15, homeEdge: "L", morph: 3 },
  { r: 55, xP: 0.05, yP: 0.74, vx:  0.16, vy:  0.11, homeEdge: "L", morph: 5 },
  { r: 68, xP: 0.10, yP: 0.90, vx: -0.13, vy: -0.14, homeEdge: "L", morph: 2 },

  /* Right lane */
  { r: 70, xP: 0.93, yP: 0.24, vx: -0.14, vy:  0.16, homeEdge: "R", morph: 4 },
  { r: 60, xP: 0.90, yP: 0.54, vx: -0.12, vy: -0.18, homeEdge: "R", morph: 1 },
  { r: 75, xP: 0.95, yP: 0.76, vx: -0.15, vy:  0.13, homeEdge: "R", morph: 3 },
  { r: 55, xP: 0.84, yP: 0.90, vx:  0.11, vy: -0.14, homeEdge: "R", morph: 5 },

  /* Top lane */
  { r: 65, xP: 0.28, yP: 0.06, vx:  0.16, vy:  0.13, homeEdge: "T", morph: 2 },
  { r: 58, xP: 0.54, yP: 0.07, vx: -0.18, vy:  0.14, homeEdge: "T", morph: 4 },
  { r: 62, xP: 0.72, yP: 0.05, vx:  0.13, vy:  0.16, homeEdge: "T", morph: 1 },

  /* Bottom lane */
  { r: 65, xP: 0.22, yP: 0.93, vx:  0.15, vy: -0.13, homeEdge: "B", morph: 3 },
  { r: 60, xP: 0.50, yP: 0.95, vx: -0.13, vy: -0.16, homeEdge: "B", morph: 5 },
  { r: 72, xP: 0.75, yP: 0.94, vx: -0.14, vy: -0.13, homeEdge: "B", morph: 2 },
]

const MORPH_DURATIONS = [14, 18, 11, 16, 20]

/* ── Per-theme blob colour palettes ─────────────────────────────────────────
   Each palette uses vivid shades of the theme's hue family so blobs are
   clearly visible against their dark background while looking harmonious.
   All colours are noticeably brighter / more saturated than the background
   gradients, giving good contrast on every theme.
──────────────────────────────────────────────────────────────────────────── */
const THEME_COLORS = {
  /* Dark purple/pink background → vivid purples, pinks, violets, magentas */
  pink: [
    "rgba(168,  85, 247, 0.72)",  // purple
    "rgba(236,  72, 153, 0.68)",  // hot pink
    "rgba(139,  92, 246, 0.72)",  // violet
    "rgba(192, 132, 252, 0.66)",  // lavender
    "rgba(244, 114, 182, 0.68)",  // light pink
    "rgba(217,  70, 239, 0.65)",  // magenta
    "rgba(167, 139, 250, 0.70)",  // periwinkle
    "rgba(196,  32, 176, 0.62)",  // deep fuchsia
    "rgba(147,  51, 234, 0.68)",  // deep purple
    "rgba(232, 121, 249, 0.63)",  // orchid
  ],
  /* Dark navy background → cyans, sky blues, indigos, electric blues */
  blue: [
    "rgba( 56, 189, 248, 0.80)",  // sky cyan
    "rgba( 99, 179, 237, 0.75)",  // cornflower
    "rgba(147, 197, 253, 0.70)",  // periwinkle blue
    "rgba( 34, 211, 238, 0.78)",  // electric cyan
    "rgba(129, 140, 248, 0.74)",  // indigo-blue
    "rgba( 14, 165, 233, 0.75)",  // azure
    "rgba( 96, 165, 250, 0.76)",  // light blue
    "rgba(165, 243, 252, 0.65)",  // pale cyan
    "rgba( 67, 120, 230, 0.72)",  // royal blue
    "rgba(186, 230, 253, 0.63)",  // ice blue
  ],
  /* Dark forest-green background → limes, emeralds, mints, bright greens */
  green: [
    "rgba( 74, 222, 128, 0.80)",  // bright green
    "rgba(163, 230,  53, 0.78)",  // lime
    "rgba( 52, 211, 153, 0.78)",  // emerald
    "rgba(250, 204,  21, 0.75)",  // yellow (contrast pop)
    "rgba(134, 239, 172, 0.70)",  // mint
    "rgba( 16, 185, 129, 0.78)",  // jade
    "rgba(132, 204,  22, 0.74)",  // yellow-green
    "rgba( 34, 197,  94, 0.78)",  // vivid green
    "rgba(187, 247, 208, 0.64)",  // pale mint
    "rgba(217, 249, 157, 0.65)",  // lemon-lime
  ],
  /* Dark burnt-orange/brown background → vivid oranges, ambers, golds, peaches */
  orange: [
    "rgba(251, 146,  60, 0.85)",  // bright orange
    "rgba(245, 158,  11, 0.82)",  // amber
    "rgba(252, 211,  77, 0.78)",  // gold
    "rgba(249, 115,  22, 0.83)",  // vivid orange
    "rgba(253, 186, 116, 0.74)",  // peach
    "rgba(251, 191,  36, 0.78)",  // golden yellow
    "rgba(234,  88,  12, 0.80)",  // deep orange
    "rgba(254, 215, 170, 0.68)",  // light peach
    "rgba(239, 120,  40, 0.80)",  // tangerine
    "rgba(255, 167,  38, 0.75)",  // mango
  ],
}

/* ── Physics constants ───────────────────────────────────────────────────── */
const MAX_SPEED  = 0.25   // px/frame — slow-motion drift (~15 px/sec at 60fps)
const MIN_SPEED  = 0.10   // px/frame — always visibly moving
const SPRING_K   = 0.0003 // spring stiffness toward home band; period ≈ 6 sec
const HOME_BAND  = 0.11   // how far from each edge the home centre is (11%)
const NOISE      = 0.005  // Brownian noise — prevents exact periodic paths
const JITTER     = 0.06   // random nudge on wall bounce (breaks corner ping-pong)

export function SideBlobs() {
  const { themeName }  = useTheme()
  const colors         = THEME_COLORS[themeName] ?? THEME_COLORS.pink

  const elRefs = useRef([])
  const state  = useRef([])
  const mouse  = useRef({ x: -9999, y: -9999 })
  const raf    = useRef(null)

  useEffect(() => {
    state.current = BLOBS.map(b => ({
      ...b,
      x: b.xP * window.innerWidth,
      y: b.yP * window.innerHeight,
    }))

    const onMove  = e => { mouse.current = { x: e.clientX, y: e.clientY } }
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 } }
    window.addEventListener("mousemove",  onMove)
    window.addEventListener("mouseleave", onLeave)

    function tick() {
      const W  = window.innerWidth
      const H  = window.innerHeight
      const mx = mouse.current.x
      const my = mouse.current.y

      state.current.forEach((b, i) => {
        /* ── 1. Brownian noise — breaks periodicity on free axis ── */
        b.vx += (Math.random() - 0.5) * NOISE
        b.vy += (Math.random() - 0.5) * NOISE

        /* ── 2. Spring toward home edge band ─────────────────────────────
              The spring ONLY acts on the constrained axis (x for L/R blobs,
              y for T/B blobs).  The other axis wanders freely so blobs
              trace long slow arcs along their edge.
              homeX/Y is a point ONE HOME_BAND inward from the edge;
              this keeps blobs fully visible (not half-clipped) and well
              inside the edge decorative zone.                            */
        if (b.homeEdge === "L") {
          const homeX = b.r + W * HOME_BAND
          b.vx -= (b.x - homeX) * SPRING_K
        } else if (b.homeEdge === "R") {
          const homeX = W - b.r - W * HOME_BAND
          b.vx -= (b.x - homeX) * SPRING_K
        } else if (b.homeEdge === "T") {
          const homeY = b.r + H * HOME_BAND
          b.vy -= (b.y - homeY) * SPRING_K
        } else {
          const homeY = H - b.r - H * HOME_BAND
          b.vy -= (b.y - homeY) * SPRING_K
        }

        /* ── 3. Speed cap ── */
        let spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy)
        if (spd > MAX_SPEED) {
          b.vx = (b.vx / spd) * MAX_SPEED
          b.vy = (b.vy / spd) * MAX_SPEED
          spd  = MAX_SPEED
        }

        /* ── 4. Anti-stuck: minimum speed floor ── */
        if (spd > 0 && spd < MIN_SPEED) {
          const boost = MIN_SPEED / spd
          b.vx *= boost
          b.vy *= boost
        } else if (spd === 0) {
          /* Perfectly stationary (essentially impossible with noise, but
             handled as final safety net)                                */
          const angle = Math.random() * Math.PI * 2
          b.vx = Math.cos(angle) * MIN_SPEED
          b.vy = Math.sin(angle) * MIN_SPEED
        }

        /* ── 5. Move ── */
        b.x += b.vx
        b.y += b.vy

        /* ── 6. Wall bounce with jitter ──────────────────────────────────
              Jitter on the parallel axis breaks exact-angle reflections
              so blobs can never lock into a repeating corner path.      */
        if (b.x - b.r < 0) {
          b.x  = b.r
          b.vx = Math.abs(b.vx)
          b.vy += (Math.random() - 0.5) * JITTER
        }
        if (b.x + b.r > W) {
          b.x  = W - b.r
          b.vx = -Math.abs(b.vx)
          b.vy += (Math.random() - 0.5) * JITTER
        }
        if (b.y - b.r < 0) {
          b.y  = b.r
          b.vy = Math.abs(b.vy)
          b.vx += (Math.random() - 0.5) * JITTER
        }
        if (b.y + b.r > H) {
          b.y  = H - b.r
          b.vy = -Math.abs(b.vy)
          b.vx += (Math.random() - 0.5) * JITTER
        }

        /* ── 7. Mouse repulsion ── */
        const dx   = b.x - mx
        const dy   = b.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 160 && dist > 0) {
          const force = ((160 - dist) / 160) * 5
          b.x += (dx / dist) * force
          b.y += (dy / dist) * force
        }

        /* ── 8. Clamp inside viewport (safety after mouse push) ── */
        b.x = Math.max(b.r, Math.min(W - b.r, b.x))
        b.y = Math.max(b.r, Math.min(H - b.r, b.y))

        /* ── 9. Update DOM ── */
        const el = elRefs.current[i]
        if (el) {
          el.style.transform = `translate(${b.x - b.r}px, ${b.y - b.r}px)`
        }
      })

      raf.current = requestAnimationFrame(tick)
    }

    tick()

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener("mousemove",  onMove)
      window.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    /* z-index: -5 keeps SideBlobs:
         • ABOVE the gradient LavaBackground (which is at z-index: -10)
         • BELOW every piece of page content — sections with `relative` but
           no explicit z-index sit at z-index: auto (above negative values),
           so all text, cards, hero blobs, navbar (z-50) are in front.     */
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -5, filter: "url(#metaball-goo)" }}
    >
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter
            id="metaball-goo"
            x="-30%" y="-30%"
            width="160%" height="160%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 28 -12"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {BLOBS.map((b, i) => {
        const morphN = b.morph
        const dur    = MORPH_DURATIONS[(i + morphN) % MORPH_DURATIONS.length]
        const delay  = -(i * 1.8)
        return (
          <div
            key={i}
            ref={el => { elRefs.current[i] = el }}
            className="absolute top-0 left-0"
            style={{
              width:      b.r * 2,
              height:     b.r * 2,
              background: colors[i % colors.length],
              willChange: "transform",
              animation:  `morph-blob-${morphN} ${dur}s ease-in-out ${delay}s infinite`,
            }}
          />
        )
      })}
    </div>
  )
}
