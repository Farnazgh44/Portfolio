import { useRouter }  from "../lib/router-context"
import { BlobButton } from "./blob-button"

// 5 projects — sized large enough that all 5 together span wider than the
// viewport, so you never see the same card twice on screen at once.
const allProjects = [
  { id: "1", name: "SugarCloud Cupcakes", tools: "UI/UX & Product Design",     image: "/images/Laptop_Feature.png",    imageStyle: { objectFit: "contain" }                   },
  { id: "2", name: "AlpineLink",          tools: "Mobile App Design",           image: "/images/Phone1_feature.png",    imageStyle: { objectFit: "contain" }                   },
  { id: "3", name: "Reddit App Redesign", tools: "Mobile App Design",           image: "/images/Phone2_feature.png",    imageStyle: { objectFit: "contain" }                   },
  { id: "4", name: "Dogwood Land & Gardening", tools: "Web Design & UX Case Study", image: "/images/Dogwood.png",        imageStyle: { objectFit: "cover" }                     },
  { id: "5", name: "Space Shipper",       tools: "Game UI",                     image: "/images/Game.png",              imageStyle: { objectFit: "cover" }                     },
]

function ProjectCard({ project }) {
  return (
    <a href={`#project-${project.id}`} className="block shrink-0 group mr-4 sm:mr-5 md:mr-6">
      <div
        className="w-52 h-52 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 overflow-hidden relative cursor-pointer rounded-2xl"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        {/* Video card */}
        {project.video ? (
          <video
            src={project.video}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full"
            style={{ objectFit: "cover", display: "block" }}
          />
        ) : (
          /* Image card */
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full"
            style={{ objectFit: "cover", ...project.imageStyle }}
          />
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
          style={{
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(8px)",
          }}
        >
          <p className="text-white font-semibold text-base mb-1">{project.name}</p>
          <p className="text-white/60 text-sm text-center px-4">{project.tools}</p>
        </div>
      </div>
    </a>
  )
}

function InfiniteRow({ projects, direction }) {
  // Double the array so the seamless loop has enough content
  const doubled = [...projects, ...projects]

  return (
    <div className="overflow-hidden w-full">
      <div
        className={`flex ${direction === "left" ? "animate-scroll-left" : "animate-scroll-right"}`}
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

      <div className="relative z-10 text-center mt-16">
        <BlobButton
          onClick={() => navigate("projects")}
          className="pill-btn-hover inline-block px-8 py-2.5 rounded-full text-sm font-medium text-white/80 cursor-pointer"
          style={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          All Projects
        </BlobButton>
      </div>
    </section>
  )
}
