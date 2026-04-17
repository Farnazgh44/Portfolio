import { useRouter } from "../lib/router-context"

const RESUME_PDF_URL = "/FarnazGholamiResume.pdf"

export function ResumePage() {
  const { navigate } = useRouter()

  return (
    <main
      className="fixed inset-0 z-50 flex flex-col"
      style={{
        background: "linear-gradient(135deg, #1a1033 0%, #0f0d1a 50%, #0a0a14 100%)",
      }}
    >
      {/* Top toolbar */}
      <header
        className="flex items-center justify-between px-4 md:px-8 py-3 shrink-0"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <div className="flex items-center gap-4">
          {/* Back button */}
          <button
            onClick={() => navigate("home")}
            className="pill-btn-hover flex items-center gap-2 rounded-full text-white/70 hover:text-white"
            style={{
              background:   "rgba(255,255,255,0.08)",
              border:       "1px solid rgba(255,255,255,0.15)",
              padding:      "11px 26px",
              borderRadius: "999px",
              fontSize:     "0.85rem",
              fontWeight:   500,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back
          </button>

          {/* File name */}
          <span className="text-white/60 text-sm font-medium hidden md:block">
            FarnazGholamiResume.pdf
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Open in new tab */}
          <a
            href={RESUME_PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="pill-btn-hover flex items-center gap-2 rounded-full text-white/70 hover:text-white"
            style={{
              background:   "rgba(255,255,255,0.08)",
              border:       "1px solid rgba(255,255,255,0.15)",
              padding:      "11px 26px",
              borderRadius: "999px",
              fontSize:     "0.85rem",
              fontWeight:   500,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" x2="21" y1="14" y2="3" />
            </svg>
            <span className="hidden sm:inline">Open</span>
          </a>

          {/* Download button */}
          <a
            href={RESUME_PDF_URL}
            download="FarnazGholamiResume.pdf"
            className="pill-btn-hover flex items-center gap-2 rounded-full text-white"
            style={{
              background:   "rgba(139, 92, 246, 0.4)",
              border:       "1px solid rgba(139, 92, 246, 0.5)",
              padding:      "11px 26px",
              borderRadius: "999px",
              fontSize:     "0.85rem",
              fontWeight:   500,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Download
          </a>
        </div>
      </header>

      {/* PDF embed area */}
      <div className="flex-1 overflow-hidden p-4 md:p-8">
        <div
          className="w-full h-full rounded-xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <iframe
            src={`${RESUME_PDF_URL}#toolbar=1&navpanes=1`}
            title="Farnaz Gholami Resume"
            className="w-full h-full border-none"
            style={{ minHeight: "100%" }}
          />
        </div>
      </div>
    </main>
  )
}
