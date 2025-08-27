"use client";

import { useState, useEffect, useCallback, memo, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

// Constants - moved outside component to prevent recreation
const SCROLL_THRESHOLD = 50;
const PORTAL_URL = "https://portal.thefundedpro.com/login";

// Navigation items - static data
const NAV_ITEMS = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Plans", href: "#plans" },
  { name: "FAQ", href: "#faq" },
  { name: "Contact", href: "#contact" },
] as const;

// Smooth scroll function
const smoothScrollTo = (targetId: string) => {
  if (typeof window === 'undefined') return;
  
  const targetElement = document.querySelector(targetId) as HTMLElement;
  if (targetElement) {
    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }
};

// Optimized scroll handler with RAF throttling
const useScrollHandler = (threshold: number) => {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = useCallback(() => {
    if (typeof window === 'undefined') return;
    const scrolled = window.scrollY > threshold;
    setIsScrolled(scrolled);
  }, [threshold]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let rafId: number;
    
    const throttledScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = 0;
      });
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [handleScroll]);

  return isScrolled;
};

// Memoized logo component
const Logo = memo(() => {
  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    smoothScrollTo('#home');
  }, []);

  return (
    <a 
      href="#home" 
      onClick={handleLogoClick}
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan/40 rounded cursor-pointer"
    >
      <h1 className="text-2xl font-bold font-display text-white">
        Funded<span className="text-brand-cyan">Pro</span>
      </h1>
    </a>
  );
});
Logo.displayName = "Logo";

// Memoized navigation link
const NavLink = memo(({ href, children }: { href: string; children: React.ReactNode }) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    smoothScrollTo(href);
  }, [href]);

  return (
    <a
      href={href}
      onClick={handleClick}
      className="text-white hover:text-brand-cyan transition-colors duration-200 px-3 py-2 text-sm font-medium cursor-pointer"
    >
      {children}
    </a>
  );
});
NavLink.displayName = "NavLink";

// Memoized portal button
const PortalButton = memo(({ className = "" }: { className?: string }) => (
  <a
    href={PORTAL_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block"
  >
    <Button className={`bg-brand-cyan hover:bg-brand-cyan/90 text-black font-semibold px-5 py-2 rounded-lg transition-all duration-300 hover:scale-105 animate-glow ${className}`}>
      Client's Portal
    </Button>
  </a>
));
PortalButton.displayName = "PortalButton";

// Memoized mobile menu button
const MobileMenuButton = memo(({ 
  isOpen, 
  onClick 
}: { 
  isOpen: boolean; 
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="text-white hover:text-brand-cyan transition-colors duration-200 md:hidden"
    aria-label={isOpen ? "Close mobile menu" : "Open mobile menu"}
    aria-expanded={isOpen}
  >
    {isOpen ? <X size={24} /> : <Menu size={24} />}
  </button>
));
MobileMenuButton.displayName = "MobileMenuButton";

// Memoized mobile navigation
const MobileNavigation = memo(({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) => {
  const handleMobileNavClick = useCallback((href: string) => {
    onClose();
    // Small delay to ensure menu closes before scrolling
    setTimeout(() => {
      smoothScrollTo(href);
    }, 100);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-2">
      <div className="px-4 pt-2 pb-4 space-y-3 bg-[#1a237e]/95 backdrop-blur-md rounded-lg border border-[#00e5ff]/20">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.name}
            onClick={() => handleMobileNavClick(item.href)}
            className="text-white hover:text-brand-cyan block w-full text-left px-3 py-2 text-base font-medium transition-colors duration-200 cursor-pointer"
          >
            {item.name}
          </button>
        ))}
        <div className="pt-4">
          <PortalButton className="w-full" />
        </div>
      </div>
    </div>
  );
});
MobileNavigation.displayName = "MobileNavigation";

// Main navigation component
export function Navigation() {
  const isScrolled = useScrollHandler(SCROLL_THRESHOLD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Memoized class names to prevent recalculation
  const navClasses = useMemo(() => {
    const baseClasses = "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[#00e5ff]/20";
    const backgroundClasses = isScrolled 
      ? "bg-[#1a237e]/95 backdrop-blur-md shadow-lg" 
      : "bg-transparent";
    return `${baseClasses} ${backgroundClasses}`;
  }, [isScrolled]);

  // Memoized event handlers
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.name} href={item.href}>
                {item.name}
              </NavLink>
            ))}
            <PortalButton />
          </div>

          <MobileMenuButton isOpen={isMobileMenuOpen} onClick={toggleMobileMenu} />
        </div>

        <MobileNavigation isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      </div>
    </nav>
  );
}
