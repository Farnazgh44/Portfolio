import { useState, useRef, useEffect } from "react"
import { Footer }    from "../components/footer"
import { SideBlobs } from "../components/side-blobs"
import { useRouter }  from "../lib/router-context"

/* ─── Toolkit icon map ──────────────────────────────────────────────────────── */
const TOOL_ICONS = {
  Figma:           "/images/toolkit-figma.png",
  Photoshop:       "/images/toolkit-photoshop.png",
  Illustrator:     "/images/toolkit-illustrator.png",
  InDesign:        "/images/toolkit-indesign.png",
  "After Effects": "/images/toolkit-aftereffects.png",
  Canva:           "/images/toolkit-canva.png",
  "VS Code":       "/images/toolkit-vscode.png",
  Dimension:       "/images/toolkit-dimension.png",
  Tinkercad:       "/images/toolkit-tinkercad.png",
  Maze:            "/images/toolkit-maze.png",
}

/* ─── Project data ──────────────────────────────────────────────────────────── */
const PROJECTS = [
  {
    id:          "sugarcloud",
    pageId:      "project-sugarcloud",
    image:       "/images/Laptop_Feature.png",
    imageScale:  1.03,
    logo:        "/images/SugarcloudLogo.png",
    logoHeight:  "clamp(60px, 7vw, 90px)",
    nameScript:  "SugarCloud",
    namePlain:   "Cupcakes",
    category:    "UI/UX & Product Design",
    desc:        "SugarCloud Cupcakes is an online cupcake ordering website. Led the design process including UX research, user journey development, UI/UX design, wireframing, responsive layouts for desktop and mobile, and interactive prototyping.",
    tools:       ["Figma", "Photoshop", "Illustrator"],
  },
  {
    id:          "alpine",
    pageId:      "project-alpine",
    image:       "/images/Phone1_feature.png",
    logo:        "/images/AlpineLogo.png",
    logoHeight:  "clamp(68px, 8.5vw, 108px)",
    name:        "AlpineLink",
    nameStyle:   "upper",
    category:    "UI/UX & Product Design",
    desc:        "AlpineLink is an all-season outdoor adventure app designed for hiking, skiing, biking, and snowboarding. Led the design process including UX research, user flows, UI/UX design, and interactive prototyping.",
    tools:       ["Figma", "After Effects"],
  },
  {
    id:          "reddit",
    pageId:      "project-reddit",
    image:       "/images/Phone2_feature.png",
    logo:        null,
    name:        "Reddit Redesign",
    category:    "Mobile App Design",
    desc:        "A Reddit mobile app redesign focused on improving user experience and visual clarity across key screens including the feed, post detail, and profile views.",
    tools:       ["Figma", "Photoshop"],
  },
  {
    id:          "dogwood",
    pageId:      "project-dogwood",
    image:       "/images/Dogwood.png",
    imageScale:  1.5,
    logo:        null,
    name:        "Dogwood Landscaping & Gardening",
    category:    "Web Design & UX Case Study",
    desc:        "A website design for Dogwood Landscaping & Gardening — a local landscaping and gardening business. Focused on clean layout, approachable branding, and a seamless user experience for potential clients.",
    tools:       ["Figma", "Canva", "VS Code"],
  },
  {
    id:          "game",
    pageId:      "project-game",
    image:       "/images/Game.png",
    imageScale:  1.5,
    logo:        null,
    name:        "Space Shipper",
    category:    "Game UI",
    desc:        "A game user interface design project focused on intuitive controls, immersive visual hierarchy, and a cohesive in-game experience across menus, HUD elements, and interactive screens.",
    tools:       ["Figma", "Canva", "Photoshop"],
  },
]

const N = PROJECTS.length

/* ─── Card transform / filter based on offset ──────────────────────────────── */
function getCardStyle(offset) {
  const abs = Math.abs(offset)

  if (abs === 0) {
    return {
      transform: "translate(-50%, -50%) scale(1)",
      filter:    "none",
      opacity:   1,
      zIndex:    10,
    }
  }

  if (abs === 1) {
    const dir = offset > 0 ? 1 : -1
    return {
      transform: `translate(calc(-50% + ${dir * 20}vw), -50%) scale(0.70)`,
      filter:    "none",
      opacity:   1,
      zIndex:    6,
    }
  }

  /* abs === 2 — hidden behind front */
  return {
    transform: "translate(-50%, -50%) scale(0.62)",
    filter:    "blur(16px)",
    opacity:   0,
    zIndex:    2,
  }
}

/* ─── Tool icon chip ────────────────────────────────────────────────────────── */
function ToolChip({ toolName }) {
  const icon = TOOL_ICONS[toolName]
  return (
    <div style={{
      width:                "46px",
      height:               "46px",
      borderRadius:         "10px",
      background:           "rgba(255,255,255,0.14)",
      backdropFilter:       "blur(10px)",
      WebkitBackdropFilter: "blur(10px)",
      border:               "1px solid rgba(255,255,255,0.22)",
      display:              "flex",
      alignItems:           "center",
      justifyContent:       "center",
      flexShrink:           0,
    }}>
      {icon
        ? <img src={icon} alt={toolName} style={{ width: 28, height: 28, objectFit: "contain" }} />
        : <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.65rem", fontWeight: 600 }}>{toolName.slice(0,2)}</span>
      }
    </div>
  )
}

/* ─── Hover overlay ─────────────────────────────────────────────────────────── */
function CardOverlay({ project, onViewProject }) {
  return (
    <div className="proj-overlay">
      {/* Logo */}
      {project.logo && (
        <img
          src={project.logo}
          alt="logo"
          draggable="false"
          style={{
            height:        project.logoHeight ?? "clamp(60px, 7vw, 90px)",
            width:         "auto",
            maxWidth:      "80%",
            objectFit:     "contain",
            marginBottom:  "14px",
            filter:        "drop-shadow(0 2px 8px rgba(0,0,0,0.4))",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Name */}
      <div style={{ marginBottom: "8px", lineHeight: 1.15, textAlign: "center" }}>
        {project.nameScript ? (
          /* Mixed-font name: "SugarCloud Cupcakes" */
          <p style={{ margin: 0, color: "#fff" }}>
            <span style={{
              fontFamily:  "'Dancing Script', cursive",
              fontSize:    "clamp(1.5rem, 2.6vw, 2.2rem)",
              fontWeight:  600,
              letterSpacing: "0.01em",
            }}>
              {project.nameScript}
            </span>
            {" "}
            <span style={{
              fontFamily:  "inherit",
              fontSize:    "clamp(1.3rem, 2.2vw, 1.9rem)",
              fontWeight:  600,
              letterSpacing: "0.02em",
            }}>
              {project.namePlain}
            </span>
          </p>
        ) : (
          /* Regular / uppercase name */
          <p style={{
            margin:        0,
            color:         "#fff",
            fontSize:      "clamp(1.3rem, 2.4vw, 2rem)",
            fontWeight:    700,
            letterSpacing: project.nameStyle === "upper" ? "0.14em" : "0.02em",
            textTransform: project.nameStyle === "upper" ? "uppercase" : "none",
          }}>
            {project.name}
          </p>
        )}
      </div>

      {/* Category */}
      <p style={{
        margin:        "0 0 14px",
        color:         "rgba(255,255,255,0.70)",
        fontSize:      "clamp(0.78rem, 1.1vw, 0.95rem)",
        fontWeight:    500,
        letterSpacing: "0.04em",
        textAlign:     "center",
      }}>
        {project.category}
      </p>

      {/* View Project button */}
      <button
        className="proj-view-btn"
        onClick={e => { e.stopPropagation(); onViewProject() }}
        style={{
          marginTop:            "28px",
          padding:              "12px 34px",
          borderRadius:         "999px",
          background:           "rgba(255,255,255,0.15)",
          backdropFilter:       "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border:               "1px solid rgba(255,255,255,0.35)",
          color:                "#fff",
          fontSize:             "0.88rem",
          fontWeight:           600,
          letterSpacing:        "0.07em",
          textTransform:        "uppercase",
          cursor:               "pointer",
          transition:           "background 0.25s ease, transform 0.2s ease",
          flexShrink:           0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(255,255,255,0.28)"
          e.currentTarget.style.transform  = "scale(1.04)"
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(255,255,255,0.15)"
          e.currentTarget.style.transform  = "scale(1)"
        }}
      >
        View Project →
      </button>
    </div>
  )
}

/* ─── Arrow button ──────────────────────────────────────────────────────────── */
function ArrowBtn({ onClick, dir, isMobile }) {
  return (
    <button
      onClick={onClick}
      style={{
        position:             "absolute",
        [dir === "left" ? "left" : "right"]: isMobile ? "3vw" : "2.5vw",
        top:                  "50%",
        transform:            "translateY(-50%)",
        zIndex:               20,
        width:                isMobile ? "36px" : "54px",
        height:               isMobile ? "36px" : "54px",
        borderRadius:         "50%",
        background:           "rgba(255,255,255,0.12)",
        backdropFilter:       "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border:               "1px solid rgba(255,255,255,0.24)",
        color:                "rgba(255,255,255,0.88)",
        fontSize:             isMobile ? "1.3rem" : "1.8rem",
        cursor:               "pointer",
        display:              "flex",
        alignItems:           "center",
        justifyContent:       "center",
        lineHeight:           1,
        transition:           "background 0.2s ease, border-color 0.2s ease",
        flexShrink:           0,
        userSelect:           "none",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background  = "rgba(255,255,255,0.22)"
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.40)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background  = "rgba(255,255,255,0.12)"
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.24)"
      }}
    >
      {dir === "left" ? "‹" : "›"}
    </button>
  )
}

/* ─── Main page ─────────────────────────────────────────────────────────────── */
export function ProjectsPage() {
  const [current, setCurrent] = useState(0)
  const dragRef  = useRef(null)
  const touchRef = useRef(null)
  const { navigate } = useRouter()

  /* Mobile detection — phones only (< 640px). Desktop stays untouched. */
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  const prev = () => setCurrent(i => (i - 1 + N) % N)
  const next = () => setCurrent(i => (i + 1) % N)

  function getOffset(i) {
    let d = i - current
    if (d >  Math.floor(N / 2)) d -= N
    if (d < -Math.floor(N / 2)) d += N
    return d
  }

  /* Mouse drag — skip when the user is clicking on the overlay / its buttons */
  function onPointerDown(e) {
    if (e.target.closest(".proj-overlay")) return
    dragRef.current = { startX: e.clientX, moved: false }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  function onPointerMove(e) {
    if (!dragRef.current) return
    if (Math.abs(e.clientX - dragRef.current.startX) > 6) dragRef.current.moved = true
  }
  function onPointerUp(e) {
    if (!dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    if (dragRef.current.moved) {
      if (dx < -60) next()
      else if (dx > 60) prev()
    }
    dragRef.current = null
  }

  /* Touch swipe */
  function onTouchStart(e) { touchRef.current = e.touches[0].clientX }
  function onTouchEnd(e) {
    if (touchRef.current === null) return
    const dx = e.changedTouches[0].clientX - touchRef.current
    if (dx < -60) next()
    else if (dx > 60) prev()
    touchRef.current = null
  }

  return (
    <>
      {/* ── Scoped CSS for overlay hover ── */}
      <style>{`
        @keyframes projFloat {
          0%   { transform: translateY(0px)   rotate(0deg);   }
          30%  { transform: translateY(-10px) rotate(0.4deg); }
          60%  { transform: translateY(-5px)  rotate(-0.3deg);}
          100% { transform: translateY(0px)   rotate(0deg);   }
        }
        .proj-img-float {
          animation: projFloat 4s ease-in-out infinite;
        }
        /* Pause float when overlay is visible so it doesn't look jittery */
        .proj-card:hover .proj-img-float {
          animation-play-state: paused;
        }
        /* Mobile — disable hover overlay (no hover on touch screens) */
        @media (max-width: 639px) {
          .proj-card:hover .proj-overlay { opacity: 0; pointer-events: none; }
        }

        .proj-card { position: relative; }
        .proj-overlay {
          position:             absolute;
          inset:                0;
          opacity:              0;
          pointer-events:       none;
          transition:           opacity 0.35s ease;
          background:           rgba(18, 6, 30, 0.72);
          backdrop-filter:      blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius:        inherit;
          display:              flex;
          flex-direction:       column;
          align-items:          center;
          justify-content:      center;
          padding:              clamp(20px, 3vw, 44px) clamp(24px, 4vw, 56px);
          z-index:              3;
          overflow:             hidden;
        }
        .proj-card:hover .proj-overlay {
          opacity:        1;
          pointer-events: auto;
        }
      `}</style>

      <main>
        <SideBlobs />

        <section
          className="relative w-full overflow-hidden"
          style={{ height: "100vh" }}
        >
          {/* ── Card deck ── */}
          {PROJECTS.map((project, i) => {
            const offset  = getOffset(i)
            const style   = getCardStyle(offset)
            const isFront = offset === 0

            return (
              <div
                key={project.id}
                className="proj-card"
                style={{
                  position:             "absolute",
                  left:                 "50%",
                  top:                  "50%",
                  width:                isMobile ? "82vw" : "clamp(480px, 62vw, 880px)",
                  height:               isMobile ? "clamp(280px, 55vh, 400px)" : "clamp(380px, 76vh, 760px)",
                  borderRadius:         "28px",
                  background:           "rgba(255,255,255,0.07)",
                  backdropFilter:       "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border:               "1px solid rgba(255,255,255,0.15)",
                  boxShadow:            isFront
                    ? "0 28px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.14)"
                    : "0 10px 30px rgba(0,0,0,0.22)",
                  overflow:             "hidden",
                  display:              "flex",
                  flexDirection:        "column",
                  ...style,
                  transition:   "transform 0.6s cubic-bezier(0.4,0,0.2,1), filter 0.55s ease, opacity 0.5s ease, box-shadow 0.5s ease",
                  willChange:   "transform, filter, opacity",
                  cursor:       isFront ? "default" : "default",
                  userSelect:   "none",
                  pointerEvents: offset === 0 ? "auto" : "none",
                }}
                onPointerDown={isFront ? onPointerDown : undefined}
                onPointerMove={isFront ? onPointerMove : undefined}
                onPointerUp={isFront   ? onPointerUp   : undefined}
                onTouchStart={isFront  ? onTouchStart  : undefined}
                onTouchEnd={isFront ? (e) => {
                  if (touchRef.current === null) return
                  const dx = e.changedTouches[0].clientX - touchRef.current
                  touchRef.current = null
                  if (dx < -60) next()
                  else if (dx > 60) prev()
                  else if (isMobile && Math.abs(dx) < 10) navigate(project.pageId) // tap = open project
                } : undefined}
              >
                {/* ── Image zone — fills card minus the info bar ── */}
                <div style={{
                  position:   "relative",
                  flex:       1,
                  minHeight:  0,
                  overflow:   "hidden",
                }}>
                  {/* Scale wrapper — separate from float so transforms don't clash */}
                  <div style={{
                    width:           "100%",
                    height:          "100%",
                    transform:       project.imageScale ? `scale(${project.imageScale})` : undefined,
                    transformOrigin: "center center",
                  }}>
                    <img
                      src={project.image}
                      alt={project.name || project.nameScript}
                      draggable="false"
                      className={isFront ? "proj-img-float" : ""}
                      style={{
                        width:          "100%",
                        height:         "100%",
                        objectFit:      "contain",
                        objectPosition: "center center",
                        display:        "block",
                        userSelect:     "none",
                        pointerEvents:  "none",
                        padding:        isMobile ? "12px 12px 0" : "20px 20px 0",
                      }}
                    />
                  </div>

                  {/* Hover overlay — project info (covers image zone only) */}
                  <CardOverlay
                    project={project}
                    onViewProject={() => navigate(project.pageId)}
                  />
                </div>

                {/* ── Persistent info bar ── */}
                <div style={{
                  flexShrink:    0,
                  padding:       isMobile ? "10px 16px 12px" : "13px 24px 15px",
                  background:    "rgba(255,255,255,0.06)",
                  backdropFilter:"blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  borderTop:     "1px solid rgba(255,255,255,0.18)",
                  display:       "flex",
                  flexDirection: "column",
                  alignItems:    "center",
                  gap:           "2px",
                }}>
                  <p style={{
                    margin:        0,
                    color:         "#fff",
                    fontWeight:    700,
                    fontSize:      isMobile ? "0.95rem" : "clamp(0.95rem, 1.3vw, 1.15rem)",
                    letterSpacing: "0.01em",
                    lineHeight:    1.2,
                    textAlign:     "center",
                    whiteSpace:    "nowrap",
                    overflow:      "hidden",
                    textOverflow:  "ellipsis",
                    maxWidth:      "100%",
                  }}>
                    {project.nameScript
                      ? `${project.nameScript} ${project.namePlain}`
                      : project.name}
                  </p>
                  <p style={{
                    margin:        0,
                    color:         "rgba(255,255,255,0.55)",
                    fontWeight:    500,
                    fontSize:      isMobile ? "0.72rem" : "clamp(0.72rem, 0.9vw, 0.82rem)",
                    letterSpacing: "0.04em",
                    textAlign:     "center",
                    whiteSpace:    "nowrap",
                    overflow:      "hidden",
                    textOverflow:  "ellipsis",
                    maxWidth:      "100%",
                  }}>
                    {project.category}
                  </p>
                </div>
              </div>
            )
          })}

          {/* ── Navigation arrows ── */}
          <ArrowBtn onClick={prev} dir="left"  isMobile={isMobile} />
          <ArrowBtn onClick={next} dir="right" isMobile={isMobile} />

          {/* ── Dot indicators ── */}
          <div style={{
            position:  "absolute",
            bottom:    "3.5vh",
            left:      "50%",
            transform: "translateX(-50%)",
            display:   "flex",
            gap:       "10px",
            zIndex:    20,
          }}>
            {PROJECTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width:        current === i ? "28px" : "8px",
                  height:       "8px",
                  borderRadius: "999px",
                  background:   current === i
                    ? "rgba(255,255,255,0.88)"
                    : "rgba(255,255,255,0.30)",
                  border:       "none",
                  cursor:       "pointer",
                  padding:      0,
                  transition:   "width 0.3s ease, background 0.3s ease",
                }}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
