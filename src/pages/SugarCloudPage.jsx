/**
 * SugarCloud Cupcakes — Case Study Page
 * Hero: left info panel + right swipeable mockup carousel
 * Below: Design Process — same pattern as AlpineLink (collapsed steps + sticky visual)
 */
import { useState, useRef, useEffect } from "react"
import { useRouter } from "../lib/router-context"
import { SideBlobs } from "../components/side-blobs"
import { Footer }    from "../components/footer"

/* ── Brand colour ────────────────────────────────────────────────────────── */
const PINK      = "rgba(232,121,160,1)"
const PINK_DIM  = "rgba(232,121,160,0.18)"
const PINK_MID  = "rgba(232,121,160,0.45)"

/* ── Toolkit data ────────────────────────────────────────────────────────── */
const TOOLS = [
  { name: "Illustrator", icon: "/images/toolkit-illustrator.png" },
  { name: "Figma",       icon: "/images/toolkit-figma.png"       },
  { name: "Canva",       icon: "/images/toolkit-canva.png"       },
  { name: "Photoshop",   icon: "/images/toolkit-photoshop.png"   },
]

/* ── Mockup slides ───────────────────────────────────────────────────────── */
const MOCKUPS = [
  { src: "/images/Sugar_Laptop.png", alt: "SugarCloud desktop mockup" },
  { src: "/images/Sugar_Phone.png",  alt: "SugarCloud mobile mockup"  },
]

/* ── Design process steps (content to be filled by user later) ───────────── */
const STEPS = [
  {
    number: 1,
    title:  "Project Overview",
    visual: "/images/Compa.png",
    content: [
      { type: "heading", text: "The Project" },
      { type: "para",    text: "SugarCloud Cupcakes is a modern UI/UX and branding project designed to reimagine how users discover and order desserts online. The goal was to craft a visually engaging, playful, and premium digital experience — while keeping the ordering process simple and intuitive." },
      { type: "heading", text: "The Problem" },
      { type: "para",    text: "While researching bakery websites, a clear pattern emerged: most felt outdated, static, and lacking in meaningful interaction. Users had little reason to linger, explore, or feel genuinely excited about what they were ordering. This project set out to change that." },
      { type: "heading", text: "What Was Built" },
      { type: "para",    text: "A complete digital product — spanning branding, product visuals, marketing materials, and a fully responsive website concept — all designed to feel as sweet as the product itself." },
      { type: "highlight", text: "Designed a fully interactive cupcake e-commerce prototype using Figma Variables to simulate real-time cart behavior." },
    ],
  },
  {
    number: 2,
    title:  "User Research",
    visual: "/images/Sugar_Persona.png",
    content: [
      { type: "para",    text: "Before designing a single screen, I focused on understanding how people actually order desserts online — what delights them, what slows them down, and what makes them leave." },
      { type: "heading", text: "What Users Expect" },
      { type: "bullets", items: [
        "A fast, frictionless ordering process with minimal steps",
        "A visually appealing experience that reflects the quality of the product",
        "Interactive, responsive moments that feel modern and alive",
      ]},
      { type: "heading", text: "Where Bakery Websites Fall Short" },
      { type: "bullets", items: [
        "Cluttered or outdated layouts that feel hard to navigate",
        "Unclear information hierarchy — users struggle to find what they need",
        "Little to no engaging interaction, making the experience feel flat",
      ]},
      { type: "heading", text: "User Persona — Emily Carter" },
      { type: "meta",    items: [ "Age 29  ·  Marketing Coordinator  ·  Vancouver, BC" ]},
      { type: "para",    text: "Emily is a busy, social young professional who loves hosting small gatherings. She regularly brings desserts to create warm, memorable moments — and because of her lifestyle, she values speed and convenience above all when shopping online." },
      { type: "para",    text: "She's drawn to modern, visually rich websites where she can browse quickly and make decisions based on how beautiful and well-presented the products feel. She's motivated by the desire to impress her guests with something unique and premium — but becomes frustrated the moment a website feels slow, cluttered, or forces her to call or email to place an order." },
      { type: "highlight", text: "Emily represents users who expect a seamless, enjoyable digital experience — one where exploring, selecting, and ordering feels effortless and visually satisfying every step of the way." },
    ],
  },
  {
    number: 3,
    title:  "Brand Identity",
    visuals: [
      "/images/Sugar_Interface2.png",
      "/images/Sugar_Interface3.png",
    ],
    content: [
      { type: "para",    text: "The brand was designed to feel soft, sweet, playful, and premium — reflecting both the emotional warmth of desserts and a modern digital aesthetic that feels polished and inviting." },
      { type: "heading", text: "Name Concept" },
      { type: "para",    text: "\"Sugar Cloud\" evokes the fluffy, airy texture of cupcake frosting. Cloud communicates softness and lightness, while Sugar speaks to sweetness and indulgence — together making the name both descriptive and genuinely memorable." },
      { type: "heading", text: "Logo Design" },
      { type: "para",    text: "The logo merges a cupcake swirl with a cloud shape, creating an instant visual connection to the product while maintaining a clean, modern feel. It was crafted using Illustrator for precise vector construction, then refined in Photoshop for final visual polish." },
      { type: "heading", text: "Color Palette" },
      { type: "para",    text: "Each color was chosen to evoke warmth, softness, and a premium dessert experience — working together to create visual hierarchy and guide user attention through the interface." },
      { type: "swatches", items: [
        { hex: "#A32567", label: "Deep berry — emphasis & call-to-action" },
        { hex: "#FFC8E3", label: "Soft pink — backgrounds & overall warmth" },
        { hex: "#DF74AE", label: "Vibrant pink — interactions & highlights" },
        { hex: "#FBEEF5", label: "Light cream — balance & softness" },
        { hex: "#131313", label: "Dark neutral — text & contrast" },
      ]},
      { type: "heading", text: "Typography" },
      { type: "bullets", items: [
        "A script-style font for headings and brand elements — soft, expressive, and friendly in tone",
        "Inter for body text and UI elements — clean, highly readable, and built for digital screens",
      ]},
      { type: "meta",    items: [ "Inter was chosen specifically for its performance across interfaces — ensuring clarity in product descriptions, navigation, and form inputs while keeping the overall feel polished and professional." ]},
    ],
  },
  {
    number: 4,
    title:  "User Interface",
    visuals: [
      "/images/Sugar_Interface.png",
      "/images/Var1.png",
      "/images/Var2.png",
      "/images/Var3.png",
      "/images/Style.png",
    ],
    content: [
      { type: "heading", text: "Design Approach" },
      { type: "para",    text: "The UI for SugarCloud Cupcakes was designed to feel soft, modern, and visually engaging — while maintaining simplicity and clarity throughout. Every decision was guided by one goal: let the product shine, and get out of the way." },
      { type: "heading", text: "Visual Language" },
      { type: "bullets", items: [
        "Rounded cards and soft shadows to create a warm, approachable feel",
        "A pastel color palette that reflects the brand's sweet and premium identity",
        "Typography balanced between decorative and readable — personality without sacrificing usability",
      ]},
      { type: "heading", text: "Built for Consistency" },
      { type: "para",    text: "To ensure scalability across the entire product, I built the interface in Figma using Auto Layout and a fully reusable component system. This allowed layouts to flex naturally across key sections — homepage, menu, cart, and checkout — without losing visual cohesion." },
      { type: "heading", text: "Powered by Figma Variables" },
      { type: "para",    text: "A key part of this project was integrating Figma Variables to bring real logic into the prototype. Variables were created for product prices, item quantities, cart count, total cost, and cart state — giving the interface the ability to respond dynamically to user actions." },
      { type: "highlight", text: "When users add or remove cupcakes, the cart icon updates in real time and the total price automatically recalculates — transforming the design from a static mockup into a logic-driven, interactive experience." },
      { type: "para",    text: "The result is a UI that goes beyond aesthetics. It simulates real product behavior, creating a prototype that feels less like a design file and more like a working product." },
    ],
  },
  {
    number: 5,
    title:  "User Experience",
    visuals: [
      "/images/Sugar_Experience.png",
      "/images/ProtoSugar.png",
      "/images/HighFi (1).png",
      "/images/HighFi (2).png",
      "/images/HighFi (3).png",
      "/images/HighFi (4).png",
      "/images/HighFi (5).png",
      "/images/HighFi (6).png",
      "/images/HighFi (7).png",
      "/images/HighFi (8).png",
      "/images/HighFi (9).png",
      "/images/HighFi (10).png",
      "/images/HighFi (11).png",
      "/images/HighFi (12).png",
      "/images/HighFi (13).png",
      "/images/HighFi (14).png",
      "/images/HighFi (15).png",
    ],
    content: [
      { type: "heading", text: "Interactive Prototype" },
      { type: "para",    text: "Rather than building simple screen-to-screen navigation, I designed a fully logic-based interactive system using Figma Variables — one that responds to user actions the way a real product would." },
      { type: "bullets", items: [
        "Add cupcakes to the cart with a single tap",
        "Increase or decrease item quantity on the fly",
        "Watch the cart icon update dynamically in real time",
        "See the subtotal and total recalculate automatically",
      ]},
      { type: "heading", text: "Key Techniques" },
      { type: "heading", text: "✦  Figma Variables" },
      { type: "bullets", items: [
        "Stored product price values for each item",
        "Controlled quantity changes with increment and decrement logic",
        "Calculated order totals dynamically based on cart contents",
      ]},
      { type: "heading", text: "✦  State-Based Components" },
      { type: "bullets", items: [
        "Distinct cart states — empty vs. filled — each with its own layout",
        "Interactive +/− buttons that update values without any prototyping workarounds",
      ]},
      { type: "heading", text: "✦  User Flow Optimization" },
      { type: "bullets", items: [
        "A clear, linear journey: Homepage → Menu → Cart → Checkout",
        "Minimal steps throughout — no dead ends, no unnecessary decisions",
      ]},
      { type: "highlight", text: "The result is a fully interactive prototype that behaves like a working product — a meaningful step beyond typical static design projects." },
    ],
  },
  {
    number: 6,
    title:  "Outcome",
    visual: "/images/Sugarcloud.gif",
    wideVisual: true,
    content: [
      { type: "para",    text: "SugarCloud Cupcakes came together as a complete digital brand experience — not just a set of screens, but a cohesive product that spans design, identity, interaction, and storytelling." },
      { type: "heading", text: "What Was Delivered" },
      { type: "bullets", items: [
        "UI/UX design — responsive website concept and mobile experience",
        "Fully interactive Figma prototype with real cart logic",
        "Brand identity — logo, color palette, and typography system",
        "Product visuals — cupcake photography and styled imagery",
        "Posters and marketing assets for promotional use",
        "Motion and video concept to bring the brand to life",
      ]},
      { type: "heading", text: "What Makes This Project Strong" },
      { type: "bullets", items: [
        "Combines UX, branding, and product thinking into a single unified experience",
        "Goes beyond visuals — includes real interaction logic powered by Figma Variables",
        "Feels startup-ready: polished, consistent, and built to scale",
      ]},
      { type: "heading", text: "Key Takeaways" },
      { type: "para",    text: "This project pushed me to grow across multiple disciplines at once — sharpening my UI/UX design skills, deepening my command of advanced Figma techniques like Auto Layout and Variables, and developing a stronger sense of branding and visual storytelling." },
      { type: "highlight", text: "Most importantly, it showed me how to take a simple idea and turn it into a complete, cohesive digital experience — one that looks and behaves like a real product." },
    ],
  },
]

/* ── Fixed heights shared by step box and visual panel ──────────────────── */
const STEP_BOX_H     = 472
const STEP_CONTENT_H = 420

/* ── Tool icon ───────────────────────────────────────────────────────────── */
function ToolIcon({ name, icon }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      title={name}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:                "54px",
        height:               "54px",
        borderRadius:         "14px",
        background:           hov ? PINK_DIM : "rgba(255,255,255,0.10)",
        backdropFilter:       "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border:               `1px solid ${hov ? PINK_MID : "rgba(255,255,255,0.15)"}`,
        display:              "flex",
        alignItems:           "center",
        justifyContent:       "center",
        flexShrink:           0,
        transition:           "all 0.22s ease",
        cursor:               "default",
      }}
    >
      <img src={icon} alt={name} style={{ width: 32, height: 32, objectFit: "contain" }} />
    </div>
  )
}

/* ── Mockup carousel ─────────────────────────────────────────────────────── */
function MockupCarousel() {
  const [idx, setIdx]   = useState(0)
  const [anim, setAnim] = useState(true)
  const touchStart      = useRef(null)
  const total           = MOCKUPS.length

  const go = (next) => {
    setAnim(false)
    setTimeout(() => { setIdx((next + total) % total); setAnim(true) }, 160)
  }

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX }
  const onTouchEnd   = (e) => {
    if (touchStart.current === null) return
    const dx = e.changedTouches[0].clientX - touchStart.current
    if (Math.abs(dx) > 40) go(dx < 0 ? idx + 1 : idx - 1)
    touchStart.current = null
  }

  return (
    <div
      style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", userSelect: "none" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div style={{ width: "100%", maxWidth: "720px", height: "clamp(380px, 56vh, 580px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <img
          key={idx}
          src={MOCKUPS[idx].src}
          alt={MOCKUPS[idx].alt}
          style={{
            maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto",
            objectFit: "contain", display: "block",
            opacity:   anim ? 1 : 0,
            transform: anim ? "translateX(0) scale(1)" : "translateX(20px) scale(0.97)",
            transition: "opacity 0.32s ease, transform 0.32s ease",
            filter: "drop-shadow(0 16px 48px rgba(0,0,0,0.55))",
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginTop: "18px" }}>
        <button
          onClick={() => go(idx - 1)}
          style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.80)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s ease", fontSize: "1.1rem", lineHeight: 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = PINK_DIM; e.currentTarget.style.borderColor = PINK_MID }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)" }}
        >‹</button>

        <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>
          {MOCKUPS.map((_, i) => (
            <button key={i} onClick={() => go(i)} style={{
              width: i === idx ? "10px" : "7px", height: i === idx ? "10px" : "7px",
              borderRadius: "50%", background: i === idx ? PINK : "rgba(255,255,255,0.30)",
              border: "none", padding: 0, cursor: "pointer", transition: "all 0.3s ease",
            }} />
          ))}
        </div>

        <button
          onClick={() => go(idx + 1)}
          style={{
            width: "36px", height: "36px", borderRadius: "50%",
            background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.80)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s ease", fontSize: "1.1rem", lineHeight: 1,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = PINK_DIM; e.currentTarget.style.borderColor = PINK_MID }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)" }}
        >›</button>
      </div>
    </div>
  )
}

/* ── Rich text renderer ──────────────────────────────────────────────────── */
function StepContent({ blocks }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {blocks.map((block, i) => {
        if (block.type === "para") return (
          <p key={i} style={{ margin: 0, color: "rgba(255,255,255,0.80)", fontSize: "clamp(0.87rem,1.15vw,0.97rem)", lineHeight: 1.75 }}>
            {block.text}
          </p>
        )
        if (block.type === "heading") return (
          <p key={i} style={{ margin: 0, color: PINK, fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", marginTop: "4px" }}>
            {block.text}
          </p>
        )
        if (block.type === "meta") return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
            {block.items.map((item, j) => (
              <p key={j} style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: "0.82rem", lineHeight: 1.55 }}>{item}</p>
            ))}
          </div>
        )
        if (block.type === "bullets") return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {block.items.map((item, j) => (
              <div key={j} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <span style={{ color: PINK, fontSize: "0.75rem", marginTop: "4px", flexShrink: 0 }}>◆</span>
                <span style={{ color: "rgba(255,255,255,0.78)", fontSize: "clamp(0.85rem,1.1vw,0.93rem)", lineHeight: 1.65 }}>{item}</span>
              </div>
            ))}
          </div>
        )
        if (block.type === "highlight") return (
          <div key={i} style={{
            marginTop: "8px",
            padding: "14px 18px",
            borderRadius: "12px",
            background: "rgba(232,121,160,0.13)",
            border: "1px solid rgba(232,121,160,0.40)",
            borderLeft: `4px solid ${PINK}`,
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
              <span style={{ color: PINK, fontSize: "1rem", flexShrink: 0, marginTop: "1px" }}>✦</span>
              <span style={{ color: "#fff", fontSize: "clamp(0.87rem,1.15vw,0.95rem)", fontWeight: 600, lineHeight: 1.65 }}>
                {block.text}
              </span>
            </div>
          </div>
        )
        if (block.type === "swatches") return (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            {block.items.map((item, j) => (
              <div key={j} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
                  background: item.hex,
                  border: "1px solid rgba(255,255,255,0.18)",
                  boxShadow: `0 2px 8px ${item.hex}55`,
                }} />
                <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                  <span style={{ color: "rgba(255,255,255,0.90)", fontSize: "0.80rem", fontWeight: 600, fontFamily: "monospace", letterSpacing: "0.04em" }}>{item.hex}</span>
                  <span style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.76rem", lineHeight: 1.3 }}>{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        )
        return null
      })}
    </div>
  )
}

/* ── Laptop mockup with canvas-based chroma key ──────────────────────────── */
function LaptopVideoMockup() {
  const videoRef   = useRef(null)
  const overlayRef = useRef(null)
  const [overlayOpacity, setOverlayOpacity] = useState(0)

  /* Start video immediately — don't wait for canvas */
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.play().catch(() => {})
  }, [])

  /* Build chroma-key canvas overlay — fetch as blob to avoid canvas taint */
  useEffect(() => {
    const canvas = overlayRef.current
    if (!canvas) return

    fetch("/images/Sugar_Laptop_Green.png")
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob)
        const img = new Image()
        img.onload = () => {
          canvas.width  = img.naturalWidth
          canvas.height = img.naturalHeight
          const ctx = canvas.getContext("2d")
          ctx.drawImage(img, 0, 0)
          try {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            const d = imageData.data
            for (let i = 0; i < d.length; i += 4) {
              const r = d[i], g = d[i + 1], b = d[i + 2]
              /* Remove green-screen pixels — high G, low R and B */
              if (g > 80 && g > r * 1.3 && g > b * 1.3) {
                d[i + 3] = 0
              }
            }
            ctx.putImageData(imageData, 0, 0)
          } catch (_) { /* canvas tainted fallback — show as-is */ }
          URL.revokeObjectURL(url)
          setOverlayOpacity(1)
        }
        img.src = url
      })
      .catch(() => {
        /* If fetch fails, fall back to plain img tag */
        setOverlayOpacity(0)
      })
  }, [])

  return (
    <div style={{
      position: "relative", width: "100%", height: "100%",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px", boxSizing: "border-box",
    }}>
      {/* Spacer image — sets the container height from the laptop's natural aspect ratio */}
      <div style={{ position: "relative", width: "100%", maxWidth: "620px", marginTop: "-70px" }}>
        <img
          src="/images/Sugar_Laptop_Green.png"
          alt=""
          style={{ width: "100%", height: "auto", display: "block", visibility: "hidden" }}
        />

        {/* Video — absolutely fills the screen area of the laptop */}
        <video
          ref={videoRef}
          src="/videos/Sugar_Video.mp4"
          autoPlay loop muted playsInline
          style={{
            position: "absolute",
            top: "27%", left: "7%",
            width: "85%", height: "48%",
            objectFit: "cover",
            borderRadius: "2px",
            clipPath: "inset(2% 8% 2% 8%)",
            zIndex: 1,
          }}
        />

        {/* Canvas — laptop frame with green screen keyed out, sits on top of video */}
        <canvas
          ref={overlayRef}
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            display: "block",
            zIndex: 2,
            filter: "drop-shadow(0 12px 36px rgba(0,0,0,0.50))",
            opacity: overlayOpacity,
            transition: "opacity 0.4s ease",
          }}
        />
      </div>
    </div>
  )
}

/* ── Right-panel visual: single image or mini carousel ───────────────────── */
/* ── Open Image button ───────────────────────────────────────────────────── */
function OpenImageBtn({ onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "6px 14px", borderRadius: "999px",
        background: hov ? "rgba(232,121,160,0.28)" : PINK_DIM,
        border: `1px solid ${hov ? PINK : PINK_MID}`,
        color: hov ? "#fff" : "rgba(255,255,255,0.85)",
        fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.04em",
        cursor: "pointer", transition: "all 0.22s ease",
        transform: hov ? "translateY(-1px)" : "translateY(0)",
        flexShrink: 0,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M4.5 1.5H2a.5.5 0 00-.5.5v2.5M7.5 1.5H10a.5.5 0 01.5.5v2.5M4.5 10.5H2a.5.5 0 01-.5-.5V7.5M7.5 10.5H10a.5.5 0 00.5-.5V7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
      Open Image
    </button>
  )
}

/* ── Open Video button ───────────────────────────────────────────────────── */
function OpenVideoBtn({ onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "6px 14px", borderRadius: "999px",
        background: hov ? "rgba(232,121,160,0.28)" : PINK_DIM,
        border: `1px solid ${hov ? PINK : PINK_MID}`,
        color: hov ? "#fff" : "rgba(255,255,255,0.85)",
        fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.04em",
        cursor: "pointer", transition: "all 0.22s ease",
        transform: hov ? "translateY(-1px)" : "translateY(0)",
        flexShrink: 0,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M1.5 2.5a.5.5 0 01.5-.5h.5v7.5H2a.5.5 0 01-.5-.5V2.5zM4.5 2.5l6 3-6 3V2.5z" fill="currentColor"/>
      </svg>
      Open Video
    </button>
  )
}

function StepVisual({ step, openLightbox, isMobile }) {
  const [visible,  setVisible]  = useState(true)
  const [slideIdx, setSlideIdx] = useState(0)
  const [imgAnim,  setImgAnim]  = useState(true)
  const prevStep                = useRef(step)

  /* Fade the whole panel when the step changes */
  useEffect(() => {
    if (prevStep.current?.number !== step?.number) {
      setVisible(false)
      setSlideIdx(0)
      const t = setTimeout(() => { prevStep.current = step; setVisible(true) }, 180)
      return () => clearTimeout(t)
    }
  }, [step])

  const s      = prevStep.current
  const isVideo    = s?.component === "laptopVideo"
  const wideVisual = s?.wideVisual ?? false
  const slides     = s?.visuals ?? (s?.visual ? [s.visual] : [])
  const multi  = slides.length > 1

  const goSlide = (next) => {
    setImgAnim(false)
    setTimeout(() => {
      setSlideIdx((next + slides.length) % slides.length)
      setImgAnim(true)
    }, 150)
  }

  /* Nav arrow button */
  const NavBtn = ({ dir }) => {
    const [hov, setHov] = useState(false)
    return (
      <button
        onClick={() => goSlide(slideIdx + dir)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "absolute", top: "50%", transform: "translateY(-50%)",
          [dir === -1 ? "left" : "right"]: "14px",
          zIndex: 10,
          width: "34px", height: "34px", borderRadius: "50%",
          background: hov ? "rgba(232,121,160,0.30)" : "rgba(255,255,255,0.12)",
          backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)",
          border: `1px solid ${hov ? PINK_MID : "rgba(255,255,255,0.20)"}`,
          color: hov ? PINK : "rgba(255,255,255,0.80)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.1rem", lineHeight: 1,
          transition: "all 0.2s ease",
        }}
      >
        {dir === -1 ? "‹" : "›"}
      </button>
    )
  }

  return (
    <div style={{
      position:             "sticky",
      top:                  "120px",
      borderRadius:         "24px",
      background:           "rgba(255,255,255,0.08)",
      backdropFilter:       "blur(22px)",
      WebkitBackdropFilter: "blur(22px)",
      border:               "1px solid rgba(255,255,255,0.14)",
      boxShadow:            "0 24px 64px rgba(0,0,0,0.35)",
      overflow:             "hidden",
      opacity:              visible ? 1 : 0,
      transform:            visible ? "translateY(0)" : "translateY(10px)",
      transition:           "opacity 0.3s ease, transform 0.3s ease",
      display:              "flex",
      flexDirection:        "column",
      alignItems:           "center",
      justifyContent:       "center",
      height:               isMobile ? "220px" : `${STEP_BOX_H}px`,
      minHeight:            isMobile ? "220px" : `${STEP_BOX_H}px`,
    }}>

      {/* Dot indicators — absolutely pinned to top center, only for multi-image */}
      {!isVideo && multi && (
        <div style={{ position: "absolute", top: "14px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "7px", zIndex: 5 }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => goSlide(i)} style={{
              width: i === slideIdx ? "10px" : "7px",
              height: i === slideIdx ? "10px" : "7px",
              borderRadius: "50%",
              background: i === slideIdx ? PINK : "rgba(255,255,255,0.30)",
              border: "none", padding: 0, cursor: "pointer",
              transition: "all 0.25s ease",
            }} />
          ))}
        </div>
      )}

      {/* Video laptop mockup — Step 6 only */}
      {isVideo && (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <LaptopVideoMockup />
        </div>
      )}

      {/* Image area — all other steps */}
      {!isVideo && (
        <div style={{ position: "relative", width: "100%", flex: 1, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", padding: wideVisual ? "12px 14px 44px" : multi ? "32px 56px" : "40px" }}>
          {multi && <NavBtn dir={-1} />}
          <img
            key={slideIdx}
            src={slides[slideIdx]}
            alt={`Step ${s?.number} — ${slideIdx + 1}`}
            onClick={() => openLightbox && slides[slideIdx] && openLightbox({ type: "image", src: slides[slideIdx] })}
            style={{
              maxWidth:   wideVisual ? "94%" : "100%",
              maxHeight:  wideVisual ? `${STEP_BOX_H - 80}px` : `${STEP_BOX_H - (multi ? 100 : 80)}px`,
              width:      "auto",
              height:     "auto",
              objectFit:  "contain",
              display:    "block",
              filter:     "drop-shadow(0 8px 28px rgba(0,0,0,0.40))",
              opacity:    imgAnim ? 1 : 0,
              transform:  imgAnim ? "scale(1)" : "scale(0.97)",
              transition: "opacity 0.25s ease, transform 0.25s ease",
              cursor:     "zoom-in",
            }}
          />
          {multi && <NavBtn dir={1} />}
        </div>
      )}

      {/* Open Image button — absolutely pinned to bottom center */}
      {!isVideo && slides[slideIdx] && (
        <div style={{ position: "absolute", bottom: "14px", left: "50%", transform: "translateX(-50%)", zIndex: 5 }}>
          <OpenImageBtn onClick={() => openLightbox && openLightbox({ type: "image", src: slides[slideIdx] })} />
        </div>
      )}

      {/* Open Video button — absolutely pinned to bottom center, Outcome step only */}
      {isVideo && (
        <div style={{ position: "absolute", bottom: "14px", left: "50%", transform: "translateX(-50%)", zIndex: 5 }}>
          <OpenVideoBtn onClick={() => openLightbox && openLightbox({ type: "video", src: "/videos/Sugar_Video.mp4" })} />
        </div>
      )}
    </div>
  )
}

/* ── Collapsed step row ──────────────────────────────────────────────────── */
function CollapsedStepRow({ step, isLast, onClick, grow }) {
  const [hov, setHov] = useState(false)

  return (
    <div style={{ display: "flex", flex: grow ? 1 : undefined, marginBottom: grow ? 0 : (isLast ? 0 : "10px") }}>
      {/* Circle + connector */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "48px", flexShrink: 0 }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%",
          border:     `2px solid ${hov ? PINK_MID : "rgba(255,255,255,0.22)"}`,
          background: hov ? PINK_DIM : "rgba(255,255,255,0.06)",
          color:      hov ? PINK : "rgba(255,255,255,0.50)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.80rem", fontWeight: 700, flexShrink: 0,
          transition: "all 0.28s ease",
        }}>
          {step.number}
        </div>
        {!isLast && (
          <div style={{ flex: 1, width: "2px", minHeight: "10px", marginTop: "4px", background: "rgba(255,255,255,0.10)" }} />
        )}
      </div>

      {/* Title button */}
      <div style={{ flex: 1, marginLeft: "16px", display: "flex", alignItems: "center" }}>
        <button
          onClick={onClick}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            width: "100%", display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: "12px",
            padding: "14px 18px", borderRadius: "14px",
            background:     hov ? PINK_DIM : "rgba(255,255,255,0.05)",
            border:         `1px solid ${hov ? "rgba(232,121,160,0.28)" : "rgba(255,255,255,0.10)"}`,
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            cursor: "pointer", textAlign: "left",
            transition: "background 0.28s ease, border-color 0.28s ease",
          }}
        >
          <span style={{
            color: hov ? "#fff" : "rgba(255,255,255,0.85)",
            fontSize: "clamp(0.93rem,1.3vw,1.05rem)", fontWeight: 500, letterSpacing: "0.01em",
            transition: "color 0.28s ease",
          }}>
            {step.title}
          </span>
          <div style={{
            width: "26px", height: "26px", borderRadius: "50%",
            background: hov ? PINK_DIM : "rgba(255,255,255,0.07)",
            border:     `1px solid ${hov ? "rgba(232,121,160,0.30)" : "rgba(255,255,255,0.12)"}`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            transition: "all 0.28s ease",
          }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M4 2l3 3-3 3" stroke={hov ? PINK : "rgba(255,255,255,0.55)"}
                strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
      </div>
    </div>
  )
}

/* ── Open step box ───────────────────────────────────────────────────────── */
function OpenStepBox({ step, onClose }) {
  const [closeHov, setCloseHov] = useState(false)
  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "48px", flexShrink: 0 }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%",
          border: `2px solid ${PINK}`,
          background: PINK_DIM, color: PINK,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.80rem", fontWeight: 700, flexShrink: 0,
        }}>
          {step.number}
        </div>
        <div style={{
          flex: 1, width: "2px", minHeight: "16px", marginTop: "4px",
          background: `linear-gradient(to bottom, ${PINK}, rgba(232,121,160,0.10))`,
        }} />
      </div>

      <div style={{
        flex: 1, marginLeft: "16px", borderRadius: "14px",
        background:           PINK_DIM,
        border:               `1px solid ${PINK_MID}`,
        backdropFilter:       "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        overflow:             "hidden",
      }}>
        {/* Header row with title + close button */}
        <div style={{ padding: "14px 14px 14px 18px", borderBottom: `1px solid rgba(232,121,160,0.22)`, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
          <span style={{ color: "#fff", fontSize: "clamp(0.93rem,1.3vw,1.05rem)", fontWeight: 700, letterSpacing: "0.01em" }}>
            {step.title}
          </span>
          <button
            onClick={onClose}
            onMouseEnter={() => setCloseHov(true)}
            onMouseLeave={() => setCloseHov(false)}
            title="Close"
            style={{
              flexShrink: 0,
              width: "28px", height: "28px", borderRadius: "50%",
              border:     `1px solid ${closeHov ? PINK : PINK_MID}`,
              background: closeHov ? "rgba(232,121,160,0.25)" : "rgba(232,121,160,0.10)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", transition: "all 0.22s ease",
            }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2 9l7-7M9 9L2 2" stroke={closeHov ? "#fff" : PINK} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div style={{
          height: `${STEP_CONTENT_H}px`, overflowY: "auto",
          padding: "16px 20px 20px",
          scrollbarWidth: "thin",
          scrollbarColor: `rgba(232,121,160,0.4) rgba(255,255,255,0.05)`,
        }}>
          <StepContent blocks={step.content} />
        </div>
      </div>
    </div>
  )
}

/* ── Close arrow ─────────────────────────────────────────────────────────── */
function CloseArrow({ onClick }) {
  const [hov, setHov] = useState(false)
  return (
    <div style={{ display: "flex", marginTop: "12px" }}>
      <div style={{ width: "48px", display: "flex", justifyContent: "center", flexShrink: 0 }}>
        <button
          onClick={onClick}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          title="Back to all steps"
          style={{
            width: "38px", height: "38px", borderRadius: "50%",
            border:     `2px solid ${hov ? PINK : PINK_MID}`,
            background: hov ? "rgba(232,121,160,0.25)" : PINK_DIM,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.25s ease",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2.5 8.5l5-5 5 5" stroke={PINK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

/* ── Lightbox (image + video) ────────────────────────────────────────────── */
function Lightbox({ item, onClose }) {
  useEffect(() => {
    if (!item) return
    const onKey = (e) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [item, onClose])

  if (!item) return null

  return (
    <div
      onClick={onClose}
      style={{
        position:             "fixed",
        inset:                0,
        zIndex:               1200,
        display:              "flex",
        alignItems:           "center",
        justifyContent:       "center",
        background:           "rgba(0,0,0,0.88)",
        backdropFilter:       "blur(22px)",
        WebkitBackdropFilter: "blur(22px)",
        animation:            "fadeIn 0.25s ease",
        cursor:               "zoom-out",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position:       "absolute",
          top:            "clamp(16px,3vh,28px)",
          right:          "clamp(16px,3vw,28px)",
          width:          "44px",
          height:         "44px",
          borderRadius:   "50%",
          background:     "rgba(255,255,255,0.12)",
          border:         "1px solid rgba(255,255,255,0.22)",
          backdropFilter: "blur(12px)",
          color:          "#fff",
          fontSize:       "20px",
          lineHeight:     1,
          display:        "flex",
          alignItems:     "center",
          justifyContent: "center",
          cursor:         "pointer",
          zIndex:         1201,
          transition:     "background 0.2s",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.24)"}
        onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
      >✕</button>

      {item.type === "video" ? (
        <video
          src={item.src}
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
            animation:    "lightboxPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        />
      ) : (
        <img
          src={item.src}
          alt=""
          onClick={e => e.stopPropagation()}
          style={{
            maxWidth:     "90vw",
            maxHeight:    "85vh",
            borderRadius: "16px",
            objectFit:    "contain",
            boxShadow:    "0 30px 80px rgba(0,0,0,0.65)",
            cursor:       "default",
            animation:    "lightboxPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        />
      )}
    </div>
  )
}

/* ── Bringing the Brand to Life — sticky scroll-driven horizontal gallery ── */
const BRAND_ITEMS = [
  { type: "image", src: "/images/Sugar_Banner.png"   },
  { type: "image", src: "/images/Sugar_room.png"     },
  { type: "video", src: "/videos/Sugar_Magazine.mp4" },
  { type: "image", src: "/images/Sugar_Magazine.png" },
  { type: "video", src: "/videos/Sugar_Insta.mp4"    },
  { type: "image", src: "/images/Sugar_bag.png"      },
]

const ITEM_H = 300 /* px — fixed height for every card */
/* How many scroll-pixels are needed per gallery-pixel of movement.
   6 → you scroll 6× further to move the gallery the same distance (slower/smoother). */
const GALLERY_SCROLL_RATIO = 4.5

function BrandInRealLife({ openLightbox }) {
  const wrapperRef    = useRef(null)
  const trackRef      = useRef(null)
  const currentX      = useRef(0)
  const targetX       = useRef(0)
  const rafId         = useRef(null)
  // Touch drag (mobile)
  const touchStartX      = useRef(null)
  const touchStartTarget = useRef(0)
  // Custom scrollbar
  const sbTrackRef   = useRef(null)
  const sbThumbRef   = useRef(null)
  const sbDragging   = useRef(false)
  const sbDragStartX = useRef(0)
  const sbDragStartT = useRef(0)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  /* Mobile touch drag */
  const onTouchStart = (e) => {
    touchStartX.current      = e.touches[0].clientX
    touchStartTarget.current = targetX.current
  }
  const onTouchMove = (e) => {
    if (touchStartX.current === null) return
    const delta = e.touches[0].clientX - touchStartX.current
    const track = trackRef.current
    if (!track) return
    const maxShift = -(track.scrollWidth - window.innerWidth + 96)
    targetX.current = Math.max(maxShift, Math.min(0, touchStartTarget.current + delta))
  }
  const onTouchEnd = () => { touchStartX.current = null }

  /* Recompute wrapper height when track resizes */
  useEffect(() => {
    const track   = trackRef.current
    const wrapper = wrapperRef.current
    if (!track || !wrapper) return
    const update = () => {
      const scrollRange = Math.max(0, track.scrollWidth - window.innerWidth + 96)
      wrapper.style.height = `calc(100vh + ${scrollRange * GALLERY_SCROLL_RATIO}px)`
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(track)
    window.addEventListener("resize", update)
    return () => { ro.disconnect(); window.removeEventListener("resize", update) }
  }, [])

  /* Smooth lerp loop — also syncs scrollbar thumb position */
  useEffect(() => {
    const loop = () => {
      currentX.current += (targetX.current - currentX.current) * 0.09
      if (trackRef.current) trackRef.current.style.transform = `translateX(${currentX.current}px)`
      const track   = trackRef.current
      const sbTrack = sbTrackRef.current
      const sbThumb = sbThumbRef.current
      if (track && sbTrack && sbThumb) {
        const maxShift = -(track.scrollWidth - window.innerWidth + 96)
        if (maxShift < 0) {
          const sbW    = sbTrack.offsetWidth
          const thumbW = Math.max(48, sbW * (window.innerWidth / track.scrollWidth))
          const maxTX  = sbW - thumbW
          const prog   = currentX.current / maxShift
          sbThumb.style.width     = `${thumbW}px`
          sbThumb.style.transform = `translateX(${Math.max(0, Math.min(maxTX, prog * maxTX))}px)`
        }
      }
      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId.current)
  }, [])

  /* Map page scroll → gallery X */
  useEffect(() => {
    const onScroll = () => {
      const wrapper = wrapperRef.current
      const track   = trackRef.current
      if (!wrapper || !track) return
      const wRect       = wrapper.getBoundingClientRect()
      const scrollableH = wrapper.offsetHeight - window.innerHeight
      if (scrollableH <= 0) return
      const scrolled = Math.max(0, -wRect.top)
      const progress = Math.min(1, scrolled / scrollableH)
      const maxShift = -(track.scrollWidth - window.innerWidth + 96)
      targetX.current = maxShift * progress
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* Scrollbar thumb drag */
  useEffect(() => {
    const onMouseMove = (e) => {
      if (!sbDragging.current) return
      const delta   = e.clientX - sbDragStartX.current
      const track   = trackRef.current
      const sbTrack = sbTrackRef.current
      const sbThumb = sbThumbRef.current
      if (!track || !sbTrack || !sbThumb) return
      const maxShift = -(track.scrollWidth - window.innerWidth + 96)
      const sbW      = sbTrack.offsetWidth
      const thumbW   = parseFloat(sbThumb.style.width) || 48
      const maxTX    = sbW - thumbW
      const ratio    = maxTX > 0 ? maxShift / maxTX : 0
      targetX.current = Math.max(maxShift, Math.min(0, sbDragStartT.current + delta * ratio))
    }
    const onMouseUp = () => {
      sbDragging.current = false
      if (sbThumbRef.current) {
        sbThumbRef.current.style.background = PINK
        sbThumbRef.current.style.cursor = "grab"
      }
    }
    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseup",   onMouseUp)
    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseup",   onMouseUp)
    }
  }, [])

  /* Click on scrollbar track — jump to that position */
  const onSbTrackClick = (e) => {
    const sbTrack = sbTrackRef.current
    const sbThumb = sbThumbRef.current
    const track   = trackRef.current
    if (!sbTrack || !sbThumb || !track) return
    const rect     = sbTrack.getBoundingClientRect()
    const clickX   = e.clientX - rect.left
    const sbW      = sbTrack.offsetWidth
    const thumbW   = parseFloat(sbThumb.style.width) || 48
    const maxTX    = sbW - thumbW
    const prog     = Math.max(0, Math.min(1, (clickX - thumbW / 2) / maxTX))
    const maxShift = -(track.scrollWidth - window.innerWidth + 96)
    targetX.current = maxShift * prog
  }

  const PAD    = isMobile ? "16px" : "clamp(32px, 5vw, 72px)"
  const CARD_H = isMobile ? 150 : ITEM_H

  return (
    <div ref={wrapperRef}>
      <section
        onTouchStart={isMobile ? onTouchStart : undefined}
        onTouchMove={isMobile  ? onTouchMove  : undefined}
        onTouchEnd={isMobile   ? onTouchEnd   : undefined}
        style={{
          position: "sticky", top: 0, height: "100vh",
          display: "flex", flexDirection: "column", justifyContent: "center",
          overflow: "hidden",
          touchAction: isMobile ? "pan-y" : undefined,
        }}
      >
        <h2 style={{
          margin: "0 0 36px", paddingLeft: PAD,
          color: "#fff", fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
          fontWeight: 700, letterSpacing: "-0.01em",
        }}>
          Bringing the Brand to Life
        </h2>

        <div ref={trackRef} style={{ display: "flex", gap: isMobile ? "10px" : "16px", paddingLeft: PAD, willChange: "transform" }}>
          {BRAND_ITEMS.map((item, i) =>
            item.type === "video" ? (
              <div key={i} style={{ position: "relative", flexShrink: 0, cursor: "zoom-in" }}
                onClick={() => openLightbox({ type: "video", src: item.src })}>
                <video src={item.src} autoPlay loop muted playsInline
                  style={{ height: `${CARD_H}px`, width: "auto", display: "block",
                    borderRadius: "16px", objectFit: "cover",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.40)",
                    pointerEvents: "none" }} />
                <div style={{
                  position: "absolute", inset: 0, borderRadius: "16px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(0,0,0,0)", transition: "background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(0,0,0,0.30)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(0,0,0,0)"}
                >
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.20)", backdropFilter: "blur(8px)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    opacity: 0, transition: "opacity 0.2s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity = "1"}
                    onMouseLeave={e => e.currentTarget.style.opacity = "0"}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="white">
                      <path d="M5 3l11 6-11 6V3z"/>
                    </svg>
                  </div>
                </div>
              </div>
            ) : (
              <img key={i} src={item.src} alt=""
                onClick={() => openLightbox({ type: "image", src: item.src })}
                style={{ height: `${CARD_H}px`, width: "auto", flexShrink: 0,
                  borderRadius: "16px", objectFit: "cover", display: "block",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.40)", cursor: "zoom-in",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.55)" }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)";    e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.40)" }}
              />
            )
          )}
        </div>

        {/* ── Custom scrollbar — desktop only ── */}
        {!isMobile && (
          <div style={{ padding: `32px ${PAD} 0`, userSelect: "none" }}>
            <div
              ref={sbTrackRef}
              onClick={onSbTrackClick}
              style={{
                position: "relative", height: "5px", borderRadius: "3px",
                background: "rgba(255,255,255,0.10)", cursor: "pointer",
              }}
            >
              <div
                ref={sbThumbRef}
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  sbDragging.current   = true
                  sbDragStartX.current = e.clientX
                  sbDragStartT.current = targetX.current
                  e.currentTarget.style.cursor = "grabbing"
                }}
                style={{
                  position: "absolute", top: "-3px", left: 0,
                  height: "11px", width: "80px", borderRadius: "6px",
                  background: PINK,
                  cursor: "grab",
                  boxShadow: `0 0 10px ${PINK_DIM}`,
                  transition: "background 0.18s, box-shadow 0.18s",
                }}
                onMouseEnter={e => { if (!sbDragging.current) { e.currentTarget.style.background = "#fff"; e.currentTarget.style.boxShadow = "0 0 12px rgba(255,255,255,0.45)" } }}
                onMouseLeave={e => { if (!sbDragging.current) { e.currentTarget.style.background = PINK;  e.currentTarget.style.boxShadow = `0 0 10px ${PINK_DIM}` } }}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  )
}


/* ── Full stepper wrapper ────────────────────────────────────────────────── */
function CaseStudyStepper({ openLightbox }) {
  const [openIndex, setOpenIndex] = useState(null)
  const [hdVisible, setHdVisible] = useState(false)
  const [isMobile,  setIsMobile]  = useState(() => window.innerWidth < 640)
  const headingRef = useRef(null)
  const openStep   = (i) => setOpenIndex(i)
  const closeStep  = ()  => setOpenIndex(null)

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  useEffect(() => {
    const el = headingRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setHdVisible(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const hdAnim = (delay) => ({
    opacity:    hdVisible ? 1 : 0,
    transform:  hdVisible ? "translateX(0)" : "translateX(-48px)",
    transition: `opacity 0.65s ease ${delay}, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}`,
  })

  return (
    <div style={{
      width: "100%", boxSizing: "border-box",
      paddingTop: "80px", paddingBottom: "0px",
      paddingLeft:  isMobile ? "16px" : "clamp(32px, 5vw, 72px)",
      paddingRight: isMobile ? "16px" : "clamp(32px, 5vw, 72px)",
    }}>
      {/* Section heading */}
      <div ref={headingRef} style={{ marginBottom: isMobile ? "24px" : "52px", textAlign: isMobile ? "center" : "left" }}>
        <div style={{
          display: "inline-block", padding: "5px 18px", borderRadius: "999px",
          background: PINK_DIM, border: `1px solid ${PINK_MID}`,
          color: PINK, fontSize: "0.72rem", fontWeight: 600,
          letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: "14px",
          ...hdAnim("0s"),
        }}>
          Case Study
        </div>
        <h2 style={{ margin: 0, color: "#fff", fontSize: isMobile ? "1.3rem" : "clamp(1.6rem,3vw,2.4rem)", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.1, ...hdAnim("0.15s") }}>
          Design Process
        </h2>
        <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.45)", fontSize: isMobile ? "0.78rem" : "clamp(0.88rem,1.2vw,0.98rem)", ...hdAnim("0.28s") }}>
          Tap any step to explore the full story.
        </p>
      </div>

      {/* Mobile: visual on top, steps below — Desktop: two columns */}
      <div style={{
        display:       "flex",
        flexDirection: isMobile ? "column" : "row",
        gap:           isMobile ? "16px" : "clamp(20px,3vw,48px)",
        alignItems:    "flex-start",
      }}>

        {/* Glass visual — TOP on mobile (order -1), RIGHT on desktop */}
        <div style={{
          order:   isMobile ? -1 : 1,
          flex:    isMobile ? "none" : 1,
          width:   isMobile ? "100%" : undefined,
          minWidth: isMobile ? undefined : 0,
          opacity:    hdVisible ? 1 : 0,
          transform:  hdVisible ? "translateX(0)" : "translateX(48px)",
          transition: "opacity 0.65s ease 0.48s, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) 0.48s",
        }}>
          <StepVisual
            step={openIndex !== null ? STEPS[openIndex] : STEPS[0]}
            openLightbox={openLightbox}
            isMobile={isMobile}
          />
        </div>

        {/* Steps list — BOTTOM on mobile (order 0), LEFT on desktop */}
        <div style={{
          order:     isMobile ? 0 : 0,
          flex:      isMobile ? "none" : "0 0 48%",
          width:     isMobile ? "100%" : undefined,
          maxWidth:  isMobile ? undefined : "48%",
          opacity:    hdVisible ? 1 : 0,
          transform:  hdVisible ? "translateX(0)" : "translateX(-48px)",
          transition: "opacity 0.65s ease 0.38s, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) 0.38s",
        }}>
          {openIndex === null ? (
            <div style={{
              display: "flex", flexDirection: "column",
              height: isMobile ? "auto" : `${STEP_BOX_H}px`,
              gap:    isMobile ? "6px" : 0,
            }}>
              {STEPS.map((step, i) => (
                <CollapsedStepRow
                  key={step.number}
                  step={step}
                  isLast={i === STEPS.length - 1}
                  onClick={() => openStep(i)}
                  grow={!isMobile}
                />
              ))}
            </div>
          ) : (
            <OpenStepBox step={STEPS[openIndex]} onClose={closeStep} />
          )}
        </div>

      </div>
    </div>
  )
}

/* ── Main page ───────────────────────────────────────────────────────────── */
export function SugarCloudPage() {
  const { navigate } = useRouter()
  const [heroIn,       setHeroIn]       = useState(false)
  const [lightboxItem, setLightboxItem] = useState(null)
  const [isMobile,     setIsMobile]     = useState(() => window.innerWidth < 640)
  const openLightbox = (item) => setLightboxItem(item)
  const backBtnRef = useRef(null)

  useEffect(() => {
    const syncLeft = () => {
      const header = document.querySelector("header")
      const btn    = backBtnRef.current
      if (!header || !btn) return
      btn.style.left = window.getComputedStyle(header).paddingLeft
    }
    syncLeft()
    window.addEventListener("resize", syncLeft)
    return () => window.removeEventListener("resize", syncLeft)
  }, [])

  // Preload ALL step images on mount so switching steps is instant
  useEffect(() => {
    STEPS.forEach(s => {
      const srcs = s.visuals ?? (s.visual ? [s.visual] : [])
      srcs.forEach(src => {
        const img = new window.Image()
        img.src = src
      })
    })
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setHeroIn(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return (
    <>
      <SideBlobs />

      <main style={{ minHeight: "100vh", overflowX: "clip" }}>

        {/* ── Back button ──────────────────────────────────────────────── */}
        <button
          ref={backBtnRef}
          onClick={() => navigate("projects")}
          style={{
            position:             "fixed",
            top:                  "clamp(110px,13vh,140px)",
            zIndex:               50,
            display:              "flex",
            alignItems:           "center",
            gap:                  "8px",
            padding:              "11px 26px",
            borderRadius:         "999px",
            background:           "rgba(255,255,255,0.10)",
            backdropFilter:       "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border:               "1px solid rgba(255,255,255,0.22)",
            color:                "rgba(255,255,255,0.88)",
            fontSize:             "0.85rem",
            fontWeight:           500,
            cursor:               "pointer",
            transition:           "background 0.2s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.10)"}
        >
          ← Back
        </button>

        {/* ════════════════════════════════════════════════════════════
            HERO — mobile: laptop top + info below | desktop: left info + right carousel
        ════════════════════════════════════════════════════════════ */}
        <section style={{
          display:        "flex",
          flexDirection:  isMobile ? "column" : "row",
          alignItems:     isMobile ? "center" : "center",
          height:         isMobile ? "auto" : "100vh",
          padding:        isMobile
            ? "120px 16px 32px"
            : "80px clamp(20px, 4vw, 72px) 0",
          gap:            isMobile ? "24px" : "clamp(24px, 3vw, 56px)",
        }}>

          {/* ── Laptop mockup — TOP on mobile, RIGHT on desktop ──────── */}
          <div style={{
            order:      isMobile ? -1 : 1,
            flex:       isMobile ? "none" : 1,
            width:      isMobile ? "100%" : undefined,
            minWidth:   isMobile ? undefined : 0,
            display:    "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity:    heroIn ? 1 : 0,
            transform:  heroIn ? "translateX(0)" : "translateX(60px)",
            transition: "opacity 0.8s 0.12s ease, transform 0.8s 0.12s ease",
          }}>
            <img
              src="/images/Sugarcloud.gif"
              alt="SugarCloud desktop mockup"
              style={{
                width:      "100%",
                maxWidth:   isMobile ? "420px" : "1140px",
                height:     "auto",
                display:    "block",
                margin:     "0 auto",
                marginTop:  isMobile ? "0" : "-110px",
                filter:     "drop-shadow(0 24px 64px rgba(0,0,0,0.60))",
                objectFit:  "contain",
              }}
            />
          </div>

          {/* ── Info panel — BOTTOM centered on mobile, LEFT on desktop ─ */}
          <div style={{
            order:         isMobile ? 0 : 0,
            width:         isMobile ? "100%" : "clamp(280px, 40%, 460px)",
            flexShrink:    0,
            display:       "flex",
            flexDirection: "column",
            alignItems:    isMobile ? "center" : "flex-start",
            textAlign:     isMobile ? "center" : "left",
            gap:           "0px",
            opacity:       heroIn ? 1 : 0,
            transform:     heroIn ? "translateX(0)" : "translateX(-50px)",
            transition:    "opacity 0.8s ease, transform 0.8s ease",
          }}>

            {/* Logo on top, Name below */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: isMobile ? "center" : "flex-start", gap: "10px", marginBottom: "10px" }}>
              <img
                src="/images/SugarcloudLogo.png"
                alt="SugarCloud Cupcakes"
                style={{
                  height:    isMobile ? "80px" : "clamp(100px, 12vw, 150px)",
                  width:     "auto",
                  objectFit: "contain",
                  filter:    "drop-shadow(0 4px 16px rgba(232,121,160,0.45))",
                }}
              />
              <h1 style={{
                margin: 0,
                lineHeight: 1.05,
                textAlign: isMobile ? "center" : "left",
                display: "flex",
                alignItems: "baseline",
                gap: "0.3em",
                flexWrap: "nowrap",
                whiteSpace: "nowrap",
              }}>
                <span style={{
                  fontFamily: "'Dancing Script', cursive",
                  fontSize:   isMobile ? "2rem" : "clamp(2.4rem, 4vw, 3.8rem)",
                  fontWeight: 700,
                  color:      "#fff",
                  whiteSpace: "nowrap",
                }}>
                  SugarCloud
                </span>
                <span style={{
                  fontFamily: "'Open Sans', sans-serif",
                  fontSize:   isMobile ? "2rem" : "clamp(2.4rem, 4vw, 3.8rem)",
                  fontWeight: 400,
                  color:      "rgba(255,255,255,0.85)",
                  letterSpacing: "0.01em",
                  whiteSpace: "nowrap",
                }}>
                  Cupcakes
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p style={{
              margin:        "0 0 12px",
              color:         PINK,
              fontSize:      isMobile ? "0.75rem" : "clamp(0.78rem, 1vw, 0.90rem)",
              fontWeight:    600,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
            }}>
              Cupcake Ordering Website
            </p>

            {/* Divider */}
            <div style={{ width: "100%", maxWidth: "400px", height: "1px", background: "rgba(255,255,255,0.09)", marginBottom: "18px", alignSelf: isMobile ? "center" : "flex-start" }} />

            {/* Tools row */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px", flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start" }}>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", minWidth: "58px", flexShrink: 0 }}>Tools</span>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start" }}>
                {TOOLS.map(t => <ToolIcon key={t.name} {...t} />)}
              </div>
            </div>

            {/* Role row */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px", flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start" }}>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", minWidth: "58px", flexShrink: 0 }}>Role</span>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: isMobile ? "center" : "flex-start" }}>
                {["UI/UX", "Branding", "Product Designer"].map(r => (
                  <span key={r} style={{
                    padding: "3px 11px", borderRadius: "999px",
                    background: PINK_DIM, border: `1px solid ${PINK_MID}`,
                    color: "rgba(255,255,255,0.85)", fontSize: "0.71rem", fontWeight: 600,
                  }}>{r}</span>
                ))}
              </div>
            </div>

            {/* Timeline row */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "26px", justifyContent: isMobile ? "center" : "flex-start" }}>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", minWidth: "58px", flexShrink: 0 }}>Timeline</span>
              <span style={{ color: "rgba(255,255,255,0.88)", fontSize: "0.82rem", fontWeight: 600 }}>5 Weeks</span>
            </div>

            {/* Figma Prototype button */}
            <a
              href="https://www.figma.com/proto/ST0WcHHTo9lmOlJTD7e8IK/Untitled?node-id=487-2571&t=j1rZPXVPC3aiuZmU-1&scaling=scale-down&content-scaling=fixed&page-id=340%3A4540"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                padding: "11px 26px", borderRadius: "999px",
                background: PINK_DIM, border: `1px solid ${PINK_MID}`,
                color: "rgba(255,255,255,0.92)",
                fontSize: "0.85rem", fontWeight: 500, letterSpacing: "0.04em",
                textDecoration: "none", transition: "all 0.22s ease",
                alignSelf: isMobile ? "center" : "flex-start",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(232,121,160,0.28)"
                e.currentTarget.style.borderColor = PINK
                e.currentTarget.style.transform = "translateY(-2px)"
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = PINK_DIM
                e.currentTarget.style.borderColor = PINK_MID
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              <img src="/images/toolkit-figma.png" alt="Figma" style={{ width: "16px", height: "16px", objectFit: "contain" }} />
              Figma Prototype
            </a>

          </div>

        </section>

        {/* ════════════════════════════════════════════════════════════
            DESIGN PROCESS — AlpineLink-style stepper
        ════════════════════════════════════════════════════════════ */}
        <CaseStudyStepper openLightbox={openLightbox} />

        {/* ════════════════════════════════════════════════════════════
            BRAND IN REAL LIFE — scroll-driven horizontal gallery
        ════════════════════════════════════════════════════════════ */}
        <BrandInRealLife openLightbox={openLightbox} />

      </main>

      <div style={{ marginTop: "-40px" }}>
        <Footer />
      </div>

      {/* ── Lightbox — renders above everything ──────────────────────── */}
      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </>
  )
}
