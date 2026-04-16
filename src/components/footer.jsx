import { useRouter } from "../lib/router-context"
import { GlassCard } from "./glass-card"

const socialLinks = [
  {
    label: "Email",
    href: "mailto:farnaz.gholami7900@gmail.com",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/farnaz-gholami-4165b9345",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Contact",
    href: "contact",
    isRoute: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "Resume",
    href: "resume",
    isRoute: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
]

export function Footer() {
  const { navigate } = useRouter()

  return (
    <footer className="relative pt-40 pb-12 px-4 overflow-hidden" id="contact">
      {/* Subtle lava blobs */}
      <div
        className="absolute w-32 h-32 opacity-15 blur-[40px] pointer-events-none"
        style={{
          top: "-10%",
          right: "15%",
          background: "var(--blob-2)",
          borderRadius: "45% 55% 50% 50%",
          animation: "blob-float-4 24s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-24 h-24 opacity-15 blur-[35px] pointer-events-none"
        style={{
          bottom: "10%",
          left: "10%",
          background: "var(--blob-5)",
          borderRadius: "55% 45% 50% 50%",
          animation: "blob-float-1 20s ease-in-out infinite",
        }}
      />

      <div className="relative z-10 flex items-center justify-center gap-4 mb-8">
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.isRoute ? "#" : link.href}
            target={link.href.startsWith("http") ? "_blank" : undefined}
            rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
            aria-label={link.label}
            className="relative group"
            onClick={link.isRoute ? (e) => { e.preventDefault(); navigate(link.href) } : undefined}
          >
            {/* Tooltip */}
            <span
              className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-lg text-xs font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none scale-90 group-hover:scale-100"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {link.label}
            </span>
            <div
              className="icon-btn-hover w-12 h-12 flex items-center justify-center rounded-xl text-white/60 hover:text-white transition-all duration-300 hover:scale-110 cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              {link.icon}
            </div>
          </a>
        ))}
      </div>

      <p className="relative z-10 text-center text-white/40 text-xs tracking-wider">
        FARNAZ GHOLAMI | 2026
      </p>
    </footer>
  )
}
