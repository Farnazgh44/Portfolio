/**
 * ProjectDetailPage — generic placeholder used by all 5 project routes.
 * Each project passes its own data; you can replace the body with a full
 * case-study layout whenever you're ready.
 */
import { useRouter } from "../lib/router-context"
import { SideBlobs } from "../components/side-blobs"
import { Footer }    from "../components/footer"

/* ─── Per-project data (logos, colours, tools, etc.) ───────────────────────── */
const TOOL_ICONS = {
  Figma:           "/images/toolkit-figma.png",
  Photoshop:       "/images/toolkit-photoshop.png",
  Illustrator:     "/images/toolkit-illustrator.png",
  InDesign:        "/images/toolkit-indesign.png",
  "After Effects": "/images/toolkit-aftereffects.png",
  Canva:           "/images/toolkit-canva.png",
  "VS Code":       "/images/toolkit-vscode.png",
  Dimension:       "/images/toolkit-dimension.png",
  Tinkercad:       "/images/toolkit-tinkercad.png",
  Maze:            "/images/toolkit-maze.png",
}

export const PROJECT_DATA = {
  "project-sugarcloud": {
    logo:        "/images/SugarcloudLogo.png",
    nameScript:  "SugarCloud",
    namePlain:   "Cupcakes",
    category:    "UI/UX & Product Design",
    image:       "/images/Laptop_Feature.png",
    tools:       ["Figma", "Photoshop", "Illustrator"],
    accent:      "#e879a0",
  },
  "project-alpine": {
    logo:        "/images/AlpineLogo.png",
    logoHeight:  "clamp(68px, 8.5vw, 108px)",
    name:        "AlpineLink",
    nameStyle:   "upper",
    category:    "UI/UX & Product Design",
    image:       "/images/Phone1_feature.png",
    tools:       ["Figma", "After Effects"],
    accent:      "#60a5fa",
  },
  "project-reddit": {
    logo:        null,
    name:        "Reddit Redesign",
    category:    "Mobile App Design",
    image:       "/images/Phone2_feature.png",
    tools:       ["Figma", "Photoshop"],
    accent:      "#f97316",
  },
  "project-cat-holder": {
    logo:        null,
    name:        "Cat Phone Holder",
    category:    "3D Design",
    image:       "/images/Cat_feature.png",
    tools:       ["Tinkercad"],
    accent:      "#a78bfa",
  },
  "project-perfume": {
    logo:        null,
    name:        "3D Perfume Bottle",
    category:    "Product Visualisation",
    image:       "/images/Perfume_featured.png",
    tools:       ["Dimension", "Photoshop"],
    accent:      "#f0abfc",
  },
}

/* ─── Tool chip ─────────────────────────────────────────────────────────────── */
function ToolChip({ toolName }) {
  const icon = TOOL_ICONS[toolName]
  return (
    <div style={{
      display:              "flex",
      alignItems:           "center",
      gap:                  "8px",
      padding:              "8px 16px 8px 10px",
      borderRadius:         "12px",
      background:           "rgba(255,255,255,0.09)",
      backdropFilter:       "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      border:               "1px solid rgba(255,255,255,0.16)",
    }}>
      {icon && (
        <img src={icon} alt={toolName}
          style={{ width: 24, height: 24, objectFit: "contain" }} />
      )}
      <span style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.85rem", fontWeight: 500 }}>
        {toolName}
      </span>
    </div>
  )
}

/* ─── Project name rendering ────────────────────────────────────────────────── */
function ProjectName({ project, accentColor }) {
  if (project.nameScript) {
    return (
      <h1 style={{ margin: 0, lineHeight: 1.1, textAlign: "center" }}>
        <span style={{
          fontFamily:   "'Dancing Script', cursive",
          fontSize:     "clamp(2.2rem, 5vw, 4rem)",
          fontWeight:   600,
          color:        "#fff",
          letterSpacing:"0.01em",
        }}>
          {project.nameScript}
        </span>
        {" "}
        <span style={{
          fontSize:     "clamp(1.9rem, 4.2vw, 3.4rem)",
          fontWeight:   600,
          color:        "#fff",
          letterSpacing:"0.02em",
        }}>
          {project.namePlain}
        </span>
      </h1>
    )
  }
  return (
    <h1 style={{
      margin:        0,
      color:         "#fff",
      fontSize:      "clamp(2rem, 4.5vw, 3.6rem)",
      fontWeight:    700,
      letterSpacing: project.nameStyle === "upper" ? "0.12em" : "0.02em",
      textTransform: project.nameStyle === "upper" ? "uppercase" : "none",
      textAlign:     "center",
    }}>
      {project.name}
    </h1>
  )
}

/* ─── Main component ────────────────────────────────────────────────────────── */
export function ProjectDetailPage({ projectId }) {
  const { navigate } = useRouter()
  const project = PROJECT_DATA[projectId]

  /* Safety fallback — shouldn't happen */
  if (!project) {
    return (
      <div style={{ color: "#fff", padding: 60, textAlign: "center" }}>
        <p>Project not found.</p>
        <button onClick={() => navigate("projects")}
          style={{ color: "#fff", cursor: "pointer", marginTop: 20, background: "transparent", border: "1px solid #fff", padding: "10px 24px", borderRadius: 8 }}>
          ← Back
        </button>
      </div>
    )
  }

  return (
    <>
      <main style={{ minHeight: "100vh", position: "relative" }}>
        <SideBlobs />

        {/* ── Back button ── */}
        <button
          onClick={() => navigate("projects")}
          className="left-4 md:left-8 3xl:left-20"
          style={{
            position:             "fixed",
            top:                  "24px",
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
            letterSpacing:        "0.04em",
            transition:           "background 0.2s ease",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.10)"}
        >
          ← Back
        </button>

        {/* ── Hero section ── */}
        <section style={{
          minHeight:      "100vh",
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          justifyContent: "center",
          padding:        "120px clamp(24px, 8vw, 120px) 80px",
          gap:            "0",
        }}>
          {/* Logo */}
          {project.logo && (
            <img
              src={project.logo}
              alt="logo"
              style={{
                height:       project.logoHeight ?? "clamp(70px, 9vw, 110px)",
                width:        "auto",
                maxWidth:     "80%",
                objectFit:    "contain",
                marginBottom: "24px",
                filter:       "drop-shadow(0 4px 16px rgba(0,0,0,0.3))",
              }}
            />
          )}

          {/* Project name */}
          <ProjectName project={project} accentColor={project.accent} />

          {/* Category badge */}
          <div style={{
            marginTop:            "16px",
            padding:              "6px 20px",
            borderRadius:         "999px",
            background:           `${project.accent}22`,
            border:               `1px solid ${project.accent}55`,
            color:                project.accent,
            fontSize:             "0.82rem",
            fontWeight:           600,
            letterSpacing:        "0.08em",
            textTransform:        "uppercase",
          }}>
            {project.category}
          </div>

          {/* Tools */}
          <div style={{
            display:   "flex",
            gap:       "10px",
            flexWrap:  "wrap",
            justifyContent: "center",
            marginTop: "28px",
          }}>
            {project.tools.map(t => <ToolChip key={t} toolName={t} />)}
          </div>

          {/* Hero image */}
          <div style={{
            marginTop:            "56px",
            width:                "clamp(320px, 72vw, 1000px)",
            borderRadius:         "24px",
            overflow:             "hidden",
            background:           "rgba(255,255,255,0.06)",
            backdropFilter:       "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border:               "1px solid rgba(255,255,255,0.14)",
            boxShadow:            `0 32px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.06)`,
          }}>
            <img
              src={project.image}
              alt={project.name || project.nameScript}
              style={{
                width:      "100%",
                display:    "block",
                objectFit:  "contain",
                maxHeight:  "70vh",
              }}
            />
          </div>

          {/* Coming soon placeholder ── replace this section with case study content */}
          <div style={{
            marginTop:            "72px",
            width:                "clamp(320px, 62vw, 820px)",
            padding:              "48px clamp(24px, 5vw, 64px)",
            borderRadius:         "24px",
            background:           "rgba(255,255,255,0.05)",
            backdropFilter:       "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border:               "1px solid rgba(255,255,255,0.10)",
            textAlign:            "center",
          }}>
            {/* Animated ring */}
            <div style={{
              width:        "64px",
              height:       "64px",
              borderRadius: "50%",
              border:       `2px solid ${project.accent}44`,
              borderTop:    `2px solid ${project.accent}`,
              margin:       "0 auto 24px",
              animation:    "spin 1.8s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

            <p style={{
              margin:        "0 0 10px",
              color:         "rgba(255,255,255,0.85)",
              fontSize:      "clamp(1.1rem, 1.8vw, 1.4rem)",
              fontWeight:    600,
              letterSpacing: "0.02em",
            }}>
              Case Study Coming Soon
            </p>
            <p style={{
              margin:     0,
              color:      "rgba(255,255,255,0.45)",
              fontSize:   "0.9rem",
              lineHeight: 1.7,
              maxWidth:   "480px",
              margin:     "0 auto",
            }}>
              The full project breakdown — research, design decisions,
              prototypes, and outcomes — will be added here shortly.
            </p>
          </div>

          <div style={{ height: "80px" }} />
        </section>
      </main>
      <Footer />
    </>
  )
}
