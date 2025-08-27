'use client';

import { useEffect, useRef } from 'react';

export function ScrollAnimations() {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    // Throttled intersection observer for better performance
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -5% 0px',
    };

    const observer = new IntersectionObserver(entries => {
      // Cancel any pending animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Use requestAnimationFrame to batch updates
      animationFrameRef.current = requestAnimationFrame(() => {
        entries.forEach(entry => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            // Add visible class immediately for better performance
            el.classList.add('reveal-visible');
            el.classList.remove('reveal-hidden');
            // Stop observing once animated to prevent re-triggering
            observer.unobserve(el);
          }
        });
      });
    }, observerOptions);

    observerRef.current = observer;

    // Observe all sections with performance optimization
    if (typeof document !== 'undefined') {
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        // Only observe sections that don't already have reveal classes
        if (
          !section.classList.contains('reveal-visible') &&
          !section.classList.contains('reveal-hidden')
        ) {
          observer.observe(section);
        }
      });
    }

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return null;
}
