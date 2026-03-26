import { useEffect, useRef, useState } from "react"

const COLORS = [
  "#f472b6", "#fb923c", "#34d399", "#38bdf8",
  "#a78bfa", "#f9a8d4", "#6ee7b7", "#fbbf24",
]

function lerp(a, b, t) { return a + (b - a) * t }
function lerpAngle(a, b, t) {
  const d = ((b - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI
  return a + d * t
}

function buildBlobPath(cx, cy, rx, ry, phase, wobble, rotation) {
  const pts = 18
  const cosR = Math.cos(rotation)
  const sinR = Math.sin(rotation)
  const coords = []
  for (let i = 0; i < pts; i++) {
    const angle = (i / pts) * Math.PI * 2
    const r1 = 1 + wobble * 0.35 * Math.sin(2 * angle + phase * 1.3)
    const r2 = 1 + wobble * 0.22 * Math.sin(3 * angle - phase * 0.9)
    const r3 = 1 + wobble * 0.15 * Math.sin(5 * angle + phase * 0.6)
    const rFactor = r1 * r2 * r3
    const lx = rx * rFactor * Math.cos(angle)
    const ly = ry * rFactor * Math.sin(angle)
    coords.push([
      cx + lx * cosR - ly * sinR,
      cy + lx * sinR + ly * cosR,
    ])
  }
  const n = coords.length
  let d = ""
  for (let i = 0; i < n; i++) {
    const p0 = coords[(i - 1 + n) % n]
    const p1 = coords[i]
    const p2 = coords[(i + 1) % n]
    const p3 = coords[(i + 2) % n]
    if (i === 0) d += `M ${p1[0].toFixed(1)},${p1[1].toFixed(1)} `
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6
    d += `C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)} `
  }
  return d + "Z"
}

/**
 * AutoBlobText - Text with automatic sequential blob animation on mount + hover support
 * 
 * Props:
 *  - text: string to display
 *  - as: HTML tag (default "h2")
 *  - className: styling for the text element
 *  - filterId: unique SVG filter ID (default "goo-auto")
 *  - autoDelay: ms between each letter animation (default 60)
 *  - autoDuration: ms each blob stays visible (default 400)
 */
export function AutoBlobText({
  text,
  as: Tag = "h2",
  className = "",
  filterId = "goo-auto",
  autoDelay = 60,
  autoDuration = 400,
  startDelay = 0,   // ms to wait before the auto-blob sequence fires
}) {
  const containerRef = useRef(null)
  const letterRefs = useRef([])
  const pathRefs = useRef([])
  const blobState = useRef([])
  const colorIdx = useRef(0)
  const rafId = useRef(null)
  const autoAnimDone = useRef(false)
  const [ready, setReady] = useState(false)

  const allLetters = text.split("").filter((ch) => ch !== " ")
  const totalUnits = allLetters.length

  useEffect(() => {
    if (totalUnits === 0) return

    blobState.current = Array.from({ length: totalUnits }, (_, i) => ({
      curX: -999, curY: -999, curRx: 0, curRy: 0,
      tarX: -999, tarY: -999, tarRx: 0, tarRy: 0,
      phase: Math.random() * Math.PI * 2,
      wobble: 0, tarWobble: 0,
      rotation: 0, tarRotation: Math.random() * Math.PI * 2,
      color: COLORS[i % COLORS.length],
      visible: false,
    }))

    function animate() {
      blobState.current.forEach((b, i) => {
        b.phase += 0.045
        b.curX = lerp(b.curX, b.tarX, 0.14)
        b.curY = lerp(b.curY, b.tarY, 0.14)
        b.curRx = lerp(b.curRx, b.tarRx, 0.10)
        b.curRy = lerp(b.curRy, b.tarRy, 0.10)
        b.wobble = lerp(b.wobble, b.tarWobble, 0.08)
        b.rotation = lerpAngle(b.rotation, b.tarRotation, 0.07)

        const pathEl = pathRefs.current[i]
        if (!pathEl) return

        if (b.curRx < 0.5) {
          pathEl.setAttribute("d", "")
          return
        }
        pathEl.setAttribute(
          "d",
          buildBlobPath(b.curX, b.curY, b.curRx, b.curRy, b.phase, b.wobble, b.rotation)
        )
      })
      rafId.current = requestAnimationFrame(animate)
    }

    rafId.current = requestAnimationFrame(animate)
    setReady(true)
    return () => cancelAnimationFrame(rafId.current)
  }, [totalUnits])

  // Auto-animate on mount: sequentially blob each letter, after startDelay
  useEffect(() => {
    if (!ready || autoAnimDone.current) return
    const timers = []
    allLetters.forEach((_, i) => {
      const showTimer = setTimeout(() => showBlob(i), startDelay + i * autoDelay)
      timers.push(showTimer)
      const hideTimer = setTimeout(() => {
        hideBlob(i)
        if (i === allLetters.length - 1) autoAnimDone.current = true
      }, startDelay + i * autoDelay + autoDuration)
      timers.push(hideTimer)
    })
    return () => timers.forEach(clearTimeout)
  }, [ready, allLetters.length, autoDelay, autoDuration, startDelay])

  function showBlob(i) {
    const span = letterRefs.current[i]
    const container = containerRef.current
    if (!span || !container) return
    const b = blobState.current[i]
    if (!b) return
    const r = span.getBoundingClientRect()
    const cr = container.getBoundingClientRect()
    const cx = r.left - cr.left + r.width / 2
    const cy = r.top - cr.top + r.height / 2

    if (!b.visible) {
      b.curX = cx; b.curY = cy
      b.curRx = r.width * 0.3; b.curRy = r.height * 0.3
    }

    b.tarX = cx; b.tarY = cy
    b.tarRx = r.width * 0.82
    b.tarRy = r.height * 0.68
    b.tarWobble = 1
    b.tarRotation = b.rotation + (Math.random() * Math.PI - Math.PI / 2)

    b.color = COLORS[colorIdx.current % COLORS.length]
    colorIdx.current++
    if (pathRefs.current[i]) pathRefs.current[i].setAttribute("fill", b.color)
    b.visible = true
  }

  function hideBlob(i) {
    const b = blobState.current[i]
    if (!b) return
    b.tarRx = 0; b.tarRy = 0
    b.tarWobble = 0; b.visible = false
  }

  // Build letter spans
  let unitIdx = 0
  const chars = text.split("").map((ch, charIdx) => {
    if (ch === " ") {
      return (
        <span key={`s-${charIdx}`} className="inline-block w-[0.25em]">
          {"\u00A0"}
        </span>
      )
    }
    const capturedIdx = unitIdx
    unitIdx++
    return (
      <span
        key={`l-${charIdx}`}
        className="inline-block relative"
        style={{ zIndex: 10 }}
        data-blob-text-letter
        ref={(el) => { letterRefs.current[capturedIdx] = el }}
        onMouseEnter={() => showBlob(capturedIdx)}
        onMouseLeave={() => hideBlob(capturedIdx)}
      >
        {ch}
      </span>
    )
  })

  return (
    <div ref={containerRef} className="relative inline-block">
      {/* Blob SVG layer */}
      <svg
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{ zIndex: 5, overflow: "visible" }}
      >
        <defs>
          <filter id={filterId} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9"
              result="goo"
            />
          </filter>
        </defs>
        <g filter={`url(#${filterId})`}>
          {Array.from({ length: totalUnits }).map((_, i) => (
            <path
              key={i}
              ref={(el) => { pathRefs.current[i] = el }}
              fill={COLORS[i % COLORS.length]}
            />
          ))}
        </g>
      </svg>

      {/* Rendered text */}
      <Tag className={className}>
        {chars}
      </Tag>
    </div>
  )
}
