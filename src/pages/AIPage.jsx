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
    title: "Why I Use AI",
    body: [
      "AI is becoming part of many industries, including design. I believe it's important to understand and use these tools rather than ignore them.",
      "AI doesn't replace creativity, the vision still comes from the designer. As many professionals say, \"AI is not creativity by itself, it becomes creative when guided by human intention.\"",
      "When used thoughtfully, AI becomes a creative partner for inspiration and new ideas.",
    ],
  },
  {
    title: "How I Use AI",
    body: [
      "AI has become part of the modern creative process. Rather than replacing creativity, it expands it.",
      "As a designer and developer, I use AI to explore ideas faster, visualize concepts, and experiment with new directions. Even when the results aren't exact, they often spark new inspiration.",
      "For me, AI is a powerful tool for early-stage ideation and creative exploration.",
    ],
  },
]

/* ── Gallery data ──
   Manually ordered to give each column a pleasant tall/short rhythm and
   ensure neighbouring columns always have visually distinct aspect ratios.

   col 0 (i%3=0): square → tall → square → wide → square → portrait → square
   col 1 (i%3=1): very-tall → landscape → tall → square → portrait → square → portrait
   col 2 (i%3=2): landscape → square → tall → square → square → landscape → portrait
*/
const GALLERY_ITEMS = [
  // ── row 0 ──────────────────────────────────────────────────────────────────
  { src: "/images/AI12.png", alt: "Woman putting on a diamond earring",       category: "Realistic" }, // col 0 – square
  { src: "/images/AI4.png",  alt: "Pixel art kitchen scene",                  category: "Art"       }, // col 1 – very tall
  { src: "/images/AI15.png", alt: "Pixel art vibrant sunset over the lake",   category: "Art"       }, // col 2 – landscape
  // ── row 1 ──────────────────────────────────────────────────────────────────
  { src: "/images/AI1.png",  alt: "Woman dancing in the rain",                category: "Realistic" }, // col 0 – tall portrait
  { src: "/images/AI6.png",  alt: "Toronto skyline bursting through a map",   category: "Realistic" }, // col 1 – landscape/square
  { src: "/images/AI10.png", alt: "3D onigiri character",                     category: "Art"       }, // col 2 – square
  // ── row 2 ──────────────────────────────────────────────────────────────────
  { src: "/images/AI16.png", alt: "Glittery millefeuille cake slice",         category: "Realistic" }, // col 0 – square
  { src: "/images/AI8.png",  alt: "Pixel art rainy street at night",          category: "Art"       }, // col 1 – tall portrait
  { src: "/images/AI3.png",  alt: "Cupcake Instagram 3D mockup",              category: "Art"       }, // col 2 – tall portrait
  // ── row 3 ──────────────────────────────────────────────────────────────────
  { src: "/images/AI17.png", alt: "Dreamy pink cherry blossom sky",           category: "Realistic" }, // col 0 – landscape (wide)
  { src: "/images/AI13.png", alt: "Woman applying perfume by the window",     category: "Realistic" }, // col 1 – square
  { src: "/images/AI20.png", alt: "Pink hazy road through pine trees",        category: "Realistic" }, // col 2 – square
  // ── row 4 ──────────────────────────────────────────────────────────────────
  { src: "/images/AI7.png",  alt: "Blue conditioner bottles on a beach",      category: "Texture"   }, // col 0 – square
  { src: "/images/AI2.png",  alt: "Strawberry cake slice, painterly style",   category: "Realistic" }, // col 1 – portrait
  { src: "/images/AI21.png", alt: "Neon crystal game controller",             category: "Texture"   }, // col 2 – square
  // ── row 5 ──────────────────────────────────────────────────────────────────
  { src: "/images/AI19.png", alt: "Cabin by a golden river at sunset",        category: "Realistic" }, // col 0 – portrait
  { src: "/images/AI23.png", alt: "Cartoon sharks by an elevator",            category: "Art"       }, // col 1 – square
  { src: "/images/AI14.png", alt: "Colourful Italian coastal village",        category: "Realistic" }, // col 2 – landscape/square
  // ── row 6 ──────────────────────────────────────────────────────────────────
  { src: "/images/AI5.png",  alt: "Glass letter F filled with strawberries",  category: "Texture"   }, // col 0 – square
  { src: "/images/AI11.png", alt: "Pixel art cozy bedroom at night",          category: "Art"       }, // col 1 – portrait
  { src: "/images/AI9.png",  alt: "Pixel art burger and fries combo",         category: "Art"       }, // col 2 – portrait
  // ── row 7 ──────────────────────────────────────────────────────────────────
  { src: "/images/AI18.png", alt: "Anime girl with a blue drink",             category: "Art"       }, // col 0 – portrait
  { src: "/images/AI22.png", alt: "Cherry blossom walkway by the river",      category: "Realistic" }, // col 1 – tall portrait
]

const CATEGORIES = ["All", "Realistic", "Art", "Texture"]

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
    : GALLERY_ITEMS.filter(item => item.category === activeTab)

  const slideEase = "transform 0.85s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.6s ease"

  return (
    <main className="relative min-h-screen flex flex-col">
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
              Designing with AI
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
              AI Generated Images and Videos
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
                "AI will not replace designers, but designers who use AI will replace those who don't."
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
                <div className="flex flex-col gap-2">
                  {card.body.map((para, pi) => (
                    <p
                      key={pi}
                      style={{
                        fontSize:   "clamp(0.78rem, 1vw, 0.88rem)",
                        color:      "rgba(255,255,255,0.65)",
                        lineHeight: 1.65,
                        margin:     0,
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
              AI Gallery
            </h2>
            <p style={{ fontSize: "clamp(0.82rem, 1.1vw, 0.95rem)", color: "rgba(255,255,255,0.45)" }}>
              A collection of images and visuals created with the help of AI tools
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

          {/* Masonry grid – explicit 3-column flex so we control which image goes in which column */}
          {(() => {
            const NUM_COLS = 3
            const cols = Array.from({ length: NUM_COLS }, () => [])
            filtered.forEach((item, i) => cols[i % NUM_COLS].push({ item, globalIdx: i }))

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
                        <img
                          src={item.src}
                          alt={item.alt}
                          loading="lazy"
                          style={{ display: "block", width: "100%", height: "auto" }}
                        />
                      </div>
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
            position:   "fixed",
            inset:      0,
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            zIndex:     9999,
            display:    "flex",
            alignItems: "center",
            justifyContent: "center",
            padding:    "24px",
            cursor:     "zoom-out",
            animation:  "fadeIn 0.2s ease",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              position:    "relative",
              maxWidth:    "min(90vw, 900px)",
              maxHeight:   "85vh",
              cursor:      "default",
              animation:   "lightboxPop 0.3s cubic-bezier(0.23,1,0.32,1)",
            }}
          >
            <img
              src={lightbox.src}
              alt={lightbox.alt}
              style={{
                display:     "block",
                maxWidth:    "100%",
                maxHeight:   "80vh",
                borderRadius: "16px",
                boxShadow:   "0 24px 80px rgba(0,0,0,0.7)",
                border:      "1px solid rgba(255,255,255,0.12)",
              }}
            />
            {/* Caption */}
            <p
              style={{
                textAlign:  "center",
                marginTop:  "12px",
                fontSize:   "0.85rem",
                color:      "rgba(255,255,255,0.6)",
              }}
            >
              {lightbox.alt}
            </p>
            {/* Close button */}
            <button
              onClick={() => setLightbox(null)}
              style={{
                position:    "absolute",
                top:         "-14px",
                right:       "-14px",
                width:       "36px",
                height:      "36px",
                borderRadius: "50%",
                border:      "1px solid rgba(255,255,255,0.25)",
                background:  "rgba(30,20,60,0.9)",
                color:       "#fff",
                fontSize:    "1.1rem",
                cursor:      "pointer",
                display:     "flex",
                alignItems:  "center",
                justifyContent: "center",
                lineHeight:  1,
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <Footer />
    </main>
  )
}
