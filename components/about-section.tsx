"use client";

import { memo, useMemo } from "react";
import { Users, TrendingUp, DollarSign, Clock } from "lucide-react";
import Image from "next/image";

// Types
interface StatData {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
  color: string;
}

interface ValueData {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  bgColor: string;
  iconColor: string;
}

// Constants
const STATS_DATA: StatData[] = [
  {
    icon: Users,
    value: "10,000+",
    label: "Challenge Participants",
    color: "text-brand-cyan",
  },
  {
    icon: TrendingUp,
    value: "750+",
    label: "Funded Traders",
    color: "text-brand-gold",
  },
  {
    icon: DollarSign,
    value: "$770K+",
    label: "Annual Projected Profits",
    color: "text-brand-cyan",
  },
  {
    icon: Clock,
    value: "67%",
    label: "Longer Evaluation Period",
    color: "text-brand-gold",
  },
];

const VALUES_DATA: ValueData[] = [
  {
    icon: Users,
    title: "Trader-First",
    description: "Every decision we make prioritizes the success and satisfaction of our trading community.",
    bgColor: "bg-brand-cyan/20",
    iconColor: "text-brand-cyan",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "We continuously evolve our platform and policies to stay ahead of industry standards.",
    bgColor: "bg-brand-gold/20",
    iconColor: "text-brand-gold",
  },
  {
    icon: Clock,
    title: "Transparency",
    description: "Clear rules, honest communication, and fair evaluation processes define our approach.",
    bgColor: "bg-brand-cyan/20",
    iconColor: "text-brand-cyan",
  },
];

// Memoized stat item component
const StatItem = memo(({ stat }: { stat: StatData }) => {
  const IconComponent = stat.icon;
  
  return (
    <article
      aria-label={`Statistic: ${stat.label}`}
      className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 text-center group shadow-lg min-h-[160px]"
    >
      <div className="mb-4">
        <IconComponent
          className={`w-7 h-7 sm:w-8 sm:h-8 ${stat.color} mx-auto group-hover:scale-110 transition-transform duration-300 ease-in-out`}
        />
      </div>
      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
        {stat.value}
      </h3>
      <p className="text-xs sm:text-sm text-gray-300">{stat.label}</p>
    </article>
  );
});

StatItem.displayName = "StatItem";

// Memoized value item component
const ValueItem = memo(({ value }: { value: ValueData }) => {
  const IconComponent = value.icon;
  
  return (
    <div className="text-center">
      <div className={`w-14 h-14 sm:w-16 sm:h-16 ${value.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
        <IconComponent className={`w-7 h-7 sm:w-8 sm:h-8 ${value.iconColor}`} />
      </div>
      <h4 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{value.title}</h4>
      <p className="text-gray-300 text-sm sm:text-base">{value.description}</p>
    </div>
  );
});

ValueItem.displayName = "ValueItem";

// Memoized CEO section component
const CEOSection = memo(() => (
  <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 shadow-2xl flex flex-col lg:flex-row items-center gap-6">
    <div className="relative flex-shrink-0">
      <Image
        src="/ceo.avif"
        alt="CEO Destiny Isibor"
        width={160}
        height={160}
        className="w-36 h-36 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-full border-2 border-brand-cyan object-cover shadow-lg"
        priority
      />
    </div>
    <div className="text-center lg:text-left space-y-3 flex-1 min-w-0">
      <p className="text-lg text-gray-300 leading-relaxed">
        Founded by <span className="text-brand-cyan font-semibold">Destiny Isibor</span>, FundedPro is redefining proprietary trading with trader-first funding models.
      </p>
      <p className="text-lg text-gray-300 italic font-medium text-brand-gold">
        "Empowering traders to turn talent into success is what drives us every day."
      </p>
    </div>
  </div>
));

CEOSection.displayName = "CEOSection";

// Memoized mission section component
const MissionSection = memo(() => (
  <div className="bg-gradient-to-r from-brand-cyan/20 to-brand-gold/20 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-brand-cyan/30 shadow-xl">
    <h3 className="text-xl sm:text-2xl font-bold font-display text-white mb-3 sm:mb-4">Our Mission</h3>
    <p className="text-gray-300 leading-relaxed">
      To democratize access to trading capital and create opportunities for skilled traders to build
      sustainable, profitable careers in financial markets.
    </p>
  </div>
));

MissionSection.displayName = "MissionSection";

// Main about section component
export function AboutSection() {
  // Memoized stats data to prevent recreation
  const stats = useMemo(() => STATS_DATA, []);
  
  // Memoized values data to prevent recreation
  const values = useMemo(() => VALUES_DATA, []);

  return (
    <section 
      id="about"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#2d1b69] to-[#1a237e] scroll-mt-24 md:scroll-mt-28"
      role="region" 
      aria-labelledby="about-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 id="about-heading" className="text-4xl md:text-5xl font-bold font-display text-white mb-8">
            About <span className="text-brand-cyan">FundedPro</span>
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* About Content + CEO Image */}
          <div className="space-y-8">
            <CEOSection />
            <MissionSection />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <StatItem key={`stat-${index}`} stat={stat} />
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mt-20">
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-white text-center mb-10 sm:mb-12">
            Our Core Values
          </h3>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {values.map((value, index) => (
              <ValueItem key={`value-${index}`} value={value} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
