/* ─── Lava Lamp Blobs ───
   Crisp, solid blobs spread across entire screen.
   Positioned behind main content (z-0) but in front of background.
   ─── */
export function SideBlobs() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
    >
      {/* Top left area */}
      <div
        className="absolute w-8 h-8 opacity-60"
        style={{
          top: "8%",
          left: "6%",
          background: "#a855f7",
          borderRadius: "50%",
          animation: "lava-float-1 18s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-12 h-12 opacity-50"
        style={{
          top: "15%",
          left: "10%",
          background: "#ec4899",
          borderRadius: "50%",
          animation: "lava-float-2 22s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-6 h-6 opacity-55"
        style={{
          top: "22%",
          left: "4%",
          background: "#8b5cf6",
          borderRadius: "50%",
          animation: "lava-float-3 15s ease-in-out infinite",
        }}
      />

      {/* Top center-left */}
      <div
        className="absolute w-5 h-5 opacity-45"
        style={{
          top: "5%",
          left: "25%",
          background: "#f472b6",
          borderRadius: "50%",
          animation: "lava-float-4 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-10 h-10 opacity-40"
        style={{
          top: "12%",
          left: "35%",
          background: "#c084fc",
          borderRadius: "50%",
          animation: "lava-float-1 25s ease-in-out infinite reverse",
        }}
      />

      {/* Top right area */}
      <div
        className="absolute w-14 h-14 opacity-50"
        style={{
          top: "6%",
          right: "8%",
          background: "#a855f7",
          borderRadius: "50%",
          animation: "lava-float-5 19s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-7 h-7 opacity-55"
        style={{
          top: "18%",
          right: "15%",
          background: "#ec4899",
          borderRadius: "50%",
          animation: "lava-float-2 16s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute w-5 h-5 opacity-45"
        style={{
          top: "10%",
          right: "25%",
          background: "#f472b6",
          borderRadius: "50%",
          animation: "lava-float-3 21s ease-in-out infinite",
        }}
      />

      {/* Middle left side */}
      <div
        className="absolute w-10 h-10 opacity-50"
        style={{
          top: "40%",
          left: "3%",
          background: "#c084fc",
          borderRadius: "50%",
          animation: "lava-float-4 24s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-6 h-6 opacity-55"
        style={{
          top: "55%",
          left: "8%",
          background: "#f472b6",
          borderRadius: "50%",
          animation: "lava-float-5 17s ease-in-out infinite reverse",
        }}
      />

      {/* Middle center area */}
      <div
        className="absolute w-4 h-4 opacity-35"
        style={{
          top: "45%",
          left: "40%",
          background: "#a855f7",
          borderRadius: "50%",
          animation: "lava-float-1 28s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-6 h-6 opacity-30"
        style={{
          top: "35%",
          right: "45%",
          background: "#ec4899",
          borderRadius: "50%",
          animation: "lava-float-2 30s ease-in-out infinite reverse",
        }}
      />

      {/* Middle right side */}
      <div
        className="absolute w-9 h-9 opacity-50"
        style={{
          top: "42%",
          right: "5%",
          background: "#8b5cf6",
          borderRadius: "50%",
          animation: "lava-float-3 23s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-5 h-5 opacity-45"
        style={{
          top: "58%",
          right: "12%",
          background: "#c084fc",
          borderRadius: "50%",
          animation: "lava-float-4 19s ease-in-out infinite reverse",
        }}
      />

      {/* Bottom left area */}
      <div
        className="absolute w-11 h-11 opacity-50"
        style={{
          bottom: "15%",
          left: "5%",
          background: "#a855f7",
          borderRadius: "50%",
          animation: "lava-float-5 21s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-6 h-6 opacity-55"
        style={{
          bottom: "25%",
          left: "12%",
          background: "#ec4899",
          borderRadius: "50%",
          animation: "lava-float-1 18s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute w-4 h-4 opacity-40"
        style={{
          bottom: "8%",
          left: "20%",
          background: "#f472b6",
          borderRadius: "50%",
          animation: "lava-float-2 26s ease-in-out infinite",
        }}
      />

      {/* Bottom center */}
      <div
        className="absolute w-8 h-8 opacity-35"
        style={{
          bottom: "10%",
          left: "45%",
          background: "#c084fc",
          borderRadius: "50%",
          animation: "lava-float-3 24s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute w-5 h-5 opacity-40"
        style={{
          bottom: "20%",
          right: "40%",
          background: "#8b5cf6",
          borderRadius: "50%",
          animation: "lava-float-4 27s ease-in-out infinite",
        }}
      />

      {/* Bottom right area */}
      <div
        className="absolute w-12 h-12 opacity-50"
        style={{
          bottom: "12%",
          right: "6%",
          background: "#ec4899",
          borderRadius: "50%",
          animation: "lava-float-5 20s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute w-7 h-7 opacity-55"
        style={{
          bottom: "28%",
          right: "10%",
          background: "#a855f7",
          borderRadius: "50%",
          animation: "lava-float-1 16s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-4 h-4 opacity-45"
        style={{
          bottom: "5%",
          right: "22%",
          background: "#f472b6",
          borderRadius: "50%",
          animation: "lava-float-2 22s ease-in-out infinite reverse",
        }}
      />

      {/* Extra scattered small blobs for more liquid feel */}
      <div
        className="absolute w-3 h-3 opacity-40"
        style={{
          top: "30%",
          left: "18%",
          background: "#c084fc",
          borderRadius: "50%",
          animation: "lava-float-3 32s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-3 h-3 opacity-35"
        style={{
          top: "65%",
          left: "30%",
          background: "#8b5cf6",
          borderRadius: "50%",
          animation: "lava-float-4 28s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute w-4 h-4 opacity-40"
        style={{
          top: "75%",
          right: "35%",
          background: "#ec4899",
          borderRadius: "50%",
          animation: "lava-float-5 25s ease-in-out infinite",
        }}
      />
      <div
        className="absolute w-3 h-3 opacity-35"
        style={{
          top: "25%",
          right: "30%",
          background: "#a855f7",
          borderRadius: "50%",
          animation: "lava-float-1 30s ease-in-out infinite reverse",
        }}
      />
    </div>
  )
}
