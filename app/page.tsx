"use client";

import dynamic from "next/dynamic"
import { memo, Suspense, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { KeyHighlightsSection } from "@/components/key-highlights-section"
import { DualTrackPlansSection } from "@/components/dual-track-plans-section"
import { ScrollAnimations } from "@/components/scroll-animations"
import TermsOfServicePage from "@/components/terms-of-service";
import Privacypolicy from "@/components/privacy-policy";
import { Chatbot } from "@/components/chatbot"
import { useSearchParams } from "next/navigation";
// import { ContactPage } from "@/components/contact"
const TestimonialsSection = dynamic(
  () => import("@/components/testimonials-section").then((m) => ({ default: m.TestimonialsSection })),
  { ssr: true }
)
const AboutSection = dynamic(
  () => import("@/components/about-section").then((m) => ({ default: m.AboutSection })),
  { ssr: true }
)
const FAQSection = dynamic(
  () => import("@/components/faq-section").then((m) => ({ default: m.FAQSection })),
  { ssr: true }
)
const Footer = dynamic(
  () => import("@/components/footer").then((m) => ({ default: m.Footer })),
  { ssr: true }
)
const Contact = dynamic(
  () => import("@/components/contact").then((m) => m.default),
  { ssr: true }
)

// Loading component for Suspense fallback
const PageLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#2d1b69] via-[#1a237e] to-[#0f1419] flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-cyan mx-auto mb-4"></div>
      <p className="text-white text-lg">Loading...</p>
    </div>
  </div>
);

const HomePageContent = memo(function HomePageContent() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      // Wait for the page to load completely
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen">
      <ScrollAnimations />
      <Navigation />

      <section id="home">
        <HeroSection />
      </section>

      <section id="about">
        <AboutSection />
      </section>

      <section id="highlights">
        <KeyHighlightsSection />
      </section>

      <section id="plans">
        <DualTrackPlansSection />
      </section>

      <section id="testimonials">
        <TestimonialsSection />
      </section>

      <section id="faq">
        <FAQSection />
      </section>

      <section id="contact">
        <Contact />
      </section>
      <section id="footer">
        <Footer />
      </section>
      <Chatbot />
    </main>
  )
})

// Client component that uses useSearchParams
function PageRouter() {
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  if (page === 'terms-of-service') {
    return <TermsOfServicePage />;
  }
  if (page === 'privacy-policy') {
    return <Privacypolicy />;
  }

  return <HomePageContent />;
}

// Main component with Suspense boundary
export default function HomePage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <PageRouter />
    </Suspense>
  );
}