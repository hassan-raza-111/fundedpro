'use client';

import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { Footer } from '@/components/footer';

// Constants
const SCROLL_THRESHOLD = 50;
const PORTAL_URL = 'https://portal.thefundedpro.com/login';
const LAST_UPDATED = '25 October 2024';

// Navigation items
const NAV_ITEMS = [
  { name: 'Home', href: '/#home' },
  { name: 'About', href: '/#about' },
  { name: 'Plans', href: '/#plans' },
  { name: 'FAQ', href: '/#faq' },
  { name: 'Contact', href: '/#contact' },
] as const;

// Scroll handler
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

// Logo component
const Logo = memo(() => (
  <Link
    href="/"
    className="focus-visible:ring-brand-cyan/40 rounded focus:outline-none focus-visible:ring-2"
  >
    <h1 className="font-display text-2xl font-bold text-white">
      Funded<span className="text-brand-cyan">Pro</span>
    </h1>
  </Link>
));
Logo.displayName = 'Logo';

// Navigation link component
const NavLink = memo(
  ({ href, children }: { href: string; children: React.ReactNode }) => (
    <Link
      href={href}
      className="hover:text-brand-cyan px-3 py-2 text-sm font-medium text-white transition-colors duration-200"
    >
      {children}
    </Link>
  )
);
NavLink.displayName = 'NavLink';

// Portal button component
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

// Mobile menu button
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

// Mobile navigation
const MobileNavigation = memo(
  ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;

    return (
      <div className="mt-2 md:hidden">
        <div className="space-y-3 rounded-lg border border-[#00e5ff]/20 bg-[#1a237e]/95 px-4 pt-2 pb-4 backdrop-blur-md">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.name}
              href={item.href}
              className="hover:text-brand-cyan block px-3 py-2 text-base font-medium text-white transition-colors duration-200"
              onClick={onClose}
            >
              {item.name}
            </Link>
          ))}
          <div className="pt-4">
            <PortalButton className="w-full" />
          </div>
        </div>
      </div>
    );
  }
);
MobileNavigation.displayName = 'MobileNavigation';

// Terms of Service Navigation Component
const TermsOfServiceNavigation = memo(() => {
  const isScrolled = useScrollHandler(SCROLL_THRESHOLD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navClasses = useMemo(() => {
    const baseClasses =
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[#00e5ff]/20';
    return isScrolled
      ? `${baseClasses} bg-[#1a237e]/95 backdrop-blur-md shadow-lg`
      : `${baseClasses} bg-transparent`;
  }, [isScrolled]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <nav className={navClasses}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-1 md:flex">
            {NAV_ITEMS.map(item => (
              <NavLink key={item.name} href={item.href}>
                {item.name}
              </NavLink>
            ))}
            <PortalButton />
          </div>

          {/* Mobile Menu Button */}
          <MobileMenuButton
            isOpen={isMobileMenuOpen}
            onClick={toggleMobileMenu}
          />
        </div>

        {/* Mobile Navigation */}
        <MobileNavigation isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />
      </div>
    </nav>
  );
});
TermsOfServiceNavigation.displayName = 'TermsOfServiceNavigation';

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#2d1b69] via-[#1a237e] to-[#0f1419]">
      <TermsOfServiceNavigation />

      <div className="pt-20 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              Terms of Service
            </h1>
            <p className="text-lg text-gray-300">
              Last Updated: {LAST_UPDATED}
            </p>
          </div>

          {/* Terms Content */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md sm:p-8 lg:p-12">
            <div className="prose prose-invert max-w-none">
              <div className="space-y-6 text-sm leading-relaxed text-gray-300 sm:text-base">
                {/* Introduction */}
                <div>
                  <p className="mb-4">
                    FundedPro is a performance-based capital allocation firm
                    founded by Destiny Isibor, operating globally from Rodney
                    Bay, St. Lucia.
                  </p>
                  <p className="mb-4">
                    Our infrastructure is powered by advanced trading systems,
                    and financial operations are managed through regulated
                    channels.
                  </p>
                  <p className="mb-4">
                    These Terms govern your access to our evaluation challenges,
                    simulated trading accounts, and capital funding services
                    (collectively, the "Services").
                  </p>
                  <p className="font-semibold text-white">
                    By registering, funding, or trading with us, you irrevocably
                    accept these Terms. There is no appeal. No exception. No
                    ambiguity.
                  </p>
                </div>

                {/* Section 1 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    1. ACCESS & ELIGIBILITY
                  </h2>
                  <p className="mb-4">You must be:</p>
                  <ul className="ml-4 list-inside list-disc space-y-2">
                    <li>At least 18 years of age</li>
                    <li>Legally permitted to use our Services</li>
                    <li>
                      Not a resident of USA, Bangladesh, Russia, Iran, North
                      Korea, or any FATF-restricted jurisdiction
                    </li>
                  </ul>
                  <p className="mt-4">
                    We do not operate for the unqualified. Your participation is
                    a privilege — not a right.
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    2. EVALUATION MODELS
                  </h2>
                  <p className="mb-4">Capital is earned — not given.</p>
                  <p className="mb-4">Available tracks:</p>
                  <ul className="mb-4 ml-4 list-inside list-disc space-y-2">
                    <li>Stellar 2-Step Challenge</li>
                    <li>Express Challenge</li>
                    <li>Stellar Lite</li>
                    <li>Instant Funded Account</li>
                  </ul>
                  <p className="mb-4">
                    Rules are defined in our FAQ/Rules section and are binding
                    upon purchase. Add-ons or special offers override standard
                    terms during their validity.
                  </p>
                  <p className="font-semibold text-white">
                    Pass the test — or be replaced.
                  </p>
                </div>

                {/* Section 3 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    3. TRADING RULES
                  </h2>
                  <p className="mb-4">
                    We reward discipline. We eliminate exploitation.
                  </p>
                  <p className="mb-4 font-semibold text-white">
                    ABSOLUTE PROHIBITIONS:
                  </p>
                  <ul className="ml-4 list-inside list-disc space-y-2">
                    <li>Exceeding daily (5%) or total (10%) loss limits</li>
                    <li>Cross-account hedging (on or off-platform)</li>
                    <li>
                      Using bots, AI, scripts, or automated trading systems
                    </li>
                    <li>
                      Arbitrage of any kind — latency, statistical, triangular
                    </li>
                    <li>
                      Exploiting price delays, data feed errors, or system bugs
                      ("Latency Trading")
                    </li>
                    <li>
                      Copy trading, mirror accounts, or group coordination
                    </li>
                    <li>Third-party trading or delegation</li>
                    <li>
                      Opening abnormal position sizes (relative to your history)
                    </li>
                    <li>Trading during extreme gaps or illiquid conditions</li>
                    <li>Overnight positions in Futures accounts</li>
                    <li>Risk-to-reward ratios worse than 5:1</li>
                    <li>Account rolling or intentional failure patterns</li>
                    <li>
                      Using different IP addresses for dashboard and trading
                      platform
                    </li>
                    <li>
                      Mismatched email registration across platforms (e.g.,
                      dashboard vs Tradovate)
                    </li>
                  </ul>
                  <p className="mt-4">
                    We monitor behavior, not just outcomes. Pattern detection is
                    algorithmic and relentless.
                  </p>
                  <p className="font-semibold text-white">
                    Violation = instant termination. No refund. No warning.
                  </p>
                </div>

                {/* Section 4 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    4. PROFIT & PAYOUTS
                  </h2>
                  <ul className="ml-4 list-inside list-disc space-y-2">
                    <li>Profit splits: Up to 80%, scaled by performance</li>
                    <li>Payouts processed by authorized financial partners</li>
                    <li>
                      Withdrawal fee: Up to 3.5% (charged by third-party
                      processors like Rise)
                    </li>
                    <li>KYC verification required before first payout</li>
                  </ul>
                  <p className="mt-4">
                    You trade. We fund. You profit — if you follow the rules.
                  </p>
                </div>

                {/* Section 5 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    5. FEES & REFUNDS
                  </h2>
                  <ul className="ml-4 list-inside list-disc space-y-2">
                    <li>A non-refundable fee grants access to evaluation</li>
                    <li>All payments are final</li>
                    <li>No refund if you've placed a single trade</li>
                    <li>
                      Refund requestable only if no trading activity within 7
                      days
                    </li>
                    <li>Add-ons and upgrades are permanently non-refundable</li>
                    <li>Inactive accounts (30+ days) are suspended</li>
                  </ul>
                  <p className="mt-4">
                    Your fee covers data, infrastructure, and access — not
                    guarantees.
                  </p>
                </div>

                {/* Section 6 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    6. ACCOUNT TERMINATION
                  </h2>
                  <p className="mb-4">
                    We may terminate your account at any time, including for:
                  </p>
                  <ul className="ml-4 list-inside list-disc space-y-2">
                    <li>Rule violations</li>
                    <li>Suspicious trading behavior</li>
                    <li>Failed KYC</li>
                    <li>Chargebacks or disputes</li>
                  </ul>
                  <p className="mt-4">
                    Termination is final. No appeals. No reinstatement.
                  </p>
                </div>

                {/* Section 7 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    7. DISPUTES & CHARGEBACKS
                  </h2>
                  <p className="mb-4">
                    Contact support@fundedpro.com before escalating.
                  </p>
                  <p className="mb-4">
                    Initiating a chargeback without resolution:
                  </p>
                  <ul className="ml-4 list-inside list-disc space-y-2">
                    <li>Triggers permanent ban</li>
                    <li>Requires formal withdrawal of dispute</li>
                    <li>
                      Reactivation takes 45–60 business days after compliance
                    </li>
                  </ul>
                  <p className="mt-4">Trust is non-negotiable.</p>
                </div>

                {/* Section 8 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    8. KYC VERIFICATION
                  </h2>
                  <p className="mb-4">Mandatory before first payout.</p>
                  <ul className="ml-4 list-inside list-disc space-y-2">
                    <li>
                      Submit valid government ID (Passport or National ID)
                    </li>
                    <li>Expired documents rejected</li>
                    <li>Processed via Veriff or Sumsub</li>
                    <li>We do not store your personal data</li>
                  </ul>
                  <p className="mt-4">No KYC = No payout. Period.</p>
                </div>

                {/* Section 9 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    9. INTELLECTUAL PROPERTY
                  </h2>
                  <p className="mb-4">
                    Everything — platform, rules, systems, branding — is our
                    exclusive property.
                  </p>
                  <p className="mb-4">You will not:</p>
                  <ul className="ml-4 list-inside list-disc space-y-2">
                    <li>Replicate our models</li>
                    <li>Reverse-engineer our systems</li>
                    <li>Use our name or content without permission</li>
                  </ul>
                  <p className="mt-4">
                    We own the game. You play by our rules.
                  </p>
                </div>

                {/* Section 10 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    10. LIMITATION OF LIABILITY
                  </h2>
                  <p className="mb-4">Our services are provided "as is".</p>
                  <p className="mb-4">We are not liable for:</p>
                  <ul className="ml-4 list-inside list-disc space-y-2">
                    <li>Trading losses</li>
                    <li>Market volatility</li>
                    <li>Technical delays</li>
                    <li>Data inaccuracies</li>
                    <li>Indirect or consequential damages</li>
                  </ul>
                  <p className="mt-4">
                    You assume full risk. We provide opportunity — not
                    insurance.
                  </p>
                </div>

                {/* Section 11 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    11. CHANGES TO TERMS
                  </h2>
                  <p className="mb-4">We may update these Terms at any time.</p>
                  <p className="mb-4">Changes are effective upon:</p>
                  <ul className="ml-4 list-inside list-disc space-y-2">
                    <li>Website notice</li>
                    <li>Email notification</li>
                    <li>Dashboard alert</li>
                  </ul>
                  <p className="mt-4">
                    Your continued use = acceptance. Ignorance is not an excuse.
                  </p>
                </div>

                {/* Section 12 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    12. GOVERNING LAW
                  </h2>
                  <p className="mb-4">
                    These Terms are governed by the laws of St. Lucia.
                  </p>
                  <p className="mb-4">
                    Disputes resolved exclusively in the courts of St. Lucia.
                  </p>
                  <p>You submit to our jurisdiction. No exceptions.</p>
                </div>

                {/* Section 13 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    13. CONTACT
                  </h2>
                  <div className="rounded-lg bg-white/10 p-4">
                    <p className="mb-2">
                      <strong>Email:</strong> support@fundedpro.com
                    </p>
                    <p>
                      <strong>Address:</strong> Commercial Center, Level 2,
                      Rodney Bay, St. Lucia
                    </p>
                  </div>
                </div>

                {/* Prohibited Jurisdictions */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    PROHIBITED JURISDICTIONS
                  </h2>
                  <p className="mb-4">Our services are not available in:</p>
                  <ul className="ml-4 list-inside list-disc space-y-2">
                    <li>
                      USA, Bangladesh, Russia, Iran, North Korea, Syria, Sudan,
                      Cuba, Venezuela, Afghanistan, Belarus, Myanmar, Lebanon,
                      Libya, Somalia, Yemen, Zimbabwe
                    </li>
                  </ul>
                  <p className="mt-4">
                    We comply with OFAC, FATF, and global AML standards.
                  </p>
                </div>

                {/* Final Note */}
                <div className="bg-brand-cyan/10 border-brand-cyan/20 mt-8 rounded-lg border p-6">
                  <p className="text-center font-medium text-white">
                    <strong>FundedPro is not a platform. It's a filter.</strong>
                    <br />
                    We exist to identify the disciplined, the skilled, and the
                    relentless.
                    <br />
                    If you follow the rules, we reward you — massively.
                    <br />
                    If you test the boundaries, you are gone.
                    <br />
                    This is not a negotiation. It's the standard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
