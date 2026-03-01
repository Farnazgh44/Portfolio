import { useTheme } from "../lib/theme-context"

export function LavaBackground() {
  const { theme } = useTheme()

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div
        className="absolute inset-0 transition-all duration-1000 ease-in-out"
        style={{
          background: `linear-gradient(135deg, ${theme.gradient1} 0%, ${theme.gradient2} 50%, ${theme.gradient3} 100%)`,
        }}
      />

      {/* Lava blobs */}
      <div
        className="absolute w-[500px] h-[500px] opacity-70 blur-[80px]"
        style={{
          background: theme.blob1,
          top: "10%",
          left: "15%",
          animation: "blob-float-1 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] opacity-60 blur-[70px]"
        style={{
          background: theme.blob2,
          top: "50%",
          right: "10%",
          animation: "blob-float-2 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[350px] h-[350px] opacity-50 blur-[60px]"
        style={{
          background: theme.blob3,
          bottom: "10%",
          left: "30%",
          animation: "blob-float-3 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] opacity-60 blur-[65px]"
        style={{
          background: theme.blob4,
          top: "30%",
          left: "60%",
          animation: "blob-float-4 28s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-[450px] h-[450px] opacity-50 blur-[75px]"
        style={{
          background: theme.blob5,
          bottom: "30%",
          right: "25%",
          animation: "blob-float-5 24s ease-in-out infinite",
        }}
      />
    </div>
  )
}
