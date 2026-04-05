import { useState, useRef, useEffect } from "react"
import { useRouter } from "../lib/router-context"
import { useTheme } from "../lib/theme-context"
import { GlassCard } from "./glass-card"
import { ScrollProgress } from "./scroll-progress"

const NAV_LINKS = [
  { label: "Projects", href: "projects", type: "route" },
  { label: "About", href: "about", type: "route" },
  { label: "Resume", href: "resume", type: "route" },
  { label: "Draft", href: "ai", type: "route" },
  { label: "Contact", href: "contact", type: "route" },
]

const THEME_COLORS = {
  pink: { label: "Pink", preview: "#B13782" },
  blue: { label: "Blue", preview: "#1a3a5c" },
  green: { label: "Green", preview: "#1a5c3a" },
  orange: { label: "Orange", preview: "#8B4513" },
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [burgerHovered, setBurgerHovered] = useState(false)
  const { setTheme, themeName } = useTheme()
  const menuRef = useRef(null)
  const paletteRef = useRef(null)
  const { page, navigate } = useRouter()
  const isHome = page === "home"

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
      if (paletteRef.current && !paletteRef.current.contains(e.target)) {
        setPaletteOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-5 md:px-8 3xl:px-20 3xl:py-8">
      {/* Logo + Scroll Progress */}
      <div className="flex items-center gap-2">
        <GlassCard
          intensity="medium"
          className="nav-glass-hover w-14 h-14 3xl:w-24 3xl:h-24 flex items-center justify-center rounded-xl cursor-pointer overflow-hidden"
          onClick={() => navigate("home")}
        >
          <img src="/images/logo.png" alt="FG Logo" className="w-10 h-10 3xl:w-16 3xl:h-16 object-contain" />
        </GlassCard>
        <ScrollProgress />
      </div>

      {/* Right side: Hamburger + Palette */}
      <div className="flex items-center gap-2">

        {/* ── Hamburger menu area ── */}
        <div ref={menuRef} className="relative">
          {/* Pill button (always visible) */}
          <div
            className={`
              nav-glass-hover flex items-center overflow-hidden transition-all duration-500 ease-in-out
              rounded-xl ${menuOpen ? "sm:rounded-full" : ""}
            `}
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {/* Nav links — horizontal expansion on sm+ ONLY */}
            <div
              className={`
                hidden sm:flex items-center gap-1 overflow-hidden transition-all duration-500 ease-in-out
                ${menuOpen ? "max-w-[400px] opacity-100 px-4" : "max-w-0 opacity-0 px-0"}
              `}
            >
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  className="nav-link-gradient text-white/80 text-sm font-medium whitespace-nowrap transition-all duration-300 px-3 py-1.5 rounded-full bg-transparent border-none cursor-pointer"
                  onClick={() => {
                    setMenuOpen(false)
                    if (link.type === "route") {
                      navigate(link.href)
                    } else if (!isHome) {
                      navigate("home")
                      setTimeout(() => {
                        const el = document.querySelector(link.href)
                        if (el) el.scrollIntoView({ behavior: "smooth" })
                      }, 200)
                    } else {
                      const el = document.querySelector(link.href)
                      if (el) el.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Hamburger button */}
            <button
              className="icon-btn-hover w-14 h-14 3xl:w-24 3xl:h-24 flex flex-col items-center justify-center gap-[5px] 3xl:gap-[10px] shrink-0 cursor-pointer rounded-xl"
              style={{ background: "transparent", border: "1px solid transparent" }}
              onMouseEnter={() => setBurgerHovered(true)}
              onMouseLeave={() => setBurgerHovered(false)}
              onClick={() => {
                setMenuOpen(!menuOpen)
                setPaletteOpen(false)
              }}
              aria-label="Toggle menu"
            >
              <span
                className={`hamburger-bar block h-[2px] 3xl:h-[3px] transition-all duration-300 ${
                  menuOpen ? "w-5 3xl:w-8 rotate-45 translate-y-[7px] 3xl:translate-y-[12px]" : "w-6 3xl:w-10"
                }`}
                style={{ background: burgerHovered ? "linear-gradient(90deg, #8B5CF6, #EC4899)" : "white" }}
              />
              <span
                className={`hamburger-bar block h-[2px] 3xl:h-[3px] transition-all duration-300 ${
                  menuOpen ? "w-5 3xl:w-8 opacity-0" : "w-6 3xl:w-10"
                }`}
                style={{ background: burgerHovered ? "linear-gradient(90deg, #A855F7, #EC4899)" : "white" }}
              />
              <span
                className={`hamburger-bar block h-[2px] 3xl:h-[3px] transition-all duration-300 ${
                  menuOpen ? "w-5 3xl:w-8 -rotate-45 -translate-y-[7px] 3xl:-translate-y-[12px]" : "w-6 3xl:w-10"
                }`}
                style={{ background: burgerHovered ? "linear-gradient(90deg, #EC4899, #8B5CF6)" : "white" }}
              />
            </button>
          </div>

          {/* Mobile-only vertical dropdown — drops below the button */}
          <div
            className={`
              sm:hidden absolute right-0 z-50 flex flex-col overflow-hidden
              transition-all duration-300 ease-in-out rounded-2xl
              ${menuOpen ? "max-h-64 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}
            `}
            style={{
              background: "rgba(20,20,30,0.75)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.15)",
              top: "100%",
              minWidth: "140px",
            }}
          >
            <div className="flex flex-col p-2 gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.label}
                  className="nav-link-gradient text-white/80 text-sm font-medium text-left px-4 py-2.5 rounded-xl bg-transparent border-none cursor-pointer hover:bg-white/10 transition-colors"
                  onClick={() => {
                    setMenuOpen(false)
                    if (link.type === "route") {
                      navigate(link.href)
                    } else if (!isHome) {
                      navigate("home")
                      setTimeout(() => {
                        const el = document.querySelector(link.href)
                        if (el) el.scrollIntoView({ behavior: "smooth" })
                      }, 200)
                    } else {
                      const el = document.querySelector(link.href)
                      if (el) el.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Palette / Theme area ── */}
        <div ref={paletteRef} className="relative">
          {/* Pill button (always visible) */}
          <div
            className={`
              nav-glass-hover flex items-center overflow-hidden transition-all duration-500 ease-in-out
              rounded-xl ${paletteOpen ? "sm:rounded-full" : ""}
            `}
            style={{
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            {/* Theme swatches — horizontal expansion on sm+ ONLY */}
            <div
              className={`
                hidden sm:flex items-center gap-2 overflow-hidden transition-all duration-500 ease-in-out
                ${paletteOpen ? "max-w-[250px] opacity-100 px-3" : "max-w-0 opacity-0 px-0"}
              `}
            >
              {Object.entries(THEME_COLORS).map(([key, { preview }]) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key)
                    setPaletteOpen(false)
                  }}
                  className={`w-7 h-7 rounded-full shrink-0 transition-all duration-300 hover:scale-110 ${
                    themeName === key ? "ring-2 ring-white ring-offset-1 ring-offset-transparent scale-110" : ""
                  }`}
                  style={{ background: preview }}
                  aria-label={`Switch to ${key} theme`}
                />
              ))}
            </div>

            {/* Palette icon button */}
            <button
              className="icon-btn-hover w-14 h-14 3xl:w-24 3xl:h-24 flex items-center justify-center shrink-0 cursor-pointer rounded-xl"
              style={{ background: "transparent", border: "1px solid transparent" }}
              onClick={() => {
                setPaletteOpen(!paletteOpen)
                setMenuOpen(false)
              }}
              aria-label="Toggle theme picker"
            >
              <svg width="22" height="22" className="3xl:!w-12 3xl:!h-12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="13.5" cy="6.5" r="2" />
                <circle cx="17.5" cy="10.5" r="2" />
                <circle cx="8.5" cy="7.5" r="2" />
                <circle cx="6.5" cy="12.5" r="2" />
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
              </svg>
            </button>
          </div>

          {/* Mobile-only vertical dropdown — drops below the button with color + label rows */}
          <div
            className={`
              sm:hidden absolute right-0 z-50 flex flex-col overflow-hidden
              transition-all duration-300 ease-in-out rounded-2xl
              ${paletteOpen ? "max-h-64 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"}
            `}
            style={{
              background: "rgba(20,20,30,0.75)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.15)",
              top: "100%",
              minWidth: "140px",
            }}
          >
            <div className="flex flex-col p-2 gap-1">
              {Object.entries(THEME_COLORS).map(([key, { label, preview }]) => (
                <button
                  key={key}
                  onClick={() => {
                    setTheme(key)
                    setPaletteOpen(false)
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-left border-none cursor-pointer transition-colors ${
                    themeName === key ? "bg-white/15" : "bg-transparent hover:bg-white/10"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full shrink-0 ${themeName === key ? "ring-2 ring-white ring-offset-1 ring-offset-transparent" : ""}`}
                    style={{ background: preview }}
                  />
                  <span className="text-white/80 text-sm whitespace-nowrap">{label}</span>
                  {themeName === key && <span className="text-white/50 text-xs ml-auto">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </header>
  )
}
