import { useState, useEffect } from "react";

/* ─────────────────────────────────────────────
   DESIGN TOKENS & GLOBAL STYLES
   ───────────────────────────────────────────── */
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* Grid */
    --cols: 12;
    --gutter: 24px;
    --container-max: 1080px;

    /* Colors */
    --bg:       #0a0a0a;
    --surface:  #111111;
    --surface2: #1a1a1a;
    --border:   rgba(255,255,255,0.08);
    --text:     #f0ece8;
    --muted:    #888;
    --accent:   #c8ff00;
    --accent-dark: #9ec800;

    /* Type */
    --font: 'Inter', 'Helvetica Neue', sans-serif;

    /* Misc */
    --radius: 14px;
    --transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--font);
    background: var(--bg);
    color: var(--text);
    -webkit-font-smoothing: antialiased;
  }

  /* ── LAYOUT PRIMITIVES ── */

  /* Full-bleed: background spans 100vw */
  .full-bleed { width: 100%; }

  /* Container: content capped at 1080px, centered */
  .container {
    max-width: var(--container-max);
    margin: 0 auto;
    padding: 0 var(--gutter);
    width: 100%;
  }

  /* 12-column grid */
  .grid {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: var(--gutter);
    align-items: start;
  }

  /* Column span classes */
  .col-1  { grid-column: span 1;  }
  .col-2  { grid-column: span 2;  }
  .col-3  { grid-column: span 3;  }
  .col-4  { grid-column: span 4;  }
  .col-5  { grid-column: span 5;  }
  .col-6  { grid-column: span 6;  }
  .col-7  { grid-column: span 7;  }
  .col-8  { grid-column: span 8;  }
  .col-9  { grid-column: span 9;  }
  .col-10 { grid-column: span 10; }
  .col-11 { grid-column: span 11; }
  .col-12 { grid-column: span 12; }

  /* ── TABLET (≤900px) ── */
  @media (max-width: 900px) {
    :root { --gutter: 20px; }
    .col-3 { grid-column: span 6; }
    .col-4 { grid-column: span 6; }
    .col-5 { grid-column: span 6; }
    .col-7 { grid-column: span 12; }
    .col-8 { grid-column: span 12; }
  }

  /* ── MOBILE (≤640px) ── */
  @media (max-width: 640px) {
    :root { --gutter: 16px; }
    .col-1, .col-2, .col-3, .col-4,
    .col-5, .col-6, .col-7, .col-8,
    .col-9, .col-10, .col-11 { grid-column: span 12; }
    .mob-6 { grid-column: span 6 !important; }
  }

  /* ── NAV ── */
  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(10,10,10,0.85);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    height: 64px;
  }
  .nav .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }
  .nav-logo {
    font-size: 17px; font-weight: 700;
    color: var(--text); text-decoration: none;
    letter-spacing: -0.3px;
  }
  .nav-logo span { color: var(--accent); }
  .nav-links {
    display: flex; gap: 32px; list-style: none;
  }
  .nav-links a {
    font-size: 14px; font-weight: 500;
    color: var(--muted); text-decoration: none;
    transition: color var(--transition);
  }
  .nav-links a:hover { color: var(--text); }
  .nav-cta {
    font-size: 13px; font-weight: 600;
    background: var(--accent); color: #000;
    border: none; padding: 8px 18px;
    border-radius: 8px; cursor: pointer;
    text-decoration: none;
    transition: background var(--transition), transform var(--transition);
  }
  .nav-cta:hover { background: var(--accent-dark); transform: translateY(-1px); }

  /* Hamburger */
  .hamburger {
    display: none; flex-direction: column; gap: 5px;
    background: none; border: none; cursor: pointer; padding: 4px;
  }
  .hamburger span {
    display: block; width: 22px; height: 2px;
    background: var(--text); border-radius: 2px;
    transition: transform var(--transition), opacity var(--transition);
  }
  .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hamburger.open span:nth-child(2) { opacity: 0; }
  .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  .mobile-menu {
    display: none;
  }

  @media (max-width: 768px) {
    .nav-links, .nav-cta { display: none !important; }
    .hamburger { display: flex; }
    .mobile-menu {
      display: block;
      position: fixed; top: 64px; left: 0; right: 0;
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 24px;
      z-index: 99;
      transform: translateY(-100%);
      opacity: 0;
      pointer-events: none;
      transition: transform var(--transition), opacity var(--transition);
    }
    .mobile-menu.open {
      transform: translateY(0);
      opacity: 1;
      pointer-events: all;
    }
    .mobile-menu ul {
      list-style: none;
      display: flex; flex-direction: column; gap: 20px;
    }
    .mobile-menu a {
      font-size: 18px; font-weight: 500;
      color: var(--text); text-decoration: none;
    }
    .mobile-menu .mob-cta {
      display: inline-block; margin-top: 12px;
      font-size: 15px; font-weight: 600;
      background: var(--accent); color: #000;
      padding: 10px 22px; border-radius: 8px;
      text-decoration: none;
    }
  }

  /* ── HERO ── */
  .hero-section {
    padding: 140px 0 100px;
    background: var(--bg);
    position: relative;
    overflow: hidden;
  }
  .hero-section::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 900px 600px at 60% 50%, rgba(200,255,0,0.04) 0%, transparent 70%);
    pointer-events: none;
  }
  .hero-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 12px; font-weight: 600; letter-spacing: 1.5px;
    text-transform: uppercase; color: var(--accent);
    background: rgba(200,255,0,0.08);
    border: 1px solid rgba(200,255,0,0.2);
    padding: 5px 12px; border-radius: 20px;
    margin-bottom: 24px;
  }
  .hero-eyebrow::before {
    content: ''; width: 6px; height: 6px;
    background: var(--accent); border-radius: 50%;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }
  .hero-title {
    font-size: clamp(40px, 6vw, 72px);
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -2px;
    margin-bottom: 24px;
  }
  .hero-title em {
    font-style: normal;
    color: var(--accent);
  }
  .hero-subtitle {
    font-size: clamp(15px, 1.8vw, 18px);
    color: var(--muted);
    line-height: 1.7;
    max-width: 460px;
    margin-bottom: 40px;
  }
  .hero-actions {
    display: flex; gap: 14px; flex-wrap: wrap;
  }
  .btn-primary {
    font-size: 14px; font-weight: 600;
    background: var(--accent); color: #000;
    border: none; padding: 13px 28px;
    border-radius: 10px; cursor: pointer;
    text-decoration: none;
    transition: background var(--transition), transform var(--transition);
  }
  .btn-primary:hover { background: var(--accent-dark); transform: translateY(-2px); }
  .btn-ghost {
    font-size: 14px; font-weight: 500;
    background: transparent;
    color: var(--text);
    border: 1px solid var(--border);
    padding: 13px 28px;
    border-radius: 10px; cursor: pointer;
    text-decoration: none;
    transition: border-color var(--transition), background var(--transition);
  }
  .btn-ghost:hover { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.04); }

  /* Hero media side */
  .hero-media {
    position: relative; align-self: center;
  }
  .hero-card {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
  }
  .hero-card-header {
    background: var(--surface);
    padding: 14px 18px;
    display: flex; align-items: center; gap: 8px;
    border-bottom: 1px solid var(--border);
  }
  .dot { width: 10px; height: 10px; border-radius: 50%; }
  .hero-screen {
    padding: 24px;
    display: flex; flex-direction: column; gap: 12px;
  }
  .mock-bar {
    height: 10px; border-radius: 6px;
    background: rgba(255,255,255,0.07);
  }
  .mock-bar.accent { background: rgba(200,255,0,0.2); width: 60%; }
  .mock-bar.short { width: 40%; }
  .mock-row {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 6px;
  }
  .mock-block {
    height: 80px; border-radius: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
  }
  .mock-block.highlight {
    background: rgba(200,255,0,0.06);
    border-color: rgba(200,255,0,0.15);
  }
  .hero-badge {
    position: absolute; bottom: -12px; left: -16px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 12px 16px;
    display: flex; align-items: center; gap: 10px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .badge-icon {
    width: 36px; height: 36px; border-radius: 8px;
    background: rgba(200,255,0,0.12);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .badge-text strong { font-size: 13px; font-weight: 600; display: block; }
  .badge-text span { font-size: 11px; color: var(--muted); }

  /* ── STATS STRIP ── */
  .stats-section {
    background: var(--surface);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    padding: 32px 0;
  }
  .stat-item { text-align: center; }
  .stat-num {
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 700; letter-spacing: -1.5px;
    color: var(--accent);
  }
  .stat-label {
    font-size: 12px; color: var(--muted);
    text-transform: uppercase; letter-spacing: 0.8px;
    margin-top: 4px; font-weight: 500;
  }
  .stat-divider {
    border: none; border-left: 1px solid var(--border);
    margin: 0;
  }

  /* ── WORK SECTION ── */
  .section-eyebrow {
    font-size: 11px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 2px;
    color: var(--accent); margin-bottom: 12px;
  }
  .section-title {
    font-size: clamp(28px, 4vw, 42px);
    font-weight: 700; letter-spacing: -1.2px;
    line-height: 1.1;
  }
  .section-sub {
    font-size: 15px; color: var(--muted);
    line-height: 1.6; margin-top: 12px;
  }

  .work-section {
    padding: 100px 0;
    background: var(--bg);
  }
  .work-header {
    margin-bottom: 56px;
  }
  .work-header .grid {
    align-items: end;
  }
  .project-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    cursor: pointer;
    transition: transform var(--transition), border-color var(--transition);
  }
  .project-card:hover {
    transform: translateY(-4px);
    border-color: rgba(255,255,255,0.16);
  }
  .project-thumb {
    width: 100%; aspect-ratio: 16/10;
    display: flex; align-items: center; justify-content: center;
    font-size: 40px; position: relative; overflow: hidden;
  }
  .project-thumb::after {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.3) 100%);
  }
  .project-meta {
    padding: 20px;
  }
  .project-tags {
    display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 10px;
  }
  .tag {
    font-size: 11px; font-weight: 600;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--border);
    color: var(--muted);
    padding: 3px 9px; border-radius: 20px;
    text-transform: uppercase; letter-spacing: 0.5px;
  }
  .project-name {
    font-size: 17px; font-weight: 600;
    margin-bottom: 6px; letter-spacing: -0.3px;
  }
  .project-desc {
    font-size: 13px; color: var(--muted); line-height: 1.55;
  }
  .project-footer {
    padding: 14px 20px;
    border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .project-year { font-size: 12px; color: var(--muted); }
  .project-arrow {
    width: 28px; height: 28px; border-radius: 50%;
    background: rgba(200,255,0,0.1);
    border: 1px solid rgba(200,255,0,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; color: var(--accent);
    transition: background var(--transition), transform var(--transition);
  }
  .project-card:hover .project-arrow {
    background: var(--accent); color: #000;
    transform: rotate(45deg);
  }

  /* Feature project (full 12 cols) */
  .project-card.featured .project-thumb {
    aspect-ratio: 21/9;
  }
  @media (min-width: 641px) {
    .project-card.featured .project-inner {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }
    .project-card.featured .project-thumb {
      aspect-ratio: unset; min-height: 280px;
    }
  }

  /* ── ABOUT ── */
  .about-section {
    padding: 100px 0;
    background: var(--surface);
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
  }
  .about-text { align-self: center; }
  .about-body {
    font-size: 15px; color: var(--muted);
    line-height: 1.8; margin-top: 20px;
  }
  .about-body p + p { margin-top: 16px; }
  .about-skills {
    display: flex; flex-wrap: wrap; gap: 8px; margin-top: 28px;
  }
  .skill-chip {
    font-size: 12px; font-weight: 500;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    padding: 6px 14px; border-radius: 20px;
    transition: background var(--transition), border-color var(--transition);
  }
  .skill-chip:hover {
    background: rgba(200,255,0,0.08);
    border-color: rgba(200,255,0,0.3);
    color: var(--accent);
  }
  .about-image { align-self: start; }
  .about-photo {
    width: 100%; aspect-ratio: 4/5;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    position: relative;
    display: flex; align-items: center; justify-content: center;
  }
  .about-photo-inner {
    display: flex; flex-direction: column; align-items: center;
    gap: 12px; color: var(--muted);
  }
  .photo-avatar {
    width: 80px; height: 80px; border-radius: 50%;
    background: rgba(200,255,0,0.1);
    border: 2px solid rgba(200,255,0,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 32px;
  }
  .experience-card {
    position: absolute; bottom: 20px; right: 20px;
    background: rgba(10,10,10,0.9);
    border: 1px solid var(--border);
    border-radius: 12px; padding: 12px 16px;
    backdrop-filter: blur(12px);
  }
  .exp-num {
    font-size: 26px; font-weight: 700;
    color: var(--accent); letter-spacing: -1px;
  }
  .exp-label {
    font-size: 11px; color: var(--muted);
    text-transform: uppercase; letter-spacing: 0.8px;
  }

  /* ── PROCESS ── */
  .process-section {
    padding: 100px 0;
    background: var(--bg);
  }
  .process-header { margin-bottom: 56px; text-align: center; }
  .process-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 28px;
    transition: border-color var(--transition);
  }
  .process-card:hover { border-color: rgba(200,255,0,0.2); }
  .process-num {
    font-size: 11px; font-weight: 700;
    color: var(--accent); letter-spacing: 2px;
    text-transform: uppercase; margin-bottom: 16px;
  }
  .process-icon {
    font-size: 28px; margin-bottom: 14px;
  }
  .process-title {
    font-size: 16px; font-weight: 600; margin-bottom: 8px;
  }
  .process-body {
    font-size: 13px; color: var(--muted); line-height: 1.65;
  }

  /* ── CONTACT ── */
  .contact-section {
    padding: 100px 0;
    background: var(--surface);
    border-top: 1px solid var(--border);
  }
  .contact-inner { align-items: center; }
  .contact-form {
    display: flex; flex-direction: column; gap: 16px;
    margin-top: 32px;
  }
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  @media (max-width: 640px) {
    .form-row { grid-template-columns: 1fr; }
  }
  .form-input {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 13px 16px;
    font-size: 14px; font-family: var(--font);
    color: var(--text);
    width: 100%;
    transition: border-color var(--transition);
    outline: none;
  }
  .form-input::placeholder { color: var(--muted); }
  .form-input:focus { border-color: rgba(200,255,0,0.4); }
  textarea.form-input { resize: vertical; min-height: 120px; }
  .contact-info {
    align-self: center;
  }
  .contact-links {
    display: flex; flex-direction: column; gap: 14px; margin-top: 28px;
  }
  .contact-link {
    display: flex; align-items: center; gap: 12px;
    font-size: 14px; color: var(--muted);
    text-decoration: none;
    transition: color var(--transition);
  }
  .contact-link:hover { color: var(--text); }
  .contact-link-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    transition: background var(--transition);
  }
  .contact-link:hover .contact-link-icon {
    background: rgba(200,255,0,0.1);
    border-color: rgba(200,255,0,0.3);
  }

  /* ── FOOTER ── */
  .footer {
    background: var(--bg);
    border-top: 1px solid var(--border);
    padding: 32px 0;
  }
  .footer .container {
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px;
  }
  .footer-copy { font-size: 13px; color: var(--muted); }
  .footer-links {
    display: flex; gap: 24px; list-style: none;
  }
  .footer-links a {
    font-size: 13px; color: var(--muted);
    text-decoration: none;
    transition: color var(--transition);
  }
  .footer-links a:hover { color: var(--text); }
`;

/* ─────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────── */
const projects = [
  {
    id: 1,
    emoji: "💳",
    color: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    name: "Fintech Dashboard",
    tags: ["UI/UX", "Design System"],
    desc: "End-to-end redesign of a financial analytics platform. Reduced task completion time by 38%.",
    year: "2025",
    featured: false,
  },
  {
    id: 2,
    emoji: "🛍️",
    color: "linear-gradient(135deg, #1a0533, #3d1a78, #6b21a8)",
    name: "E-Commerce Rebrand",
    tags: ["Brand", "UX Research"],
    desc: "Full brand and UX overhaul for a DTC fashion label. Conversion rate increased by 22%.",
    year: "2024",
    featured: false,
  },
  {
    id: 3,
    emoji: "📱",
    color: "linear-gradient(135deg, #052e16, #166534, #16a34a)",
    name: "Mobile Banking App",
    tags: ["Product Design", "iOS"],
    desc: "Designing a zero-friction mobile banking experience from concept to handoff.",
    year: "2024",
    featured: false,
  },
  {
    id: 4,
    emoji: "🧠",
    color: "linear-gradient(135deg, #1e1b4b, #312e81, #4338ca)",
    name: "AI Content Platform",
    tags: ["SaaS", "UX Strategy"],
    desc: "Designed a complex AI writing tool, making powerful features feel effortless for non-technical users.",
    year: "2023",
    featured: true,
  },
];

const processSteps = [
  { num: "01", icon: "🔍", title: "Discover", body: "I start with stakeholder interviews, competitive analysis, and user research to build a solid problem foundation." },
  { num: "02", icon: "💡", title: "Define", body: "Synthesis of insights into clear personas, journey maps, and a focused design brief with measurable goals." },
  { num: "03", icon: "✏️", title: "Design", body: "Rapid sketching, wireframes, and iterative high-fidelity prototypes validated with real users at each step." },
  { num: "04", icon: "🚀", title: "Deliver", body: "Pixel-perfect specs, annotated component library, and close collaboration with engineers through launch." },
];

const skills = ["Figma", "FigJam", "Prototyping", "User Research", "Usability Testing", "Design Systems", "HTML / CSS", "Motion Design", "Accessibility", "Design Tokens", "Workshop Facilitation", "Interaction Design"];

/* ─────────────────────────────────────────────
   COMPONENT
   ───────────────────────────────────────────── */
export default function Portfolio() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{css}</style>

      {/* ── NAVIGATION ── */}
      <nav className="nav full-bleed">
        <div className="container">
          <a href="#" className="nav-logo">farnaz<span>.</span></a>
          <ul className="nav-links">
            {["Work", "About", "Process", "Contact"].map((l) => (
              <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
            ))}
          </ul>
          <a href="#contact" className="nav-cta">Let's talk →</a>
          <button
            className={`hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <ul>
          {["Work", "About", "Process", "Contact"].map((l) => (
            <li key={l}><a href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)}>{l}</a></li>
          ))}
        </ul>
        <a href="#contact" className="mob-cta" onClick={() => setMenuOpen(false)}>Let's talk →</a>
      </div>

      {/* ── HERO ── */}
      <section id="hero" className="full-bleed hero-section">
        <div className="container">
          <div className="grid" style={{ alignItems: "center" }}>

            {/* Left: copy — 7 cols desktop, 12 mobile */}
            <div className="col-7">
              <div className="hero-eyebrow">Available for freelance</div>
              <h1 className="hero-title">
                Designing <em>digital</em><br />
                experiences that<br />
                actually work.
              </h1>
              <p className="hero-subtitle">
                I'm Farnaz — a UI/UX designer crafting purposeful interfaces where clarity meets delight.
                From research to pixels, I make complexity feel simple.
              </p>
              <div className="hero-actions">
                <a href="#work" className="btn-primary">View my work</a>
                <a href="#contact" className="btn-ghost">Get in touch</a>
              </div>
            </div>

            {/* Right: mock UI — 5 cols desktop, hidden becomes full-width */}
            <div className="col-5 hero-media">
              <div className="hero-card">
                <div className="hero-card-header">
                  <div className="dot" style={{ background: "#ff5f57" }} />
                  <div className="dot" style={{ background: "#febc2e" }} />
                  <div className="dot" style={{ background: "#28c840" }} />
                  <span style={{ marginLeft: 8, fontSize: 12, color: "var(--muted)" }}>dashboard.app</span>
                </div>
                <div className="hero-screen">
                  <div className="mock-bar accent" />
                  <div className="mock-bar" style={{ width: "80%" }} />
                  <div className="mock-bar short" />
                  <div className="mock-row">
                    <div className="mock-block highlight" />
                    <div className="mock-block" />
                    <div className="mock-block" />
                    <div className="mock-block highlight" />
                  </div>
                  <div className="mock-bar" style={{ width: "70%", marginTop: 8 }} />
                  <div className="mock-bar short" />
                </div>
              </div>
              <div className="hero-badge">
                <div className="badge-icon">🎯</div>
                <div className="badge-text">
                  <strong>+38% Task Efficiency</strong>
                  <span>Fintech Dashboard, 2025</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="full-bleed stats-section">
        <div className="container">
          <div className="grid" style={{ alignItems: "center" }}>
            {[
              { num: "5+", label: "Years Experience" },
              null,
              { num: "40+", label: "Projects Shipped" },
              null,
              { num: "12", label: "Happy Clients" },
              null,
              { num: "3", label: "Design Awards" },
            ].map((item, i) =>
              item === null ? (
                <hr key={i} className="stat-divider col-1" style={{ display: "none" }} />
              ) : (
                <div key={i} className="stat-item col-3 mob-6">
                  <div className="stat-num">{item.num}</div>
                  <div className="stat-label">{item.label}</div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── SELECTED WORK ── */}
      <section id="work" className="full-bleed work-section">
        <div className="container">
          <div className="work-header">
            <div className="grid">
              <div className="col-6">
                <div className="section-eyebrow">Selected Work</div>
                <h2 className="section-title">Projects I'm proud of.</h2>
              </div>
              <div className="col-6" style={{ textAlign: "right", alignSelf: "end" }}>
                <a href="#" className="btn-ghost" style={{ fontSize: 13 }}>View all projects →</a>
              </div>
            </div>
          </div>

          {/* Featured project — 12 cols */}
          {projects.filter(p => p.featured).map(p => (
            <div key={p.id} className="project-card featured col-12" style={{ marginBottom: "var(--gutter)" }}>
              <div className="project-inner">
                <div className="project-thumb" style={{ background: p.color, fontSize: 56 }}>
                  {p.emoji}
                </div>
                <div style={{ padding: "32px" }}>
                  <div className="project-tags">
                    {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    <span className="tag" style={{ background: "rgba(200,255,0,0.08)", borderColor: "rgba(200,255,0,0.2)", color: "var(--accent)" }}>Featured</span>
                  </div>
                  <div className="project-name" style={{ fontSize: 22, marginBottom: 10 }}>{p.name}</div>
                  <div className="project-desc" style={{ fontSize: 15, lineHeight: 1.7 }}>{p.desc}</div>
                  <div style={{ marginTop: 24 }}>
                    <a href="#" className="btn-primary" style={{ fontSize: 13 }}>View case study →</a>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Regular project cards — 4 cols each (3 per row) */}
          <div className="grid">
            {projects.filter(p => !p.featured).map(p => (
              <div key={p.id} className="col-4 project-card">
                <div className="project-thumb" style={{ background: p.color }}>
                  <span style={{ fontSize: 48 }}>{p.emoji}</span>
                </div>
                <div className="project-meta">
                  <div className="project-tags">
                    {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <div className="project-name">{p.name}</div>
                  <div className="project-desc">{p.desc}</div>
                </div>
                <div className="project-footer">
                  <span className="project-year">{p.year}</span>
                  <div className="project-arrow">↗</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="full-bleed about-section">
        <div className="container">
          <div className="grid about-inner" style={{ alignItems: "center", gap: "var(--gutter)" }}>

            {/* Text — 6 cols */}
            <div className="col-6 about-text">
              <div className="section-eyebrow">About Me</div>
              <h2 className="section-title">Design that bridges<br />empathy & precision.</h2>
              <div className="about-body">
                <p>
                  I'm a product designer with 5+ years crafting digital experiences across fintech,
                  e-commerce, and SaaS. I believe great design is the result of deep empathy,
                  rigorous thinking, and an obsessive attention to detail.
                </p>
                <p>
                  My work lives at the intersection of research and craft — I'm equally comfortable
                  running user interviews as I am building a design system from scratch.
                </p>
              </div>
              <div className="about-skills">
                {skills.map(s => (
                  <span key={s} className="skill-chip">{s}</span>
                ))}
              </div>
              <div style={{ marginTop: 32 }}>
                <a href="#" className="btn-ghost" style={{ fontSize: 13 }}>Download résumé ↓</a>
              </div>
            </div>

            {/* Photo — 5 cols, offset 1 */}
            <div className="col-5" style={{ gridColumn: "span 5", marginLeft: "auto" }}>
              <div className="about-photo">
                <div className="about-photo-inner">
                  <div className="photo-avatar">👤</div>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>Your photo here</span>
                </div>
                <div className="experience-card">
                  <div className="exp-num">5+</div>
                  <div className="exp-label">Years of Experience</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section id="process" className="full-bleed process-section">
        <div className="container">
          <div className="process-header">
            <div className="section-eyebrow">How I Work</div>
            <h2 className="section-title">My design process.</h2>
            <p className="section-sub" style={{ maxWidth: 480, margin: "12px auto 0" }}>
              A proven framework that turns fuzzy problems into clear, shipped solutions.
            </p>
          </div>
          <div className="grid">
            {processSteps.map(s => (
              <div key={s.num} className="col-3 process-card">
                <div className="process-num">{s.num}</div>
                <div className="process-icon">{s.icon}</div>
                <div className="process-title">{s.title}</div>
                <div className="process-body">{s.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="full-bleed contact-section">
        <div className="container">
          <div className="grid contact-inner">

            {/* Info — 4 cols */}
            <div className="col-4 contact-info">
              <div className="section-eyebrow">Contact</div>
              <h2 className="section-title">Let's build something great.</h2>
              <p className="section-sub" style={{ marginTop: 12 }}>
                Open to freelance projects, full-time roles, and interesting conversations.
              </p>
              <div className="contact-links">
                {[
                  { icon: "✉️", label: "farnazgh4444@gmail.com", href: "mailto:farnazgh4444@gmail.com" },
                  { icon: "💼", label: "linkedin.com/in/farnaz", href: "#" },
                  { icon: "🐦", label: "@farnaz_designs", href: "#" },
                ].map(l => (
                  <a key={l.label} href={l.href} className="contact-link">
                    <div className="contact-link-icon">{l.icon}</div>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Spacer — 1 col */}
            <div className="col-1" style={{ display: "none" }} />

            {/* Form — 7 cols */}
            <div className="col-7">
              <form className="contact-form" onSubmit={e => e.preventDefault()}>
                <div className="form-row">
                  <input className="form-input" placeholder="Your name" type="text" />
                  <input className="form-input" placeholder="Your email" type="email" />
                </div>
                <input className="form-input" placeholder="Subject" type="text" />
                <textarea className="form-input" placeholder="Tell me about your project..." />
                <div>
                  <button type="submit" className="btn-primary">Send message →</button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="full-bleed footer">
        <div className="container">
          <span className="footer-copy">© 2025 Farnaz. All rights reserved.</span>
          <ul className="footer-links">
            {["Work", "About", "Process", "Contact"].map(l => (
              <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
            ))}
          </ul>
        </div>
      </footer>

    </div>
  );
}
