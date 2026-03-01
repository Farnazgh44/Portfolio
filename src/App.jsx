import { Component, useState, useCallback } from "react"
import { ThemeProvider } from "./lib/theme-context"
import { RouterProvider, useRouter } from "./lib/router-context"
import { LavaBackground } from "./components/lava-background"
import { Navbar } from "./components/navbar"
import { BlobCursor } from "./components/blob-cursor"
import { IntroAnimation } from "./components/intro-animation"
import { HomePage } from "./pages/HomePage"
import { AboutPage } from "./pages/AboutPage"
import { ContactPage } from "./pages/ContactPage"
import { ResumePage } from "./pages/ResumePage"
import { ProjectsPage } from "./pages/ProjectsPage"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  componentDidCatch(error, info) {
    console.log("[v0] ErrorBoundary caught:", error.message, info.componentStack)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ color: "white", padding: 40 }}>
          <h1>Something crashed</h1>
          <pre style={{ whiteSpace: "pre-wrap", color: "#ff6b6b" }}>{this.state.error?.message}</pre>
          <pre style={{ whiteSpace: "pre-wrap", color: "#aaa", fontSize: 12 }}>{this.state.error?.stack}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

function PageRouter() {
  const { page } = useRouter()
  if (page === "projects") {
    return (
      <ErrorBoundary>
        <ProjectsPage />
      </ErrorBoundary>
    )
  }

  if (page === "about") {
    return (
      <ErrorBoundary>
        <AboutPage />
      </ErrorBoundary>
    )
  }
  if (page === "contact") {
    return (
      <ErrorBoundary>
        <ContactPage />
      </ErrorBoundary>
    )
  }
  if (page === "resume") {
    return (
      <ErrorBoundary>
        <ResumePage />
      </ErrorBoundary>
    )
  }
  return <HomePage />
}

export default function App() {
  const [introComplete, setIntroComplete] = useState(false)
  const handleIntroDone = useCallback(() => setIntroComplete(true), [])

  return (
    <RouterProvider>
      <ThemeProvider>
        {/* Intro animation overlay */}
        {!introComplete && <IntroAnimation onComplete={handleIntroDone} />}

        {/* Custom blob cursor (desktop only) */}
        <BlobCursor />

        {/* Global SVG gradient for icon hover effects */}
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            <linearGradient id="icon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
        </svg>
        <LavaBackground />
        <Navbar />
        <PageRouter />
      </ThemeProvider>
    </RouterProvider>
  )
}
