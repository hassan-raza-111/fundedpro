'use client';

import dynamic from 'next/dynamic';
import { memo, Suspense, useEffect } from 'react';
import { Navigation } from '@/components/navigation';
import { HeroSection } from '@/components/hero-section';
import { KeyHighlightsSection } from '@/components/key-highlights-section';
import { DualTrackPlansSection } from '@/components/dual-track-plans-section';
import { ScrollAnimations } from '@/components/scroll-animations';
import TermsOfServicePage from '@/components/terms-of-service';
import Privacypolicy from '@/components/privacy-policy';
import { Chatbot } from '@/components/chatbot';
import { useSearchParams } from 'next/navigation';
import { useScrollOptimization } from '@/hooks/use-mobile';

// import { ContactPage } from "@/components/contact"
const TestimonialsSection = dynamic(
  () =>
    import('@/components/testimonials-section').then(m => ({
      default: m.TestimonialsSection,
    })),
  { ssr: true }
);
const AboutSection = dynamic(
  () =>
    import('@/components/about-section').then(m => ({
      default: m.AboutSection,
    })),
  { ssr: true }
);
const FAQSection = dynamic(
  () =>
    import('@/components/faq-section').then(m => ({ default: m.FAQSection })),
  { ssr: true }
);
const Footer = dynamic(
  () => import('@/components/footer').then(m => ({ default: m.Footer })),
  { ssr: true }
);
const Contact = dynamic(
  () => import('@/components/contact').then(m => m.default),
  { ssr: true }
);

// Loading component for Suspense fallback
const PageLoading = () => (
  <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#2d1b69] via-[#1a237e] to-[#0f1419]">
    <div className="text-center">
      <div className="border-brand-cyan mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
      <p className="text-lg text-white">Loading...</p>
    </div>
  </div>
);

const HomePageContent = memo(function HomePageContent() {
  const searchParams = useSearchParams();

  // Add scroll optimization
  useScrollOptimization();

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      // Wait for the page to load completely
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
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
  );
});

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
