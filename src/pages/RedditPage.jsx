/**
 * Reddit App Redesign — Project Case Study Page
 * Hero: left info panel (30%) + right full-height showcase image (70%), no boxes
 */
import { useState, useRef, useEffect } from "react"
import { useRouter } from "../lib/router-context"
import { SideBlobs } from "../components/side-blobs"
import { Footer }    from "../components/footer"

const TOOLS = [
  { name: "Illustrator", icon: "/images/toolkit-illustrator.png" },
  { name: "Figma",       icon: "/images/toolkit-figma.png" },
  { name: "Maze",        icon: "/images/toolkit-maze.png" },
  { name: "Photoshop",   icon: "/images/toolkit-photoshop.png" },
]

/* ─── Tool icon — square, icon only (no label), matches About page style ─── */
function ToolIcon({ name, icon, animDelay = "0s" }) {
  return (
    <div
      title={name}
      style={{
        animation: `rdPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${animDelay} both`,
        width:                "54px",
        height:               "54px",
        borderRadius:         "14px",
        background:           "rgba(255,255,255,0.10)",
        backdropFilter:       "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border:               "1px solid rgba(255,255,255,0.15)",
        display:              "flex",
        alignItems:           "center",
        justifyContent:       "center",
        flexShrink:           0,
        transition:           "background 0.2s ease, border-color 0.2s ease",
        cursor:               "default",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background   = "rgba(255,255,255,0.18)"
        e.currentTarget.style.borderColor  = "rgba(255,255,255,0.28)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background   = "rgba(255,255,255,0.10)"
        e.currentTarget.style.borderColor  = "rgba(255,255,255,0.15)"
      }}
    >
      <img src={icon} alt={name} style={{ width: 32, height: 32, objectFit: "contain" }} />
    </div>
  )
}

/* ─── Glass section card (content below hero) ───────────────────────────────── */
function Section({ children, style = {} }) {
  return (
    <div style={{
      width:                "clamp(320px, 80vw, 1100px)",
      margin:               "0 auto 40px",
      padding:              "clamp(28px, 4vw, 56px) clamp(28px, 5vw, 72px)",
      borderRadius:         "24px",
      background:           "rgba(255,255,255,0.05)",
      backdropFilter:       "blur(36px)",
      WebkitBackdropFilter: "blur(18px)",
      border:               "1px solid rgba(255,255,255,0.10)",
      ...style,
    }}>
      {children}
    </div>
  )
}

function SectionHeading({ children }) {
  return (
    <h2 style={{
      margin:        "0 0 20px",
      color:         "#fff",
      fontSize:      "clamp(1.1rem, 1.8vw, 1.4rem)",
      fontWeight:    700,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      opacity:       0.55,
    }}>
      {children}
    </h2>
  )
}

/* ─── Stepper data ───────────────────────────────────────────────────────────── */
const STEPS = [
  {
    number: 1,
    title: "Project Overview",
    visual: "/images/Phone2_feature.png",
    content: [
      { type: "para", text: 'Reddit is one of the largest online discussion platforms, known as "the front page of the internet." The platform hosts thousands of communities where users share posts, ask questions, and interact through voting and comments. While Reddit\'s community-driven content is powerful, the mobile interface often struggles with usability issues such as cluttered layouts, weak user profiles, and poor content discovery.' },
      { type: "para", text: "This project focuses on redesigning the Reddit mobile experience to make it cleaner, more engaging, and easier to navigate while preserving its strong community identity." },
      { type: "meta", items: [
        "Project Type: UX/UI Redesign Concept",
        "Role: UX Researcher & UI Designer",
        "Tools: Figma, Canva",
        "Platform: Mobile App",
      ]},
      { type: "heading", text: "The goal of the redesign was to improve three key areas:" },
      { type: "bullets", items: [
        "Clarity – make content easier to read and understand",
        "Discovery – help users find answers and communities faster",
        "Personalization – allow users to express identity through their profiles",
      ]},
    ],
  },
  {
    number: 2,
    title: "User Research",
    visual: "/images/Phone2_feature.png",
    content: [
      { type: "para", text: "To understand the current experience, I analyzed Reddit's interface and identified major usability issues. The evaluation focused on how users browse posts, discover communities, and interact with content." },
      { type: "heading", text: "Key Pain Points" },
      { type: "bullets", items: [
        "Cluttered Content Layout — Posts, links, and advertisements often appear visually similar, making it difficult for users to quickly scan content.",
        "Weak User Profiles — Profiles lack personality and customization options, limiting how users represent themselves.",
        "Poor Content Discovery — Users must rely heavily on search to find relevant discussions, which slows down exploration.",
        "Limited Content Creation Guidance — The posting interface does not clearly guide users through different types of content.",
        "Low Chat Engagement — The chat page offers minimal personalization and lacks relevant community recommendations.",
      ]},
      { type: "heading", text: "User Persona — Jordan Lee" },
      { type: "meta", items: [
        "Age: 23 · Location: Vancouver, Canada",
        "Occupation: University Student",
        "Jordan uses Reddit daily to stay updated on gaming news and tech discussions.",
      ]},
      { type: "heading", text: "Goals" },
      { type: "bullets", items: [
        "Stay informed about trending discussions",
        "Ask questions and find answers quickly",
        "Discover new communities",
        "Personalize their online profile",
      ]},
      { type: "heading", text: "Frustrations" },
      { type: "bullets", items: [
        "Cluttered layout makes posts hard to read",
        "Profiles feel empty compared to other platforms",
        "Searching for answers takes too long",
        "Ads blend with real posts",
      ]},
      { type: "para", text: "This research helped guide the design process toward clarity, engagement, and personalization." },
    ],
  },
  {
    number: 3,
    title: "User Interface",
    visual: "/images/Phone2_feature.png",
    content: [
      { type: "para", text: "The redesign focused on improving several key screens of the Reddit mobile app." },
      { type: "heading", text: "Home Page" },
      { type: "meta", items: ["Problem: The original home page felt cluttered and visually inconsistent. Posts and advertisements blended together, making it difficult for users to focus."] },
      { type: "meta", items: ["Solution: A card-based layout was introduced to clearly separate posts and improve readability. Additional spacing and hierarchy help users quickly scan the feed."] },
      { type: "heading", text: "Answers Page" },
      { type: "meta", items: ["Problem: The answers page relied mainly on a search bar and filters, making the page feel empty and difficult to explore."] },
      { type: "heading", text: "New discovery sections introduced:" },
      { type: "bullets", items: ["Trending Questions", "FAQ", "Explore", "Top Answers"] },
      { type: "heading", text: "Create Post Page" },
      { type: "meta", items: ["Problem: The posting experience lacked guidance and structure."] },
      { type: "heading", text: "Quick post-type options added:" },
      { type: "bullets", items: ["Image", "Video", "Link", "Text"] },
      { type: "para", text: "An \u201cAsk Me Anything\u201d input highlights trending hashtags and topics to inspire user participation." },
      { type: "heading", text: "Chat Page" },
      { type: "meta", items: ["Problem: The chat page lacked visual hierarchy and personalization."] },
      { type: "heading", text: "Redesigned chat section includes:" },
      { type: "bullets", items: ["Discover Channels", "Recommended Communities", "Explore Channels button"] },
      { type: "heading", text: "Account Page" },
      { type: "meta", items: ["Problem: The original profile appeared incomplete and lacked engagement features."] },
      { type: "heading", text: "Redesigned profile includes:" },
      { type: "bullets", items: ["Bio section", "Karma and Reddit age", "Achievements and badges", "Community creation options", "Premium upgrade call-to-action"] },
    ],
  },
  {
    number: 4,
    title: "Brand Identity",
    visual: "/images/Phone2_feature.png",
    content: [
      { type: "para", text: "The redesign maintains Reddit's recognizable identity while modernizing its visual experience." },
      { type: "heading", text: "Color Palette" },
      { type: "para", text: "The interface continues to use Reddit's signature orange color, helping maintain brand recognition while adding warmer tones and improved visual hierarchy." },
      { type: "heading", text: "Visual Style" },
      { type: "heading", text: "The design introduces:" },
      { type: "bullets", items: ["Playful illustrations", "Rounded cards", "Consistent icons", "Warm color accents"] },
      { type: "para", text: "These elements align with Reddit's friendly and community-driven personality." },
      { type: "heading", text: "Design Direction" },
      { type: "heading", text: "The visual approach focuses on creating a platform that feels:" },
      { type: "bullets", items: ["Approachable", "Modern", "Interactive", "Community-oriented"] },
    ],
  },
  {
    number: 5,
    title: "User Experience",
    visual: "/images/Phone2_feature.png",
    content: [
      { type: "para", text: "The redesigned experience focuses on improving the overall journey from discovery to engagement." },
      { type: "heading", text: "User Journey" },
      { type: "bullets", items: [
        "Discover — User opens Reddit to see trending discussions.",
        "Browse — Card-based layouts help users quickly identify posts and content types.",
        "Seek Answers — Users visit the Answers page to explore trending questions.",
        "Personalize — Users update their profile and view achievements.",
        "Engage — Users join communities and participate in chat channels.",
      ]},
      { type: "heading", text: "UX Improvements" },
      { type: "bullets", items: [
        "Clear content hierarchy",
        "Faster discovery of discussions",
        "Personalized user profiles",
        "Better community recommendations",
        "Simplified content creation",
      ]},
      { type: "para", text: "These improvements make the platform feel more intuitive and engaging for both new and experienced users." },
    ],
  },
  {
    number: 6,
    title: "Outcome",
    visual: "/images/Phone2_feature.png",
    content: [
      { type: "para", text: "The redesigned concept transforms Reddit's mobile interface into a cleaner and more user-centered experience." },
      { type: "heading", text: "Key Improvements" },
      { type: "bullets", items: [
        "Improved Readability — Card-based layouts clearly separate posts, links, and advertisements.",
        "Better Content Discovery — Story-like sections encourage users to explore trending discussions and questions.",
        "Stronger Personalization — Profiles now include bios, achievements, and clearer identity features.",
        "Enhanced Community Engagement — Chat recommendations help users discover relevant communities.",
      ]},
    ],
  },
]

/* ─── Rich text renderer for step content ────────────────────────────────────── */
function StepContent({ blocks }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {blocks.map((block, i) => {
        if (block.type === "para") return (
          <p key={i} style={{ margin: 0, color: "rgba(255,255,255,0.80)", fontSize: "clamp(0.87rem, 1.15vw, 0.97rem)", lineHeight: 1.75 }}>
            {block.text}
          </p>
        )
        if (block.type === "heading") return (
          <p key={i} style={{ margin: 0, color: "rgba(249,115,22,0.95)", fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", marginTop: "4px" }}>
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
                <span style={{ color: "rgba(249,115,22,0.9)", fontSize: "0.75rem", marginTop: "4px", flexShrink: 0 }}>◆</span>
                <span style={{ color: "rgba(255,255,255,0.78)", fontSize: "clamp(0.85rem, 1.1vw, 0.93rem)", lineHeight: 1.65 }}>{item}</span>
              </div>
            ))}
          </div>
        )
        return null
      })}
    </div>
  )
}

/* ─── Step 2 — User Research slides (original designs + problems) ────────────── */
const UR_SLIDES = [
  { image: "/images/HomeOG.png",    label: "Home Page",        content: "The home page felt cluttered and visually inconsistent, making it difficult to read and navigate. The left-side navigation bar created an awkward empty space on the right, while posts and advertisements blended together, reducing focus and readability. The overall layout lacked hierarchy and engagement, causing users to feel overwhelmed." },
  { image: "/images/AnswerOG.png",  label: "Answers Page",     content: "The Reddit Answers page lacked engagement and visual hierarchy. It only provided a search bar and basic filters, making the interface feel empty and uninviting. The layout relied heavily on plain text and minimal color, which made it harder for users to explore or discover trending topics. The overall experience felt static and not community-driven." },
  { image: "/images/CreateOG.png",  label: "Create Post Page", content: "The posting experience was limited and lacked clear guidance. There were no options to distinguish between different post types, making it confusing for users who wanted to share specific formats like images, videos, links, or text. The plain layout felt empty and uninspiring, offering little visual hierarchy or motivation to create content." },
  { image: "/images/ChatOG.png",    label: "Chat Page",        content: "The original Chat page only displayed the \u201cDiscover Channels\u201d section with minimal visuals and limited interaction. It lacked personalization and felt static, making it difficult for users to discover relevant chat rooms or communities that matched their interests." },
  { image: "/images/ProfileOG.png", label: "Profile Page",     content: "The original profile page felt incomplete and lacked a clear structure. It appeared more like an overlay rather than a full page, offering limited personalization and visual engagement. Users had little motivation to explore achievements or upgrade to Premium, as most sections blended together with minimal hierarchy or interaction." },
]

/* ─── Step 3 — User Interface slides (new designs + improvements) ────────────── */
const UI_SLIDES = [
  { image: "/images/HomeNew.png",    label: "Home Page",        content: "The redesigned home page introduces a clean, card-based layout that improves readability and organization. Posts are visually separated with clear spacing, allowing users to browse more comfortably. The footer is now more engaging and colorful, harmonizing with Reddit\u2019s signature orange palette. The centered navigation bar creates better visual balance, and the simplified structure offers a lighter, more modern, and user-friendly experience." },
  { image: "/images/AnswerNew.png",  label: "Answers Page",     content: "The redesigned Answers page introduces a more structured and visually engaging layout. It features colorful icons, categorized sections (Trending Qs, FAQ, Explore, Top Answers), and community-based topics to make navigation easier and more fun. The interface now feels lively, user-focused, and aligned with Reddit\u2019s vibrant color palette, encouraging users to explore and participate." },
  { image: "/images/CreateNew.png",  label: "Create Post Page", content: "The redesigned Create section introduces clear post type buttons (Image, Video, Link, Text) for quick selection and ease of use. An \u201cAsk Me Anything\u201d input bar highlights trending topics and hashtags to inspire engagement. The new Preview button provides better clarity before publishing, while the overall layout feels organized, colorful, and aligned with Reddit\u2019s branding, making content creation more intuitive and enjoyable." },
  { image: "/images/ChatNew.png",    label: "Chat Page",        content: "The redesigned Chat page keeps the \u201cDiscover Channels\u201d feature but enhances it with a more vibrant and visually structured layout. A new \u201cExplore Channels\u201d call-to-action encourages user interaction, while the \u201cRecommended for You\u201d section suggests communities based on user interests and activity. Clear hierarchy, warm colors, and friendly illustrations create a more engaging and welcoming chat experience." },
  { image: "/images/ProfileNew.png", label: "Profile Page",     content: "The redesigned profile is now a fully structured page with an organized and modern layout. Key stats like Karma and Reddit Age are placed near the profile picture for quick visibility, while a bio section adds personality and context. A bold Premium banner encourages engagement, and the main actions \u2014 Achievements & Badges, My Posts, Start a Community, and Rewards \u2014 are clearly grouped with consistent icons and color cues. The overall design feels warmer, more personal, and aligned with Reddit\u2019s playful identity." },
]

/* ─── Generic reusable slide carousel (used for step 2 & 3) ──────────────────── */
function StepCarousel({ slides, contentLabel }) {
  const [idx, setIdx]         = useState(0)
  const [animKey, setAnimKey] = useState(0)

  const total  = slides.length
  const slide  = slides[idx]
  const orange = "rgba(249,115,22,1)"

  /* label colour: orange = Problem, teal = Improvement, purple = UX Insight */
  const labelColor = contentLabel === "Improvement"
    ? "rgba(52,211,153,1)"
    : contentLabel === "UX Insight"
      ? "rgba(167,139,250,1)"
      : orange
  const labelBg    = contentLabel === "Improvement"
    ? "rgba(52,211,153,0.14)"
    : contentLabel === "UX Insight"
      ? "rgba(167,139,250,0.14)"
      : "rgba(249,115,22,0.15)"
  const labelBorder = contentLabel === "Improvement"
    ? "rgba(52,211,153,0.35)"
    : contentLabel === "UX Insight"
      ? "rgba(167,139,250,0.35)"
      : "rgba(249,115,22,0.35)"

  const go = (next) => { setIdx((next + total) % total); setAnimKey(k => k + 1) }

  /* Internal arrow button */
  const ArrowBtn = ({ dir }) => {
    const [hov, setHov] = useState(false)
    return (
      <button
        onClick={() => go(dir === "prev" ? idx - 1 : idx + 1)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "absolute",
          [dir === "prev" ? "left" : "right"]: "12px",
          top: "50%", transform: "translateY(-50%)",
          width: "36px", height: "36px", borderRadius: "50%",
          background: hov ? "rgba(249,115,22,0.28)" : "rgba(255,255,255,0.10)",
          border: `1.5px solid ${hov ? "rgba(249,115,22,0.6)" : "rgba(255,255,255,0.20)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", zIndex: 2, transition: "all 0.25s ease", flexShrink: 0,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          {dir === "prev"
            ? <path d="M7.5 2L4 6l3.5 4" stroke={hov ? orange : "rgba(255,255,255,0.7)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            : <path d="M4.5 2L8 6l-3.5 4" stroke={hov ? orange : "rgba(255,255,255,0.7)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          }
        </svg>
      </button>
    )
  }

  return (
    <div style={{
      position: "sticky", top: "120px",
      borderRadius: "24px",
      background: "rgba(255,255,255,0.08)",
      backdropFilter: "blur(22px)", WebkitBackdropFilter: "blur(22px)",
      border: "1px solid rgba(255,255,255,0.14)",
      boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
      overflow: "hidden",
      height: `${STEP_BOX_H}px`, minHeight: `${STEP_BOX_H}px`,
    }}>
      <style>{`@keyframes scFadeSlide{from{opacity:0;transform:translateX(18px)}to{opacity:1;transform:translateX(0)}}`}</style>

      <ArrowBtn dir="prev" />
      <ArrowBtn dir="next" />

      {/* Slide */}
      <div key={animKey} style={{
        display: "flex", alignItems: "center",
        height: "100%", padding: "24px 60px", gap: "24px",
        animation: "scFadeSlide 0.32s ease",
      }}>
        {/* Phone image */}
        <div style={{ flex: "0 0 44%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={slide.image} alt={slide.label} style={{
            maxWidth: "100%", maxHeight: "400px", objectFit: "contain", display: "block",
            filter: "drop-shadow(0 8px 28px rgba(0,0,0,0.50))",
          }} />
        </div>

        {/* Text panel */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px", overflow: "hidden" }}>
          {/* Page badge */}
          <div style={{
            display: "inline-flex", alignSelf: "flex-start",
            padding: "4px 14px", borderRadius: "999px",
            background: "rgba(249,115,22,0.15)",
            border: "1px solid rgba(249,115,22,0.35)",
            color: orange, fontSize: "0.70rem", fontWeight: 700,
            letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            {slide.label}
          </div>

          {/* Content label (Problem / Improvement) */}
          <div style={{
            color: labelColor, fontSize: "0.72rem", fontWeight: 700,
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            {contentLabel}
          </div>

          {/* Content body */}
          <p style={{
            margin: 0, color: "rgba(255,255,255,0.82)",
            fontSize: "clamp(0.82rem, 1.1vw, 0.93rem)", lineHeight: 1.75,
            overflowY: "auto", maxHeight: "280px",
            scrollbarWidth: "thin", scrollbarColor: `${labelColor} transparent`,
          }}>
            {slide.content}
          </p>

          {/* Dot indicators */}
          <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "auto" }}>
            {slides.map((_, i) => (
              <button key={i} onClick={() => go(i)} style={{
                width: i === idx ? "22px" : "6px", height: "6px",
                borderRadius: "3px",
                background: i === idx ? orange : "rgba(255,255,255,0.28)",
                border: "none", padding: 0, cursor: "pointer",
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Step 5 — User Experience slides (UX artifacts) ────────────────────────── */
const UX_SLIDES = [
  { image: "/images/Persona.png",       label: "Persona",       content: "Jordan Lee, a 23-year-old university student from Vancouver, represents Reddit\u2019s core mobile user. Jordan uses Reddit daily to follow gaming news, tech discussions, and niche communities. Key goals include staying informed on trending topics, asking questions quickly, and discovering new communities. Main frustrations include the cluttered layout, empty profiles, slow answer discovery, and ads that blend with real posts." },
  { image: "/images/Userscenario.png",  label: "User Scenario", content: "Jordan opens Reddit on a lunch break, looking for recommendations on a new laptop. The current interface makes it hard to find the right community quickly \u2014 search results are scattered and the Answers page offers no guided discovery. The redesigned experience gives Jordan a clear path: an Answers page with trending questions, categorized topics, and community suggestions that surface the right content without excessive searching." },
  { image: "/images/Empathymap.png",    label: "Empathy Map",   content: "Jordan thinks: \u201cWhy is everything so cluttered?\u201d and \u201cI can\u2019t tell ads from real posts.\u201d Jordan feels frustrated by the lack of personalization and overwhelmed by information density. Jordan sees a mix of posts, ads, and links with inconsistent visual hierarchy. Jordan says: \u201cI just want to find answers fast\u201d and \u201cMy profile looks empty compared to other apps.\u201d Jordan does: switches between subreddits manually and relies heavily on search." },
  { image: "/images/Journeymap.png",    label: "Journey Map",   content: "Jordan\u2019s journey moves through five stages: Discover \u2192 Browse \u2192 Seek Answers \u2192 Personalize \u2192 Engage. Pain points peak during Browse (cluttered feed) and Seek Answers (no guided discovery). The redesign targets both stages \u2014 card layouts reduce browse friction while the revamped Answers page with trending Qs and community topics dramatically shortens the path from question to answer." },
]

/* Thin wrappers so StepVisual stays clean */
function UserResearchCarousel()   { return <StepCarousel slides={UR_SLIDES} contentLabel="Problem"     /> }
function UserInterfaceCarousel()  { return <StepCarousel slides={UI_SLIDES} contentLabel="Improvement" /> }
function UserExperienceCarousel() { return <StepCarousel slides={UX_SLIDES} contentLabel="UX Insight"  /> }

/* ─── Step 6 — Outcome before/after carousel ────────────────────────────────── */
const OUTCOME_SLIDES = [
  { label: "Home Page",    before: "/images/HomeOG.png",    after: "/images/HomeNew.png"    },
  { label: "Answer Page",  before: "/images/AnswerOG.png",  after: "/images/AnswerNew.png"  },
  { label: "Create Page",  before: "/images/CreateOG.png",  after: "/images/CreateNew.png"  },
  { label: "Chat Page",    before: "/images/ChatOG.png",    after: "/images/ChatNew.png"    },
  { label: "Profile Page", before: "/images/ProfileOG.png", after: "/images/ProfileNew.png" },
]

function OutcomeCarousel() {
  const [idx, setIdx]         = useState(0)
  const [animKey, setAnimKey] = useState(0)
  const total  = OUTCOME_SLIDES.length
  const slide  = OUTCOME_SLIDES[idx]
  const orange = "rgba(249,115,22,1)"

  const go = (next) => { setIdx((next + total) % total); setAnimKey(k => k + 1) }

  /* Arrow button */
  const ArrowBtn = ({ dir }) => {
    const [hov, setHov] = useState(false)
    return (
      <button
        onClick={() => go(dir === "prev" ? idx - 1 : idx + 1)}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position:   "absolute",
          [dir === "prev" ? "left" : "right"]: "10px",
          top: "50%", transform: "translateY(-50%)",
          width: "34px", height: "34px", borderRadius: "50%",
          background: hov ? "rgba(249,115,22,0.28)" : "rgba(255,255,255,0.10)",
          border: `1.5px solid ${hov ? "rgba(249,115,22,0.6)" : "rgba(255,255,255,0.20)"}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", zIndex: 2, transition: "all 0.25s ease", flexShrink: 0,
        }}
      >
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          {dir === "prev"
            ? <path d="M7 2L3.5 5.5 7 9" stroke={hov ? orange : "rgba(255,255,255,0.7)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            : <path d="M4 2l3.5 3.5L4 9"  stroke={hov ? orange : "rgba(255,255,255,0.7)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          }
        </svg>
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
      height:               `${STEP_BOX_H}px`,
      minHeight:            `${STEP_BOX_H}px`,
      display:              "flex",
      flexDirection:        "column",
    }}>
      <style>{`@keyframes ocFadeSlide{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}`}</style>

      <ArrowBtn dir="prev" />
      <ArrowBtn dir="next" />

      {/* Page title */}
      <div style={{
        padding:       "14px 56px 10px",
        textAlign:     "center",
        flexShrink:    0,
        borderBottom:  "1px solid rgba(255,255,255,0.08)",
      }}>
        <span style={{
          color:         orange,
          fontSize:      "0.85rem",
          fontWeight:    700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}>
          {slide.label}
        </span>
      </div>

      {/* Before / After columns */}
      <div
        key={animKey}
        style={{
          flex:       1,
          display:    "flex",
          overflow:   "hidden",
          animation:  "ocFadeSlide 0.32s ease",
        }}
      >
        {/* Before */}
        <div style={{
          flex:           1,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          borderRight:    "1px solid rgba(255,255,255,0.08)",
          padding:        "10px 8px 14px",
          gap:            "8px",
        }}>
          <span style={{
            color:         "rgba(255,255,255,0.45)",
            fontSize:      "0.68rem",
            fontWeight:    600,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            flexShrink:    0,
          }}>Before</span>
          <img
            src={slide.before}
            alt={`${slide.label} before`}
            style={{
              flex:       1,
              minHeight:  0,
              maxWidth:   "100%",
              objectFit:  "contain",
              display:    "block",
              filter:     "drop-shadow(0 6px 20px rgba(0,0,0,0.55))",
            }}
          />
        </div>

        {/* After */}
        <div style={{
          flex:           1,
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          padding:        "10px 8px 14px",
          gap:            "8px",
        }}>
          <span style={{
            color:         orange,
            fontSize:      "0.68rem",
            fontWeight:    600,
            letterSpacing: "0.10em",
            textTransform: "uppercase",
            flexShrink:    0,
          }}>After</span>
          <img
            src={slide.after}
            alt={`${slide.label} after`}
            style={{
              flex:       1,
              minHeight:  0,
              maxWidth:   "100%",
              objectFit:  "contain",
              display:    "block",
              filter:     "drop-shadow(0 6px 20px rgba(0,0,0,0.55))",
            }}
          />
        </div>
      </div>

      {/* Dot indicators */}
      <div style={{
        display:        "flex",
        justifyContent: "center",
        gap:            "6px",
        padding:        "8px 0 10px",
        flexShrink:     0,
      }}>
        {OUTCOME_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            style={{
              width:      i === idx ? "22px" : "6px",
              height:     "6px",
              borderRadius: "3px",
              background: i === idx ? orange : "rgba(255,255,255,0.28)",
              border:     "none",
              padding:    0,
              cursor:     "pointer",
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── Brand Identity zoom viewer ─────────────────────────────────────────────── */
function ZoomControlBtn({ onClick, disabled, children }) {
  const [hov, setHov] = useState(false)
  const orange = "rgba(249,115,22,1)"
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width:      "26px",
        height:     "26px",
        borderRadius: "50%",
        background:  disabled ? "rgba(255,255,255,0.04)" : hov ? "rgba(249,115,22,0.25)" : "rgba(255,255,255,0.10)",
        border:      `1px solid ${disabled ? "rgba(255,255,255,0.07)" : hov ? "rgba(249,115,22,0.55)" : "rgba(255,255,255,0.18)"}`,
        display:     "flex",
        alignItems:  "center",
        justifyContent: "center",
        cursor:      disabled ? "default" : "pointer",
        opacity:     disabled ? 0.35 : 1,
        transition:  "all 0.22s ease",
        flexShrink:  0,
        color:       hov && !disabled ? orange : "rgba(255,255,255,0.80)",
        fontSize:    "0.9rem",
        lineHeight:  1,
      }}
    >
      {children}
    </button>
  )
}

function BrandIdentityViewer() {
  const [zoom, setZoom]         = useState(1)
  const [pan, setPan]           = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [nat, setNat]           = useState({ w: 0, h: 0 })   /* natural image px */
  const [ctn, setCtn]           = useState({ w: 0, h: 0 })   /* container px     */
  const containerRef            = useRef(null)
  const dragStart               = useRef(null)
  const MIN_Z = 1, MAX_Z = 4, STEP_Z = 0.5

  /* Preload image to get natural dimensions before rendering */
  useEffect(() => {
    const img = new Image()
    img.onload = () => setNat({ w: img.naturalWidth, h: img.naturalHeight })
    img.src = "/images/BrandIdentity.png"
  }, [])

  /* Measure inner container */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const m = () => setCtn({ w: el.clientWidth, h: el.clientHeight })
    m()
    const ro = new ResizeObserver(m)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  /* "Contain" scale — fits whole image at zoom 1 without cropping */
  const fitScale = (nat.w && nat.h && ctn.w && ctn.h)
    ? Math.min(ctn.w / nat.w, ctn.h / nat.h)
    : 0

  /* Displayed image dimensions (natural aspect ratio × fitScale × zoom) */
  const iw = nat.w * fitScale * zoom
  const ih = nat.h * fitScale * zoom

  /* Top-left position so the image stays centred + pan offset */
  const imgLeft = (ctn.w - iw) / 2 + pan.x
  const imgTop  = (ctn.h - ih) / 2 + pan.y

  /* Helpers */
  const maxPan = () => ({
    x: Math.max(0, iw - ctn.w) / 2,
    y: Math.max(0, ih - ctn.h) / 2,
  })
  const clampPan = (px, py) => {
    const m = maxPan()
    return { x: Math.max(-m.x, Math.min(m.x, px)), y: Math.max(-m.y, Math.min(m.y, py)) }
  }

  const zoomIn  = () => setZoom(z => Math.min(+(z + STEP_Z).toFixed(1), MAX_Z))
  const zoomOut = () => setZoom(z => Math.max(+(z - STEP_Z).toFixed(1), MIN_Z))
  const reset   = () => { setZoom(1); setPan({ x: 0, y: 0 }) }

  /* Re-clamp pan whenever zoom changes */
  useEffect(() => {
    if (!fitScale) return
    const newIw = nat.w * fitScale * zoom
    const newIh = nat.h * fitScale * zoom
    const mx = Math.max(0, newIw - ctn.w) / 2
    const my = Math.max(0, newIh - ctn.h) / 2
    setPan(p => ({ x: Math.max(-mx, Math.min(mx, p.x)), y: Math.max(-my, Math.min(my, p.y)) }))
  }, [zoom])   // eslint-disable-line

  /* Drag handlers */
  const onMouseDown = (e) => {
    if (zoom <= 1) return
    e.preventDefault()
    setDragging(true)
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y }
  }

  const onMouseMove = (e) => {
    if (!dragging || !dragStart.current) return
    setPan(clampPan(e.clientX - dragStart.current.x, e.clientY - dragStart.current.y))
  }

  const stopDrag = () => { setDragging(false); dragStart.current = null }

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
      height:               `${STEP_BOX_H}px`,
      minHeight:            `${STEP_BOX_H}px`,
    }}>

      {/* Drag-to-pan viewport */}
      <div
        ref={containerRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        style={{
          width:      "100%",
          height:     "100%",
          position:   "relative",
          overflow:   "hidden",
          cursor:     zoom > 1 ? (dragging ? "grabbing" : "grab") : "zoom-in",
          userSelect: "none",
        }}
      >
        {fitScale > 0 && (
          <img
            src="/images/BrandIdentity.png"
            alt="Brand Identity"
            draggable={false}
            style={{
              position:      "absolute",
              left:          `${imgLeft}px`,
              top:           `${imgTop}px`,
              width:         `${iw}px`,
              height:        `${ih}px`,
              display:       "block",
              userSelect:    "none",
              pointerEvents: "none",
              /* No objectFit — explicit natural-aspect-ratio dimensions, zero stretching */
              transition:    dragging
                ? "none"
                : "left 0.22s ease, top 0.22s ease, width 0.28s ease, height 0.28s ease",
            }}
          />
        )}
      </div>

      {/* Zoom control pill — bottom right */}
      <div style={{
        position:       "absolute",
        bottom:         "14px",
        right:          "14px",
        display:        "flex",
        alignItems:     "center",
        gap:            "6px",
        background:     "rgba(0,0,0,0.50)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderRadius:   "999px",
        padding:        "5px 10px",
        border:         "1px solid rgba(255,255,255,0.12)",
        zIndex:         3,
      }}>
        {/* – */}
        <ZoomControlBtn onClick={zoomOut} disabled={zoom <= MIN_Z}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </ZoomControlBtn>

        {/* Zoom % label */}
        <span style={{
          color:      "rgba(255,255,255,0.82)",
          fontSize:   "0.70rem",
          fontWeight: 600,
          minWidth:   "34px",
          textAlign:  "center",
          letterSpacing: "0.02em",
        }}>
          {Math.round(zoom * 100)}%
        </span>

        {/* + */}
        <ZoomControlBtn onClick={zoomIn} disabled={zoom >= MAX_Z}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M5 2v6M2 5h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </ZoomControlBtn>

        {/* Reset (only shown when zoomed) */}
        {zoom !== 1 && (
          <ZoomControlBtn onClick={reset} disabled={false}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M8.5 5A3.5 3.5 0 1 1 5 1.5M5 1.5L6.8 0M5 1.5L3.2 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ZoomControlBtn>
        )}
      </div>

      {/* Zoom hint — fades in briefly on mount */}
      <div style={{
        position:   "absolute",
        bottom:     "14px",
        left:       "50%",
        transform:  "translateX(-50%)",
        color:      "rgba(255,255,255,0.38)",
        fontSize:   "0.68rem",
        pointerEvents: "none",
        letterSpacing: "0.04em",
      }}>
        {zoom === 1 ? "Use + to zoom in" : "Drag to pan"}
      </div>
    </div>
  )
}

/* ─── Right panel — dispatches to correct visual per step ───────────────────── */
function StepVisual({ step, isMobile }) {
  const [visible, setVisible]   = useState(true)
  const prevStep                = useRef(step)

  useEffect(() => {
    if (prevStep.current?.number !== step?.number) {
      setVisible(false)
      const t = setTimeout(() => { prevStep.current = step; setVisible(true) }, 180)
      return () => clearTimeout(t)
    }
  }, [step])

  const s = prevStep.current

  /* Step 2 → User Research carousel (original designs + problems)   */
  /* Step 3 → User Interface carousel (new designs + improvements)   */
  /* Step 4 → Brand Identity zoomable image                          */
  /* Step 5 → User Experience carousel (UX artifacts)                */
  /* Step 6 → Outcome before/after carousel                          */
  if (s?.number === 2 || s?.number === 3 || s?.number === 4 || s?.number === 5 || s?.number === 6) {
    return (
      <div style={{
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}>
        {s.number === 2 ? <UserResearchCarousel />   :
         s.number === 3 ? <UserInterfaceCarousel />  :
         s.number === 4 ? <BrandIdentityViewer />    :
         s.number === 5 ? <UserExperienceCarousel /> :
                          <OutcomeCarousel />}
      </div>
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
      alignItems:           "center",
      justifyContent:       "center",
      height:               isMobile ? "220px" : `${STEP_BOX_H}px`,
      minHeight:            isMobile ? "220px" : `${STEP_BOX_H}px`,
    }}>
      <img
        src={s?.visual}
        alt={`Step ${s?.number}`}
        style={{
          width:      "100%",
          height:     "100%",
          objectFit:  "contain",
          display:    "block",
          padding:    "32px",
          filter:     "drop-shadow(0 12px 40px rgba(0,0,0,0.45))",
        }}
      />
    </div>
  )
}

/* Fixed height shared by every open step box and the glass panel */
const STEP_CONTENT_H = 420   /* scrollable description area height in px */
const STEP_BOX_H     = 472   /* total open box height (header + content) */

/* ─── Collapsed step row (shown in all-steps view) ──────────────────────────── */
function CollapsedStepRow({ step, isLast, onClick, grow }) {
  const [hov, setHov] = useState(false)
  const orange = "rgba(249,115,22,1)"

  return (
    <div style={{ display: "flex", flex: grow ? 1 : undefined, marginBottom: grow ? 0 : (isLast ? 0 : "10px") }}>
      {/* Circle + connector */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "48px", flexShrink: 0 }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%",
          border:      `2px solid ${hov ? "rgba(249,115,22,0.55)" : "rgba(255,255,255,0.22)"}`,
          background:  hov ? "rgba(249,115,22,0.12)" : "rgba(255,255,255,0.06)",
          color:       hov ? orange : "rgba(255,255,255,0.50)",
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

      {/* Title button — vertically centred within the row's available height */}
      <div style={{ flex: 1, marginLeft: "16px", display: "flex", alignItems: "center" }}>
        <button
          onClick={onClick}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          style={{
            width: "100%", display: "flex", alignItems: "center",
            justifyContent: "space-between", gap: "12px",
            padding: "14px 18px", borderRadius: "14px",
            background:    hov ? "rgba(249,115,22,0.08)" : "rgba(255,255,255,0.05)",
            border:        `1px solid ${hov ? "rgba(249,115,22,0.28)" : "rgba(255,255,255,0.10)"}`,
            backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
            cursor: "pointer", textAlign: "left",
            transition: "background 0.28s ease, border-color 0.28s ease",
          }}
        >
          <span style={{
            color:     hov ? "#fff" : "rgba(255,255,255,0.85)",
            fontSize:  "clamp(0.93rem, 1.3vw, 1.05rem)",
            fontWeight: 500, letterSpacing: "0.01em",
            transition: "color 0.28s ease",
          }}>
            {step.title}
          </span>
          {/* Right chevron */}
          <div style={{
            width: "26px", height: "26px", borderRadius: "50%",
            background: hov ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.07)",
            border:     `1px solid ${hov ? "rgba(249,115,22,0.30)" : "rgba(255,255,255,0.12)"}`,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            transition: "all 0.28s ease",
          }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M4 2l3 3-3 3" stroke={hov ? "rgba(249,115,22,0.9)" : "rgba(255,255,255,0.55)"}
                strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </button>
      </div>
    </div>
  )
}

/* ─── Open step box (single-step expanded view) ──────────────────────────────── */
function OpenStepBox({ step }) {
  const orange  = "rgba(249,115,22,1)"

  return (
    <div style={{ display: "flex" }}>
      {/* Orange circle + connector going down to the close arrow */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "48px", flexShrink: 0 }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%",
          border: `2px solid ${orange}`,
          background: "rgba(249,115,22,0.18)", color: orange,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.80rem", fontWeight: 700, flexShrink: 0,
        }}>
          {step.number}
        </div>
        <div style={{
          flex: 1, width: "2px", minHeight: "16px", marginTop: "4px",
          background: `linear-gradient(to bottom, ${orange}, rgba(249,115,22,0.10))`,
        }} />
      </div>

      {/* The box */}
      <div style={{
        flex: 1, marginLeft: "16px", borderRadius: "14px",
        background:           "rgba(249,115,22,0.11)",
        border:               "1px solid rgba(249,115,22,0.35)",
        backdropFilter:       "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        overflow:             "hidden",
      }}>
        {/* Title row */}
        <div style={{
          padding: "14px 18px",
          borderBottom: "1px solid rgba(249,115,22,0.20)",
        }}>
          <span style={{
            color: "#fff", fontSize: "clamp(0.93rem, 1.3vw, 1.05rem)",
            fontWeight: 700, letterSpacing: "0.01em",
          }}>
            {step.title}
          </span>
        </div>
        {/* Scrollable description */}
        <div style={{
          height: `${STEP_CONTENT_H}px`, overflowY: "auto",
          padding: "16px 20px 20px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(249,115,22,0.4) rgba(255,255,255,0.05)",
        }}>
          <StepContent blocks={step.content} />
        </div>
      </div>
    </div>
  )
}

/* ─── Close-arrow circle (replaces the "next step" circle below the open box) ── */
function CloseArrow({ onClick }) {
  const [hov, setHov] = useState(false)
  const orange = "rgba(249,115,22,1)"

  return (
    <div style={{ display: "flex", marginTop: "12px" }}>
      {/* Aligned to the same left position as number circles */}
      <div style={{ width: "48px", display: "flex", justifyContent: "center", flexShrink: 0 }}>
        <button
          onClick={onClick}
          onMouseEnter={() => setHov(true)}
          onMouseLeave={() => setHov(false)}
          title="Back to all steps"
          style={{
            width: "38px", height: "38px", borderRadius: "50%",
            border:     `2px solid ${hov ? orange : "rgba(249,115,22,0.55)"}`,
            background: hov ? "rgba(249,115,22,0.25)" : "rgba(249,115,22,0.12)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.25s ease",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2.5 8.5l5-5 5 5" stroke={orange}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

/* ─── Full stepper wrapper ───────────────────────────────────────────────────── */
function CaseStudyStepper() {
  const [openIndex, setOpenIndex] = useState(null)
  const [hdVisible, setHdVisible] = useState(false)
  const [isMobile,  setIsMobile]  = useState(() => window.innerWidth < 640)
  const headingRef = useRef(null)
  const openStep  = (i) => setOpenIndex(i)
  const closeStep = ()  => setOpenIndex(null)
  const orange = "rgba(249,115,22,1)"

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
    opacity:   hdVisible ? 1 : 0,
    transform: hdVisible ? "translateX(0)" : "translateX(-48px)",
    transition: `opacity 0.65s ease ${delay}, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}`,
  })

  return (
    <div style={{
      width:         "100%",
      boxSizing:     "border-box",
      paddingTop:    "80px",
      paddingBottom: "120px",
      paddingLeft:   isMobile ? "16px" : "clamp(32px, 5vw, 72px)",
      paddingRight:  isMobile ? "16px" : "clamp(32px, 5vw, 72px)",
    }}>
      {/* Section heading */}
      <div ref={headingRef} style={{ marginBottom: isMobile ? "24px" : "52px", textAlign: isMobile ? "center" : "left" }}>
        <div style={{
          display: "inline-block", padding: "5px 18px", borderRadius: "999px",
          background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.30)",
          color: orange, fontSize: "0.72rem", fontWeight: 600,
          letterSpacing: "0.10em", textTransform: "uppercase", marginBottom: "14px",
          ...hdAnim("0s"),
        }}>
          Case Study
        </div>
        <h2 style={{ margin: 0, color: "#fff", fontSize: isMobile ? "1.3rem" : "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.1, ...hdAnim("0.15s") }}>
          Design Process
        </h2>
        <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.45)", fontSize: isMobile ? "0.78rem" : "clamp(0.88rem, 1.2vw, 0.98rem)", ...hdAnim("0.28s") }}>
          {isMobile ? "Tap any step to explore." : "Click any step to explore the full story."}
        </p>
      </div>

      {/* Mobile: visual top, steps below — Desktop: two columns */}
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? "16px" : "clamp(20px, 3vw, 48px)", alignItems: "flex-start" }}>

        {/* Glass visual — TOP on mobile, RIGHT on desktop */}
        <div style={{
          order: isMobile ? -1 : 1, flex: isMobile ? "none" : 1,
          width: isMobile ? "100%" : undefined, minWidth: isMobile ? undefined : 0,
          opacity: hdVisible ? 1 : 0, transform: hdVisible ? "translateX(0)" : "translateX(48px)",
          transition: "opacity 0.65s ease 0.48s, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) 0.48s",
        }}>
          <StepVisual step={openIndex !== null ? STEPS[openIndex] : STEPS[0]} isMobile={isMobile} />
        </div>

        {/* Steps — BOTTOM on mobile, LEFT on desktop */}
        <div style={{
          order: isMobile ? 0 : 0,
          flex: isMobile ? "none" : "0 0 48%", width: isMobile ? "100%" : undefined, maxWidth: isMobile ? undefined : "48%",
          opacity: hdVisible ? 1 : 0, transform: hdVisible ? "translateX(0)" : "translateX(-48px)",
          transition: "opacity 0.65s ease 0.38s, transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94) 0.38s",
        }}>
          {openIndex === null ? (
            <div style={{ display: "flex", flexDirection: "column", height: isMobile ? "auto" : `${STEP_BOX_H}px`, gap: isMobile ? "6px" : 0 }}>
              {STEPS.map((step, i) => (
                <CollapsedStepRow key={step.number} step={step} isLast={i === STEPS.length - 1} onClick={() => openStep(i)} grow={!isMobile} />
              ))}
            </div>
          ) : (
            <><OpenStepBox step={STEPS[openIndex]} /><CloseArrow onClick={closeStep} /></>
          )}
        </div>

      </div>
    </div>
  )
}

/* ─── Mobile swipeable phone carousel (phones only) ─────────────────────────── */
const HERO_PHONES = [
  { src: "/images/HomeNew.png",    label: "Home"    },
  { src: "/images/AnswerNew.png",  label: "Answers" },
  { src: "/images/ProfileNew.png", label: "Profile" },
  { src: "/images/CreateNew.png",  label: "Create"  },
  { src: "/images/ChatNew.png",    label: "Chat"    },
]

function MobilePhoneCarousel() {
  const [idx, setIdx]         = useState(0)
  const [offset, setOffset]   = useState(0)
  const [dragging, setDragging] = useState(false)
  const touchStartX = useRef(null)
  const idxRef      = useRef(0)
  const total       = HERO_PHONES.length
  const SWIPE_THRESHOLD = 40
  const orange = "rgba(249,115,22,1)"

  const goTo = (n) => {
    const next = (n + total) % total
    setIdx(next)
    idxRef.current = next
    setOffset(0)
  }

  useEffect(() => {
    const t = setInterval(() => goTo(idxRef.current + 1), 5000)
    return () => clearInterval(t)
  }, [])

  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; setDragging(true) }
  const onTouchMove  = (e) => { if (touchStartX.current === null) return; setOffset(e.touches[0].clientX - touchStartX.current) }
  const onTouchEnd   = () => {
    if (Math.abs(offset) >= SWIPE_THRESHOLD) goTo(idxRef.current + (offset < 0 ? 1 : -1))
    else setOffset(0)
    touchStartX.current = null
    setDragging(false)
  }

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ width: "100%", display: "flex", justifyContent: "center", background: "transparent", touchAction: "pan-y" }}
      >
        <img
          src={HERO_PHONES[idx].src}
          alt={HERO_PHONES[idx].label}
          draggable={false}
          style={{
            width:      "55%",
            maxWidth:   "210px",
            height:     "auto",
            display:    "block",
            transform:  `translateX(${offset}px)`,
            transition: dragging ? "none" : "transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
            filter:     "drop-shadow(0 8px 28px rgba(249,115,22,0.35))",
            userSelect: "none",
          }}
        />
      </div>
      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
        {HERO_PHONES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} style={{
            width: i === idx ? "20px" : "6px", height: "6px", borderRadius: "3px",
            background: i === idx ? orange : "rgba(255,255,255,0.35)",
            border: "none", padding: 0, cursor: "pointer", transition: "all 0.3s ease",
          }} />
        ))}
      </div>
    </div>
  )
}

/* ─── Interactive hero phone stack (5 phones, 3-D fan, drag + click + auto) ─── */
function HeroPhoneStack() {
  const [centerIdx, setCenterIdx] = useState(0)
  const [dragging,  setDragging]  = useState(false)
  const [dragDelta, setDragDelta] = useState(0)

  const startX  = useRef(null)
  const didDrag = useRef(false)
  const idxRef  = useRef(0)       /* readable by interval without stale closure */
  const orange  = "rgba(249,115,22,1)"
  const DRAG_THRESHOLD = 50

  const PHONES = [
    { src: "/images/HomeNew.png",    label: "Home"    },
    { src: "/images/AnswerNew.png",  label: "Answers" },
    { src: "/images/ProfileNew.png", label: "Profile" },
    { src: "/images/CreateNew.png",  label: "Create"  },
    { src: "/images/ChatNew.png",    label: "Chat"    },
  ]

  const advance = (newIdx) => {
    setCenterIdx(newIdx)
    idxRef.current = newIdx
  }

  /* Auto-advance every 5 s */
  useEffect(() => {
    const t = setInterval(
      () => advance((idxRef.current + 1) % PHONES.length),
      5000,
    )
    return () => clearInterval(t)
  }, [])

  /* Slot configs — slightly tighter spread so the sweep feels controlled */
  const SLOTS = [
    { dx: -300, dz: -180, ry: -25, sc: 0.60, zi: 1, op: 0.55 }, // -2
    { dx: -165, dz:  -90, ry: -14, sc: 0.80, zi: 3, op: 0.80 }, // -1
    { dx:    0, dz:    0, ry:   0, sc: 1.00, zi: 5, op: 1.00 }, //  0
    { dx:  165, dz:  -90, ry:  14, sc: 0.80, zi: 3, op: 0.80 }, // +1
    { dx:  300, dz: -180, ry:  25, sc: 0.60, zi: 1, op: 0.55 }, // +2
  ]

  const slotOf = (i) => {
    let off = (i - centerIdx + PHONES.length) % PHONES.length
    if (off > 2) off -= PHONES.length
    return SLOTS[off + 2]
  }

  /* ── Pointer handlers ── */
  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    startX.current  = e.clientX
    didDrag.current = false
    setDragging(true)
  }

  const onPointerMove = (e) => {
    if (startX.current === null) return
    const delta = e.clientX - startX.current
    setDragDelta(delta)
    if (Math.abs(delta) > DRAG_THRESHOLD / 2) didDrag.current = true
  }

  const onPointerUp = (e) => {
    if (startX.current === null) return
    const delta = e.clientX - startX.current
    startX.current = null
    setDragging(false)
    setDragDelta(0)
    if (Math.abs(delta) >= DRAG_THRESHOLD) {
      advance((idxRef.current + (delta < 0 ? 1 : -1) + PHONES.length) % PHONES.length)
    }
  }

  /* Clamp drag so center phone moves ≤ 100 px with the finger */
  const dragShift = Math.max(-100, Math.min(100, dragDelta * 0.55))

  /* Smooth easing matching the featured-works card transitions */
  const EASE = "cubic-bezier(0.25, 0.46, 0.45, 0.94)"

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        width:             "100%",
        height:            "100%",
        position:          "relative",
        perspective:       "1100px",
        perspectiveOrigin: "50% 50%",
        cursor:            dragging ? "grabbing" : "grab",
        userSelect:        "none",
        touchAction:       "none",
      }}
    >
      {PHONES.map((phone, i) => {
        const s        = slotOf(i)
        const isCenter = i === centerIdx
        /* Only center phone follows the finger during drag */
        const liveX    = s.dx + (isCenter && dragging ? dragShift : 0)

        return (
          <div
            key={phone.src}
            onClick={() => { if (!didDrag.current) advance(i) }}
            style={{
              position:  "absolute",
              left:      "50%",
              top:       "50%",
              zIndex:    s.zi,
              opacity:   s.op,
              transform: `translate(-50%,-50%) translateX(${liveX}px) translateZ(${s.dz}px) rotateY(${s.ry}deg) scale(${s.sc})`,
              /* Dragging: no transition so the center card sticks to the finger.
                 Released: smooth spring — all phones glide to their new slots.  */
              transition: dragging
                ? "none"
                : `transform 0.52s ${EASE}, opacity 0.52s ${EASE}`,
              cursor:    dragging ? "grabbing" : (isCenter ? "grab" : "pointer"),
              background:"none",
            }}
          >
            <img
              src={phone.src}
              alt={phone.label}
              draggable={false}
              style={{
                height:        "min(70vh, 580px)",
                width:         "auto",
                display:       "block",
                filter:        isCenter
                  ? "drop-shadow(0 24px 48px rgba(0,0,0,0.55))"
                  : "drop-shadow(0 10px 24px rgba(0,0,0,0.38))",
                userSelect:    "none",
                pointerEvents: "none",
                transition:    `filter 0.52s ${EASE}`,
              }}
            />
          </div>
        )
      })}

      {/* Page indicator dots */}
      <div style={{
        position:      "absolute",
        bottom:        "28px",
        left:          "50%",
        transform:     "translateX(-50%)",
        display:       "flex",
        gap:           "7px",
        zIndex:        10,
        pointerEvents: dragging ? "none" : "auto",
      }}>
        {PHONES.map((_, i) => (
          <button
            key={i}
            onClick={() => advance(i)}
            style={{
              width:        i === centerIdx ? "22px" : "7px",
              height:       "7px",
              borderRadius: "4px",
              background:   i === centerIdx ? orange : "rgba(255,255,255,0.30)",
              border:       "none",
              padding:      0,
              cursor:       "pointer",
              transition:   "all 0.35s ease",
            }}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── Main page ─────────────────────────────────────────────────────────────── */
export function RedditPage() {
  const { navigate } = useRouter()
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640)
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  return (
    <>
      <style>{`
        @keyframes rdSlideLeft {
          from { opacity: 0; transform: translateX(-52px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        @keyframes rdPopIn {
          from { opacity: 0; transform: scale(0.45); }
          to   { opacity: 1; transform: scale(1);    }
        }
      `}</style>
      <SideBlobs />

      <main style={{ minHeight: "100vh" }}>

        {/* ══════════════════════════════════════════════════════════════
            HERO — left info (30%) | right bare image (70%)
        ══════════════════════════════════════════════════════════════ */}
        <section style={{
          display:       "flex",
          flexDirection: isMobile ? "column" : "row",
          width:         "100vw",
          height:        isMobile ? "auto" : "100vh",
          minHeight:     isMobile ? "100vh" : undefined,
          overflow:      "hidden",
          position:      "relative",
          zIndex:        1,
          padding:       isMobile ? "85px 16px 16px" : 0,
          boxSizing:     "border-box",
          gap:           isMobile ? "10px" : 0,
          alignItems:    isMobile ? "center" : undefined,
        }}>

          {/* ── MOBILE MOCKUP — swipeable carousel on mobile, 3-D stack on desktop ── */}
          {isMobile && <MobilePhoneCarousel />}

          {/* ── LEFT PANEL ── */}
          <div style={{
            width:          isMobile ? "100%" : "32vw",
            minWidth:       isMobile ? "unset" : "300px",
            flexShrink:     0,
            display:        "flex",
            flexDirection:  "column",
            justifyContent: isMobile ? "flex-start" : "center",
            alignItems:     isMobile ? "center" : undefined,
            /* generous padding so content breathes */
            padding:        isMobile ? "0" : "0 clamp(36px, 5vw, 72px) 0 clamp(36px, 5vw, 72px)",
            position:       "relative",
            zIndex:         2,
          }}>

            {/* ← Back button — fixed so always visible while scrolling */}
            <button
              onClick={() => navigate("projects")}
              style={{
                position:             "fixed",
                top:                  "clamp(72px,9vh,96px)",
                left:                 "clamp(24px,3vw,48px)",
                zIndex:               50,
                display:              "flex",
                alignItems:           "center",
                gap:                  "7px",
                padding:              "9px 20px",
                borderRadius:         "999px",
                background:           "rgba(255,255,255,0.10)",
                backdropFilter:       "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border:               "1px solid rgba(255,255,255,0.22)",
                color:                "rgba(255,255,255,0.88)",
                fontSize:             "0.85rem",
                fontWeight:           500,
                cursor:               "pointer",
                letterSpacing:        "0.04em",
                transition:           "background 0.2s ease",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.10)"}
            >
              ← Back
            </button>

            {/* ── Info block ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "10px" : "22px" }}>

              {/* Reddit logo */}
              <img
                src="/images/RedditLogo.png"
                alt="Reddit logo"
                style={{
                  height:    isMobile ? "60px" : "clamp(64px, 8vw, 96px)",
                  width:     "auto",
                  objectFit: "contain",
                  alignSelf: isMobile ? "center" : "flex-start",
                  filter:    "drop-shadow(0 4px 18px rgba(255,100,0,0.45))",
                  animation: "rdSlideLeft 0.70s cubic-bezier(0.25,0.46,0.45,0.94) 0.10s both",
                }}
              />

              {/* Project title */}
              <h1 style={{
                margin:     0,
                color:      "#fff",
                fontSize:   isMobile ? "1.5rem" : "clamp(2rem, 3.6vw, 3.2rem)",
                fontWeight: 700,
                lineHeight: 1.05,
                whiteSpace: isMobile ? "normal" : "nowrap",
                textAlign:  isMobile ? "center" : "left",
                animation:  "rdSlideLeft 0.70s cubic-bezier(0.25,0.46,0.45,0.94) 0.25s both",
              }}>
                Reddit Redesign
              </h1>

              {/* Category badge */}
              <div style={{
                display:       "inline-flex",
                alignSelf:     isMobile ? "center" : "flex-start",
                padding:       "5px 16px",
                borderRadius:  "999px",
                background:    "rgba(249,115,22,0.18)",
                border:        "1px solid rgba(249,115,22,0.40)",
                color:         "#f97316",
                fontSize:      "0.75rem",
                fontWeight:    600,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                animation:     "rdSlideLeft 0.70s cubic-bezier(0.25,0.46,0.45,0.94) 0.40s both",
              }}>
                UI/UX Redesign
              </div>

              {/* Divider */}
              <div style={{
                width:        "44px",
                height:       "2px",
                background:   "rgba(255,255,255,0.22)",
                borderRadius: "2px",
                animation:    "rdSlideLeft 0.55s ease 0.52s both",
                alignSelf:    isMobile ? "center" : undefined,
              }} />

              {/* Tool icons — squares with no label, staggered pop-in */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: isMobile ? "center" : "flex-start" }}>
                {TOOLS.map((t, i) => (
                  <ToolIcon key={t.name} {...t} animDelay={`${0.58 + i * 0.10}s`} />
                ))}
              </div>

            </div>
          </div>

          {/* ── RIGHT PANEL — interactive 3-D phone stack (desktop only) ── */}
          {!isMobile && (
            <div style={{
              flex:     1,
              position: "relative",
              height:   "100%",
            }}>
              <HeroPhoneStack />
            </div>
          )}
        </section>

        {/* ══════════════════════════════════════════════════════════════
            STEPPER / ACCORDION SECTION
        ══════════════════════════════════════════════════════════════ */}
        <CaseStudyStepper />

        {/* ── Figma Link button ── */}
        <div style={{ display: "flex", justifyContent: "center", padding: "0 0 48px" }}>
          <a
            href="https://www.figma.com/design/vKNmWMvdeVnMEGZolC6pQC/Untitled?node-id=0-1&t=JOTQP8xADYPxQDX1-1"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:              "inline-flex",
              alignItems:           "center",
              gap:                  "10px",
              padding:              "14px 36px",
              borderRadius:         "999px",
              background:           "linear-gradient(135deg, rgba(249,115,22,0.18), rgba(249,115,22,0.08))",
              backdropFilter:       "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border:               "1px solid rgba(249,115,22,0.45)",
              color:                "rgba(255,255,255,0.92)",
              fontSize:             "0.95rem",
              fontWeight:           600,
              letterSpacing:        "0.05em",
              textDecoration:       "none",
              cursor:               "pointer",
              transition:           "background 0.25s ease, border-color 0.25s ease, transform 0.2s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background  = "linear-gradient(135deg, rgba(249,115,22,0.32), rgba(249,115,22,0.16))"
              e.currentTarget.style.borderColor = "rgba(249,115,22,0.70)"
              e.currentTarget.style.transform   = "translateY(-2px)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background  = "linear-gradient(135deg, rgba(249,115,22,0.18), rgba(249,115,22,0.08))"
              e.currentTarget.style.borderColor = "rgba(249,115,22,0.45)"
              e.currentTarget.style.transform   = "translateY(0)"
            }}
          >
            <img
              src="/images/toolkit-figma.png"
              alt="Figma"
              style={{ width: "22px", height: "22px", objectFit: "contain" }}
            />
            View Figma File
          </a>
        </div>

      </main>

      <Footer />
    </>
  )
}
