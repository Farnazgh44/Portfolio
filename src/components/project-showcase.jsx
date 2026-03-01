import { useRouter } from "../lib/router-context"
import { GlassCard } from "./glass-card"

const allProjects = [
  { id: "1", name: "Phone Holder", tools: "3D Printing, Tinkercad", image: "/images/project-phone-holder.png", imageStyle: { transform: "scale(1.15)", objectPosition: "center center" } },
  { id: "2", name: "AlpineLink App", tools: "Figma, Photoshop, Illustrator", image: "/images/project-alpinelink.png", imageStyle: { objectPosition: "center 60%" } },
  { id: "3", name: "Reddit Redesign", tools: "Figma, Photoshop", image: "/images/project-reddit.png", imageStyle: {} },
  { id: "4", name: "Stylized Portrait", tools: "Illustrator", image: "/images/project-stylized-portrait.png", imageStyle: { transform: "scale(0.85)", objectPosition: "center center" } },
  { id: "5", name: "Saadi Stationery", tools: "Figma, Photoshop, Illustrator, Maze", image: "/images/project-saadi-stationery.png", imageStyle: {} },
  { id: "6", name: "Seattle Vector", tools: "Illustrator", image: "/images/project-seattle-vector.png", imageStyle: { objectPosition: "center bottom" } },
  { id: "7", name: "SugarCloud Cupcakes", tools: "Figma, Photoshop, Illustrator", image: "/images/project-sugarcloud.png", imageStyle: {} },
  { id: "8", name: "3D Lighthouse", tools: "Project Neo", image: "/images/project-3d-lighthouse.png", imageStyle: {} },
  { id: "9", name: "3D Perfume", tools: "Adobe Dimension, Maya", image: "/images/project-3d-perfume.png", imageStyle: { objectPosition: "center center" } },
  { id: "10", name: "Craigslist Redesign", tools: "Figma, Photoshop, Illustrator", image: "/images/project-craigslist.png", imageStyle: {} },
]

function ProjectCard({ project }) {
  return (
    <a href={`#project-${project.id}`} className="block shrink-0 group">
      <div
        className="w-28 h-28 sm:w-44 sm:h-44 md:w-56 md:h-56 overflow-hidden relative cursor-pointer rounded-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover"
          style={project.imageStyle || {}}
        />

        <div
          className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
          }}
        >
          <p className="text-white font-semibold text-sm mb-1">{project.name}</p>
          <p className="text-white/60 text-xs text-center px-3">{project.tools}</p>
        </div>
      </div>
    </a>
  )
}

function InfiniteRow({ projects, direction }) {
  const doubled = [...projects, ...projects]

  return (
    <div className="overflow-hidden w-full">
      <div
        className={`flex gap-2 sm:gap-3 ${direction === "left" ? "animate-scroll-left" : "animate-scroll-right"}`}
        style={{ width: "max-content" }}
      >
        {doubled.map((project, i) => (
          <ProjectCard key={`${project.id}-${i}`} project={project} />
        ))}
      </div>
    </div>
  )
}

export function ProjectShowcase() {
  const { navigate } = useRouter()

  return (
    <section className="relative py-16 overflow-hidden" id="all-projects">
      {/* Subtle lava blobs behind project rows */}
      <div
        className="absolute w-36 h-36 opacity-20 blur-[45px] pointer-events-none"
        style={{
          top: "10%",
          left: "5%",
          background: "var(--blob-1)",
          borderRadius: "50% 40% 60% 50%",
          animation: "blob-float-3 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-28 h-28 opacity-15 blur-[40px] pointer-events-none"
        style={{
          top: "60%",
          right: "8%",
          background: "var(--blob-4)",
          borderRadius: "40% 60% 50% 50%",
          animation: "blob-float-5 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-24 h-24 opacity-20 blur-[35px] pointer-events-none"
        style={{
          bottom: "15%",
          left: "40%",
          background: "var(--blob-3)",
          borderRadius: "60% 40% 50% 50%",
          animation: "blob-float-2 20s ease-in-out infinite",
        }}
      />

      <div className="relative z-10 flex flex-col gap-6 mb-8">
        <InfiniteRow projects={allProjects} direction="left" />
      </div>

      <div className="relative z-10 text-center mt-8">
        <button
          onClick={() => navigate("projects")}
          className="pill-btn-hover inline-block px-8 py-2.5 rounded-full text-sm font-medium text-white/80 cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          All Projects
        </button>
      </div>
    </section>
  )
}
