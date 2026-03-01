import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

/* ────────────────────────────────────────────
   Lava-lamp style intro blobs.
   Uses the SAME technique as lava-background.jsx:
   CSS blur + opacity + border-radius keyframes.
   
   Phase 1: Blobs clustered in loose formation (center area)
   Phase 2: Blobs separate & scatter across the full screen  
   Phase 3: Fade out to reveal the homepage hero
   ──────────────────────────────────────────── */

const INTRO_BLOBS = [
  /* Large blobs - main cluster */
  {
    id: 0,
    p1: { x: "35%", y: "25%", w: 420, h: 420 },
    p2: { x: "5%",  y: "5%",  w: 500, h: 500 },
    color: "linear-gradient(135deg, #7B2FBE, #4A90D9, #2DD4A8)",
    blur: 70, opacity: 0.75, anim: "blob-float-1",
    delay: 0, dur: 18,
  },
  {
    id: 1,
    p1: { x: "48%", y: "20%", w: 350, h: 350 },
    p2: { x: "65%", y: "2%",  w: 380, h: 380 },
    color: "linear-gradient(135deg, #A855F7, #6366F1, #38BDF8)",
    blur: 65, opacity: 0.7, anim: "blob-float-2",
    delay: 0.15, dur: 22,
  },
  {
    id: 2,
    p1: { x: "30%", y: "40%", w: 480, h: 480 },
    p2: { x: "15%", y: "55%", w: 520, h: 520 },
    color: "linear-gradient(135deg, #C026D3, #7C3AED, #60A5FA)",
    blur: 80, opacity: 0.65, anim: "blob-float-3",
    delay: 0.1, dur: 20,
  },
  {
    id: 3,
    p1: { x: "55%", y: "38%", w: 300, h: 300 },
    p2: { x: "72%", y: "60%", w: 360, h: 360 },
    color: "linear-gradient(135deg, #DB2777, #9333EA, #4F46E5)",
    blur: 60, opacity: 0.7, anim: "blob-float-4",
    delay: 0.2, dur: 24,
  },
  {
    id: 4,
    p1: { x: "40%", y: "55%", w: 380, h: 380 },
    p2: { x: "55%", y: "35%", w: 440, h: 440 },
    color: "linear-gradient(135deg, #8B5CF6, #EC4899, #A855F7)",
    blur: 70, opacity: 0.6, anim: "blob-float-5",
    delay: 0.05, dur: 19,
  },
  /* Smaller accent blobs */
  {
    id: 5,
    p1: { x: "25%", y: "30%", w: 200, h: 200 },
    p2: { x: "85%", y: "20%", w: 240, h: 240 },
    color: "linear-gradient(135deg, #2DD4BF, #818CF8, #C084FC)",
    blur: 50, opacity: 0.65, anim: "blob-float-2",
    delay: 0.25, dur: 16,
  },
  {
    id: 6,
    p1: { x: "60%", y: "50%", w: 180, h: 180 },
    p2: { x: "3%",  y: "70%", w: 220, h: 220 },
    color: "linear-gradient(135deg, #F472B6, #7C3AED, #38BDF8)",
    blur: 45, opacity: 0.7, anim: "blob-float-3",
    delay: 0.3, dur: 17,
  },
  {
    id: 7,
    p1: { x: "52%", y: "28%", w: 160, h: 160 },
    p2: { x: "80%", y: "75%", w: 200, h: 200 },
    color: "linear-gradient(135deg, #A78BFA, #F0ABFC, #67E8F9)",
    blur: 40, opacity: 0.6, anim: "blob-float-1",
    delay: 0.35, dur: 21,
  },
  /* Tiny accent spheres */
  {
    id: 8,
    p1: { x: "33%", y: "22%", w: 100, h: 100 },
    p2: { x: "45%", y: "80%", w: 140, h: 140 },
    color: "linear-gradient(135deg, #F9A8D4, #C084FC, #818CF8)",
    blur: 30, opacity: 0.75, anim: "blob-float-4",
    delay: 0.12, dur: 14,
  },
  {
    id: 9,
    p1: { x: "58%", y: "45%", w: 90, h: 90 },
    p2: { x: "25%", y: "10%", w: 120, h: 120 },
    color: "linear-gradient(135deg, #6EE7B7, #818CF8, #E879F9)",
    blur: 28, opacity: 0.7, anim: "blob-float-5",
    delay: 0.18, dur: 15,
  },
]

/* ─── Canvas-based blob morph loader ───
   Lava-lamp inspired: circle → corner buds → rounded square → back.
   Uses blur + threshold for organic goo merging. */

const MORPH_STAGES = [
  // Stage 0 — circle
  [{ x: 0, y: 0, r: 36 }],
  // Stage 1 — top-right bud
  [{ x: 0, y: 0, r: 36 }, { x: 22, y: -22, r: 20 }],
  // Stage 2 — top-right + bottom-right
  [{ x: 0, y: 0, r: 36 }, { x: 22, y: -22, r: 20 }, { x: 22, y: 22, r: 20 }],
  // Stage 3 — + bottom-left
  [{ x: 0, y: 0, r: 36 }, { x: 22, y: -22, r: 20 }, { x: 22, y: 22, r: 20 }, { x: -22, y: 22, r: 20 }],
  // Stage 4 — all 4 corners → rounded square
  [{ x: 0, y: 0, r: 36 }, { x: 22, y: -22, r: 20 }, { x: 22, y: 22, r: 20 }, { x: -22, y: 22, r: 20 }, { x: -22, y: -22, r: 20 }],
];

function lerpMorphStages(a, b, t) {
  const result = [];
  const maxLen = Math.max(a.length, b.length);
  for (let i = 0; i < maxLen; i++) {
    const ca = a[i] || { x: 0, y: 0, r: 0 };
    const cb = b[i] || { x: 0, y: 0, r: 0 };
    result.push({
      x: ca.x + (cb.x - ca.x) * t,
      y: ca.y + (cb.y - ca.y) * t,
      r: ca.r + (cb.r - ca.r) * t,
    });
  }
  return result;
}

function morphEaseInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

const MORPH_CYCLE = 3.0; // seconds
const MORPH_STEPS = [0, 1, 2, 3, 4, 3, 2, 1, 0];

function getMorphCircles(elapsed) {
  const raw = (elapsed % MORPH_CYCLE) / MORPH_CYCLE;
  const numTransitions = MORPH_STEPS.length - 1;
  const seg = raw * numTransitions;
  const idx = Math.min(Math.floor(seg), numTransitions - 1);
  const t = morphEaseInOut(seg - idx);
  return lerpMorphStages(MORPH_STAGES[MORPH_STEPS[idx]], MORPH_STAGES[MORPH_STEPS[idx + 1]], t);
}

function BlobRingLoader() {
  const canvasRef = useRef(null);
  const offRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);

  const W = 200, H = 200;
  const BLUR_R = 10, THRESHOLD = 0.45;

  const animate = useCallback((ts) => {
    if (!startRef.current) startRef.current = ts;
    const elapsed = (ts - startRef.current) / 1000;

    const canvas = canvasRef.current;
    const off = offRef.current;
    if (!canvas || !off) { rafRef.current = requestAnimationFrame(animate); return; }

    const ctx = canvas.getContext("2d");
    const octx = off.getContext("2d");

    const circles = getMorphCircles(elapsed);

    // Draw white circles on black to offscreen
    octx.clearRect(0, 0, W, H);
    octx.fillStyle = "#000";
    octx.fillRect(0, 0, W, H);
    octx.fillStyle = "#fff";
    for (const c of circles) {
      if (c.r < 0.5) continue;
      octx.beginPath();
      octx.arc(W / 2 + c.x, H / 2 + c.y, c.r, 0, Math.PI * 2);
      octx.fill();
    }

    // Blur onto main canvas
    ctx.clearRect(0, 0, W, H);
    ctx.filter = `blur(${BLUR_R}px)`;
    ctx.drawImage(off, 0, 0);
    ctx.filter = "none";

    // Hard threshold for crisp organic edges
    const img = ctx.getImageData(0, 0, W, H);
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const bright = d[i] / 255;
      if (bright > THRESHOLD) {
        d[i] = 255; d[i + 1] = 255; d[i + 2] = 255; d[i + 3] = 200;
      } else {
        d[i] = 0; d[i + 1] = 0; d[i + 2] = 0; d[i + 3] = 0;
      }
    }
    ctx.putImageData(img, 0, 0);

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const off = document.createElement("canvas");
    off.width = W; off.height = H;
    offRef.current = off;
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      style={{ width: 100, height: 100 }}
    />
  );
}

export function IntroAnimation({ onComplete }) {
  const [phase, setPhase] = useState(1)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(2), 3000)
    const t2 = setTimeout(() => setPhase(3), 4500)
    const t3 = setTimeout(() => { setVisible(false); onComplete?.() }, 5400)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onComplete])

  function skip() { setVisible(false); onComplete?.() }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[60] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Background gradient */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: phase >= 2
                ? "linear-gradient(135deg, #4A1068 0%, #1E1B4B 50%, #0F172A 100%)"
                : "linear-gradient(135deg, #581C87 0%, #312E81 50%, #1E1B4B 100%)",
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Lava blobs -- uses same CSS blur technique as LavaBackground */}
          {INTRO_BLOBS.map((blob) => {
            const pos = phase === 1 ? blob.p1 : blob.p2
            return (
              <motion.div
                key={blob.id}
                className="absolute"
                style={{
                  width: pos.w,
                  height: pos.h,
                  filter: `blur(${blob.blur}px)`,
                  background: blob.color,
                  animation: `${blob.anim} ${blob.dur}s ease-in-out infinite`,
                }}
                initial={{
                  left: blob.p1.x,
                  top: blob.p1.y,
                  width: blob.p1.w,
                  height: blob.p1.h,
                  opacity: 0,
                  scale: 0.3,
                }}
                animate={{
                  left: pos.x,
                  top: pos.y,
                  width: pos.w,
                  height: pos.h,
                  opacity: phase === 3 ? 0 : blob.opacity,
                  scale: phase === 3 ? 1.3 : 1,
                }}
                transition={
                  phase === 1
                    ? { duration: 1.2, ease: "easeOut", delay: blob.delay }
                    : phase === 2
                    ? { duration: 1.4, ease: [0.22, 0.68, 0.36, 1.0], delay: blob.delay * 0.6 }
                    : { duration: 0.8, ease: "easeIn", delay: blob.id * 0.04 }
                }
              />
            )
          })}

          {/* Phase 2: extra scattered small splatters that fly outward */}
          {phase >= 2 && Array.from({ length: 8 }).map((_, i) => {
            const ang = (i / 8) * Math.PI * 2 + i * 0.3
            const dist = 30 + i * 8
            const size = 80 + i * 20
            const colors = [
              "linear-gradient(135deg, #E879F9, #7C3AED)",
              "linear-gradient(135deg, #818CF8, #2DD4BF)",
              "linear-gradient(135deg, #F472B6, #A855F7)",
              "linear-gradient(135deg, #38BDF8, #8B5CF6)",
              "linear-gradient(135deg, #C084FC, #EC4899)",
              "linear-gradient(135deg, #6EE7B7, #7C3AED)",
              "linear-gradient(135deg, #F9A8D4, #6366F1)",
              "linear-gradient(135deg, #A78BFA, #F0ABFC)",
            ]
            return (
              <motion.div
                key={`splat-${i}`}
                className="absolute"
                style={{
                  width: size,
                  height: size,
                  filter: `blur(${25 + i * 4}px)`,
                  background: colors[i],
                  animation: `blob-float-${(i % 5) + 1} ${14 + i * 2}s ease-in-out infinite`,
                }}
                initial={{
                  left: "50%",
                  top: "50%",
                  opacity: 0,
                  scale: 0,
                }}
                animate={{
                  left: `${50 + Math.cos(ang) * dist}%`,
                  top: `${50 + Math.sin(ang) * dist}%`,
                  opacity: phase === 3 ? 0 : 0.55,
                  scale: phase === 3 ? 1.5 : 1,
                }}
                transition={{
                  duration: phase === 3 ? 0.7 : 1.0,
                  ease: [0.22, 0.68, 0.36, 1.0],
                  delay: 0.05 + i * 0.04,
                }}
              />
            )
          })}

          {/* Blob ring loader in center -- canvas-based goo ring with traveling dot */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-[5] pointer-events-none"
            animate={{ opacity: phase === 1 ? 1 : 0 }}
            transition={{ duration: 0.6 }}
          >
            <BlobRingLoader />
          </motion.div>

          {/* Skip intro button */}
          <motion.button
            className="fixed bottom-6 right-6 z-[70] text-white/30 text-xs font-medium bg-transparent border-none transition-colors"
            style={{ cursor: "none" }}
            onClick={skip}
            onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)" }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.3)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            skip intro
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
