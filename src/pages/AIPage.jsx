import { useEffect, useState, useRef, useCallback } from "react"
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

/* ── Gallery data — 7 images + 3 videos
   Column assignment is index % 3, so:
   col 0 → indices 0, 3, 6, 9
   col 1 → indices 1, 4, 7, 10  ← Draft(6) at 4, Draft(7) at 7: stacked in same column
   col 2 → indices 2, 5, 8
*/
const GALLERY_ITEMS = [
  { type: "image", src: "/images/Draft (1).png", alt: "Draft 1",  category: ["3D"],                 col: 0 },
  { type: "image", src: "/images/Draft (2).png", alt: "Draft 2",  category: ["Illustration", "3D"], col: 1 },
  { type: "video", src: "/videos/Draft (1).mp4", alt: "Draft V1", category: ["Motion graphic"],      col: 2 },
  { type: "image", src: "/images/Draft (3).png", alt: "Draft 3",  category: ["3D"],                 col: 0 },
  { type: "image", src: "/images/Draft (6).png", alt: "Draft 6",  category: ["Illustration"],        col: 1 },
  { type: "video", src: "/videos/Draft (2).mp4", alt: "Draft V2", category: ["Motion graphic"],      col: 2 },
  { type: "image", src: "/images/Draft (5).png", alt: "Draft 5",  category: ["Illustration"],        col: 0 }, // directly under Draft(3).png
  { type: "image", src: "/images/Draft (7).png", alt: "Draft 7",  category: ["Illustration"],        col: 1 },
  { type: "video", src: "/videos/Draft (3).mp4", alt: "Draft V3", category: ["Motion graphic"],      col: 2 },
  { type: "image", src: "/images/Draft (4).png", alt: "Draft 4",  category: ["3D"],                 col: 2 }, // directly under Draft(3).mp4
]

const CATEGORIES = ["All", "Illustration", "Motion graphic", "3D"]

export function AIPage() {
  const [settled, setSettled]     = useState(false)
  const [cardsIn, setCardsIn]     = useState(false)
  const [activeTab, setActiveTab] = useState("All")
  const [lightbox, setLightbox]   = useState(null)   // { src, alt }
  const galleryRef                = useRef(null)
  const [galleryVisible, setGalleryVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setSettled(true), 80)
    const t2 = setTimeout(() => setCardsIn(true),  350)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  /* Intersection observer for gallery fade-in */
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

  /* ESC closes lightbox */
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

          {/* ── Left: Text block — slides in from left ── */}
          <div
            className="flex-1 flex flex-col justify-center"
            style={{
              transform:  settled ? "translateX(0)"     : "translateX(-110vw)",
              opacity:    settled ? 1                   : 0,
              transition: slideEase,
            }}
          >
            {/* Heading */}
            <h1
              className="text-white font-bold mb-3"
              style={{
                fontSize:    "clamp(2rem, 4.5vw, 5rem)",
                lineHeight:  1.1,
                whiteSpace:  "nowrap",
              }}
            >
              Drafting Ideas
            </h1>

            {/* Subheading */}
            <p
              className="font-medium mb-6"
              style={{
                fontSize:      "clamp(0.95rem, 1.6vw, 1.25rem)",
                color:         "rgba(255,255,255,0.65)",
                letterSpacing: "0.01em",
              }}
            >
              A Collection of Visual Explorations
            </p>

            {/* Quote */}
            <blockquote
              style={{
                borderLeft:  "3px solid rgba(180,100,255,0.6)",
                paddingLeft: "clamp(12px, 1.5vw, 20px)",
                margin:      0,
                maxWidth:    "480px",
              }}
            >
              <p
                style={{
                  fontSize:   "clamp(0.82rem, 1.15vw, 1rem)",
                  color:      "rgba(255,255,255,0.55)",
                  lineHeight: 1.65,
                  fontStyle:  "italic",
                }}
              >
                "Not every idea needs a full story to have meaning."
              </p>
            </blockquote>
          </div>

          {/* ── Right: Info cards — slide in from right ── */}
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
                <h3
                  className="text-white font-bold mb-3"
                  style={{ fontSize: "clamp(0.95rem, 1.4vw, 1.15rem)" }}
                >
                  {card.title}
                </h3>
                <div className="flex flex-col gap-3">
                  {card.body.map((para, pi) => (
                    <p
                      key={pi}
                      style={{
                        fontSize:   pi === 0
                          ? "clamp(0.83rem, 1.05vw, 0.93rem)"
                          : "clamp(0.78rem, 1vw, 0.88rem)",
                        color:      pi === 0
                          ? "rgba(255,255,255,0.88)"
                          : "rgba(255,255,255,0.60)",
                        fontWeight: pi === 0 ? 500 : 400,
                        lineHeight: 1.70,
                        margin:     0,
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

      {/* ── AI Gallery section ── */}
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
            <h2
              className="text-white font-bold mb-1"
              style={{ fontSize: "clamp(1.6rem, 3vw, 2.8rem)", lineHeight: 1.15 }}
            >
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
                  padding:          "6px 20px",
                  borderRadius:     "999px",
                  fontSize:         "clamp(0.75rem, 1vw, 0.875rem)",
                  fontWeight:       500,
                  cursor:           "pointer",
                  transition:       "all 0.25s ease",
                  border:           activeTab === cat
                    ? "1px solid rgba(180,100,255,0.8)"
                    : "1px solid rgba(255,255,255,0.18)",
                  background:       activeTab === cat
                    ? "linear-gradient(135deg, rgba(100,80,255,0.7), rgba(180,60,200,0.7))"
                    : "rgba(255,255,255,0.07)",
                  color:            activeTab === cat
                    ? "#fff"
                    : "rgba(255,255,255,0.6)",
                  backdropFilter:   "blur(8px)",
                  WebkitBackdropFilter: "blur(8px)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Masonry grid – 3-column flex, images and videos supported */}
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
                  <div
                    key={ci}
                    style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}
                  >
                    {col.map(({ item, globalIdx }) => (
                      <div
                        key={item.src}
                        onClick={() => setLightbox(item)}
                        style={{
                          borderRadius: "14px",
                          overflow:     "hidden",
                          cursor:       "zoom-in",
                          position:     "relative",
                          border:       "1px solid rgba(255,255,255,0.08)",
                          transition:   "transform 0.3s ease, box-shadow 0.3s ease",
                          opacity:      galleryVisible ? 1 : 0,
                          transform:    galleryVisible ? "scale(1)" : "scale(0.96)",
                          transitionDelay: `${(ci * 0.08 + globalIdx * 0.03).toFixed(2)}s`,
                          background:   "rgba(0,0,0,0.25)",
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = "scale(1.025)"
                          e.currentTarget.style.boxShadow = "0 8px 32px rgba(120,60,220,0.35)"
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = "scale(1)"
                          e.currentTarget.style.boxShadow = "none"
                        }}
                      >
                        {item.type === "video" ? (
                          <>
                            <video
                              src={item.src}
                              autoPlay
                              loop
                              muted
                              playsInline
                              style={{ display: "block", width: "100%", height: "auto", pointerEvents: "none" }}
                            />
                            {/* Play icon overlay */}
                            <div style={{
                              position: "absolute", inset: 0,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              background: "rgba(0,0,0,0)", transition: "background 0.2s",
                            }}
                              onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.30)"}
                              onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0)"}
                            >
                              <div style={{
                                width: "48px", height: "48px", borderRadius: "50%",
                                background: "rgba(255,255,255,0.18)", backdropFilter: "blur(8px)",
                                border: "1px solid rgba(255,255,255,0.30)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                opacity: 0, transition: "opacity 0.2s",
                              }}
                                ref={el => {
                                  if (!el) return
                                  el.parentElement.addEventListener("mouseenter", () => el.style.opacity = "1")
                                  el.parentElement.addEventListener("mouseleave", () => el.style.opacity = "0")
                                }}
                              >
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                                  <path d="M5 3l11 6-11 6V3z"/>
                                </svg>
                              </div>
                            </div>
                          </>
                        ) : (
                          <img
                            src={item.src}
                            alt={item.alt}
                            loading="lazy"
                            style={{ display: "block", width: "100%", height: "auto" }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )
          })()}

        </div>
      </section>

      {/* ── Lightbox — supports both images and videos ── */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position:   "fixed",
            inset:      0,
            background: "rgba(0,0,0,0.88)",
            backdropFilter: "blur(22px)",
            WebkitBackdropFilter: "blur(22px)",
            zIndex:     9999,
            display:    "flex",
            alignItems: "center",
            justifyContent: "center",
            padding:    "24px",
            cursor:     "zoom-out",
            animation:  "fadeIn 0.2s ease",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setLightbox(null)}
            style={{
              position:    "absolute",
              top:         "clamp(16px,3vh,28px)",
              right:       "clamp(16px,3vw,28px)",
              width:       "44px",
              height:      "44px",
              borderRadius: "50%",
              border:      "1px solid rgba(255,255,255,0.22)",
              background:  "rgba(255,255,255,0.12)",
              backdropFilter: "blur(12px)",
              color:       "#fff",
              fontSize:    "20px",
              cursor:      "pointer",
              display:     "flex",
              alignItems:  "center",
              justifyContent: "center",
              lineHeight:  1,
              zIndex:      10000,
              transition:  "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.24)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          >✕</button>

          {lightbox.type === "video" ? (
            <video
              src={lightbox.src}
              autoPlay
              loop
              controls
              onClick={e => e.stopPropagation()}
              style={{
                maxWidth:     "90vw",
                maxHeight:    "85vh",
                borderRadius: "16px",
                boxShadow:    "0 30px 80px rgba(0,0,0,0.65)",
                cursor:       "default",
                animation:    "lightboxPop 0.3s cubic-bezier(0.23,1,0.32,1)",
              }}
            />
          ) : (
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              onClick={e => e.stopPropagation()}
              style={{
                display:      "block",
                maxWidth:     "90vw",
                maxHeight:    "85vh",
                borderRadius: "16px",
                objectFit:    "contain",
                boxShadow:    "0 30px 80px rgba(0,0,0,0.65)",
                cursor:       "default",
                animation:    "lightboxPop 0.3s cubic-bezier(0.23,1,0.32,1)",
              }}
            />
          )}
        </div>
      )}

      <Footer />
    </main>
  )
}
