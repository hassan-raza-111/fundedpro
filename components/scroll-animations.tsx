"use client"

import { useEffect } from "react"

export function ScrollAnimations() {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const el = entry.target as HTMLElement
        if (entry.isIntersecting) {
          requestAnimationFrame(() => {
            el.classList.add("reveal-visible")
            el.classList.remove("reveal-hidden")
          })
          // Stop observing once animated to prevent re-triggering
          observer.unobserve(el)
        } else {
          // Only mark as hidden if it hasn't been revealed yet
          if (!el.classList.contains("reveal-visible")) {
            el.classList.add("reveal-hidden")
          }
        }
      })
    }, observerOptions)

    // Observe all sections without forcing initial hidden state to avoid layout issues
    if (typeof document !== 'undefined') {
      const sections = document.querySelectorAll("section")
      sections.forEach((section) => observer.observe(section))
    }

    // Cleanup
    return () => {
      observer.disconnect()
    }
  }, [])

  return null
}
