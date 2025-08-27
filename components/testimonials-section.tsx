'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

// Types
type Testimonial = {
  name: string;
  role: string;
  content: string;
  rating: number;
};

// Constants
const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Sarah M.',
    role: 'Professional Trader',
    content:
      'The 100-day evaluation period gave me the confidence to develop my strategy properly. The profit splits are incredible!',
    rating: 5,
  },
  {
    name: 'Marcus K.',
    role: 'Day Trader',
    content:
      "Finally, a prop firm that doesn't rush you through impossible deadlines. FundedPro actually wants traders to succeed.",
    rating: 5,
  },
  {
    name: 'Jennifer L.',
    role: 'Swing Trader',
    content:
      'Lower fees, higher payouts, and amazing support. I scaled from $10K to $50K in just 4 months!',
    rating: 5,
  },
  {
    name: 'David R.',
    role: 'Forex Trader',
    content:
      "The challenge was tough but fair. Weekly withdrawals are a game-changer once you're funded!",
    rating: 5,
  },
  {
    name: 'Amanda T.',
    role: 'Crypto Trader',
    content:
      "Best prop firm I've worked with. The technology integration is seamless and the rules are crystal clear.",
    rating: 5,
  },
  {
    name: 'Michael S.',
    role: 'Scalper',
    content:
      'FundedPro gave me the opportunity I needed. From $25K challenge to $100K funded account in 6 months!',
    rating: 5,
  },
] as const;

const AUTO_ADVANCE_INTERVAL = 5000;

// Utility functions
const openRegistrationPortal = (): void => {
  window.open('https://portal.thefundedpro.com/register', '_blank');
};

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Memoized current testimonial
  const currentTestimonial = useMemo(
    () => TESTIMONIALS[currentIndex],
    [currentIndex]
  );

  // Auto-advance carousel with pause on hover/focus
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % TESTIMONIALS.length);
    }, AUTO_ADVANCE_INTERVAL);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Callbacks
  const nextTestimonial = useCallback(() => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % TESTIMONIALS.length);
  }, []);

  const prevTestimonial = useCallback(() => {
    setCurrentIndex(
      prevIndex => (prevIndex - 1 + TESTIMONIALS.length) % TESTIMONIALS.length
    );
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);

  // Component renderers
  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    };

    return (
      <div className="flex justify-center gap-1">
        {[...Array(rating)].map((_, i) => (
          <Star
            key={i}
            className={`${sizeClasses[size]} fill-brand-gold text-brand-gold`}
          />
        ))}
      </div>
    );
  };

  const renderMainTestimonial = () => (
    <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-2xl backdrop-blur-md sm:p-8 md:p-12">
      <div className="mb-6 flex justify-center">
        <Quote className="text-brand-cyan h-12 w-12" />
      </div>

      <div className="text-center">
        <p className="mb-8 text-lg leading-relaxed text-white italic md:text-xl">
          "{currentTestimonial.content}"
        </p>

        {renderStars(currentTestimonial.rating, 'md')}

        <div className="mt-6 space-y-2">
          <h4 className="text-xl font-semibold text-white">
            {currentTestimonial.name}
          </h4>
          <p className="text-brand-cyan font-medium">
            {currentTestimonial.role}
          </p>
        </div>
      </div>
    </div>
  );

  const renderNavigationArrows = () => (
    <>
      <button
        onClick={prevTestimonial}
        aria-label="Previous testimonial"
        className="absolute top-1/2 left-3 z-10 hidden -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-2.5 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/40 sm:left-4 sm:block sm:p-3 md:p-4"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextTestimonial}
        aria-label="Next testimonial"
        className="absolute top-1/2 right-3 z-10 hidden -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-2.5 backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white/40 sm:right-4 sm:block sm:p-3 md:p-4"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>
    </>
  );

  const renderDotsIndicator = () => (
    <div className="mt-8 flex justify-center gap-2">
      {TESTIMONIALS.map((_, index) => (
        <button
          key={index}
          onClick={() => goToSlide(index)}
          className={`h-3 w-3 rounded-full transition-all duration-300 ${
            index === currentIndex
              ? 'bg-brand-cyan scale-125'
              : 'bg-white/30 hover:bg-white/50'
          }`}
          aria-label={`Go to testimonial ${index + 1}`}
        />
      ))}
    </div>
  );

  const renderPreviewCards = () => (
    <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {TESTIMONIALS.slice(0, 3).map((testimonial, index) => (
        <div
          key={index}
          className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/20"
        >
          {renderStars(testimonial.rating, 'sm')}
          <p className="mt-4 mb-4 line-clamp-3 text-sm text-gray-300">
            "{testimonial.content}"
          </p>
          <div className="text-sm">
            <div className="font-semibold text-white">{testimonial.name}</div>
            <div className="text-brand-cyan">{testimonial.role}</div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCTA = () => (
    <div className="mt-16 text-center">
      <p className="mb-6 text-gray-300">
        Ready to join thousands of successful traders?
      </p>
      <button
        onClick={openRegistrationPortal}
        className="from-brand-cyan hover:from-brand-cyan/90 hover:shadow-brand-cyan/30 rounded-lg bg-gradient-to-r to-blue-500 px-8 py-3 font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:to-blue-500/90"
      >
        Start Your Challenge Today
      </button>
    </div>
  );

  return (
    <section className="scroll-mt-24 bg-gradient-to-b from-[#0f1419] to-[#2d1b69] px-4 py-20 sm:px-6 md:scroll-mt-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="font-display mb-4 text-4xl font-bold text-white md:text-5xl">
            What Our <span className="text-brand-cyan">Traders Say</span>
          </h2>
          <p className="mx-auto max-w-xs px-2 text-sm leading-relaxed text-gray-300 sm:max-w-md sm:px-4 sm:text-base md:max-w-2xl md:text-lg">
            Don't just take our word for it. Here's what successful traders are
            saying about FundedPro.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div
          className="relative mx-auto max-w-4xl"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onFocus={handleMouseEnter}
          onBlur={handleMouseLeave}
        >
          {renderMainTestimonial()}
          {renderNavigationArrows()}
          {renderDotsIndicator()}
        </div>

        {renderPreviewCards()}
        {renderCTA()}
      </div>
    </section>
  );
}
