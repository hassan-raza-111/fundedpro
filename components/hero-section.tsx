'use client';

import { useState, useEffect, useMemo, memo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock, DollarSign, Target } from 'lucide-react';

// Constants
const ANIMATION_DURATION = 2000;
const ANIMATION_DELAY = 500;
const PARTICLE_COUNT = 4; // Reduced from 8 to 4 for better performance
const SCROLL_OFFSET = 100;

// Types
interface CounterState {
  days: number;
  profit: number;
  fees: number;
  account: number;
}

interface Particle {
  left: number;
  top: number;
  delay: number;
  duration: number;
}

// Memoized background visual component
const BackgroundVisual = memo(() => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const particles = useMemo((): Particle[] => {
    if (!mounted) return [];

    return Array.from({ length: PARTICLE_COUNT }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4, // Reduced from 6 to 4
      duration: 6 + Math.random() * 3, // Reduced from 8+4 to 6+3
    }));
  }, [mounted]);

  return (
    <div className="bg-brand-gradient absolute inset-0">
      {/* Animated particles with performance optimizations */}
      <div className="absolute inset-0">
        {particles.map((particle, index) => (
          <div
            key={index}
            className="bg-brand-cyan/20 animate-float absolute h-2 w-2 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
              willChange: 'transform',
              transform: 'translateZ(0)',
            }}
          />
        ))}
      </div>

      {/* Trading chart lines with reduced opacity for better performance */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="h-full w-full"
          viewBox="0 0 1200 800"
          aria-hidden="true"
        >
          <path
            d="M0,400 Q300,200 600,300 T1200,250"
            stroke="#00e5ff"
            strokeWidth="1"
            fill="none"
            className="animate-pulse"
            style={{ animationDuration: '3s' }}
          />
          <path
            d="M0,500 Q400,300 800,400 T1200,350"
            stroke="#ffd700"
            strokeWidth="1"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '1s', animationDuration: '3s' }}
          />
        </svg>
      </div>
    </div>
  );
});

BackgroundVisual.displayName = 'BackgroundVisual';

// Memoized stat card component
const StatCard = memo(
  ({
    icon: Icon,
    value,
    label,
    iconColor,
    delay = 0,
  }: {
    icon: React.ComponentType<{ className?: string }>;
    value: string | number;
    label: string;
    iconColor: string;
    delay?: number;
  }) => (
    <div
      className="animate-fade-scale rounded-lg border border-white/20 bg-white/10 p-3 backdrop-blur-md transition-all duration-300 hover:bg-white/20 sm:p-4 md:p-6"
      style={{ animationDelay: `${delay}s` }}
    >
      <Icon
        className={`h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 ${iconColor} mx-auto mb-2 sm:mb-3`}
      />
      <div className="text-lg leading-tight font-bold text-white sm:text-xl md:text-2xl">
        {value}
      </div>
      <div className="text-xs leading-tight text-gray-300 sm:text-sm">
        {label}
      </div>
    </div>
  )
);

StatCard.displayName = 'StatCard';

// Memoized CTA button component
const CTAButton = memo(
  ({
    href,
    variant = 'primary',
    children,
  }: {
    href: string;
    variant?: 'primary' | 'secondary';
    children: React.ReactNode;
  }) => {
    const isExternal = href.startsWith('http');

    const baseClasses =
      'w-full sm:w-auto font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-lg transition-all duration-300 hover:scale-105 focus-visible:ring-2';

    const variantClasses =
      variant === 'primary'
        ? 'bg-brand-cyan hover:bg-brand-cyan/90 text-black animate-glow shadow-md hover:shadow-xl hover:shadow-brand-cyan/40 focus-visible:ring-brand-cyan/50'
        : 'border-2 border-white text-white hover:bg-brand-cyan hover:text-white hover:border-brand-cyan bg-transparent hover:shadow-lg hover:shadow-brand-cyan/30 focus-visible:ring-white/40';

    const Component = isExternal ? 'a' : 'a';
    const props = isExternal
      ? { href, target: '_blank', rel: 'noopener noreferrer' }
      : { href };

    return (
      <Component {...props}>
        <Button
          size="lg"
          variant={variant === 'secondary' ? 'outline' : 'default'}
          className={`${baseClasses} ${variantClasses}`}
        >
          {children}
        </Button>
      </Component>
    );
  }
);

CTAButton.displayName = 'CTAButton';

// Custom hook for counter animation
const useCounterAnimation = (targetValues: CounterState) => {
  const [counters, setCounters] = useState<CounterState>({
    days: 0,
    profit: 0,
    fees: 0,
    account: 0,
  });

  useEffect(() => {
    let rafId = 0;
    let start = 0;

    const animate = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / ANIMATION_DURATION);

      const next = {
        days: Math.floor(targetValues.days * progress),
        profit: Math.floor(targetValues.profit * progress),
        fees: Math.floor(targetValues.fees * progress),
        account: Math.floor(targetValues.account * progress),
      };

      setCounters(prev =>
        prev.days !== next.days ||
        prev.profit !== next.profit ||
        prev.fees !== next.fees ||
        prev.account !== next.account
          ? next
          : prev
      );

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    };

    const timeoutId = setTimeout(() => {
      rafId = requestAnimationFrame(animate);
    }, ANIMATION_DELAY);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(rafId);
    };
  }, [targetValues]);

  return counters;
};

// TrustBox Widget Component with hydration handling
const TrustBoxWidget = memo(() => {
  const [mounted, setMounted] = useState(false);
  const [widgetInitialized, setWidgetInitialized] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Initialize TrustBox script
    const script = document.createElement('script');
    script.src =
      'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
    script.async = true;
    script.onload = () => {
      setWidgetInitialized(true);
    };
    script.onerror = () => {
      setWidgetInitialized(true); // Allow fallback to show even if script fails
    };
    document.body.appendChild(script);

    return () => {
      // Clean up script on unmount
      document.body.removeChild(script);
    };
  }, []);

  // Show widget container while waiting for initialization
  if (!widgetInitialized) {
    return (
      <div className="mx-auto max-w-2xl px-2 sm:px-4">
        <div className="trustpilot-widget-container">
          <div className="trustpilot-widget-placeholder">
            <div className="flex items-center justify-center space-x-2">
              <div className="border-brand-cyan h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
              <span className="text-sm text-gray-400">
                Initializing TrustBox...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback if TrustBox doesn't load - show a manual trust display
  const showFallback =
    !(window as any).Trustpilot ||
    !document.querySelector('.trustpilot-widget iframe');

  if (showFallback) {
    return (
      <div className="mx-auto max-w-2xl px-2 sm:px-4">
        <div className="trustpilot-widget-container">
          <div className="flex items-center justify-center space-x-4 p-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">
                <span className="text-sm font-bold text-white">★</span>
              </div>
              <div className="text-left">
                <div className="font-semibold text-white">
                  Trusted by Traders
                </div>
                <div className="text-sm text-gray-300">
                  Join thousands of successful traders
                </div>
              </div>
            </div>
            <a
              href="https://uk.trustpilot.com/review/thefundedpro.com"
              target="_blank"
              rel="noopener"
              className="bg-brand-cyan hover:bg-brand-cyan/90 rounded-lg px-4 py-2 text-sm font-medium text-black transition-colors"
            >
              Read Reviews
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-2 sm:px-4">
      <div className="trustpilot-widget-container">
        <div
          className="trustpilot-widget"
          data-locale="en-GB"
          data-template-id="56278e9abfbbba0bdcd568bc"
          data-businessunit-id="68aeec077630f16cf2baf983"
          data-style-height="52px"
          data-style-width="100%"
          data-token="70d221f4-9ed6-4a19-bae0-a1a9fe0ab676"
        >
          <a
            href="https://uk.trustpilot.com/review/thefundedpro.com"
            target="_blank"
            rel="noopener"
            className="text-transparent"
          >
            Trustpilot
          </a>
        </div>
      </div>
    </div>
  );
});

TrustBoxWidget.displayName = 'TrustBoxWidget';

// Main hero section component
export function HeroSection() {
  const targetValues = useMemo(
    () => ({
      days: 100,
      profit: 80,
      fees: 50,
      account: 100,
    }),
    []
  );

  const counters = useCounterAnimation(targetValues);

  // Memoized stats data
  const statsData = useMemo(
    () => [
      {
        icon: Clock,
        value: 'Unlimited',
        label: 'Day Evaluation',
        iconColor: 'text-brand-cyan',
        delay: 0,
      },
      {
        icon: TrendingUp,
        value: `Up to ${counters.profit}%`,
        label: 'Profit Split',
        iconColor: 'text-brand-gold',
        delay: 0.1,
      },
      {
        icon: DollarSign,
        value: `${counters.fees}%`,
        label: 'Lower Fees',
        iconColor: 'text-brand-cyan',
        delay: 0.2,
      },
      {
        icon: Target,
        value: `$${counters.account}K+`,
        label: 'Account Sizes',
        iconColor: 'text-brand-gold',
        delay: 0.3,
      },
    ],
    [counters]
  );

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden pt-16 pb-16 sm:pt-20 sm:pb-20 md:pt-24 md:pb-24 lg:pt-28 xl:pt-32">
      <BackgroundVisual />

      <div className="relative z-10 mx-auto max-w-7xl px-3 text-center sm:px-4 md:px-6 lg:px-8">
        <div className="animate-slide-up space-y-6 sm:space-y-8">
          {/* Main headline */}
          <h1 className="font-display px-2 text-2xl leading-tight font-bold text-white sm:px-4 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl">
            Redefining Proprietary
            <br />
            <span className="text-brand-cyan animate-typing">
              Trade Across Borders
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto max-w-4xl px-2 text-sm leading-relaxed text-gray-300 sm:px-4 sm:text-base md:text-lg lg:text-xl xl:text-2xl">
            Two flexible funding models with extended evaluation periods,
            industry leading profit splits, and built-in brokerage support for
            seamless execution
          </p>

          {/* TrustBox Widget */}
          <TrustBoxWidget />

          {/* Stats grid */}
          <div className="mx-auto mt-6 grid max-w-4xl grid-cols-2 gap-3 px-2 sm:mt-8 sm:gap-4 sm:px-4 md:mt-12 md:gap-6 lg:grid-cols-4">
            {statsData.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* CTA buttons */}
          <div className="mt-6 mb-8 flex flex-col items-center justify-center gap-3 px-2 sm:mt-8 sm:mb-10 sm:flex-row sm:gap-4 sm:px-4 md:mt-12 md:mb-16">
            <CTAButton
              href="https://portal.thefundedpro.com/register"
              variant="primary"
            >
              Get Funded
            </CTAButton>
            <CTAButton href="#plans" variant="secondary">
              Explore Tracks
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
