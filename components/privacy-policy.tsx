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

// Privacy Policy Navigation Component
const PrivacyPolicyNavigation = memo(() => {
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
PrivacyPolicyNavigation.displayName = 'PrivacyPolicyNavigation';

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#2d1b69] via-[#1a237e] to-[#0f1419]">
      <PrivacyPolicyNavigation />

      <div className="pt-20 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-300">
              Last Updated: {LAST_UPDATED}
            </p>
          </div>

          {/* Privacy Content */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-md sm:p-8 lg:p-12">
            <div className="prose prose-invert max-w-none">
              <div className="space-y-6 text-sm leading-relaxed text-gray-300 sm:text-base">
                {/* Introduction */}
                <div>
                  <p className="mb-4">
                    FundedPro operates as a high-performance proprietary trading
                    firm founded by Destiny Isibor, headquartered at Commercial
                    Center, Level 2, Rodney Bay, St. Lucia.
                  </p>
                  <p className="mb-4">
                    We do not collect data to exploit. We collect it to protect,
                    verify, and empower.
                  </p>
                  <p className="mb-4">
                    This Privacy Policy defines how we handle your personal
                    information. It is not a legal loophole. It is a contract of
                    clarity.
                  </p>
                  <p className="font-semibold text-white">
                    If you use our Services, you agree to this Policy. No
                    ambiguity. No evasion.
                  </p>
                </div>

                {/* Section 1 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    1. WHO CONTROLS YOUR DATA?
                  </h2>
                  <p className="mb-4">
                    FundedPro is the data controller. We determine why and how
                    your personal data is processed.
                  </p>
                  <div className="mb-4 rounded-lg bg-white/10 p-4">
                    <p className="mb-2">
                      <strong>For questions or to exercise your rights:</strong>
                    </p>
                    <p className="text-brand-cyan">
                      📧 support@thefundedpro.com
                    </p>
                  </div>
                  <p className="font-semibold text-white">
                    We respond. We comply. But we do not negotiate with bad
                    faith.
                  </p>
                </div>

                {/* Section 2 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    2. WHAT WE COLLECT & WHY
                  </h2>
                  <p className="mb-4">
                    We collect only what is necessary. Nothing more. Nothing
                    hidden.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-white">
                        A. Information You Provide
                      </h3>
                      <p className="mb-2">
                        When you register, trade, or contact us, you give us:
                      </p>
                      <ul className="ml-4 list-inside list-disc space-y-1">
                        <li>Full name, email, phone number</li>
                        <li>Date of birth, postal address</li>
                        <li>Login credentials, account preferences</li>
                        <li>
                          Payment details (processed via secure third parties)
                        </li>
                      </ul>
                      <div className="mt-3 rounded-lg bg-white/10 p-3">
                        <p className="text-sm">
                          <strong>Purpose:</strong> To verify identity, deliver
                          Services, and fulfill contractual obligations.
                        </p>
                        <p className="text-sm">
                          <strong>Legal Basis:</strong> Performance of contract.
                          Legitimate interest.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-white">
                        B. Information We Automatically Collect
                      </h3>
                      <p className="mb-2">When you use our platform:</p>
                      <ul className="ml-4 list-inside list-disc space-y-1">
                        <li>IP address, device type, browser</li>
                        <li>Login/logout times, session duration</li>
                        <li>
                          Trading activity (simulated), account balance,
                          strategy behavior
                        </li>
                        <li>Referral source, affiliate link usage</li>
                      </ul>
                      <div className="mt-3 rounded-lg bg-white/10 p-3">
                        <p className="text-sm">
                          <strong>Purpose:</strong> To secure the platform,
                          detect anomalies, and optimize performance.
                        </p>
                        <p className="text-sm">
                          <strong>Legal Basis:</strong> Legitimate interest.
                          Contractual necessity.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-white">
                        C. Information From Third Parties
                      </h3>
                      <p className="mb-2">
                        If you link external platforms (e.g., Tradovate,
                        MyFundedFX):
                      </p>
                      <ul className="ml-4 list-inside list-disc space-y-1">
                        <li>Trading performance data</li>
                        <li>Profile username, avatar, social trading stats</li>
                        <li>Instrument types, trade timestamps</li>
                      </ul>
                      <div className="mt-3 rounded-lg bg-white/10 p-3">
                        <p className="text-sm">
                          <strong>Purpose:</strong> To sync your activity and
                          validate performance.
                        </p>
                        <p className="text-sm">
                          <strong>Note:</strong> These platforms have their own
                          privacy policies. We are not responsible for their
                          practices.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="mb-2 text-lg font-semibold text-white">
                        D. Marketing Communication (Phone & SMS)
                      </h3>
                      <p className="mb-2">
                        If you provide a phone number during registration or
                        events:
                      </p>
                      <ul className="ml-4 list-inside list-disc space-y-1">
                        <li>
                          We may contact you via manual or AI-driven calls and
                          SMS
                        </li>
                        <li>
                          For service updates, promotions, or partnership offers
                        </li>
                        <li>You can opt out at any time. Just reply: STOP.</li>
                      </ul>
                      <div className="mt-3 rounded-lg bg-white/10 p-3">
                        <p className="text-sm">
                          <strong>Purpose:</strong> To provide marketing
                          communications.
                        </p>
                        <p className="text-sm">
                          <strong>Legal Basis:</strong> Consent or legitimate
                          interest.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    3. HOW WE USE YOUR DATA
                  </h2>
                  <p className="mb-4">We process your information for:</p>
                  <ul className="ml-4 list-inside list-disc space-y-2">
                    <li>Account creation and authentication</li>
                    <li>Service delivery (evaluation, funding, payouts)</li>
                    <li>KYC and fraud prevention</li>
                    <li>Platform security and behavioral monitoring</li>
                    <li>Analytics to improve user experience</li>
                    <li>Targeted communication (only if permitted)</li>
                  </ul>
                  <div className="mt-4 rounded-lg bg-white/10 p-4">
                    <p className="font-semibold text-white">
                      We do not sell, rent, or trade your data.
                    </p>
                  </div>
                </div>

                {/* Section 4 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    4. DATA SECURITY
                  </h2>
                  <p className="mb-4">
                    Your information is encrypted in transit and at rest. Stored
                    in secure systems with strict access controls.
                  </p>

                  <div className="mb-4 rounded-lg bg-white/10 p-4">
                    <p className="mb-3 font-semibold text-white">We use:</p>
                    <ul className="ml-4 list-inside list-disc space-y-1">
                      <li>AES-256 encryption</li>
                      <li>Multi-factor authentication</li>
                      <li>Real-time intrusion detection</li>
                      <li>Third-party penetration testing</li>
                    </ul>
                  </div>

                  <div className="bg-brand-cyan/10 border-brand-cyan/20 mb-4 rounded-lg border p-4">
                    <p className="font-semibold text-white">
                      We do not store KYC data. It is processed and secured by
                      Veriff, Sumsub, or equivalent — not us.
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/10 p-4">
                    <p className="font-semibold text-white">
                      Security is not optional. It is non-negotiable.
                    </p>
                  </div>
                </div>

                {/* Section 5 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    5. DATA SHARING
                  </h2>
                  <p className="mb-4">
                    We share your data only when necessary:
                  </p>

                  <div className="space-y-3">
                    <div className="rounded-lg bg-white/10 p-3">
                      <p className="font-semibold text-white">
                        Payment Processors (e.g., Rise)
                      </p>
                      <p className="text-white/90">
                        Payouts, transaction processing
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-3">
                      <p className="font-semibold text-white">
                        KYC Providers (e.g., Veriff, Sumsub)
                      </p>
                      <p className="text-white/90">Identity verification</p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-3">
                      <p className="font-semibold text-white">
                        IT & Cloud Infrastructure Partners
                      </p>
                      <p className="text-white/90">
                        Platform stability, data hosting
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-3">
                      <p className="font-semibold text-white">
                        Marketing & Analytics Tools
                      </p>
                      <p className="text-white/90">
                        User behavior insights (anonymous where possible)
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-3">
                      <p className="font-semibold text-white">
                        Legal & Compliance Authorities
                      </p>
                      <p className="text-white/90">
                        If required by law or to prevent fraud
                      </p>
                    </div>
                  </div>

                  <div className="bg-brand-cyan/10 border-brand-cyan/20 mt-4 rounded-lg border p-4">
                    <p className="font-semibold text-white">
                      All third parties are contractually bound to protect your
                      data. No exceptions.
                    </p>
                  </div>
                </div>

                {/* Section 6 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    6. INTERNATIONAL TRANSFERS
                  </h2>
                  <p className="mb-4">
                    Your data may be processed outside your home country.
                    Including in jurisdictions with different privacy laws.
                  </p>
                  <div className="rounded-lg bg-white/10 p-4">
                    <p className="text-white">
                      We ensure all transfers comply with international
                      standards. We protect your rights — even across borders.
                    </p>
                  </div>
                </div>

                {/* Section 7 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    7. DATA RETENTION
                  </h2>
                  <p className="mb-4">
                    We keep your data only as long as needed:
                  </p>

                  <div className="space-y-3">
                    <div className="rounded-lg bg-white/10 p-3">
                      <p className="font-semibold text-white">
                        Active accounts:
                      </p>
                      <p className="text-white/90">Until closure + 5 years</p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-3">
                      <p className="font-semibold text-white">
                        Inactive accounts:
                      </p>
                      <p className="text-white/90">
                        5 years from last activity
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-3">
                      <p className="font-semibold text-white">KYC records:</p>
                      <p className="text-white/90">
                        5 years (handled by third parties)
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/10 p-3">
                      <p className="font-semibold text-white">
                        Marketing opt-out requests:
                      </p>
                      <p className="text-white/90">Permanently logged</p>
                    </div>
                  </div>

                  <div className="bg-brand-cyan/10 border-brand-cyan/20 mt-4 rounded-lg border p-4">
                    <p className="font-semibold text-white">
                      After retention: data is deleted or anonymized.
                    </p>
                  </div>
                </div>

                {/* Section 8 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    8. YOUR RIGHTS
                  </h2>
                  <p className="mb-4">You have full control — within reason.</p>

                  <div className="mb-4 rounded-lg bg-white/10 p-4">
                    <p className="mb-4 font-semibold text-white">You can:</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">✅</span>
                        <span className="text-white/90">
                          Access your personal data
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">✅</span>
                        <span className="text-white/90">
                          Correct inaccurate information
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">✅</span>
                        <span className="text-white/90">
                          Delete your data (where applicable)
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">✅</span>
                        <span className="text-white/90">
                          Restrict processing
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">✅</span>
                        <span className="text-white/90">
                          Port your data in machine-readable format
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">✅</span>
                        <span className="text-white/90">
                          Object to marketing or profiling
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400">✅</span>
                        <span className="text-white/90">
                          Withdraw consent anytime
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-cyan/10 border-brand-cyan/20 rounded-lg border p-4">
                    <p className="mb-2 font-semibold text-white">How?</p>
                    <p className="text-brand-cyan">
                      Email: support@thefundedpro.com
                    </p>
                    <p className="mt-2 text-white/90">
                      We respond within 7 business days. No bureaucracy. No
                      runaround.
                    </p>
                  </div>
                </div>

                {/* Section 9 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    9. AUTOMATED DECISION-MAKING
                  </h2>
                  <p className="mb-4">We use behavioral algorithms to:</p>
                  <ul className="ml-4 list-inside list-disc space-y-2">
                    <li>Detect rule violations</li>
                    <li>Flag suspicious trading patterns</li>
                    <li>Prevent fraud and abuse</li>
                  </ul>
                  <div className="mb-4 rounded-lg bg-white/10 p-4">
                    <p className="font-semibold text-white">
                      These systems do not make final decisions. Humans do.
                    </p>
                  </div>
                  <div className="bg-brand-cyan/10 border-brand-cyan/20 rounded-lg border p-4">
                    <p className="text-white">
                      You have the right to contest any automated outcome. We
                      will review it — objectively.
                    </p>
                  </div>
                </div>

                {/* Section 10 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    10. COOKIES & TRACKING
                  </h2>
                  <p className="mb-4">We use cookies to:</p>
                  <ul className="ml-4 list-inside list-disc space-y-2">
                    <li>Authenticate sessions</li>
                    <li>Remember preferences</li>
                    <li>Analyze traffic</li>
                    <li>Deliver targeted ads</li>
                  </ul>

                  <div className="mb-4 rounded-lg bg-white/10 p-4">
                    <p className="mb-3 font-semibold text-white">
                      Types we use:
                    </p>
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold text-white">Essential:</p>
                        <p className="text-white/90">
                          Required for login, security (cannot be disabled)
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-white">Functional:</p>
                        <p className="text-white/90">Remember your settings</p>
                      </div>
                      <div>
                        <p className="font-semibold text-white">Analytics:</p>
                        <p className="text-white/90">
                          Understand platform usage
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-white">Advertising:</p>
                        <p className="text-white/90">
                          Serve relevant offers (you can opt out)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-brand-cyan/10 border-brand-cyan/20 rounded-lg border p-4">
                    <p className="text-white">
                      You can manage cookies in your browser. But disabling some
                      may break functionality. A full cookie list is available
                      upon request.
                    </p>
                  </div>
                </div>

                {/* Section 11 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    11. POLICY UPDATES
                  </h2>
                  <p className="mb-4">We may update this Policy at any time.</p>
                  <p className="mb-4">Changes are effective upon:</p>
                  <ul className="ml-4 list-inside list-disc space-y-2">
                    <li>Website notice</li>
                    <li>Email alert</li>
                    <li>Dashboard notification</li>
                  </ul>
                  <div className="rounded-lg bg-white/10 p-4">
                    <p className="font-semibold text-white">
                      Your continued use = acceptance. Check back occasionally.
                    </p>
                  </div>
                </div>

                {/* Section 12 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    12. JURISDICTION & ENFORCEMENT
                  </h2>
                  <p className="mb-4">
                    This Policy is governed by the laws of St. Lucia. Disputes
                    resolved exclusively in Rodney Bay, St. Lucia.
                  </p>

                  <div className="mb-4 rounded-lg bg-white/10 p-4">
                    <p className="mb-3 font-semibold text-white">
                      We comply with global standards:
                    </p>
                    <ul className="ml-4 list-inside list-disc space-y-1">
                      <li>GDPR (EU)</li>
                      <li>CCPA (California)</li>
                      <li>FATF, OFAC, AML/CFT protocols</li>
                    </ul>
                  </div>

                  <div className="bg-brand-cyan/10 border-brand-cyan/20 rounded-lg border p-4">
                    <p className="font-semibold text-white">
                      Ignorance of local law is not a defense.
                    </p>
                  </div>
                </div>

                {/* Section 13 */}
                <div>
                  <h2 className="mb-4 text-xl font-bold text-white sm:text-2xl">
                    13. FINAL NOTE
                  </h2>
                  <div className="rounded-lg bg-white/10 p-6">
                    <div className="space-y-4">
                      <p className="font-semibold text-white">
                        FundedPro does not manipulate. It filters.
                      </p>
                      <p>
                        We collect data not to control you — but to verify
                        integrity.
                      </p>
                      <p>To ensure fairness. To reward discipline.</p>
                      <p>If you follow the rules, you have nothing to fear.</p>
                      <p>If you test the system, you will be found.</p>
                      <p>This is not surveillance.</p>
                      <p className="font-semibold text-white">
                        This is selective trust.
                      </p>
                    </div>
                  </div>
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
