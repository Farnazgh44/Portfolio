import { useRef, useEffect, useState, useCallback } from "react"
import { GlassCard }          from "../components/glass-card"
import { Footer }             from "../components/footer"
import { AutoBlobText }       from "../components/auto-blob-text"
import { SideBlobs }          from "../components/side-blobs"
import { VariableProximity }  from "../components/variable-proximity"
import { BlobButton }         from "../components/blob-button"

/* ─── Data ─── */
const STORY_SECTIONS = [
  {
    title: "Why Liquid Morphism?",
    paragraphs: [
      "You might notice the flowing blob shapes throughout my portfolio. They're not just a visual choice — they come from a personal story.",
      "During a difficult time in my life, I received a lava lamp as a gift. I used to sit and watch it for long moments — the soft movements, shifting colors, and constant transformation. There was something calming and alive about it. It never stayed the same, yet it never stopped moving forward.",
      "That feeling stayed with me. The liquid, morphing shapes in my design represent that same sense of life, motion, and change — bringing softness and energy into the interface, making it feel more alive and interactive.",
      "For me, design shouldn't feel static or cold. It should feel engaging, comforting, and human. Something that keeps you curious, present, and connected.",
    ],
    video: "/videos/Lava_lamp.mp4",
    imagePosition: "center center",
    imageScale: "100%",
  },
  {
    title: "My Story",
    paragraphs: [
      "Since I was a child, I've always been passionate about art and drawing. I used to capture my experiences by turning them into visuals, telling stories through what I created.",
      "As I grew older, I realized that this is what art truly means to me: communicating ideas and emotions through visuals.",
      "Now, through UI/UX and digital design, I've found a way to bring that passion into a modern context — using my artistic background to create designs that are clear, meaningful, and interactive.",
    ],
    image: "/images/about-mystory.jpeg",
    imagePosition: "center center",
    imageScale: "110%",
  },
  {
    title: "What Drives Me",
    paragraphs: [
      "I'm driven by creating designs that are both unique and purposeful.",
      "I enjoy diving into existing designs, analyzing how they work, and exploring ways to improve them. This constant curiosity strengthens my critical thinking and pushes me to grow as a designer.",
      "I like to challenge myself by rethinking how designs can be improved — both visually and functionally — to enhance the overall user experience and create more engaging, effective interfaces.",
    ],
    image: "/images/about-whatdrivesme.jpeg",
    imagePosition: "center 80%",
    imageScale: "140%",
  },
]

const TOOLKIT = [
  { name: "Adobe Illustrator", image: "/images/toolkit-illustrator.png", desc: "Used for creating vector graphics, icons, and illustrations" },
  { name: "Adobe InDesign", image: "/images/toolkit-indesign.png", desc: "Used for layout design like magazines, booklets, and PDFs" },
  { name: "Adobe Photoshop", image: "/images/toolkit-photoshop.png", desc: "Used for photo editing and visual design" },
  { name: "Adobe After Effects", image: "/images/toolkit-aftereffects.png", desc: "Used for motion graphics and animations" },
  { name: "Adobe Premiere", image: "/images/Premium.png", desc: "Used for video editing and storytelling" },
  { name: "Canva", image: "/images/toolkit-canva.png", desc: "Used for quick and simple graphic design" },
  { name: "VSC (Visual Studio Code)", image: "/images/toolkit-vscode.png", desc: "Used for writing and editing code" },
  { name: "Adobe Dimension", image: "/images/toolkit-dimension.png", desc: "Used for creating simple 3D scenes and mockups" },
  { name: "Figma", image: "/images/toolkit-figma.png", desc: "Used for UI/UX design, wireframes, and prototypes" },
  { name: "Tinkercad", image: "/images/toolkit-tinkercad.png", desc: "Used for simple 3D modeling and basic design learning" },
  { name: "HTML", image: "/images/HTML.png", desc: "Used to structure web pages" },
  { name: "CSS", image: "/images/CSS.png", desc: "Used to style and layout websites" },
  { name: "JavaScript", image: "/images/JS.png", desc: "Used to add interactivity to websites" },
  { name: "Maya", image: "/images/Maya.png", desc: "Used for 3D modeling and animation" },
  { name: "React", image: "/images/React.png", desc: "Used to build interactive web interfaces" },
  { name: "Adobe Substance Painter", image: "/images/Substance_Painter.png", desc: "Used for texturing 3D models" },
  { name: "Maze", image: "/images/toolkit-maze.png", desc: "Used to test UI/UX designs with real users" },
  { name: "WordPress", image: "/images/wordpress.png", desc: "Used to build and manage websites easily" },
  { name: "Adobe Character Animator", image: "/images/character-animator.png", desc: "Used to animate characters using motion capture" },
  { name: "Project Neo", image: "/images/Project_Neo.png", desc: "Used to create 3D designs in a simple interface" },
]

const GOALS_DATA = {
  "Short-term": "Complete my BCIT New Media program, build a strong portfolio with diverse UX/UI projects, and secure an internship at a design-driven company where I can learn from experienced professionals.",
  "Long-term": "Become a lead UX designer at a company that values user-centered innovation. I want to mentor emerging designers and eventually start my own design consultancy focused on accessible, inclusive digital experiences.",
}

const VALUES_DATA = {
  Creativity: "I approach every project with fresh eyes and an open mind. Creativity isn't just about making things look beautiful\u2014it's about finding innovative solutions to complex problems and pushing boundaries in thoughtful ways.",
  Empathy: "Understanding the user is at the heart of everything I do. I believe the best designs come from deeply listening to people, understanding their needs, and crafting experiences that genuinely make their lives better.",
  Growth: "I'm a lifelong learner who embraces challenges as opportunities. Whether it's mastering a new tool, exploring a different design methodology, or stepping outside my comfort zone, I'm always evolving.",
}

const HOBBIES = [
  {
    label: "Games",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="6" x2="10" y1="11" y2="11" /><line x1="8" x2="8" y1="9" y2="13" />
        <line x1="15" x2="15.01" y1="12" y2="12" /><line x1="18" x2="18.01" y1="10" y2="10" />
        <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
      </svg>
    ),
    images: [
      "/images/hobby-game-1.jpg",
      "/images/hobby-game-2.jpg",
      "/images/hobby-game-3.jpg",
      "/images/hobby-game-4.jpg",
      "/images/hobby-game-5.jpg",
      "/images/hobby-game-6.jpg",
      "/images/hobby-game-7.webp",
      "/images/hobby-game-8.jpg",
      "/images/Game1.jpg",
      "/images/Game2.jpg",
      "/images/Game3.jpg",
      "/images/Game4.png",
      "/images/Game5.jpg",
      "/images/Game6.jpg",
      "/images/Game7.jpg",
      "/images/Game8.jpg",
      "/images/Game9.jpg",
      "/images/Game10.jpg",
      "/images/Game11.jpg",
      "/images/Game12.jpg",
    ],
  },
  {
    label: "Outdoors",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
      </svg>
    ),
    images: [
      "/images/hobby-travel-1.jpeg",
      "/images/hobby-travel-2.jpeg",
      "/images/Travel1.jpeg",
      "/images/Travel2.jpeg",
      "/images/Travel3.jpeg",
    ],
  },
  {
    label: "Drawing",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
        <path d="m15 5 4 4" />
      </svg>
    ),
    images: [
      "/images/hobby-drawing-1.jpg",
      "/images/hobby-drawing-2.jpg",
      "/images/hobby-drawing-3.jpg",
      "/images/hobby-drawing-4.jpg",
      "/images/hobby-drawing-5.jpg",
      "/images/hobby-drawing-6.jpg",
      "/images/hobby-drawing-7.jpg",
    ],
  },

  {
    label: "Food",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" />
        <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7" />
      </svg>
    ),
    images: [
      "/images/hobby-food-1.jpeg",
      "/images/hobby-food-2.jpeg",
      "/images/hobby-food-3.jpeg",
      "/images/hobby-food-4.jpeg",
      "/images/Foodnew.jpeg",
    ],
  },
]

const glassStyle = {
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.15)",
}

/* ── Tilt-on-hover wrapper (same as about-preview on home page) ─────────── */
function TiltWrapper({ children, active, amplitude = 12 }) {
  const ref = useRef(null)
  const [rot, setRot] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const onMove = (e) => {
    if (!active || !ref.current) return
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const nx = ((e.clientX - left) / width  - 0.5) * 2
    const ny = ((e.clientY - top)  / height - 0.5) * 2
    setRot({ x: -ny * amplitude, y: nx * amplitude })
  }

  const onLeave = () => {
    setHovered(false)
    setRot({ x: 0, y: 0 })
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => active && setHovered(true)}
      onMouseLeave={onLeave}
      style={{ perspective: "900px", transformStyle: "preserve-3d" }}
    >
      <div
        style={{
          transform: active
            ? `rotateX(${rot.x}deg) rotateY(${rot.y}deg) scale(${hovered ? 1.04 : 1})`
            : "none",
          transition: hovered
            ? "transform 0.08s linear"
            : "transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)",
          willChange: "transform",
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </div>
  )
}

/* ─── Section A: Hero ─── */
function AboutHero() {
  /* settled → triggers photo slide-in (right) + text slide-in (left) */
  const [settled, setSettled] = useState(false)
  /* showButtons → buttons pop up after text has landed */
  const [showButtons, setShowButtons] = useState(false)
  /* isMobile — phones only (<640px) */
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)

  useEffect(() => {
    const t1 = setTimeout(() => setSettled(true), 80)
    const t2 = setTimeout(() => setShowButtons(true), 650)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  /* Container ref for VariableProximity mouse tracking */
  const proximityRef = useRef(null)

  /* Shared slide-in easing */
  const slideEase = "transform 0.85s cubic-bezier(0.23, 1, 0.32, 1)"

  return (
    <section className="relative h-screen flex items-start sm:items-center pt-20 sm:pt-20 overflow-hidden">
      {/* Mobile: photo on top, text+buttons below. Desktop: side-by-side */}
      <div className="content-wrap w-full flex flex-col sm:flex-row items-stretch gap-3 md:gap-8">

        {/* Photo — TOP on mobile (order-1), RIGHT on desktop (order-2) */}
        <div
          className="order-1 sm:order-2 sm:flex-none sm:ml-auto w-full sm:w-auto"
          style={{
            transform: settled ? "translateX(0)" : "translateX(120vw)",
            transition: "transform 0.9s cubic-bezier(0.23, 1, 0.32, 1)",
          }}
        >
          <TiltWrapper active={settled} amplitude={10}>
            <div
              className="rounded-2xl overflow-hidden w-full sm:w-auto md:w-[560px] h-[260px] sm:h-[400px] md:h-[600px]"
              style={glassStyle}
            >
              <img src="/images/about-portrait.png" alt="Portrait of Farnaz" className="w-full h-full object-cover" />
            </div>
          </TiltWrapper>
        </div>

        {/* Text — BOTTOM on mobile (order-2), LEFT on desktop (order-1) */}
        <div
          className="order-2 sm:order-1 flex-none flex flex-col gap-2 sm:gap-4 w-full sm:w-[50%] md:w-[50%] h-auto p-0 sm:pt-4 sm:pr-4 sm:pb-4 md:pt-5 md:pr-5 md:pb-5"
        >
          {/* Heading */}
          <div
            style={{
              fontSize: isMobile ? "1.2rem" : "clamp(2rem, 4.5vw, 5rem)",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              transform: settled ? "translateX(0)" : "translateX(-110vw)",
              opacity: settled ? 1 : 0,
              transition: `${slideEase}, opacity 0.6s ease`,
            }}
          >
            <AutoBlobText
              text="About Me"
              as="h2"
              className="text-white font-bold mb-1 sm:mb-5"
              filterId="goo-about-heading"
              startDelay={950}
            />
          </div>

          {/* Body text */}
          <div
            ref={proximityRef}
            className="sm:flex-1 sm:min-h-0 overflow-visible"
            style={{
              transform: settled ? "translateX(0)" : "translateX(-110vw)",
              opacity: settled ? 1 : 0,
              transition: `transform 0.85s 0.12s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.6s 0.12s ease`,
              fontSize: isMobile ? "11px" : undefined,
            }}
          >
            <VariableProximity
              label="Welcome to my portfolio — I'm Farnaz Gholami, a UI/UX & Digital Designer based in Vancouver, BC."
              className="text-white/80 text-[10px] sm:text-lg leading-tight sm:leading-relaxed mb-1 sm:mb-3 font-medium"
              fromFontVariationSettings="'wght' 300"
              toFontVariationSettings="'wght' 800"
              containerRef={proximityRef}
              radius={120}
              falloff="linear"
            />
            {isMobile && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px" }}>
                <p style={{
                  margin: 0,
                  fontSize: "11px",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.72)",
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                }}>
                  With a strong background in{" "}
                  <span style={{ color: "rgba(255,255,255,0.95)", fontWeight: 600 }}>art</span>
                  {" "}— something that has been part of my life since childhood — and my education in{" "}
                  <span style={{ color: "rgba(255,255,255,0.95)", fontWeight: 600 }}>New Media Design & Web Development</span>
                  {" "}at BCIT, I've been able to combine creativity with technology.
                </p>
                <p style={{
                  margin: 0,
                  fontSize: "11px",
                  lineHeight: 1.65,
                  color: "rgba(255,255,255,0.72)",
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                }}>
                  I'm passionate about designing{" "}
                  <span style={{ color: "rgba(255,255,255,0.95)", fontWeight: 600 }}>user-friendly, visually engaging</span>
                  {" "}experiences that are not only beautiful, but{" "}
                  <span style={{ fontStyle: "italic" }}>meaningful</span>
                  {" "}— designs that balance aesthetics with functionality to truly connect with users.
                </p>
              </div>
            )}
            {!isMobile && (
              <VariableProximity
                label="With a strong background in art — something that has been part of my life since childhood — and my education in New Media Design and Web Development at BCIT, I've been able to combine creativity with technology."
                className="text-white/70 text-lg leading-relaxed mt-1 sm:mt-3"
                fromFontVariationSettings="'wght' 300"
                toFontVariationSettings="'wght' 800"
                containerRef={proximityRef}
                radius={120}
                falloff="linear"
              />
            )}
            {!isMobile && (
              <VariableProximity
                label="I'm passionate about designing user-friendly, visually engaging experiences that are not only beautiful, but meaningful. I enjoy creating designs that balance aesthetics with functionality to truly connect with users."
                className="text-white/70 text-lg leading-relaxed mt-1 sm:mt-3"
                fromFontVariationSettings="'wght' 300"
                toFontVariationSettings="'wght' 800"
                containerRef={proximityRef}
                radius={120}
                falloff="linear"
              />
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap" style={{ zIndex: 10, marginTop: "32px" }}>
            {[
              { label: "Why Liquid Morphism?", id: "my-story" },
              { label: "Values",               id: "values"   },
              { label: "Hobbies",              id: "hobbies"  },
            ].map(({ label, id }, i) => (
              <BlobButton
                key={id}
                className="pill-btn-hover rounded-full cursor-pointer whitespace-nowrap"
                onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  background:    "rgba(255,255,255,0.12)",
                  backdropFilter: "blur(10px)",
                  border:        "1px solid rgba(255,255,255,0.2)",
                  opacity:       showButtons ? 1 : 0,
                  transform:     showButtons ? "translateY(0)" : "translateY(16px)",
                  transition:    `opacity 0.4s ${i * 0.1}s ease, transform 0.4s ${i * 0.1}s cubic-bezier(0.34, 1.56, 0.64, 1)`,
                  padding:       "11px 26px",
                  borderRadius:  "999px",
                  fontSize:      "0.85rem",
                  fontWeight:    500,
                  color:         "rgba(255,255,255,0.80)",
                }}
              >
                {label}
              </BlobButton>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

/* ─── Section B: My Story (Pebble Flow-style scroll) ─── */
function MyStorySection() {
  const containerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [imageReveal, setImageReveal] = useState(0)

  useEffect(() => {
    function handleScroll() {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const scrollHeight = containerRef.current.offsetHeight - window.innerHeight
      const scrolled = -rect.top
      const p = Math.max(0, Math.min(1, scrolled / scrollHeight))

      /* each section gets 1/3 of the total scroll range */
      const sectionFloat = p * STORY_SECTIONS.length
      const idx = Math.min(STORY_SECTIONS.length - 1, Math.floor(sectionFloat))
      const sectionProgress = sectionFloat - idx /* 0..1 within current section */

      setActiveIndex(idx)
      setImageReveal(sectionProgress)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section ref={containerRef} className="relative" id="my-story" style={{ height: `${STORY_SECTIONS.length * 100}vh` }}>
      <div className="sticky top-0 h-screen flex overflow-hidden">

        {/* Left half: Glassmorphism text panel — always 50% */}
        <div className="w-1/2 h-full flex items-center justify-center relative" style={glassStyle}>
          {STORY_SECTIONS.map((section, i) => {
            const isActive = i === activeIndex
            return (
              <div
                key={i}
                className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-14 pt-16 sm:pt-20 pb-16 transition-all duration-700 ease-out overflow-visible"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isActive
                    ? "translateY(0)"
                    : i < activeIndex
                      ? "translateY(-60px)"
                      : "translateY(60px)",
                  pointerEvents: isActive ? "auto" : "none",
                }}
              >
                <span className="text-white/40 text-[10px] sm:text-xs font-medium tracking-widest uppercase mb-2 sm:mb-4">
                  {`${i + 1}/${STORY_SECTIONS.length}`}
                </span>
                <h2 className="text-white text-lg sm:text-3xl md:text-5xl font-bold mb-2 sm:mb-6 text-balance">{section.title}</h2>
                <div className="w-10 sm:w-16 h-px bg-white/20 mb-2 sm:mb-6" />
                {Array.isArray(section.paragraphs)
                  ? <div className="flex flex-col gap-2 sm:gap-3 max-w-md">
                      {section.paragraphs.map((para, pi) => (
                        <p key={pi} className="text-white/70 text-[10px] sm:text-sm md:text-lg leading-snug sm:leading-relaxed">{para}</p>
                      ))}
                    </div>
                  : <p className="text-white/70 text-[10px] sm:text-sm md:text-lg leading-snug sm:leading-relaxed max-w-md">{section.text}</p>
                }
              </div>
            )
          })}

          {/* Progress dots */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            {STORY_SECTIONS.map((_, i) => (
              <div
                key={i}
                className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-300"
                style={{
                  background: i === activeIndex ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.25)",
                  transform: i === activeIndex ? "scale(1.5)" : "scale(1)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Right half: Full-bleed images — always visible (50%) */}
        <div className="w-1/2 h-full relative overflow-hidden">
          {STORY_SECTIONS.map((section, i) => {
            let translateY = "100%"
            if (i < activeIndex) translateY = "0%"
            else if (i === activeIndex) translateY = "0%"

            const isNext = i === activeIndex + 1
            if (isNext) {
              const reveal = Math.max(0, Math.min(1, (imageReveal - 0.7) / 0.3))
              translateY = `${(1 - reveal) * 100}%`
            }

            /* Keep future images fully invisible until they start sliding in */
            const isBeingRevealed = isNext && imageReveal > 0.65
            const hidden = i > activeIndex && !isBeingRevealed

            return (
              <div
                key={i}
                className="absolute inset-0 transition-transform duration-500 ease-out"
                style={{
                  transform: `translateY(${translateY})`,
                  zIndex: i,
                  visibility: hidden ? "hidden" : "visible",
                }}
              >
                {section.video ? (
                  <video
                    src={section.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={section.image}
                    alt={section.title}
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: section.imagePosition || "center center",
                      transform: section.imageScale ? `scale(${parseInt(section.imageScale) / 100})` : undefined,
                      transformOrigin: section.imagePosition || "center center",
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Section C: Toolkit (infinite scroll with blurred overlay hover) ─── */
function ToolkitSection() {
  const doubled = [...TOOLKIT, ...TOOLKIT]
  const [paused, setPaused] = useState(false)

  return (
    <section className="relative py-8 sm:py-14 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl py-4 sm:py-5 px-3 sm:px-4 overflow-hidden" style={glassStyle}>
          <h2 className="text-white text-lg sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-center">Toolkit</h2>
          <div className="overflow-hidden w-full">
            <div
              className="flex gap-2 sm:gap-4 animate-scroll-left"
              style={{ width: "max-content", animationPlayState: paused ? "paused" : "running" }}
            >
              {doubled.map((tool, i) => (
                <div
                  key={`${tool.name}-${i}`}
                  className="relative group flex-shrink-0"
                  onMouseEnter={() => setPaused(true)}
                  onMouseLeave={() => setPaused(false)}
                >
                  <div
                    className="w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl flex items-center justify-center overflow-hidden relative"
                    style={{
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(12px)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    <img
                      src={tool.image}
                      alt={tool.name}
                      className="w-8 h-8 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
                    />
                    {/* Blurred overlay with name + description on hover */}
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center px-1.5 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"
                      style={{
                        background: "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <p className="text-white font-semibold text-[10px] md:text-xs leading-tight mb-0.5">{tool.name}</p>
                      <p className="text-white/70 text-[7px] md:text-[8px] leading-tight line-clamp-4">{tool.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Section D: Navy Container (Mission / Goals / Values) ─�����─ */
function NavySection() {
  const containerRef = useRef(null)
  const [containerScale, setContainerScale] = useState(0)
  const [missionVisible, setMissionVisible] = useState(false)
  const [goalsVisible, setGoalsVisible] = useState(false)
  const [valuesVisible, setValuesVisible] = useState(false)
  const [goalsTab, setGoalsTab] = useState("Short-term")
  const [valuesTab, setValuesTab] = useState("Creativity")

  useEffect(() => {
    function handleScroll() {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const vh = window.innerHeight
      const scrollHeight = containerRef.current.offsetHeight - vh
      const scrolled = -rect.top
      const p = Math.max(0, Math.min(1, scrolled / scrollHeight))

      const scale = Math.min(1, p / 0.25)
      setContainerScale(scale)

      setMissionVisible(p > 0.3)
      setValuesVisible(p > 0.5)
      setGoalsVisible(p > 0.7)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const containerWidth = 60 + containerScale * 40
  const containerHeight = 50 + containerScale * 50
  const containerRadius = (1 - containerScale) * 32

  return (
    <section ref={containerRef} className="relative min-h-[500vh]" id="values">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Navy container */}
        <div
          className="relative overflow-hidden"
          style={{
            width: `${containerWidth}%`,
            height: `${containerHeight}%`,
            background: "#131734",
            borderRadius: `${containerRadius}px`,
            transition: "border-radius 0.3s ease",
          }}
        >
          {/* "Missions" big hover label — visible when box is small, fades as it grows */}
          <div
            style={{
              position:      "absolute",
              inset:         0,
              display:       "flex",
              alignItems:    "center",
              justifyContent:"center",
              pointerEvents: "none",
              zIndex:        30,
              opacity:       Math.max(0, 1 - containerScale * 2),
              transition:    "opacity 0.4s ease",
            }}
          >
            <span
              style={{
                fontSize:      "clamp(3rem, 8vw, 7rem)",
                fontWeight:    700,
                color:         "white",
                letterSpacing: "-0.02em",
                userSelect:    "none",
              }}
            >
              Missions
            </span>
          </div>
          {/* Lava lamp blobs - large, vibrant, multi-color */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: "380px", height: "380px",
              top: "-5%", right: "5%",
              background: "radial-gradient(circle, rgba(255,60,150,0.9) 0%, rgba(180,40,200,0.7) 40%, rgba(60,180,220,0.5) 70%, transparent 100%)",
              borderRadius: "40% 60% 55% 45% / 55% 40% 60% 45%",
              filter: "blur(30px)",
              animation: "blob-float-1 18s ease-in-out infinite",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: "320px", height: "320px",
              bottom: "0%", left: "5%",
              background: "radial-gradient(circle, rgba(60,220,180,0.85) 0%, rgba(40,120,220,0.7) 40%, rgba(180,40,200,0.5) 70%, transparent 100%)",
              borderRadius: "55% 45% 50% 50% / 45% 55% 45% 55%",
              filter: "blur(28px)",
              animation: "blob-float-3 22s ease-in-out infinite",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: "260px", height: "260px",
              top: "35%", left: "30%",
              background: "radial-gradient(circle, rgba(255,80,180,0.85) 0%, rgba(200,60,255,0.6) 50%, transparent 100%)",
              borderRadius: "50% 40% 60% 50% / 40% 60% 40% 60%",
              filter: "blur(25px)",
              animation: "blob-float-5 20s ease-in-out infinite",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: "300px", height: "300px",
              top: "10%", left: "40%",
              background: "radial-gradient(circle, rgba(40,180,255,0.8) 0%, rgba(60,220,180,0.6) 40%, rgba(180,60,220,0.4) 70%, transparent 100%)",
              borderRadius: "45% 55% 50% 50% / 55% 45% 55% 45%",
              filter: "blur(30px)",
              animation: "blob-float-2 24s ease-in-out infinite",
            }}
          />
          <div
            className="absolute pointer-events-none"
            style={{
              width: "220px", height: "220px",
              bottom: "10%", right: "25%",
              background: "radial-gradient(circle, rgba(255,100,120,0.85) 0%, rgba(255,60,180,0.6) 50%, transparent 100%)",
              borderRadius: "60% 40% 50% 50% / 50% 60% 40% 50%",
              filter: "blur(22px)",
              animation: "blob-float-4 16s ease-in-out infinite",
            }}
          />

          {/* Cards — centered column, equal spacing */}
          <div className="absolute inset-0 z-10">

            {/* Mission — TOP LEFT, slides in from LEFT */}
            <div
              className="absolute rounded-2xl p-3 md:p-6 transition-all duration-1000 ease-out"
              style={{
                ...glassStyle,
                top:     "12%",   /* ← move up/down */
                left:    "15%",    /* ← move left/right */
                width:   "clamp(280px, 50%, 580px)",
                opacity:   missionVisible ? 1 : 0,
                transform: missionVisible ? "translateX(0)" : "translateX(-150vw)",
                zIndex: 20,
              }}
            >
              <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2 md:mb-3">Mission</h3>
              <p className="text-white/70 text-lg leading-relaxed">
                To create digital experiences that balance beauty and clarity, designs that feel intuitive, accessible, and meaningful to the people who use them.
              </p>
            </div>

            {/* Values — CENTER, slides in from RIGHT */}
            <div
              className="absolute rounded-2xl p-3 md:p-6 transition-all duration-1000 ease-out"
              style={{
                ...glassStyle,
                top:   "37%",    /* ← move up/down */
                left:  "50%",    /* ← move left/right */
                transform: valuesVisible ? "translateX(-50%)" : "translateX(150vw)",
                width: "clamp(280px, 50%, 580px)",
                opacity:   valuesVisible ? 1 : 0,
                zIndex: 20,
              }}
            >
              <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2 md:mb-3">Values</h3>
              <div className="flex gap-1 md:gap-2 mb-2 md:mb-4 relative z-30 flex-wrap">
                {Object.keys(VALUES_DATA).map((key) => (
                  <BlobButton
                    key={key}
                    stopProp
                    onClick={() => setValuesTab(key)}
                    className="pill-btn-hover rounded-full font-medium transition-all duration-300 cursor-pointer relative z-30"
                    style={{
                      background: valuesTab === key ? "linear-gradient(135deg, rgba(100,80,255,0.7), rgba(180,60,200,0.7))" : "rgba(255,255,255,0.06)",
                      color: valuesTab === key ? "white" : "rgba(255,255,255,0.5)",
                      border: `1px solid ${valuesTab === key ? "rgba(160,120,255,0.5)" : "rgba(255,255,255,0.1)"}`,
                      padding: "11px 26px",
                      fontSize: "0.85rem",
                      borderRadius: "999px",
                    }}
                  >
                    {key}
                  </BlobButton>
                ))}
              </div>
              <p className="text-white/70 text-lg leading-relaxed transition-opacity duration-300">{VALUES_DATA[valuesTab]}</p>
            </div>

            {/* Goals — BOTTOM RIGHT, slides in from BOTTOM */}
            <div
              className="absolute rounded-2xl p-3 md:p-6 transition-all duration-1000 ease-out"
              style={{
                ...glassStyle,
                top:   "70%",    /* ← move up/down */
                right: "15%",     /* ← move left/right (uses right, not left) */
                width: "clamp(280px, 50%, 580px)",
                opacity:   goalsVisible ? 1 : 0,
                transform: goalsVisible ? "translateY(0)" : "translateY(120vh)",
                zIndex: 20,
              }}
            >
              <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-3 flex-wrap">
                <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-bold">Goals</h3>
                <div className="flex gap-1 md:gap-2 relative z-30 flex-wrap">
                  {Object.keys(GOALS_DATA).map((key) => (
                    <BlobButton
                      key={key}
                      stopProp
                      onClick={() => setGoalsTab(key)}
                      className="pill-btn-hover rounded-full font-medium transition-all duration-300 cursor-pointer relative z-30"
                      style={{
                        background: goalsTab === key ? "linear-gradient(135deg, rgba(100,80,255,0.7), rgba(180,60,200,0.7))" : "rgba(255,255,255,0.06)",
                        color: goalsTab === key ? "white" : "rgba(255,255,255,0.5)",
                        border: `1px solid ${goalsTab === key ? "rgba(160,120,255,0.5)" : "rgba(255,255,255,0.1)"}`,
                        padding: "11px 26px",
                        fontSize: "0.85rem",
                        borderRadius: "999px",
                      }}
                    >
                      {key}
                    </BlobButton>
                  ))}
                </div>
              </div>
              <p className="text-white/70 text-lg leading-relaxed transition-opacity duration-300">{GOALS_DATA[goalsTab]}</p>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Section E: Hobbies ─── */
function HobbiesSection() {
  const [activeHobby, setActiveHobby] = useState(2) // Default: Drawing
  const [lightboxImg, setLightboxImg] = useState(null)
  const [lightboxAlt, setLightboxAlt] = useState("")

  /* Close lightbox on Escape */
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setLightboxImg(null)
    }
    if (lightboxImg) {
      document.addEventListener("keydown", onKey)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [lightboxImg])

  return (
    <section className="relative py-6 sm:py-10 px-4 md:px-8" id="hobbies">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-8 text-center">Hobbies</h2>

        {/* Hobby icons row */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 mb-4 sm:mb-8">
          {HOBBIES.map((hobby, i) => (
            <button
              key={hobby.label}
              onMouseEnter={() => setActiveHobby(i)}
              onClick={() => setActiveHobby(i)}
              className="flex flex-col items-center gap-1 sm:gap-2 cursor-pointer group"
            >
              <div
                className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center transition-all duration-300"
                style={{
                  background: activeHobby === i ? "rgba(160,100,255,0.15)" : "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: `1px solid ${activeHobby === i ? "rgba(160,100,255,0.4)" : "rgba(255,255,255,0.15)"}`,
                  transform: activeHobby === i ? "scale(1.1)" : "scale(1)",
                  boxShadow: activeHobby === i ? "0 0 16px rgba(160,100,255,0.25)" : "none",
                  borderRadius: "1rem",
                }}
              >
                <span className={`transition-colors duration-300 scale-75 sm:scale-100 ${activeHobby === i ? "text-white" : "text-white/50"}`}>
                  {hobby.icon}
                </span>
              </div>
              <span className={`text-[10px] sm:text-xs font-medium transition-colors duration-300 ${activeHobby === i ? "text-white" : "text-white/40"}`}>
                {hobby.label}
              </span>
            </button>
          ))}
        </div>

        {/* Gallery box with horizontal scroll */}
        <div className="rounded-2xl p-2 sm:p-4 md:p-6 h-[150px] sm:h-[200px] md:h-[240px]" style={glassStyle}>
          <div className="overflow-x-auto overflow-y-hidden h-full scrollbar-thin">
            <div className="flex gap-3 h-full" style={{ minWidth: "max-content" }}>
              {HOBBIES[activeHobby].images.map((img, i) => (
                <div
                  key={`${activeHobby}-${i}`}
                  className="h-full aspect-square rounded-xl overflow-hidden transition-all duration-500 flex-shrink-0"
                  style={{
                    ...glassStyle,
                    animationDelay: `${i * 80}ms`,
                    cursor: img ? "zoom-in" : "default",
                  }}
                  onClick={() => {
                    if (img) {
                      setLightboxImg(img)
                      setLightboxAlt(`${HOBBIES[activeHobby].label} ${i + 1}`)
                    }
                  }}
                >
                  {img ? (
                    <img
                      src={img}
                      alt={`${HOBBIES[activeHobby].label} ${i + 1}`}
                      className="w-full h-full object-cover animate-fade-in transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))" }}
                    >
                      <span className="text-white/20 text-xs">Coming soon</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Lightbox overlay ── */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          style={{
            position:        "fixed",
            inset:           0,
            zIndex:          1000,
            display:         "flex",
            alignItems:      "center",
            justifyContent:  "center",
            background:      "rgba(0, 0, 0, 0.82)",
            backdropFilter:  "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            animation:       "fadeIn 0.25s ease",
            cursor:          "default",
          }}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxImg(null)}
            style={{
              position:   "absolute",
              top:        "clamp(12px, 3vh, 28px)",
              right:      "clamp(12px, 3vw, 28px)",
              background: "rgba(255,255,255,0.12)",
              border:     "1px solid rgba(255,255,255,0.2)",
              borderRadius: "50%",
              width:      "44px",
              height:     "44px",
              display:    "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor:     "pointer",
              color:      "white",
              fontSize:   "20px",
              lineHeight: 1,
              backdropFilter: "blur(10px)",
              transition: "background 0.2s",
              zIndex:     1001,
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
          >
            ✕
          </button>

          {/* Image — click doesn't bubble to backdrop */}
          <img
            src={lightboxImg}
            alt={lightboxAlt}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth:     "90vw",
              maxHeight:    "85vh",
              borderRadius: "16px",
              boxShadow:    "0 30px 80px rgba(0,0,0,0.6)",
              objectFit:    "contain",
              animation:    "lightboxPop 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          />
        </div>
      )}
    </section>
  )
}

/* ─── Main About Page ─── */
export function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <SideBlobs />
      <main>
        <AboutHero />
        <MyStorySection />
        <ToolkitSection />
        <NavySection />
        <HobbiesSection />
      </main>
      <Footer />
    </>
  )
}
