"use client";

import { useState, useEffect, useMemo, memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, DollarSign, Target } from "lucide-react";

// Constants
const ANIMATION_DURATION = 2000;
const ANIMATION_DELAY = 500;
const PARTICLE_COUNT = 8;
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
      delay: Math.random() * 6,
      duration: 8 + Math.random() * 4,
    }));
  }, [mounted]);

  return (
    <div className="absolute inset-0 bg-brand-gradient">
      {/* Animated particles */}
      <div className="absolute inset-0">
        {particles.map((particle, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 bg-brand-cyan/20 rounded-full animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Trading chart lines */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1200 800" aria-hidden="true">
          <path
            d="M0,400 Q300,200 600,300 T1200,250"
            stroke="#00e5ff"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M0,500 Q400,300 800,400 T1200,350"
            stroke="#ffd700"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </svg>
      </div>
    </div>
  );
});

BackgroundVisual.displayName = "BackgroundVisual";

// Memoized stat card component
const StatCard = memo(({ 
  icon: Icon, 
  value, 
  label, 
  iconColor, 
  delay = 0 
}: { 
  icon: React.ComponentType<{ className?: string }>;
  value: string | number;
  label: string;
  iconColor: string;
  delay?: number;
}) => (
  <div
    className="bg-white/10 backdrop-blur-md rounded-lg p-4 sm:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 animate-fade-scale"
    style={{ animationDelay: `${delay}s` }}
  >
    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${iconColor} mx-auto mb-2`} />
    <div className="text-2xl sm:text-2xl font-bold text-white leading-tight">
      {value}
    </div>
    <div className="text-xs sm:text-sm text-gray-300">{label}</div>
  </div>
));

StatCard.displayName = "StatCard";

// Memoized CTA button component
const CTAButton = memo(({ 
  href, 
  variant = "primary", 
  children 
}: { 
  href: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}) => {
  const isExternal = href.startsWith("http");
  
  const baseClasses = "w-full sm:w-auto font-semibold px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-lg transition-all duration-300 hover:scale-105 focus-visible:ring-2";
  
  const variantClasses = variant === "primary" 
    ? "bg-brand-cyan hover:bg-brand-cyan/90 text-black animate-glow shadow-md hover:shadow-xl hover:shadow-brand-cyan/40 focus-visible:ring-brand-cyan/50"
    : "border-2 border-white text-white hover:bg-brand-cyan hover:text-white hover:border-brand-cyan bg-transparent hover:shadow-lg hover:shadow-brand-cyan/30 focus-visible:ring-white/40";

  const Component = isExternal ? "a" : "a";
  const props = isExternal 
    ? { href, target: "_blank", rel: "noopener noreferrer" }
    : { href };

  return (
    <Component {...props}>
      <Button size="lg" variant={variant === "secondary" ? "outline" : "default"} className={`${baseClasses} ${variantClasses}`}>
        {children}
      </Button>
    </Component>
  );
});

CTAButton.displayName = "CTAButton";

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
        prev.days !== next.days || prev.profit !== next.profit || 
        prev.fees !== next.fees || prev.account !== next.account ? next : prev
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

// Main hero section component
export function HeroSection() {
  const targetValues = useMemo(() => ({
    days: 100,
    profit: 80,
    fees: 50,
    account: 100,
  }), []);

  const counters = useCounterAnimation(targetValues);

  // Memoized stats data
  const statsData = useMemo(() => [
    {
      icon: Clock,
      value: "Unlimited",
      label: "Day Evaluation",
      iconColor: "text-brand-cyan",
      delay: 0,
    },
    {
      icon: TrendingUp,
      value: `Up to ${counters.profit}%`,
      label: "Profit Split",
      iconColor: "text-brand-gold",
      delay: 0.1,
    },
    {
      icon: DollarSign,
      value: `${counters.fees}%`,
      label: "Lower Fees",
      iconColor: "text-brand-cyan",
      delay: 0.2,
    },
    {
      icon: Target,
      value: `$${counters.account}K+`,
      label: "Account Sizes",
      iconColor: "text-brand-gold",
      delay: 0.3,
    },
  ], [counters]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-28 lg:pt-32 pb-20 md:pb-24">
      <BackgroundVisual />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8 animate-slide-up">
          {/* Main headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold font-display text-white leading-tight px-4">
            Redefining Proprietary
            <br />
            <span className="text-brand-cyan animate-typing">Trade Across Borders</span>
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed px-4">
            Two flexible funding models with extended evaluation periods, industry leading profit splits, and built-in
            brokerage support for seamless execution
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto mt-8 sm:mt-12 px-4">
            {statsData.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8 sm:mt-12 mb-10 sm:mb-16 px-4">
            <CTAButton href="https://portal.thefundedpro.com/register" variant="primary">
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
