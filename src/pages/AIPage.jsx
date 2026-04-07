import { useEffect, useState, useRef } from "react"
import { Footer }    from "../components/footer"
import { SideBlobs } from "../components/side-blobs"

const glassStyle = {
  background:           "rgba(255,255,255,0.08)",
  backdropFilter:       "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border:               "1px solid rgba(255,255,255,0.15)",
}

const INFO_CARDS = [
  {
    title: "Why I Create These",
    body: [
      "Not every design needs to be a full case study. Some ideas stand on their own.",
      "This space is a collection of finished pieces that explore different styles, visuals, and creative directions. While they're not part of larger projects, each one reflects my attention to detail and design thinking.",
      "These works allow me to experiment, stay inspired, and keep creating without limits.",
    ],
  },
  {
    title: "How I Approach Them",
    body: [
      "These pieces are created through quick ideas, visual exploration, and a focus on aesthetics.",
      "Some are standalone concepts, while others are small explorations of style or interaction. Even without a full process behind them, they help me refine my skills and push my creativity further.",
      "For me, this is where design feels more open, flexible, and fun.",
    ],
  },
]

/* ── Tool icon helpers ─────────────────────────────────────────── */
const T = (name, icon = null) => ({ name, icon })
const AI  = "/images/toolkit-illustrator.png"
const PS  = "/images/toolkit-photoshop.png"
const AE  = "/images/toolkit-aftereffects.png"
const DIM = "/images/toolkit-dimension.png"
const TIN = "/images/toolkit-tinkercad.png"

/* ── Gallery data ──────────────────────────────────────────────── */
const GALLERY_ITEMS = [
  {
    type: "image", src: "/images/Draft (1).png", alt: "Draft 1",
    category: ["3D"], col: 0,
    name: "3D Perfume Bottle",
    desc: "The bottle was modeled in Maya, refined in Adobe Dimension, and finalized in Adobe Photoshop.",
    tools: [T("Maya"), T("Adobe Dimension", DIM), T("Photoshop", PS)],
  },
  {
    type: "image", src: "/images/Draft (2).png", alt: "Draft 2",
    category: ["Illustration", "3D"], col: 1,
    name: "3D Lighthouse",
    desc: "Created in Project Neo using a combination of shapes and techniques, then refined and composited with a background in Adobe Illustrator.",
    tools: [T("Project Neo"), T("Adobe Illustrator", AI)],
  },
  {
    type: "video", src: "/videos/Draft (1).mp4", alt: "Draft V1",
    category: ["Motion graphic"], col: 2,
    name: "Game Trailer",
    desc: "Created using AI to remake background visuals, combined with After Effects techniques for butterfly animation, text masking, sound design, and fade transitions.",
    tools: [T("Adobe After Effects", AE)],
  },
  {
    type: "image", src: "/images/Draft (3).png", alt: "Draft 3",
    category: ["3D"], col: 0,
    name: "3D Cat Phone Holder",
    desc: "Designed in Tinkercad using real-world dimensions, then 3D printed and successfully tested with an actual phone.",
    tools: [T("Tinkercad", TIN)],
  },
  {
    type: "image", src: "/images/Draft (6).png", alt: "Draft 6",
    category: ["Illustration"], col: 1,
    name: "Seattle Layered City Skyline",
    desc: "Used a reference image of Seattle to design a layered city skyline in Adobe Illustrator.",
    tools: [T("Adobe Illustrator", AI)],
  },
  {
    type: "video", src: "/videos/Draft (2).mp4", alt: "Draft V2",
    category: ["Motion graphic"], col: 2,
    name: "Cartoony Introduction",
    desc: "Created using Adobe Character Animator, then enhanced with a live background and additional animations in After Effects.",
    tools: [T("Adobe Character Animator"), T("Adobe After Effects", AE)],
  },
  {
    type: "image", src: "/images/Draft (5).png", alt: "Draft 5",
    category: ["Illustration"], col: 0,
    name: "Portrait Illustration",
    desc: "Used a reference image to create a layered illustration based on color shading.",
    tools: [T("Adobe Illustrator", AI)],
  },
  {
    type: "image", src: "/images/Draft (7).png", alt: "Draft 7",
    category: ["Illustration"], col: 1,
    name: "Illustration Poster Design",
    desc: "A seasonal illustration poster made entirely in Adobe Illustrator.",
    tools: [T("Adobe Illustrator", AI)],
  },
  {
    type: "video", src: "/videos/Draft (3).mp4", alt: "Draft V3",
    category: ["Motion graphic"], col: 2,
    name: "Music Video",
    desc: "A lyric video created using Adobe After Effects with vector-based assets.",
    tools: [T("Adobe After Effects", AE)],
  },
  {
    type: "image", src: "/images/Draft (4).png", alt: "Draft 4",
    category: ["3D"], col: 2,
    name: "3D Box",
    desc: "Designed in Photoshop as an open layout, then assembled in After Effects by positioning each side to create a 3D box.",
    tools: [T("Adobe Photoshop", PS), T("Adobe After Effects", AE)],
  },
]

const CATEGORIES = ["All", "Illustration", "Motion graphic", "3D"]

/* ── Single gallery card with hover overlay ─────────────────────── */
function GalleryItem({ item, globalIdx, ci, galleryVisible, onOpen }) {
  const [hov, setHov] = useState(false)
  const playIconRef   = useRef(null)

  return (
    <div
      onClick={() => onOpen(item)}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        borderRadius:    "14px",
        overflow:        "hidden",
        cursor:          "zoom-in",
        position:        "relative",
        border:          "1px solid rgba(255,255,255,0.08)",
        transition:      "transform 0.3s ease, box-shadow 0.3s ease",
        opacity:         galleryVisible ? 1 : 0,
        transform:       !galleryVisible ? "scale(0.96)" : hov ? "scale(1.025)" : "scale(1)",
        boxShadow:       hov ? "0 8px 32px rgba(120,60,220,0.35)" : "none",
        transitionDelay: galleryVisible ? "0s" : `${(ci * 0.08 + globalIdx * 0.03).toFixed(2)}s`,
        background:      "rgba(0,0,0,0.25)",
      }}
    >
      {/* ── Media ── */}
      {item.type === "video" ? (
        <video
          src={item.src}
          autoPlay loop muted playsInline
          style={{ display: "block", width: "100%", height: "auto", pointerEvents: "none" }}
        />
      ) : (
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      )}

      {/* ── Hover info overlay ── */}
      <div style={{
        position:             "absolute",
        inset:                0,
        background:           "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.18) 100%)",
        backdropFilter:       hov ? "blur(2px)" : "none",
        WebkitBackdropFilter: hov ? "blur(2px)" : "none",
        opacity:              hov ? 1 : 0,
        transition:           "opacity 0.30s ease",
        display:              "flex",
        flexDirection:        "column",
        justifyContent:       "flex-end",
        padding:              "14px",
        gap:                  "6px",
        pointerEvents:        "none",
      }}>
        {/* Name */}
        <p style={{
          margin: 0, fontWeight: 700, color: "#fff",
          fontSize: "clamp(0.82rem, 1.1vw, 0.95rem)",
          lineHeight: 1.2,
          textShadow: "0 1px 6px rgba(0,0,0,0.6)",
        }}>
          {item.name}
        </p>

        {/* Description */}
        <p style={{
          margin: 0, color: "rgba(255,255,255,0.75)",
          fontSize: "clamp(0.68rem, 0.9vw, 0.78rem)",
          lineHeight: 1.5,
        }}>
          {item.desc}
        </p>

        {/* Toolkit pills */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginTop: "2px" }}>
          {item.tools.map(t => (
            <div
              key={t.name}
              style={{
                display:      "inline-flex",
                alignItems:   "center",
                gap:          "4px",
                padding:      "3px 8px",
                borderRadius: "7px",
                background:   "rgba(255,255,255,0.13)",
                border:       "1px solid rgba(255,255,255,0.20)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              {t.icon && (
                <img
                  src={t.icon}
                  alt={t.name}
                  style={{ width: "12px", height: "12px", objectFit: "contain" }}
                />
              )}
              <span style={{
                color:         "rgba(255,255,255,0.88)",
                fontSize:      "0.65rem",
                fontWeight:    600,
                letterSpacing: "0.02em",
                whiteSpace:    "nowrap",
              }}>
                {t.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Video play icon (shown when not hovering) ── */}
      {item.type === "video" && (
        <div style={{
          position:       "absolute",
          inset:          0,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          pointerEvents:  "none",
          opacity:        hov ? 0 : 1,
          transition:     "opacity 0.25s ease",
        }}>
          <div style={{
            width:          "48px",
            height:         "48px",
            borderRadius:   "50%",
            background:     "rgba(255,255,255,0.18)",
            backdropFilter: "blur(8px)",
            border:         "1px solid rgba(255,255,255,0.30)",
            display:        "flex",
            alignItems:     "center",
            justifyContent: "center",
          }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
              <path d="M5 3l11 6-11 6V3z"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

export function AIPage() {
  const [settled, setSettled]     = useState(false)
  const [cardsIn, setCardsIn]     = useState(false)
  const [activeTab, setActiveTab] = useState("All")
  const [lightbox, setLightbox]   = useState(null)
  const galleryRef                = useRef(null)
  const [galleryVisible, setGalleryVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setSettled(true), 80)
    const t2 = setTimeout(() => setCardsIn(true),  350)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    const el = galleryRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setGalleryVisible(true) },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!lightbox) return
    const onKey = (e) => { if (e.key === "Escape") setLightbox(null) }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [lightbox])

  const filtered = activeTab === "All"
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category.includes(activeTab))

  const slideEase = "transform 0.85s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.6s ease"

  return (
    <main className="relative min-h-screen flex flex-col">
      <style>{`
        @keyframes fadeIn      { from { opacity: 0 } to { opacity: 1 } }
        @keyframes lightboxPop { from { opacity: 0; transform: scale(0.88) } to { opacity: 1; transform: scale(1) } }
      `}</style>
      <SideBlobs />

      {/* ── Hero section ── */}
      <section className="relative flex-1 flex items-center px-6 md:px-12 pt-24 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* Left: Text block */}
          <div
            className="flex-1 flex flex-col justify-center"
            style={{
              transform:  settled ? "translateX(0)"     : "translateX(-110vw)",
              opacity:    settled ? 1                   : 0,
              transition: slideEase,
            }}
          >
            <h1
              className="text-white font-bold mb-3"
              style={{ fontSize: "clamp(2rem, 4.5vw, 5rem)", lineHeight: 1.1, whiteSpace: "nowrap" }}
            >
              Drafting Ideas
            </h1>
            <p
              className="font-medium mb-6"
              style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.25rem)", color: "rgba(255,255,255,0.65)", letterSpacing: "0.01em" }}
            >
              A Collection of Visual Explorations
            </p>
            <blockquote
              style={{ borderLeft: "3px solid rgba(180,100,255,0.6)", paddingLeft: "clamp(12px, 1.5vw, 20px)", margin: 0, maxWidth: "480px" }}
            >
              <p style={{ fontSize: "clamp(0.82rem, 1.15vw, 1rem)", color: "rgba(255,255,255,0.55)", lineHeight: 1.65, fontStyle: "italic" }}>
                "Not every idea needs a full story to have meaning."
              </p>
            </blockquote>
          </div>

          {/* Right: Info cards */}
          <div
            className="flex-1 flex flex-col gap-4 w-full"
            style={{
              transform:  cardsIn ? "translateX(0)"    : "translateX(110vw)",
              opacity:    cardsIn ? 1                  : 0,
              transition: "transform 0.85s 0.1s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.6s 0.1s ease",
            }}
          >
            {INFO_CARDS.map((card, ci) => (
              <div
                key={card.title}
                className="rounded-2xl p-5 md:p-7"
                style={{
                  ...glassStyle,
                  transform:  cardsIn ? "translateX(0)"    : "translateX(60px)",
                  opacity:    cardsIn ? 1                  : 0,
                  transition: `transform 0.7s ${0.15 + ci * 0.12}s cubic-bezier(0.23,1,0.32,1), opacity 0.5s ${0.15 + ci * 0.12}s ease`,
                }}
              >
                <h3 className="text-white font-bold mb-3" style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)" }}>
                  {card.title}
                </h3>
                <div className="flex flex-col gap-3">
                  {card.body.map((para, pi) => (
                    <p
                      key={pi}
                      style={{
                        fontSize:      pi === 0 ? "clamp(0.83rem, 1.05vw, 0.93rem)" : "clamp(0.78rem, 1vw, 0.88rem)",
                        color:         pi === 0 ? "rgba(255,255,255,0.88)"           : "rgba(255,255,255,0.60)",
                        fontWeight:    pi === 0 ? 500 : 400,
                        lineHeight:    1.70,
                        margin:        0,
                        paddingBottom: pi === 0 ? "2px" : 0,
                      }}
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Gallery section ── */}
      <section
        ref={galleryRef}
        className="relative px-6 md:px-12 pb-24"
        style={{
          opacity:    galleryVisible ? 1 : 0,
          transform:  galleryVisible ? "translateY(0)" : "translateY(40px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >
        <div className="max-w-7xl mx-auto w-full">

          {/* Section heading */}
          <div className="mb-8">
            <h2 className="text-white font-bold mb-1" style={{ fontSize: "clamp(1.6rem, 3vw, 2.8rem)", lineHeight: 1.15 }}>
              Gallery
            </h2>
            <p style={{ fontSize: "clamp(0.82rem, 1.1vw, 0.95rem)", color: "rgba(255,255,255,0.45)" }}>
              Pieces that explore style, visuals, and creative direction
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                style={{
                  padding:      "6px 20px",
                  borderRadius: "999px",
                  fontSize:     "clamp(0.75rem, 1vw, 0.875rem)",
                  fontWeight:   500,
                  cursor:       "pointer",
                  transition:   "all 0.25s ease",
                  border:       activeTab === cat ? "1px solid rgba(180,100,255,0.8)" : "1px solid rgba(255,255,255,0.18)",
                  background:   activeTab === cat ? "linear-gradient(135deg, rgba(100,80,255,0.7), rgba(180,60,200,0.7))" : "rgba(255,255,255,0.07)",
                  color:        activeTab === cat ? "#fff" : "rgba(255,255,255,0.6)",
                  backdropFilter:       "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry grid */}
          {(() => {
            const NUM_COLS = 3
            const cols = Array.from({ length: NUM_COLS }, () => [])
            filtered.forEach((item, i) => {
              const colIdx = activeTab === "All" ? item.col : i % NUM_COLS
              cols[colIdx].push({ item, globalIdx: i })
            })

            return (
              <div style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                {cols.map((col, ci) => (
                  <div key={ci} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>
                    {col.map(({ item, globalIdx }) => (
                      <GalleryItem
                        key={item.src}
                        item={item}
                        globalIdx={globalIdx}
                        ci={ci}
                        galleryVisible={galleryVisible}
                        onOpen={setLightbox}
                      />
                    ))}
                  </div>
                ))}
              </div>
            )
          })()}

        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position:   "fixed", inset: 0,
            background: "rgba(0,0,0,0.88)",
            backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)",
            zIndex: 9999,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px",
            cursor: "zoom-out",
            animation: "fadeIn 0.2s ease",
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{
              position: "absolute", top: "clamp(16px,3vh,28px)", right: "clamp(16px,3vw,28px)",
              width: "44px", height: "44px", borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)", color: "#fff", fontSize: "20px",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              lineHeight: 1, zIndex: 10000, transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.24)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          >✕</button>

          {lightbox.type === "video" ? (
            <video
              src={lightbox.src} autoPlay loop controls
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth: "90vw", maxHeight: "85vh", borderRadius: "16px",
                boxShadow: "0 30px 80px rgba(0,0,0,0.65)", cursor: "default",
                animation: "lightboxPop 0.3s cubic-bezier(0.23,1,0.32,1)",
              }}
            />
          ) : (
            <img
              src={lightbox.src} alt={lightbox.alt}
              onClick={e => e.stopPropagation()}
              style={{
                display: "block", maxWidth: "90vw", maxHeight: "85vh",
                borderRadius: "16px", objectFit: "contain",
                boxShadow: "0 30px 80px rgba(0,0,0,0.65)", cursor: "default",
                animation: "lightboxPop 0.3s cubic-bezier(0.23,1,0.32,1)",
              }}
            />
          )}
        </div>
      )}

      <Footer />
    </main>
  )
}
