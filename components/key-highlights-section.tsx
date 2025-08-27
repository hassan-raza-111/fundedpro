"use client";

import { memo, useMemo } from "react";
import { Clock, TrendingUp, Tag } from "lucide-react";

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
    title: "Extended Evaluation",
    mainText: "Unlimited Day Challenge Period",
    subText: "3x longer than competitors",
    gradient: "from-brand-cyan/20 to-blue-500/20",
    iconColor: "text-brand-cyan",
  },
  {
    icon: TrendingUp,
    title: "Higher Profits",
    mainText: "70-80% Profit Splits",
    subText: "Keep more of what you earn",
    gradient: "from-brand-gold/20 to-yellow-500/20",
    iconColor: "text-brand-gold",
  },
  {
    icon: Tag,
    title: "Lower Costs",
    mainText: "Up to 50% Lower Fees",
    subText: "More affordable than industry average",
    gradient: "from-brand-cyan/20 to-green-500/20",
    iconColor: "text-brand-cyan",
  },
];

// Memoized highlight card component
const HighlightCard = memo(({ highlight }: { highlight: HighlightData }) => {
  const IconComponent = highlight.icon;
  
  return (
    <div
      className={`group relative bg-gradient-to-br ${highlight.gradient} backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-brand-cyan/20 min-h-[260px]`}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
            <IconComponent className={`w-8 h-8 ${highlight.iconColor}`} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold font-display text-white mb-4">{highlight.title}</h3>

        {/* Main text */}
        <div className="text-2xl font-bold text-white mb-2">{highlight.mainText}</div>

        {/* Sub text */}
        <p className="text-gray-300 text-sm leading-relaxed">{highlight.subText}</p>

        {/* Decorative element */}
        <div className="mt-6 w-12 h-1 bg-gradient-to-r from-brand-cyan to-brand-gold mx-auto rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float opacity-0 group-hover:opacity-100 transition-opacity duration-500"
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

HighlightCard.displayName = "HighlightCard";

// Memoized CTA button component
const CTAButton = memo(() => (
  <a href="#plans" className="inline-block">
    <button className="bg-gradient-to-r from-brand-cyan to-blue-500 hover:from-brand-cyan/90 hover:to-blue-500/90 text-black font-semibold px-8 py-3 rounded-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-brand-cyan/30">
      Explore Our Plans
    </button>
  </a>
));

CTAButton.displayName = "CTAButton";

// Main key highlights section component
export function KeyHighlightsSection() {
  // Memoized highlights data to prevent recreation
  const highlights = useMemo(() => HIGHLIGHTS_DATA, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0f1419] to-[#1a237e] scroll-mt-24 md:scroll-mt-28">
      <div className="max-w-7xl mx-auto">
        {/* Section title */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
            Why Choose <span className="text-brand-cyan">FundedPro</span>?
          </h2>
          <p className="text-sm sm:text-base md:text-base lg:text-lg xl:text-xl text-gray-300 max-w-xs sm:max-w-lg md:max-w-3xl lg:max-w-3xl xl:max-w-4xl mx-auto px-2 sm:px-4 md:px-4 leading-relaxed">
            We're revolutionizing prop trading with trader-friendly policies and industry-leading benefits
          </p>
        </div>

        {/* Highlights grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => (
            <HighlightCard key={`highlight-${index}`} highlight={highlight} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-300 mb-6">Ready to experience the FundedPro advantage?</p>
          <CTAButton />
        </div>
      </div>
    </section>
  );
}
