import { useState, useEffect } from "react"
import { useRouter }     from "../lib/router-context"
import { Footer }        from "../components/footer"
import { SideBlobs }     from "../components/side-blobs"
import { SpotlightCard } from "../components/spotlight-card"
import { BlobButton }    from "../components/blob-button"

/* ─── Contact info data ─── */
const CONTACT_LINKS = [
  {
    label: "Email",
    value: "farnaz.gholami7900@gmail.com",
    href: "mailto:farnaz.gholami7900@gmail.com",
    copyValue: "farnaz.gholami7900@gmail.com",
    action: "copy",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    value: "Farnaz Gholami",
    href: "https://www.linkedin.com/in/farnaz-gholami-4165b9345",
    copyValue: "https://www.linkedin.com/in/farnaz-gholami-4165b9345",
    action: "copy",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    value: "@farnaz.gholami",
    href: "https://instagram.com/farnaz.gholami",
    copyValue: "https://instagram.com/farnaz.gholami",
    action: "copy",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "Resume",
    value: "FarnazGholamiResume.pdf",
    href: "resume",
    copyValue: null,
    action: "view",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
]

const glassStyle = {
  background: "rgba(255,255,255,0.10)",
  backdropFilter: "blur(32px)",
  WebkitBackdropFilter: "blur(32px)",
  border: "1px solid rgba(255,255,255,0.15)",
}


/* ─── Contact Info Item ─── */
function ContactInfoItem({ item }) {
  const [copied, setCopied] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [btnHovered, setBtnHovered] = useState(false)
  const { navigate } = useRouter()

  function handleCopy() {
    if (item.copyValue) {
      navigator.clipboard.writeText(item.copyValue)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleView(e) {
    e.preventDefault()
    navigate(item.href)
  }

  const isExternal = item.href.startsWith("http")
  const isRoute    = item.action === "view"

  return (
    <div
      className="flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(160,100,255,0.12)" : "rgba(255,255,255,0.06)",
        border: `1px solid ${hovered ? "rgba(160,100,255,0.4)" : "rgba(255,255,255,0.1)"}`,
        transform: hovered ? "scale(1.02)" : "scale(1)",
      }}
    >
      <a
        href={isRoute ? "#" : item.href}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        onClick={isRoute ? handleView : undefined}
        className="flex items-center gap-3 flex-1 no-underline transition-colors duration-200"
        style={{ color: hovered ? "white" : "rgba(255,255,255,0.8)" }}
      >
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300"
          style={{
            background: hovered ? "rgba(160,100,255,0.2)" : "rgba(255,255,255,0.1)",
            border: `1px solid ${hovered ? "rgba(160,100,255,0.3)" : "transparent"}`,
          }}
        >
          <span style={{ color: hovered ? "#c084fc" : "rgba(255,255,255,0.8)" }}>{item.icon}</span>
        </div>
        <span className="text-sm md:text-base font-medium">{item.label}</span>
      </a>

      {item.action === "copy" ? (
        <button
          onClick={handleCopy}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer shrink-0"
          style={{
            background: copied ? "rgba(100,255,180,0.2)" : btnHovered ? "linear-gradient(135deg, rgba(100,80,255,0.7), rgba(180,60,200,0.7))" : "rgba(255,255,255,0.12)",
            color: copied ? "#6fffb4" : btnHovered ? "white" : "rgba(255,255,255,0.7)",
            border: `1px solid ${copied ? "rgba(100,255,180,0.3)" : btnHovered ? "rgba(160,120,255,0.5)" : "rgba(255,255,255,0.15)"}`,
            transform: btnHovered ? "scale(1.05)" : "scale(1)",
          }}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      ) : item.action === "view" ? (
        <button
          onClick={handleView}
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer shrink-0"
          style={{
            background: btnHovered ? "linear-gradient(135deg, rgba(100,80,255,0.7), rgba(180,60,200,0.7))" : "rgba(255,255,255,0.12)",
            color: btnHovered ? "white" : "rgba(255,255,255,0.7)",
            border: `1px solid ${btnHovered ? "rgba(160,120,255,0.5)" : "rgba(255,255,255,0.15)"}`,
            transform: btnHovered ? "scale(1.05)" : "scale(1)",
          }}
        >
          View
        </button>
      ) : (
        <a
          href={item.href}
          download
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 shrink-0 no-underline"
          style={{
            background: btnHovered ? "linear-gradient(135deg, rgba(100,80,255,0.7), rgba(180,60,200,0.7))" : "rgba(255,255,255,0.12)",
            color: btnHovered ? "white" : "rgba(255,255,255,0.7)",
            border: `1px solid ${btnHovered ? "rgba(160,120,255,0.5)" : "rgba(255,255,255,0.15)"}`,
            transform: btnHovered ? "scale(1.05)" : "scale(1)",
          }}
        >
          Download
        </a>
      )}
    </div>
  )
}

/* ─── Main Contact Section — blobs behind, form + info in front ─── */
function ContactSection() {
  const [popped, setPopped]       = useState(false)
  const [formData, setFormData]   = useState({ name: "", email: "", message: "" })
  const [sending, setSending]     = useState(false)
  const [sent, setSent]           = useState(false)
  const [error, setError]         = useState("")

  useEffect(() => {
    const t = setTimeout(() => setPopped(true), 80)
    return () => clearTimeout(t)
  }, [])

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all fields.")
      return
    }
    setSending(true)
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error("Failed to send message")
      setSent(true)
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => setSent(false), 4000)
    } catch {
      const subject = encodeURIComponent(`Portfolio Contact from ${formData.name}`)
      const body    = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`)
      window.open(`mailto:farnaz.gholami7900@gmail.com?subject=${subject}&body=${body}`, "_blank")
      setSent(true)
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => setSent(false), 4000)
    } finally {
      setSending(false)
    }
  }

  return (
    <section
      className="relative min-h-screen flex items-center py-24 overflow-hidden"
      id="contact-form"
    >
      {/* Form + info card */}
      <div className="content-wrap relative z-10 w-full">
        <SpotlightCard
          className="rounded-2xl p-6 md:p-10"
          style={{
            ...glassStyle,
            opacity:    popped ? 1 : 0,
            transform:  popped ? "scale(1) translateY(0px)" : "scale(0.88) translateY(32px)",
            transition: "opacity 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
          spotlightColor="rgba(0, 229, 255, 0.15)"
        >
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 md:gap-12">

            {/* Left: Message Form */}
            <div className="flex-[3]">
              <h2 className="text-white text-xl md:text-2xl font-bold mb-4 sm:mb-6">Send Message</h2>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">
                    Your Name <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none transition-all duration-300 focus:ring-1 focus:ring-white/30"
                    style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.22)" }}
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">
                    Email <span className="text-pink-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none transition-all duration-300 focus:ring-1 focus:ring-white/30"
                    style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.22)" }}
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-white/60 text-sm mb-1.5">
                    Message <span className="text-pink-400">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg text-white text-sm outline-none transition-all duration-300 resize-none focus:ring-1 focus:ring-white/30"
                    style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.22)" }}
                    placeholder="Write your message..."
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}
                {sent  && <p className="text-green-400 text-sm">Message sent successfully!</p>}

                <BlobButton
                  type="submit"
                  disabled={sending}
                  className="pill-btn-hover w-full py-3 rounded-lg text-white text-sm font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(135deg, rgba(100,80,255,0.7), rgba(180,60,200,0.7))", border: "1px solid rgba(160,120,255,0.5)" }}
                  wrapperStyle={{ width: "100%" }}
                >
                  {sending ? "Sending..." : "Send Message"}
                </BlobButton>
              </form>
            </div>

            {/* Right: Contact Info */}
            <div className="flex-[2] flex flex-col gap-3 sm:gap-4 justify-center">
              {CONTACT_LINKS.map((item) => (
                <ContactInfoItem key={item.label} item={item} />
              ))}
            </div>

          </div>
        </SpotlightCard>
      </div>
    </section>
  )
}

/* ─── Contact Page ─── */
export function ContactPage() {
  return (
    <>
      <SideBlobs />
      <main className="relative">
        <ContactSection />
        <Footer />
      </main>
    </>
  )
}
