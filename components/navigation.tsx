'use client';

import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

// Constants - moved outside component to prevent recreation
const SCROLL_THRESHOLD = 50;
const PORTAL_URL = 'https://portal.thefundedpro.com/login';

// Navigation items - static data
const NAV_ITEMS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Plans', href: '#plans' },
  { name: 'FAQ', href: '#faq' },
  { name: 'Contact', href: '#contact' },
] as const;

// Smooth scroll function
const smoothScrollTo = (targetId: string) => {
  if (typeof window === 'undefined') return;

  const targetElement = document.querySelector(targetId) as HTMLElement;
  if (targetElement) {
    const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
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

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledScroll);
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
      className="focus-visible:ring-brand-cyan/40 cursor-pointer rounded focus:outline-none focus-visible:ring-2"
    >
      <h1 className="font-display text-xl font-bold text-white sm:text-2xl">
        Funded<span className="text-brand-cyan">Pro</span>
      </h1>
    </a>
  );
});
Logo.displayName = 'Logo';

// Memoized navigation link
const NavLink = memo(
  ({ href, children }: { href: string; children: React.ReactNode }) => {
    const handleClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        smoothScrollTo(href);
      },
      [href]
    );

    return (
      <a
        href={href}
        onClick={handleClick}
        className="hover:text-brand-cyan cursor-pointer px-3 py-2 text-sm font-medium text-white transition-colors duration-200"
      >
        {children}
      </a>
    );
  }
);
NavLink.displayName = 'NavLink';

// Memoized portal button
const PortalButton = memo(({ className = '' }: { className?: string }) => (
  <a
    href={PORTAL_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block"
  >
    <Button
      className={`bg-brand-cyan hover:bg-brand-cyan/90 animate-glow rounded-lg px-5 py-2 font-semibold text-black transition-all duration-300 hover:scale-105 ${className}`}
    >
      Client's Portal
    </Button>
  </a>
));
PortalButton.displayName = 'PortalButton';

// Memoized mobile menu button
const MobileMenuButton = memo(
  ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="hover:text-brand-cyan text-white transition-colors duration-200 md:hidden"
      aria-label={isOpen ? 'Close mobile menu' : 'Open mobile menu'}
      aria-expanded={isOpen}
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  )
);
MobileMenuButton.displayName = 'MobileMenuButton';

// Memoized mobile navigation
const MobileNavigation = memo(
  ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    const handleMobileNavClick = useCallback(
      (href: string) => {
        onClose();
        // Small delay to ensure menu closes before scrolling
        setTimeout(() => {
          smoothScrollTo(href);
        }, 100);
      },
      [onClose]
    );

    if (!isOpen) return null;

    return (
      <div className="mt-2 md:hidden">
        <div className="space-y-2 rounded-lg border border-[#00e5ff]/20 bg-[#1a237e]/95 px-3 pt-2 pb-3 backdrop-blur-md sm:space-y-3 sm:px-4 sm:pb-4">
          {NAV_ITEMS.map(item => (
            <button
              key={item.name}
              onClick={() => handleMobileNavClick(item.href)}
              className="hover:text-brand-cyan block w-full cursor-pointer px-2 py-2 text-left text-sm font-medium text-white transition-colors duration-200 sm:px-3 sm:text-base"
            >
              {item.name}
            </button>
          ))}
          <div className="pt-3 sm:pt-4">
            <PortalButton className="w-full" />
          </div>
        </div>
      </div>
    );
  }
);
MobileNavigation.displayName = 'MobileNavigation';

// Main navigation component
export function Navigation() {
  const isScrolled = useScrollHandler(SCROLL_THRESHOLD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Memoized class names to prevent recalculation
  const navClasses = useMemo(() => {
    const baseClasses =
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[#00e5ff]/20';
    const backgroundClasses = isScrolled
      ? 'bg-[#1a237e]/95 backdrop-blur-md shadow-lg'
      : 'bg-transparent';
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
      <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between sm:h-16">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-6 md:flex md:space-x-8">
            {NAV_ITEMS.map(item => (
              <NavLink key={item.name} href={item.href}>
                {item.name}
              </NavLink>
            ))}
            <PortalButton />
          </div>

          <MobileMenuButton
            isOpen={isMobileMenuOpen}
            onClick={toggleMobileMenu}
          />
        </div>

        <MobileNavigation isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      </div>
    </nav>
  );
}
