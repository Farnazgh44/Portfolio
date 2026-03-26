/**
 * BlobButton
 * Wraps any button with small morphing blob particles on hover.
 * Particles use position:absolute relative to the wrapper so they
 * are always exactly at the button edges — no viewport math needed.
 */
import { useState, useRef, useEffect, useCallback } from "react"

/* ── Palette — purple / pink / lavender ── */
const COLORS = [
  "rgba(232,121,249,0.95)",
  "rgba(167,139,250,0.92)",
  "rgba(240,171,252,0.95)",
  "rgba(139, 92,246,0.90)",
  "rgba(216, 72,153,0.88)",
  "rgba(196,181,253,0.92)",
]

/* Short outward vectors — blobs drift ~14–22 px outside the button */
const DIRS = [
  [-14,-20], [ -5,-22], [  6,-21], [ 15,-18],
  [ 20, -8], [ 22,  3], [ 17, 13], [  7, 20],
  [ -4, 22], [-15, 17], [-21,  6], [-20, -8],
]

let _injected = false
function inject() {
  if (_injected || typeof document === "undefined") return
  _injected = true
  const s = document.createElement("style")
  s.id = "bb-kf"
  s.textContent = `
    @keyframes bbM {
      0%,100%{ border-radius:50% }
      40%    { border-radius:65% 35% 58% 42%/45% 60% 40% 55% }
      70%    { border-radius:40% 60% 38% 62%/60% 40% 62% 38% }
    }
    ${DIRS.map(([dx,dy],i)=>`
    @keyframes bbF${i}{
      0%  { transform:translate(0,0)                              scale(0);   opacity:0 }
      20% { transform:translate(${(dx*.4).toFixed(1)}px,${(dy*.4).toFixed(1)}px) scale(1);   opacity:1 }
      75% { transform:translate(${(dx*.85).toFixed(1)}px,${(dy*.85).toFixed(1)}px) scale(.75); opacity:.85 }
      100%{ transform:translate(${dx}px,${dy}px)                 scale(.3);  opacity:0 }
    }`).join("")}
  `
  document.head.appendChild(s)
}

let _uid = 0

export function BlobButton({
  children,
  onClick,
  style,
  className,
  disabled,
  type,
  wrapperStyle,
  wrapperClass,
  stopProp = false,
  onMouseEnter: outerEnter,
  onMouseLeave: outerLeave,
  ...rest
}) {
  const [particles, setParticles] = useState([])
  const wrapRef     = useRef(null)
  const intervalRef = useRef(null)
  const hoveredRef  = useRef(false)

  useEffect(() => { inject() }, [])
  useEffect(() => () => clearInterval(intervalRef.current), [])

  const remove = useCallback(id =>
    setParticles(p => p.filter(x => x.id !== id)), [])

  const spawn = useCallback(() => {
    const el = wrapRef.current
    if (!el) return
    const W = el.offsetWidth
    const H = el.offsetHeight

    /* Random point on the perimeter of the button */
    const edge = Math.floor(Math.random() * 4)
    let x, y
    if      (edge === 0) { x = Math.random() * W; y = 0 }
    else if (edge === 1) { x = W;                 y = Math.random() * H }
    else if (edge === 2) { x = Math.random() * W; y = H }
    else                 { x = 0;                 y = Math.random() * H }

    const id    = ++_uid
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const size  = 5 + Math.random() * 6          /* 5 – 11 px */
    const dir   = Math.floor(Math.random() * DIRS.length)
    const dur   = 650 + Math.random() * 300      /* 650 – 950 ms */

    setParticles(p => [...p.slice(-16), { id, x, y, color, size, dir, dur }])
    setTimeout(() => remove(id), dur + 50)
  }, [remove])

  const enter = useCallback(e => {
    if (hoveredRef.current) return
    hoveredRef.current = true
    spawn()
    intervalRef.current = setInterval(spawn, 160)
    outerEnter?.(e)
  }, [spawn, outerEnter])

  const leave = useCallback(e => {
    hoveredRef.current = false
    clearInterval(intervalRef.current)
    outerLeave?.(e)
  }, [outerLeave])

  return (
    <span
      ref={wrapRef}
      className={wrapperClass}
      style={{
        position:   "relative",   /* particles are absolute inside this */
        display:    "inline-flex",
        overflow:   "visible",    /* particles can extend outside */
        ...wrapperStyle,
      }}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <button
        type={type}
        disabled={disabled}
        className={className}
        style={style}
        onClick={stopProp ? e => { e.stopPropagation(); onClick?.(e) } : onClick}
        {...rest}
      >
        {children}
      </button>

      {particles.map(p => (
        <span
          key={p.id}
          aria-hidden="true"
          style={{
            position:      "absolute",
            left:          p.x,
            top:           p.y,
            width:         p.size,
            height:        p.size,
            background:    p.color,
            borderRadius:  "50%",
            pointerEvents: "none",
            zIndex:        9999,
            animation:     `bbF${p.dir} ${p.dur}ms ease-out forwards, bbM ${Math.round(p.dur*.65)}ms ease-in-out infinite`,
          }}
        />
      ))}
    </span>
  )
}
