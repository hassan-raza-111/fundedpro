'use client';

import { memo, useMemo } from 'react';
import { Clock, TrendingUp, Tag } from 'lucide-react';

// Types
interface HighlightData {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  mainText: string;
  subText: string;
  gradient: string;
  iconColor: string;
}

// Constants
const HIGHLIGHTS_DATA: HighlightData[] = [
  {
    icon: Clock,
    title: 'Extended Evaluation',
    mainText: 'Unlimited Day Challenge Period',
    subText: '3x longer than competitors',
    gradient: 'from-brand-cyan/20 to-blue-500/20',
    iconColor: 'text-brand-cyan',
  },
  {
    icon: TrendingUp,
    title: 'Higher Profits',
    mainText: '70-80% Profit Splits',
    subText: 'Keep more of what you earn',
    gradient: 'from-brand-gold/20 to-yellow-500/20',
    iconColor: 'text-brand-gold',
  },
  {
    icon: Tag,
    title: 'Lower Costs',
    mainText: 'Up to 50% Lower Fees',
    subText: 'More affordable than industry average',
    gradient: 'from-brand-cyan/20 to-green-500/20',
    iconColor: 'text-brand-cyan',
  },
];

// Memoized highlight card component
const HighlightCard = memo(({ highlight }: { highlight: HighlightData }) => {
  const IconComponent = highlight.icon;

  return (
    <div
      className={`group relative bg-gradient-to-br ${highlight.gradient} hover:shadow-brand-cyan/20 min-h-[200px] rounded-xl border border-white/10 p-4 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:border-white/30 hover:shadow-2xl sm:min-h-[240px] sm:rounded-2xl sm:p-6 md:min-h-[260px] md:p-8`}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:rounded-2xl" />

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Icon */}
        <div className="mb-4 sm:mb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-colors duration-300 group-hover:bg-white/20 sm:h-14 sm:w-14 md:h-16 md:w-16">
            <IconComponent
              className={`h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 ${highlight.iconColor}`}
            />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-display mb-3 text-lg font-semibold text-white sm:mb-4 sm:text-xl">
          {highlight.title}
        </h3>

        {/* Main text */}
        <div className="mb-2 text-lg leading-tight font-bold text-white sm:text-xl md:text-2xl">
          {highlight.mainText}
        </div>

        {/* Sub text */}
        <p className="px-2 text-xs leading-relaxed text-gray-300 sm:text-sm">
          {highlight.subText}
        </p>

        {/* Decorative element */}
        <div className="from-brand-cyan to-brand-gold mx-auto mt-4 h-1 w-8 rounded-full bg-gradient-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-100 sm:mt-6 sm:w-12" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="animate-float absolute h-1 w-1 rounded-full bg-white/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              left: `${20 + index * 30}%`,
              top: `${20 + index * 20}%`,
              animationDelay: `${index * 0.5}s`,
              animationDuration: `${3 + index}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
});

HighlightCard.displayName = 'HighlightCard';

// Memoized CTA button component
const CTAButton = memo(() => (
  <a href="#plans" className="inline-block">
    <button className="from-brand-cyan hover:from-brand-cyan/90 hover:shadow-brand-cyan/30 rounded-lg bg-gradient-to-r to-blue-500 px-6 py-3 text-sm font-semibold text-black shadow-lg transition-all duration-300 hover:scale-105 hover:to-blue-500/90 sm:px-8 sm:text-base">
      Explore Our Plans
    </button>
  </a>
));

CTAButton.displayName = 'CTAButton';

// Main key highlights section component
export function KeyHighlightsSection() {
  // Memoized highlights data to prevent recreation
  const highlights = useMemo(() => HIGHLIGHTS_DATA, []);

  return (
    <section className="scroll-mt-20 bg-gradient-to-b from-[#0f1419] to-[#1a237e] px-3 py-12 sm:scroll-mt-24 sm:px-4 sm:px-6 sm:py-16 md:scroll-mt-28 md:py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section title */}
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="font-display mb-3 text-2xl leading-tight font-bold text-white sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl">
            Why Choose <span className="text-brand-cyan">FundedPro</span>?
          </h2>
          <p className="mx-auto max-w-xs px-2 text-xs leading-relaxed text-gray-300 sm:max-w-lg sm:px-4 sm:text-sm md:max-w-3xl md:text-base lg:max-w-4xl lg:text-lg xl:text-xl">
            We're revolutionizing prop trading with trader-friendly policies and
            industry-leading benefits
          </p>
        </div>

        {/* Highlights grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:gap-8 lg:grid-cols-3">
          {highlights.map((highlight, index) => (
            <HighlightCard key={`highlight-${index}`} highlight={highlight} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center sm:mt-16">
          <p className="mb-4 text-sm text-gray-300 sm:mb-6 sm:text-base">
            Ready to experience the FundedPro advantage?
          </p>
          <CTAButton />
        </div>
      </div>
    </section>
  );
}
