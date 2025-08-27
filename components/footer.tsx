'use client';

import { memo, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from 'lucide-react';

// Constants
const COMPANY_INFO = {
  name: 'FundedPro',
  description:
    'Empowering promising traders worldwide with extended evaluation periods, industry-leading profit splits, and advanced technology.',
  email: 'support@thefundedpro.com',
  address: {
    line1: 'Commercial Center, Level 2',
    line2: 'Rodney Bay, St. Lucia',
  },
} as const;

const SOCIAL_LINKS = [
  { name: 'Facebook', href: 'https://www.facebook.com', icon: Facebook },
  { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { name: 'LinkedIn', href: 'https://www.linkedin.com', icon: Linkedin },
  { name: 'Instagram', href: 'https://www.instagram.com', icon: Instagram },
] as const;

const QUICK_LINKS = [
  { name: 'About', href: '/#about' },
  { name: 'Plans', href: '/#plans' },
  { name: 'FAQ', href: '/#faq' },
  { name: 'Contact', href: '/#contact' },
  { name: 'Terms of Service', href: '/?page=terms-of-service' },
  { name: 'Privacy Policy', href: '/?page=privacy-policy' },
] as const;

// Types
type SocialLink = (typeof SOCIAL_LINKS)[number];
type QuickLink = (typeof QUICK_LINKS)[number];

// Utility functions
const isHashLink = (href: string): boolean => href.includes('/#');
const isPageLink = (href: string): boolean => !isHashLink(href);

// Optimized Social Icon Component
const SocialIcon = memo(({ name, href, icon: IconComponent }: SocialLink) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer nofollow"
    aria-label={`${name} (opens in new tab)`}
    className="group hover:bg-brand-cyan/20 focus-visible:ring-brand-cyan/40 flex h-9 w-9 transform-gpu items-center justify-center rounded-full bg-white/10 transition-all duration-300 hover:scale-110 focus-visible:ring-2 sm:h-10 sm:w-10"
  >
    <IconComponent
      className="group-hover:text-brand-cyan h-4 w-4 text-gray-300 sm:h-5 sm:w-5"
      aria-hidden="true"
    />
  </a>
));
SocialIcon.displayName = 'SocialIcon';

// Optimized Link Component
const FooterLink = memo(({ link }: { link: QuickLink }) => {
  const linkClasses =
    'text-gray-300 hover:text-brand-cyan transition-colors duration-200 hover:underline focus-visible:ring-2 focus-visible:ring-brand-cyan/40 rounded focus-visible:outline-none cursor-pointer';

  if (isPageLink(link.href)) {
    return (
      <Link href={link.href} className={linkClasses}>
        {link.name}
      </Link>
    );
  }

  return (
    <a
      href={link.href}
      onClick={useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
          if (typeof window === 'undefined') return;

          e.preventDefault();
          const currentUrl = window.location.href;
          const isOnMainPage = !currentUrl.includes('page=');

          if (isOnMainPage) {
            const targetId = link.href.split('/#')[1];
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
              targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }
          } else {
            window.location.href = link.href;
          }
        },
        [link.href]
      )}
      className={linkClasses}
    >
      {link.name}
    </a>
  );
});
FooterLink.displayName = 'FooterLink';

// Email Handler Component
const EmailHandler = memo(() => {
  const handleEmailClick = useCallback(() => {
    if (typeof window === 'undefined') return;

    const email = COMPANY_INFO.email;
    window.location.href = `mailto:${email}`;

    setTimeout(async () => {
      const confirmed = window.confirm(
        `Couldn't open your email app? Copy the address?\n\n${email}`
      );
      if (confirmed) {
        try {
          await navigator.clipboard.writeText(email);
          alert('Email copied to clipboard!');
        } catch {
          alert('Failed to copy email. Please copy it manually.');
        }
      }
    }, 1000);
  }, []);

  return (
    <button
      type="button"
      onClick={handleEmailClick}
      className="text-brand-cyan focus:ring-brand-cyan/40 rounded hover:underline focus:ring-2 focus:outline-none"
      aria-label="Contact support via email"
    >
      {COMPANY_INFO.email}
    </button>
  );
});
EmailHandler.displayName = 'EmailHandler';

// Newsletter Form Component
const NewsletterForm = memo(() => {
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email')?.toString().trim();

    if (email && /\S+@\S+\.\S+/.test(email)) {
      alert('Thank you for subscribing!');
      e.currentTarget.reset();
    } else {
      alert('Please enter a valid email.');
    }
  }, []);

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        required
        placeholder="Enter your email"
        className="focus:border-brand-cyan focus:ring-brand-cyan/30 flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-white placeholder-gray-400 transition-colors duration-300 focus:ring-2 focus:outline-none sm:px-4"
      />
      <button
        type="submit"
        className="bg-brand-cyan hover:bg-brand-cyan/90 focus-visible:ring-brand-cyan/40 w-full rounded-lg px-4 py-2 font-semibold text-black transition-all duration-300 hover:scale-105 focus-visible:ring-2"
      >
        Subscribe
      </button>
    </form>
  );
});
NewsletterForm.displayName = 'NewsletterForm';

// Company Info Section
const CompanyInfo = memo(() => (
  <div className="lg:col-span-2">
    <div className="mb-6">
      <h1 className="font-display mb-3 text-2xl font-bold text-white sm:mb-4 sm:text-3xl">
        {COMPANY_INFO.name.split('Pro')[0]}
        <span className="text-brand-cyan">Pro</span>
      </h1>
      <p className="max-w-xl leading-relaxed text-gray-300">
        {COMPANY_INFO.description}
      </p>
    </div>

    <div className="space-y-4 text-sm">
      <div className="flex items-start gap-3 text-gray-300">
        <Mail
          className="text-brand-cyan mt-0.5 h-5 w-5 flex-shrink-0"
          aria-hidden="true"
        />
        <div>
          <p className="text-gray-300">Need help?</p>
          <EmailHandler />
        </div>
      </div>

      <div className="flex items-start gap-3 text-gray-300">
        <MapPin
          className="text-brand-cyan mt-0.5 h-5 w-5 flex-shrink-0"
          aria-hidden="true"
        />
        <address className="text-gray-300 not-italic">
          {COMPANY_INFO.address.line1}
          <br />
          {COMPANY_INFO.address.line2}
        </address>
      </div>
    </div>
  </div>
));
CompanyInfo.displayName = 'CompanyInfo';

// Quick Links Section
const QuickLinks = memo(() => (
  <nav aria-label="Quick links">
    <h2 className="mb-5 text-lg font-semibold text-white sm:mb-6 sm:text-xl">
      Quick Links
    </h2>
    <ul className="space-y-2 sm:space-y-3">
      {QUICK_LINKS.map(link => (
        <li key={link.name}>
          <FooterLink link={link} />
        </li>
      ))}
    </ul>
  </nav>
));
QuickLinks.displayName = 'QuickLinks';

// Social & Newsletter Section
const SocialNewsletter = memo(() => (
  <div>
    <h2 className="mb-5 text-lg font-semibold text-white sm:mb-6 sm:text-xl">
      Connect With Us
    </h2>
    <div className="mb-6 flex gap-3 sm:mb-8 sm:gap-4">
      {SOCIAL_LINKS.map(social => (
        <SocialIcon key={social.name} {...social} />
      ))}
    </div>

    <div>
      <h3 className="mb-3 text-base font-semibold text-white sm:text-lg">
        Stay Updated
      </h3>
      <NewsletterForm />
    </div>
  </div>
));
SocialNewsletter.displayName = 'SocialNewsletter';

// Copyright Section
const Copyright = memo(() => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="mt-8 border-t border-white/10 pt-3 pb-2 sm:mt-10 sm:pt-4 sm:pb-3 lg:mt-8 lg:pt-2 lg:pb-2">
      <p className="text-center text-xs leading-tight text-gray-400 sm:text-sm lg:text-xs">
        © <span suppressHydrationWarning={true}>{currentYear}</span>{' '}
        {COMPANY_INFO.name}. All rights reserved.
      </p>
    </div>
  );
});
Copyright.displayName = 'Copyright';

// Main Footer Component
export const Footer = memo(() => (
  <footer
    role="contentinfo"
    className="relative border-t border-white/10 bg-gradient-to-b from-[#0f1419] to-[#000000]"
  >
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <CompanyInfo />
        <QuickLinks />
        <SocialNewsletter />
      </div>
      <Copyright />
    </div>

    {/* Gradient Accent Bar */}
    <div className="from-brand-cyan via-brand-gold to-brand-cyan absolute right-0 bottom-0 left-0 h-0.5 bg-gradient-to-r" />
  </footer>
));
Footer.displayName = 'Footer';
