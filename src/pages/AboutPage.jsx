import { useRef, useEffect, useState, useCallback } from "react"
import { GlassCard } from "../components/glass-card"
import { Footer } from "../components/footer"
import { BlobTextContainer } from "../components/blob-text-hover"
import { AutoBlobText } from "../components/auto-blob-text"
import { SideBlobs } from "../components/side-blobs"
import { LogoLoop } from "../components/LogoLoop"

/* ─── Data ─── */
const STORY_SECTIONS = [
  {
    title: "My Story",
    text: "Growing up, I was always the kid who couldn't stop drawing. From sketching on napkins to painting murals in my room, art was my first language. That passion eventually led me to discover the world of digital design, where I found the perfect blend of creativity and technology.",
    image: "/images/about-mystory.jpeg",
    imagePosition: "center center",
    imageScale: "100%",
  },
  {
    title: "What Drives Me",
    text: "I believe great design has the power to make people's lives easier and more enjoyable. Every pixel I place, every interaction I craft, is driven by empathy for the end user. I'm motivated by the challenge of solving real problems through thoughtful, human-centered design.",
    image: "/images/about-whatdrivesme.jpeg",
    imagePosition: "center 15%",
    imageScale: "115%",
  },
  {
    title: "Beyond Design",
    text: "When I'm not designing, you'll find me exploring new cities, trying out local cuisines, or getting lost in a good video game. I believe that diverse experiences fuel creativity, and everything I do outside of work inspires the stories I tell through design.",
    image: "/images/about-beyonddesign.jpeg",
    imagePosition: "center 15%",
    imageScale: "110%",
  },
]

const TOOLKIT = [
  { name: "Figma", image: "/images/toolkit-figma.png", desc: "Used for UI/UX design, wireframes, and prototypes" },
  { name: "Maze", image: "/images/toolkit-maze.png", desc: "A UI/UX testing tool that lets you test Figma prototypes with real users. It helps you see usability issues early and improve your design before development" },
  { name: "Illustrator", image: "/images/toolkit-illustrator.png", desc: "Used for creating vector graphics, icons, and illustrations" },
  { name: "InDesign", image: "/images/toolkit-indesign.png", desc: "Used for layout design like magazines, booklets, and PDFs" },
  { name: "After Effects", image: "/images/toolkit-aftereffects.png", desc: "Used for motion graphics and animations" },
  { name: "Canva", image: "/images/toolkit-canva.png", desc: "Used for quick and simple graphic design" },
  { name: "VS Code", image: "/images/toolkit-vscode.png", desc: "Used for writing and editing code" },
  { name: "Dimension", image: "/images/toolkit-dimension.png", desc: "Used for creating simple 3D scenes and mockups" },
  { name: "Tinkercad", image: "/images/toolkit-tinkercad.png", desc: "Used for simple 3D modeling and basic design learning" },
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
    ],
  },
  {
    label: "Travel",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
      </svg>
    ),
    images: [
      "/images/hobby-travel-1.jpeg",
      "/images/hobby-travel-2.jpeg",
      null, null, null,
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
      "/images/hobby-food-5.jpeg",
    ],
  },
]

const glassStyle = {
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
  border: "1px solid rgba(255,255,255,0.15)",
}

/* ─── Section A: Hero ─── */
function AboutHero() {
  return (
    <section className="relative pt-28 pb-16 px-4 md:px-8">
      {/* Always side-by-side: text 3/4, photo 1/4 on mobile; text flex-1, photo fixed on desktop */}
      <div className="max-w-6xl mx-auto flex flex-row items-stretch gap-3 md:gap-8">
        {/* Text box */}
        <div
          className="rounded-2xl p-3 sm:p-6 md:p-8 flex-1 flex flex-col justify-between
                     h-[220px] sm:h-[300px] md:h-[420px]"
          style={glassStyle}
        >
          <div className="flex flex-col h-full justify-between">
            <AutoBlobText
              text="About Me"
              as="h2"
              className="text-white text-base sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-4"
              filterId="goo-about-heading"
            />

            <BlobTextContainer
              className="flex-1 min-h-0 overflow-hidden"
              textItems={[
                {
                  text: "I\u2019m a New Media Design and Web Development student at BCIT with a strong background in art and a focus on UI/UX design. I enjoy creating clean, modern digital experiences that are both visually engaging and easy to use.",
                  as: "p",
                  className: "text-white/70 text-[9px] sm:text-sm leading-snug sm:leading-relaxed mb-1 sm:mb-3",
                  splitBy: "word",
                },
                {
                  text: "I\u2019m especially interested in the intersection of design, technology, and storytelling\u2014where thoughtful visuals meet practical, user-centered solutions.",
                  as: "p",
                  className: "hidden sm:block text-white/70 text-sm leading-relaxed",
                  splitBy: "word",
                },
              ]}
            >
              {/* Nav buttons */}
              <div className="flex items-center gap-1 sm:gap-3 mt-2 sm:mt-6 relative flex-wrap" style={{ zIndex: 10 }}>
                {["My Story", "Values", "Hobbies"].map((label) => (
                  <button
                    key={label}
                    className="pill-btn-hover px-2 sm:px-8 py-1 sm:py-2.5 rounded-full text-[8px] sm:text-sm font-medium text-white/80 cursor-pointer whitespace-nowrap"
                    onClick={() => {
                      const id = label.toLowerCase().replace(" ", "-")
                      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
                    }}
                    style={{
                      background: "rgba(255,255,255,0.12)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </BlobTextContainer>
          </div>
        </div>

        {/* Photo */}
        <div
          className="rounded-2xl overflow-hidden flex-1 md:flex-none md:w-[360px]
                     h-[220px] sm:h-[300px] md:h-[420px] flex-shrink-0"
          style={glassStyle}
        >
          <img src="/images/about-portrait.png" alt="Portrait of Farnaz" className="w-full h-full object-cover" />
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
                className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-14 transition-all duration-700 ease-out"
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
                <p className="text-white/70 text-[10px] sm:text-sm md:text-base leading-snug sm:leading-relaxed max-w-md">{section.text}</p>
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

            return (
              <div
                key={i}
                className="absolute inset-0 transition-transform duration-500 ease-out"
                style={{ transform: `translateY(${translateY})`, zIndex: i }}
              >
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
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Section C: Toolkit — LogoLoop with blob hover tooltip ─── */
function ToolkitSection() {
  return (
    <section className="relative py-8 sm:py-14 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="rounded-2xl py-4 sm:py-5 px-3 sm:px-4 overflow-hidden" style={glassStyle}>
          <h2 className="text-white text-lg sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 text-center">Toolkits</h2>

          {/* LogoLoop — renders each tool as a glass card; blob tooltip pops on hover */}
          <LogoLoop
            logos={TOOLKIT}
            speed={28}
            logoSize={72}
            gap={12}
            fadeOut={true}
            renderItem={(tool, isHovered) => (
              <div
                className="w-full h-full rounded-xl flex items-center justify-center relative overflow-visible"
                style={{
                  background: isHovered
                    ? "rgba(160,100,255,0.25)"
                    : "rgba(255,255,255,0.10)",
                  backdropFilter: "blur(12px)",
                  border: `1px solid ${isHovered ? "rgba(160,100,255,0.5)" : "rgba(255,255,255,0.15)"}`,
                  transition: "background 0.3s ease, border-color 0.3s ease",
                }}
              >
                <img
                  src={tool.image}
                  alt={tool.name}
                  className="w-[56%] h-[56%] object-contain"
                  style={{
                    filter: isHovered ? "brightness(1.2) drop-shadow(0 0 6px rgba(180,100,255,0.6))" : "none",
                    transition: "filter 0.3s ease",
                  }}
                />
              </div>
            )}
          />
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
      setGoalsVisible(p > 0.5)
      setValuesVisible(p > 0.7)
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

          {/* Cards - absolutely positioned at corners */}
          <div className="absolute inset-0 z-10 p-6 md:p-10">

            {/* Goals - TOP LEFT
                Mobile: 58% wide for more text room, pushed slightly lower.
                Desktop stays at 42%.                                          */}
            <div
              className="absolute top-20 left-2 md:top-24 md:left-10 rounded-2xl p-3 md:p-6 w-[58%] md:w-[42%] transition-all duration-1000 ease-out"
              style={{
                ...glassStyle,
                opacity: goalsVisible ? 1 : 0,
                transform: goalsVisible ? "translateY(0)" : "translateY(-80px)",
                zIndex: 20,
              }}
            >
              <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-3 flex-wrap">
                <h3 className="text-white text-sm md:text-xl font-bold">Goals</h3>
                <div className="flex gap-1 md:gap-2 relative z-30 flex-wrap">
                  {Object.keys(GOALS_DATA).map((key) => (
                    <button
                      key={key}
                      onClick={(e) => { e.stopPropagation(); setGoalsTab(key) }}
                      className="pill-btn-hover px-2 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-xs font-medium transition-all duration-300 cursor-pointer relative z-30"
                      style={{
                        background: goalsTab === key ? "linear-gradient(135deg, rgba(100,80,255,0.7), rgba(180,60,200,0.7))" : "rgba(255,255,255,0.06)",
                        color: goalsTab === key ? "white" : "rgba(255,255,255,0.5)",
                        border: `1px solid ${goalsTab === key ? "rgba(160,120,255,0.5)" : "rgba(255,255,255,0.1)"}`,
                      }}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>
              {/* No min-h or line-clamp — let the text show in full */}
              <p className="text-white/70 text-[10px] md:text-sm leading-relaxed transition-opacity duration-300">{GOALS_DATA[goalsTab]}</p>
            </div>

            {/* Mission - BOTTOM RIGHT — taller: no line-clamp, auto height */}
            <div
              className="absolute bottom-2 right-2 md:bottom-10 md:right-10 rounded-2xl p-3 md:p-6 w-[45%] md:w-[42%] transition-all duration-1000 ease-out"
              style={{
                ...glassStyle,
                opacity: missionVisible ? 1 : 0,
                transform: missionVisible ? "translateY(0) translateX(0)" : "translateY(80px) translateX(40px)",
                zIndex: 20,
              }}
            >
              <h3 className="text-white text-sm md:text-xl font-bold mb-2 md:mb-3">Mission</h3>
              <p className="text-white/70 text-[10px] md:text-sm leading-relaxed">
                To create digital experiences that balance beauty and clarity, designs that feel intuitive, accessible, and meaningful to the people who use them.
              </p>
            </div>

            {/* Core Values - BOTTOM LEFT — taller: no line-clamp, auto height */}
            <div
              className="absolute bottom-2 left-2 md:bottom-10 md:left-10 rounded-2xl p-3 md:p-6 w-[45%] md:w-[42%] transition-all duration-1000 ease-out"
              style={{
                ...glassStyle,
                opacity: valuesVisible ? 1 : 0,
                transform: valuesVisible ? "translateX(0)" : "translateX(-80px)",
                zIndex: 20,
              }}
            >
              <h3 className="text-white text-sm md:text-xl font-bold mb-2 md:mb-3">Values</h3>
              <div className="flex gap-1 md:gap-2 mb-2 md:mb-4 relative z-30 flex-wrap">
                {Object.keys(VALUES_DATA).map((key) => (
                  <button
                    key={key}
                    onClick={(e) => { e.stopPropagation(); setValuesTab(key) }}
                    className="pill-btn-hover px-2 py-1 md:px-4 md:py-1.5 rounded-full text-[9px] md:text-xs font-medium transition-all duration-300 cursor-pointer relative z-30"
                    style={{
                      background: valuesTab === key ? "linear-gradient(135deg, rgba(100,80,255,0.7), rgba(180,60,200,0.7))" : "rgba(255,255,255,0.06)",
                      color: valuesTab === key ? "white" : "rgba(255,255,255,0.5)",
                      border: `1px solid ${valuesTab === key ? "rgba(160,120,255,0.5)" : "rgba(255,255,255,0.1)"}`,
                    }}
                  >
                    {key}
                  </button>
                ))}
              </div>
              <p className="text-white/70 text-[10px] md:text-sm leading-relaxed transition-opacity duration-300">{VALUES_DATA[valuesTab]}</p>
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

  return (
    <section className="relative py-10 sm:py-20 px-4 md:px-8" id="hobbies">
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
                  }}
                >
                  {img ? (
                    <img
                      src={img}
                      alt={`${HOBBIES[activeHobby].label} ${i + 1}`}
                      className="w-full h-full object-cover animate-fade-in"
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
