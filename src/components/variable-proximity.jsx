import { useRef, useEffect, useState, Fragment } from "react"

/**
 * VariableProximity
 *
 * Each character's font-variation-settings smoothly interpolates between
 * `fromFontVariationSettings` (mouse far away) and `toFontVariationSettings`
 * (mouse directly over the character), based on distance within `radius` px.
 *
 * Requires a variable font — Alexandria is loaded as a variable font in index.html.
 *
 * Reflow prevention: every character span has a hidden ::after pseudo-element
 * rendered at the maximum weight, which silently reserves the widest possible
 * horizontal space. This means the layout never shifts as weight changes.
 *
 * Props:
 *   label                      — the text string to render
 *   className                  — class on the outer <span>
 *   fromFontVariationSettings  — FVS string when mouse is far  (e.g. "'wght' 400")
 *   toFontVariationSettings    — FVS string when mouse is near  (e.g. "'wght' 900")
 *   containerRef               — ref of the element that receives mousemove events
 *   radius                     — px distance at which the effect reaches full strength
 *   falloff                    — "linear" | "exponential"
 */

/* Inject the reservation CSS once */
let _vpStyleInjected = false
function injectVPStyle() {
  if (_vpStyleInjected || typeof document === "undefined") return
  _vpStyleInjected = true
  const s = document.createElement("style")
  s.id = "vp-reserve-style"
  s.textContent = `
    .vp-ch {
      display:    inline-block;
      white-space: pre;
    }
    /* The ::after reserves the character's width at maximum weight so
       the layout never reflows as font-variation-settings changes. */
    .vp-ch::after {
      content:              attr(data-ch);
      display:              block;
      height:               0;
      overflow:             hidden;
      visibility:           hidden;
      user-select:          none;
      pointer-events:       none;
      speak:                never;
      font-variation-settings: var(--vp-to);
    }
  `
  document.head.appendChild(s)
}

export function VariableProximity({
  label = "",
  className = "",
  fromFontVariationSettings = "'wght' 400, 'opsz' 9",
  toFontVariationSettings   = "'wght' 900, 'opsz' 40",
  containerRef,
  radius  = 120,
  falloff = "linear",
}) {
  const charRefs = useRef([])
  const rafRef   = useRef(null)
  const chars    = label.split("")

  /* Track per-character FVS strings in state */
  const [charFVS, setCharFVS] = useState(() =>
    chars.map(() => fromFontVariationSettings)
  )

  useEffect(() => { injectVPStyle() }, [])

  /* Re-initialise when label changes */
  useEffect(() => {
    setCharFVS(chars.map(() => fromFontVariationSettings))
    charRefs.current = charRefs.current.slice(0, chars.length)
  }, [label]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Parse "  'axis' value, 'axis' value  " into [{axis, value}] */
  const parseFVS = (str) => {
    const out = []
    const re  = /'([^']+)'\s*([\d.]+)/g
    let m
    while ((m = re.exec(str)) !== null)
      out.push({ axis: m[1], value: parseFloat(m[2]) })
    return out
  }

  const fromAxes = parseFVS(fromFontVariationSettings)
  const toAxes   = parseFVS(toFontVariationSettings)

  const buildFVS = (t) =>
    fromAxes
      .map(({ axis, value: from }, i) => {
        const to = toAxes[i]?.value ?? from
        return `'${axis}' ${(from + (to - from) * t).toFixed(2)}`
      })
      .join(", ")

  useEffect(() => {
    const el = containerRef?.current
    if (!el) return

    const onMove = (e) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        const mx = e.clientX
        const my = e.clientY

        setCharFVS(
          charRefs.current.map((span) => {
            if (!span) return fromFontVariationSettings
            const r  = span.getBoundingClientRect()
            const cx = r.left + r.width  / 2
            const cy = r.top  + r.height / 2
            const d  = Math.hypot(mx - cx, my - cy)
            if (d >= radius) return fromFontVariationSettings
            const t  = falloff === "exponential"
              ? Math.pow(1 - d / radius, 2)
              : 1 - d / radius
            return buildFVS(t)
          })
        )
      })
    }

    const onLeave = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      setCharFVS(chars.map(() => fromFontVariationSettings))
    }

    el.addEventListener("mousemove", onMove)
    el.addEventListener("mouseleave", onLeave)
    return () => {
      el.removeEventListener("mousemove", onMove)
      el.removeEventListener("mouseleave", onLeave)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [containerRef, radius, falloff, fromFontVariationSettings, toFontVariationSettings]) // eslint-disable-line react-hooks/exhaustive-deps

  /* Group characters into words so line-breaks only happen at spaces */
  const words = []
  let wordStart = 0
  for (let i = 0; i <= chars.length; i++) {
    if (i === chars.length || chars[i] === " ") {
      if (i > wordStart) words.push({ start: wordStart, end: i })
      wordStart = i + 1
    }
  }

  return (
    <span className={className} aria-label={label} style={{ display: "block" }}>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          {/* Each word is nowrap so the browser can only break at the spaces between words */}
          <span style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {chars.slice(word.start, word.end).map((char, ci) => {
              const i  = word.start + ci
              return (
                <span
                  key={i}
                  ref={(el) => { charRefs.current[i] = el }}
                  data-ch={char}
                  className="vp-ch"
                  style={{
                    fontVariationSettings: charFVS[i] ?? fromFontVariationSettings,
                    transition:            "font-variation-settings 0.15s ease-out",
                    "--vp-to":             toFontVariationSettings,
                  }}
                >
                  {char}
                </span>
              )
            })}
          </span>
          {/* Space lives OUTSIDE the nowrap span — this is the only valid break point.
              Font-variation-settings is locked to base weight so space advance-width
              never changes and can never trigger a line-reflow on hover. */}
          {wi < words.length - 1 && (
            <span
              style={{
                fontVariationSettings: fromFontVariationSettings,
                display:               "inline",
              }}
            >
              {" "}
            </span>
          )}
        </Fragment>
      ))}
    </span>
  )
}
