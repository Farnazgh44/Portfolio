import { cn } from "../lib/utils"

export function GlassCard({ children, className, intensity = "medium", ...props }) {
  const intensityStyles = {
    light: "bg-white/5 backdrop-blur-md border-white/10",
    medium: "bg-white/10 backdrop-blur-xl border-white/15",
    strong: "bg-white/15 backdrop-blur-2xl border-white/20",
  }

  return (
    <div
      className={cn(
        "rounded-2xl border shadow-lg",
        intensityStyles[intensity],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
