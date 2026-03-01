import { HeroSection } from "../components/hero-section"
import { FeaturedWorks } from "../components/featured-works"
import { AboutPreview } from "../components/about-preview"
import { ProjectShowcase } from "../components/project-showcase"
import { Footer } from "../components/footer"
import { SideBlobs } from "../components/side-blobs"

export function HomePage() {
  return (
    <>
      <SideBlobs />
      <main>
        <HeroSection />
        <FeaturedWorks />
        <AboutPreview />
        <ProjectShowcase />
      </main>
      <Footer />
    </>
  )
}
