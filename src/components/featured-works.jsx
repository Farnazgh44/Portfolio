import { useRef, useEffect, useLayoutEffect, useState } from "react"
import { useRouter }   from "../lib/router-context"
import { ScrollFloat } from "./scroll-float"
import { BlobButton }  from "./blob-button"

/*
  Featured Works — two phases:

  PHASE 1  (scroll-driven, s 0→1):
    Cards fly up from the bottom one by one into a diagonal cascade.
    "Featured Works" bg title shrinks & fades behind them.

  PHASE 2  (interactive, activates at s ≥ SWIPE_THRESHOLD):
    Front card (bottom-right) can be dragged left OR right.
    Release past SENSITIVITY px → flies off, drops to back of stack.
    All other cards cascade smoothly to their new diagonal positions.
*/

const N                 = 3
const SECTION_HEIGHT_VH = 400
const SWIPE_THRESHOLD   = 0.75   // activates after all 3 cards are fully up
const EXIT_THRESHOLD    = 0.70   // deactivates when user scrolls back — must be past card 2's window end (0.73) so all cards are at translate(-50%,-50%) when Phase 1 resumes, preventing a jump
const SENSITIVITY       = 80     // px drag to trigger a swipe

/* Card images & labels — index matches card position
   imgPad: padding around image container (less = bigger image)
   imgPos:  objectPosition for fine-tuning crop/centering             */
const CARD_DATA = [
  {
    img:    "/images/Laptop_Feature.png",
    label:  "UI/UX & Product Design",
    imgPad: "18px 18px 10px",
    imgPos: "center top",
    title:  "SugarCloud Cupcakes",
    desc:   "SugarCloud Cupcakes is an online cupcake ordering website. Led the design process including UX research, user journey development, UI/UX design, wireframing, responsive layouts for desktop and mobile, and interactive prototyping.",
    route:  "project-sugarcloud",
  },
  {
    img:    "/images/Phone1_feature.png",
    label:  "Mobile App Design",
    imgPad: "6px 10px 6px",
    imgPos: "center center",
    title:  "AlpineLink",
    desc:   "AlpineLink is an all-season outdoor adventure app designed for hiking, skiing, biking and snowboarding. Led the design process including UX research, user flows, UI/UX design, and interactive prototyping.",
    route:  "project-alpine",
  },
  {
    img:    "/images/Phone2_feature.png",
    label:  "Mobile App Design",
    imgPad: "6px 10px 6px",
    imgPos: "center center",
    title:  "Reddit App Redesign",
    desc:   "Reddit App Redesign focused on improving user experience and visual clarity. Conducted interface analysis and redesigned key screens through wireframing, UI improvements, and interactive prototyping.",
    route:  "project-reddit",
  },
]

/* POS[0]=back/bottom-left … POS[4]=front/top-right
   Cards enter left→right, each one layering IN FRONT of the previous      */
const CARD_POS = [
  { left: "23vw", top: "65vh" },
  { left: "50vw", top: "58vh" },
  { left: "77vw", top: "51vh" },
]

/* Each card rises from below during its own scroll window.
   ~90vh per card ≈ one scroll gesture each.                */
const CARD_WINDOWS = [
  [0.05, 0.28],   // SugarCloud
  [0.28, 0.51],   // AlpineLink
  [0.51, 0.73],   // Reddit
]

const easeOut = t => 1 - Math.pow(1 - t, 3)
const clamp01 = x => Math.max(0, Math.min(1, x))

const GLASS = {
  width:                "clamp(280px, 34vw, 480px)",
  height:               "clamp(280px, 34vw, 480px)",
  borderRadius:         "24px",
  background:           "rgba(255,255,255,0.07)",
  backdropFilter:       "blur(22px)",
  WebkitBackdropFilter: "blur(22px)",
  border:               "1px solid rgba(255,255,255,0.20)",
  boxShadow:            "0 12px 48px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.14)",
}

export function FeaturedWorks() {
  const { navigate }      = useRouter()
  const clickSuppressRef  = useRef(false)   // true when a drag occurred — suppresses next click
  const hintDoneRef       = useRef(false)   // true after the one-time jiggle hint has played
  const sectionRef        = useRef(null)
  const titleRef     = useRef(null)
  const cardRefs     = useRef([])          // cardRefs.current[i] = DOM node for card i
  const rafRef       = useRef(null)
  const scrollRef    = useRef(0)
  const swipeModeRef  = useRef(false)      // mirror of swipeMode for RAF closure
  const isDraggingRef = useRef(false)      // true while user is dragging the front card
  const frontIdxRef   = useRef(2)          // index of the current front card (kept in sync)

  /* Apply the nudge CSS animation to a card element (clears inline transform first) */
  const applyNudge = el => {
    if (!el) return
    el.style.transform = ""
    el.style.animation = "fwCardNudge 1.5s ease-in-out infinite"
  }
  /* Remove the nudge animation and restore the neutral transform */
  const clearNudge = el => {
    if (!el) return
    el.style.animation  = "none"
    el.style.transform  = "translate(-50%, -50%)"
  }

  /* queue[j] = which card is at diagonal position j
     queue[0]=back(top-left) … queue[N-1]=front(bottom-right)
     Initialised reversed so card 0 (first project) starts at the front  */
  const [queue, setQueue]         = useState([0, 1, 2])
  const [swipeMode, setSwipeMode] = useState(false)
  const [showSwipeUI, setShowSwipeUI] = useState(false)  // text + button visibility
  const [showHint, setShowHint]   = useState(false)   // controls arrow hint visibility

  // After a swipe, the card that went to back needs a silent transform reset
  const pendingResetRef = useRef(null)

  /* ── PHASE 1 INIT: hide all cards before first paint ──────────────────
     useLayoutEffect runs synchronously after DOM mutations, before paint.
     Empty deps = runs once on mount only → never overridden by re-renders. */
  useLayoutEffect(() => {
    const offY = window.innerHeight * 1.15
    cardRefs.current.forEach(el => {
      if (!el) return
      el.style.opacity   = "0"
      el.style.transform = `translate(-50%, calc(-50% + ${offY}px))`
    })
  }, [])

  /* ── Scroll tracker ─────────────────────────────────────────────────── */
  useEffect(() => {
    function onScroll() {
      const el = sectionRef.current
      if (!el) return
      const rect  = el.getBoundingClientRect()
      const total = el.offsetHeight - window.innerHeight
      if (total <= 0) return
      scrollRef.current = clamp01(-rect.top / total)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* ── RAF loop ───────────────────────────────────────────────────────── */
  useEffect(() => {
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick)
      const s = scrollRef.current

      /* Title: stays in background throughout all card animations, shrinking
         gradually as each card rises, then disappears exactly when the last
         card is fully up and swipe mode activates.                         */
      if (titleRef.current) {
        const t = clamp01(s / SWIPE_THRESHOLD)   // 0 → 1 across entire card range
        titleRef.current.style.transform = `translate(-50%, -50%) scale(${1 - t * 0.6})`
        titleRef.current.style.opacity   = String(0.22 * (1 - t))
      }

      /* ── Phase transition: enter swipe mode ── */
      if (s >= SWIPE_THRESHOLD && !swipeModeRef.current) {
        swipeModeRef.current = true
        const initialFrontIdx = 2
        cardRefs.current.forEach((el, i) => {
          if (!el) return
          const [, winEnd] = CARD_WINDOWS[i]
          // If this card already completed its scroll window, snap it (no visible difference).
          // If the user scrolled fast and the card never animated, use a smooth transition
          // so it rises into place instead of teleporting.
          const cardComplete = s >= winEnd
          el.style.transition = cardComplete
            ? "none"
            : "transform 0.50s cubic-bezier(0.34,1.1,0.64,1), opacity 0.35s ease"
          el.style.left       = CARD_POS[i].left
          el.style.top        = CARD_POS[i].top
          el.style.transform  = "translate(-50%, -50%)"
          el.style.opacity    = "1"
          el.style.zIndex     = String(i + 1)
        })
        requestAnimationFrame(() => {
          frontIdxRef.current = initialFrontIdx
          applyNudge(cardRefs.current[initialFrontIdx])
        })
        setShowSwipeUI(true)   // text slides in from left, button from right
        setSwipeMode(true)
        return
      }

      /* ── Phase transition: exit swipe mode — text/button slide out, cards go down in reverse ── */
      if (s < EXIT_THRESHOLD && swipeModeRef.current) {
        swipeModeRef.current = false
        setShowSwipeUI(false)   // text slides left, button slides right
        const offY = window.innerHeight * 1.15
        // Pre-set each card to exactly where Phase 1 will place it at the current
        // scroll position. This prevents a single-frame jump when Phase 1 takes over,
        // because the transition is "none" and the position is already correct.
        cardRefs.current.forEach((el, i) => {
          if (!el) return
          el.style.animation  = ""       // kill nudge — CSS animations override style.transform
          el.style.transition = "none"
          el.style.cursor     = "default"
          el.style.left       = CARD_POS[i].left
          el.style.top        = CARD_POS[i].top
          // Mirror the Phase 1 formula so there is zero positional discontinuity
          const [winStart, winEnd] = CARD_WINDOWS[i]
          const p = clamp01((s - winStart) / (winEnd - winStart))
          const t = easeOut(p)
          el.style.transform  = `translate(-50%, calc(-50% + ${(1 - t) * offY}px))`
          el.style.opacity    = String(Math.min(1, t * 5))
        })
        setSwipeMode(false)
        setQueue([0, 1, 2])
        // fall through → scroll-driven Phase 1 animates cards back down naturally
      }

      /* ── Phase 1: scroll-driven stack animation ── */
      if (swipeModeRef.current) return

      // Each card rises through its own scroll window — one scroll per card
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        const [winStart, winEnd] = CARD_WINDOWS[i]
        const p   = clamp01((s - winStart) / (winEnd - winStart))
        const t   = easeOut(p)
        const offY = window.innerHeight * 1.15
        el.style.transform = `translate(-50%, calc(-50% + ${(1 - t) * offY}px))`
        el.style.opacity   = String(Math.min(1, t * 5))
      })
    }

    tick()
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  /* ── After queue updates: reset the sent-to-back card ──────────────── */
  useEffect(() => {
    if (!swipeMode) return
    const idx = pendingResetRef.current
    if (idx == null) return
    pendingResetRef.current = null

    const el = cardRefs.current[idx]
    if (!el) return

    // Card is invisible & off-screen → reset transform/position silently
    el.style.transition = "none"
    el.style.transform  = "translate(-50%, -50%)"
    el.style.opacity    = "0"

    // Two rAF ticks so the silent reset paints before we fade back in
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.transition = "opacity 0.4s ease"
      el.style.opacity    = "1"
    }))
  }, [queue, swipeMode])

  /* ── One-time hint: jiggle (option 3) → arrow (option 1) ───────────── */
  useEffect(() => {
    if (!swipeMode)           return   // only runs when swipe mode first activates
    if (hintDoneRef.current)  return   // only once per session
    hintDoneRef.current = true

    const frontIdx = queue[queue.length - 1]
    const frontEl  = cardRefs.current[frontIdx]
    if (!frontEl) return

    // ── Option 3: jiggle ──────────────────────────────────────────────
    // t=700ms  → nudge left
    const t1 = setTimeout(() => {
      frontEl.style.transition = "transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
      frontEl.style.transform  = "translate(calc(-50% - 48px), -50%) rotate(-5deg)"

      // t=1180ms → spring back
      const t2 = setTimeout(() => {
        frontEl.style.transition = "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)"
        frontEl.style.transform  = "translate(-50%, -50%)"
      }, 480)

      return () => clearTimeout(t2)
    }, 700)

    // ── Option 1: arrow hint ──────────────────────────────────────────
    // t=1900ms → fade arrow in (after jiggle fully settles)
    const t3 = setTimeout(() => {
      setShowHint(true)
      // t=5400ms → fade arrow out (3.5s of visibility)
      const t4 = setTimeout(() => setShowHint(false), 3500)
      return () => clearTimeout(t4)
    }, 1900)

    return () => { clearTimeout(t1); clearTimeout(t3) }
  }, [swipeMode])   // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Z-index sync + nudge transfer to new front card ───────────────── */
  useEffect(() => {
    if (!swipeMode) return
    cardRefs.current.forEach((el, i) => {
      if (el) el.style.zIndex = String(queue.indexOf(i) + 1)
    })
    const newFrontIdx = queue[queue.length - 1]
    /* Remove nudge from cards that are no longer the front */
    cardRefs.current.forEach((el, i) => {
      if (el && i !== newFrontIdx) {
        el.style.animation = ""   // clear without restoring transform (RAF handles it)
      }
    })
    frontIdxRef.current = newFrontIdx
    /* Start nudging the new front card after it has faded back in (~500ms) */
    const tid = setTimeout(() => {
      if (!isDraggingRef.current) {
        applyNudge(cardRefs.current[newFrontIdx])
      }
    }, 520)
    return () => clearTimeout(tid)
  }, [queue, swipeMode])

  /* ── Drag / swipe interaction ───────────────────────────────────────── */
  useEffect(() => {
    if (!swipeMode) return

    const frontIdx = queue[queue.length - 1]
    const frontEl  = cardRefs.current[frontIdx]
    if (!frontEl) return

    frontEl.style.cursor = "grab"

    let dragging = false
    let startX   = 0
    let fired    = false   // prevent double-fire on overlapping events

    const onDown = clientX => {
      if (fired) return
      dragging = true
      startX   = clientX
      isDraggingRef.current    = true
      clickSuppressRef.current = false          // reset on each new press
      clearNudge(frontEl)                       // stop nudge, restore neutral transform
      frontEl.style.transition = "none"
      frontEl.style.cursor     = "grabbing"
    }

    const onMove = clientX => {
      if (!dragging) return
      const dx = clientX - startX
      if (Math.abs(dx) > 5) clickSuppressRef.current = true   // real drag — suppress click
      frontEl.style.transform = `translate(calc(-50% + ${dx}px), -50%) rotate(${dx * 0.04}deg)`
    }

    const onUp = clientX => {
      if (!dragging) return
      dragging = false
      frontEl.style.cursor = "grab"

      const dx  = clientX - startX
      const dir = dx > 0 ? 1 : -1

      if (Math.abs(dx) >= SENSITIVITY) {
        fired = true

        /* Fly the card off to the side */
        frontEl.style.transition = "transform 0.45s cubic-bezier(0.4,0,1,0.8), opacity 0.35s ease"
        frontEl.style.transform  = `translate(calc(-50% + ${dir * 120}vw), -50%) rotate(${dir * 25}deg)`
        frontEl.style.opacity    = "0"

        /* Slide remaining cards toward the new front position */
        cardRefs.current.forEach((el, i) => {
          if (el && i !== frontIdx) {
            el.style.transition = "left 0.45s ease, top 0.45s ease"
          }
        })

        setTimeout(() => {
          isDraggingRef.current   = false
          pendingResetRef.current = frontIdx
          setQueue(prev => {
            const next = [...prev]
            next.unshift(next.pop())   // front → back
            return next
          })
        }, 460)

      } else {
        /* Snap back with spring, then resume nudge after transition settles */
        frontEl.style.transition = "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)"
        frontEl.style.transform  = "translate(-50%, -50%)"
        setTimeout(() => {
          isDraggingRef.current = false
          applyNudge(cardRefs.current[frontIdxRef.current])
        }, 380)
      }
    }

    const onMouseDown  = e => { e.preventDefault(); onDown(e.clientX) }
    const onMouseMove  = e => onMove(e.clientX)
    const onMouseUp    = e => onUp(e.clientX)
    const onTouchStart = e => onDown(e.touches[0].clientX)
    const onTouchMove  = e => { e.preventDefault(); onMove(e.touches[0].clientX) }
    const onTouchEnd   = e => onUp(e.changedTouches[0].clientX)

    frontEl.addEventListener("mousedown",  onMouseDown)
    window .addEventListener("mousemove",  onMouseMove)
    window .addEventListener("mouseup",    onMouseUp)
    frontEl.addEventListener("touchstart", onTouchStart, { passive: false })
    window .addEventListener("touchmove",  onTouchMove,  { passive: false })
    window .addEventListener("touchend",   onTouchEnd)

    return () => {
      frontEl.removeEventListener("mousedown",  onMouseDown)
      window .removeEventListener("mousemove",  onMouseMove)
      window .removeEventListener("mouseup",    onMouseUp)
      frontEl.removeEventListener("touchstart", onTouchStart)
      window .removeEventListener("touchmove",  onTouchMove)
      window .removeEventListener("touchend",   onTouchEnd)
      frontEl.style.cursor = "default"
    }
  }, [swipeMode, queue])

  /* ── Render ─────────────────────────────────────────────────────────── */
  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ height: `${SECTION_HEIGHT_VH}vh` }}
      id="projects"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* ShinyText keyframes + card hover overlay + swipe hint */}
        <style>{`
          @keyframes fwShine {
            0%   { background-position: 250% center; }
            100% { background-position: -250% center; }
          }
          .fw-card .fw-overlay {
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          }
          .fw-card:hover .fw-overlay {
            opacity: 1;
            pointer-events: auto;
          }
          @keyframes fwHintFloat {
            0%, 100% { transform: translateX(0px);   }
            30%      { transform: translateX(-11px);  }
            70%      { transform: translateX(11px);   }
          }
          .fw-hint-pill {
            animation: fwHintFloat 1.5s ease-in-out infinite;
          }
          @keyframes fwCardNudge {
            0%, 100% { transform: translate(-50%, -50%) translateX(0px)   rotate(0deg);    }
            30%      { transform: translate(-50%, -50%) translateX(-9px)  rotate(-0.7deg); }
            70%      { transform: translate(-50%, -50%) translateX(9px)   rotate(0.7deg);  }
          }
          .fw-label-btn {
            color: rgba(255,255,255,0.75);
            cursor: pointer;
            transition: color 0.25s ease;
          }
          .fw-label-btn:hover {
            color: rgba(255,255,255,1);
          }
        `}</style>

        {/* "Featured Works" background title */}
        <h2
          ref={titleRef}
          className="absolute font-bold pointer-events-none select-none"
          style={{
            left:       "50%",
            top:        "56%",
            transform:  "translate(-50%, -50%)",
            opacity:    0.22,
            zIndex:     0,
            whiteSpace: "nowrap",
            fontSize:   "clamp(2.8rem, 9vw, 7.5rem)",
            willChange: "transform, opacity",
            /* ── Shiny text ── */
            background:           "linear-gradient(90deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.55) 30%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.55) 70%, rgba(255,255,255,0.55) 100%)",
            backgroundSize:       "250% auto",
            WebkitBackgroundClip: "text",
            backgroundClip:       "text",
            WebkitTextFillColor:  "transparent",
            animation:            "fwShine 3.5s linear infinite",
          }}
        >
          Featured Works
        </h2>

        {/* ── Top-left swipe hint with ScrollFloat ── */}
        <div style={{
          position:      "absolute",
          top:           "clamp(60px, 10vh, 100px)",
          left:          "clamp(24px, 3vw, 52px)",
          zIndex:        20,
          opacity:       showSwipeUI ? 1 : 0,
          transform:     showSwipeUI ? "translateX(0)" : "translateX(-70vw)",
          transition:    "opacity 0.55s ease, transform 0.65s cubic-bezier(0.34,1.1,0.64,1)",
          pointerEvents: "none",
        }}>
          <ScrollFloat
            triggered={showSwipeUI}
            animationDuration={1}
            stagger={0.03}
            style={{
              color:         "rgba(255,255,255,0.90)",
              fontSize:      "3rem",
              fontWeight:    600,
              letterSpacing: "0.02em",
              whiteSpace:    "nowrap",
            }}
          >
            Swipe to explore projects
          </ScrollFloat>
        </div>

        {/* ── Bottom-right All Projects button ── */}
        <BlobButton
          onClick={() => navigate("projects")}
          wrapperStyle={{
            position:      "absolute",
            bottom:        "clamp(20px, 3.5vh, 44px)",
            right:         "clamp(24px, 3vw, 52px)",
            zIndex:        20,
            opacity:       showSwipeUI ? 1 : 0,
            transform:     showSwipeUI ? "translateX(0)" : "translateX(70vw)",
            transition:    "opacity 0.55s ease 0.08s, transform 0.65s cubic-bezier(0.34,1.1,0.64,1) 0.08s",
            pointerEvents: showSwipeUI ? "auto" : "none",
          }}
          style={{
            display:       "flex",
            alignItems:    "center",
            gap:           "8px",
            padding:       "11px 26px",
            borderRadius:  "999px",
            background:    "linear-gradient(135deg, rgba(100,80,255,0.7), rgba(180,60,200,0.7))",
            backdropFilter:"blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            border:        "1px solid rgba(160,120,255,0.5)",
            color:         "rgba(255,255,255,0.88)",
            fontSize:      "0.85rem",
            fontWeight:    500,
            letterSpacing: "0.04em",
            cursor:        "pointer",
          }}
        >
          All Projects
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7h9M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </BlobButton>

        {/* Glass cards
            - left/top come from JSX (updated by queue in swipe phase)
            - opacity/transform come from RAF & event handlers only        */}
        {Array.from({ length: N }, (_, i) => {
          const slot = swipeMode ? queue.indexOf(i) : i
          const pos  = CARD_POS[slot]
          const data = CARD_DATA[i]
          return (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el }}
              className="fw-card"
              style={{
                position:       "absolute",
                left:           pos.left,
                top:            pos.top,
                zIndex:         slot + 1,
                display:        "flex",
                flexDirection:  "column",
                alignItems:     "center",
                justifyContent: "flex-start",
                overflow:       "hidden",
                /* opacity & transform intentionally omitted —
                   managed exclusively via direct DOM (RAF + handlers)     */
                ...GLASS,
              }}
            >
              {/* Project image — fills the top ~80% of the card */}
              <div style={{
                width:    "100%",
                flex:     "1 1 0",
                minHeight: 0,
                display:  "flex",
                alignItems: "center",
                justifyContent: "center",
                padding:  data.imgPad,
              }}>
                <img
                  src={data.img}
                  alt={data.label}
                  draggable="false"
                  style={{
                    width:      "100%",
                    height:     "100%",
                    objectFit:  "contain",
                    objectPosition: data.imgPos,
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Label at the bottom — clicking navigates to projects page */}
              <div style={{
                width:      "100%",
                padding:    "10px 18px 16px",
                flexShrink: 0,
                borderTop:  "1px solid rgba(255,255,255,0.10)",
              }}>
                <p
                  className="fw-label-btn"
                  onClick={e => { e.stopPropagation(); navigate("projects") }}
                  style={{
                    margin:        0,
                    fontSize:      "clamp(0.7rem, 1.1vw, 0.9rem)",
                    fontWeight:    500,
                    letterSpacing: "0.04em",
                    textAlign:     "center",
                    whiteSpace:    "nowrap",
                    overflow:      "hidden",
                    textOverflow:  "ellipsis",
                  }}
                >
                  {data.label}
                </p>
              </div>

              {/* ── Swipe arrow hint — always visible on front card in swipe mode ── */}
              {swipeMode && queue.indexOf(i) === N - 1 && (
                <div style={{
                  position:      "absolute",
                  bottom:        "62px",
                  left:          0,
                  right:         0,
                  display:       "flex",
                  justifyContent:"center",
                  pointerEvents: "none",
                  zIndex:        20,
                  opacity:       1,
                  transition:    "opacity 0.5s ease",
                }}>
                  <div
                    className="fw-hint-pill"
                    style={{
                      display:       "flex",
                      alignItems:    "center",
                      gap:           "10px",
                      color:         "rgba(255,255,255,0.85)",
                      fontSize:      "clamp(0.75rem, 1.1vw, 0.88rem)",
                      fontWeight:    500,
                      letterSpacing: "0.06em",
                      whiteSpace:    "nowrap",
                    }}
                  >
                    <span style={{ fontSize: "1.1em" }}>←</span>
                    <span>swipe</span>
                    <span style={{ fontSize: "1.1em" }}>→</span>
                  </div>
                </div>
              )}

              {/* Hover overlay — fades in via CSS .fw-card:hover .fw-overlay */}
              <div
                className="fw-overlay"
                style={{
                  position:       "absolute",
                  inset:          0,
                  display:        "flex",
                  flexDirection:  "column",
                  alignItems:     "center",
                  justifyContent: "center",
                  padding:        "24px 22px",
                  background:     "rgba(10, 0, 20, 0.72)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)",
                  borderRadius:   "inherit",
                  textAlign:      "center",
                  gap:            "14px",
                }}
              >
                {/* Project title */}
                <p style={{
                  margin:        0,
                  color:         "#fff",
                  fontSize:      "clamp(0.85rem, 1.4vw, 1.1rem)",
                  fontWeight:    700,
                  letterSpacing: "0.02em",
                  lineHeight:    1.2,
                }}>
                  {data.title}
                </p>

                {/* Thin divider */}
                <div style={{
                  width:      "36px",
                  height:     "1.5px",
                  background: "rgba(255,255,255,0.35)",
                  borderRadius: "2px",
                  flexShrink: 0,
                }} />

                {/* Description */}
                <p style={{
                  margin:      0,
                  color:       "rgba(255,255,255,0.80)",
                  fontSize:    "clamp(0.65rem, 1vw, 0.82rem)",
                  lineHeight:  1.6,
                  fontWeight:  400,
                  overflow:    "hidden",
                  display:     "-webkit-box",
                  WebkitLineClamp: 6,
                  WebkitBoxOrient: "vertical",
                }}>
                  {data.desc}
                </p>

                {/* View Project button */}
                <BlobButton
                  stopProp
                  onClick={() => navigate(data.route)}
                  style={{
                    marginTop:      "4px",
                    flexShrink:     0,
                    padding:        "8px 24px",
                    borderRadius:   "999px",
                    background:     "rgba(255,255,255,0.14)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                    border:         "1px solid rgba(255,255,255,0.28)",
                    color:          "rgba(255,255,255,0.90)",
                    fontSize:       "clamp(0.65rem, 0.9vw, 0.8rem)",
                    fontWeight:     500,
                    letterSpacing:  "0.04em",
                    cursor:         "pointer",
                    transition:     "background 0.25s ease, color 0.25s ease",
                    whiteSpace:     "nowrap",
                  }}
                >
                  View Project
                </BlobButton>
              </div>
            </div>
          )
        })}


      </div>
    </section>
  )
}
