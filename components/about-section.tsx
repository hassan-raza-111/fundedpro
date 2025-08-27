'use client';

import { memo, useMemo } from 'react';
import { Users, TrendingUp, DollarSign, Clock } from 'lucide-react';
import Image from 'next/image';

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
    value: '10,000+',
    label: 'Challenge Participants',
    color: 'text-brand-cyan',
  },
  {
    icon: TrendingUp,
    value: '750+',
    label: 'Funded Traders',
    color: 'text-brand-gold',
  },
  {
    icon: DollarSign,
    value: '$770K+',
    label: 'Annual Projected Profits',
    color: 'text-brand-cyan',
  },
  {
    icon: Clock,
    value: '67%',
    label: 'Longer Evaluation Period',
    color: 'text-brand-gold',
  },
];

const VALUES_DATA: ValueData[] = [
  {
    icon: Users,
    title: 'Trader-First',
    description:
      'Every decision we make prioritizes the success and satisfaction of our trading community.',
    bgColor: 'bg-brand-cyan/20',
    iconColor: 'text-brand-cyan',
  },
  {
    icon: TrendingUp,
    title: 'Innovation',
    description:
      'We continuously evolve our platform and policies to stay ahead of industry standards.',
    bgColor: 'bg-brand-gold/20',
    iconColor: 'text-brand-gold',
  },
  {
    icon: Clock,
    title: 'Transparency',
    description:
      'Clear rules, honest communication, and fair evaluation processes define our approach.',
    bgColor: 'bg-brand-cyan/20',
    iconColor: 'text-brand-cyan',
  },
];

// Memoized stat item component
const StatItem = memo(({ stat }: { stat: StatData }) => {
  const IconComponent = stat.icon;

  return (
    <article
      aria-label={`Statistic: ${stat.label}`}
      className="group min-h-[160px] rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-5 text-center shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/30 sm:p-6"
    >
      <div className="mb-4">
        <IconComponent
          className={`h-7 w-7 sm:h-8 sm:w-8 ${stat.color} mx-auto transition-transform duration-300 ease-in-out group-hover:scale-110`}
        />
      </div>
      <h3 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
        {stat.value}
      </h3>
      <p className="text-xs text-gray-300 sm:text-sm">{stat.label}</p>
    </article>
  );
});

StatItem.displayName = 'StatItem';

// Memoized value item component
const ValueItem = memo(({ value }: { value: ValueData }) => {
  const IconComponent = value.icon;

  return (
    <div className="text-center">
      <div
        className={`h-14 w-14 sm:h-16 sm:w-16 ${value.bgColor} mx-auto mb-4 flex items-center justify-center rounded-full`}
      >
        <IconComponent className={`h-7 w-7 sm:h-8 sm:w-8 ${value.iconColor}`} />
      </div>
      <h4 className="mb-2 text-lg font-semibold text-white sm:mb-3 sm:text-xl">
        {value.title}
      </h4>
      <p className="text-sm text-gray-300 sm:text-base">{value.description}</p>
    </div>
  );
});

ValueItem.displayName = 'ValueItem';

// Memoized CEO section component
const CEOSection = memo(() => (
  <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-2xl backdrop-blur-md sm:p-8 lg:flex-row">
    <div className="relative flex-shrink-0">
      <Image
        src="/ceo.avif"
        alt="CEO Destiny Isibor"
        width={160}
        height={160}
        className="border-brand-cyan h-36 w-36 rounded-full border-2 object-cover shadow-lg sm:h-40 sm:w-40 lg:h-44 lg:w-44"
        priority
      />
    </div>
    <div className="min-w-0 flex-1 space-y-3 text-center lg:text-left">
      <p className="text-lg leading-relaxed text-gray-300">
        Founded by{' '}
        <span className="text-brand-cyan font-semibold">Destiny Isibor</span>,
        FundedPro is redefining proprietary trading with trader-first funding
        models.
      </p>
      <p className="text-brand-gold text-lg font-medium text-gray-300 italic">
        "Empowering traders to turn talent into success is what drives us every
        day."
      </p>
    </div>
  </div>
));

CEOSection.displayName = 'CEOSection';

// Memoized mission section component
const MissionSection = memo(() => (
  <div className="from-brand-cyan/20 to-brand-gold/20 border-brand-cyan/30 rounded-2xl border bg-gradient-to-r p-6 shadow-xl backdrop-blur-md sm:p-8">
    <h3 className="font-display mb-3 text-xl font-bold text-white sm:mb-4 sm:text-2xl">
      Our Mission
    </h3>
    <p className="leading-relaxed text-gray-300">
      To democratize access to trading capital and create opportunities for
      skilled traders to build sustainable, profitable careers in financial
      markets.
    </p>
  </div>
));

MissionSection.displayName = 'MissionSection';

// Main about section component
export function AboutSection() {
  // Memoized stats data to prevent recreation
  const stats = useMemo(() => STATS_DATA, []);

  // Memoized values data to prevent recreation
  const values = useMemo(() => VALUES_DATA, []);

  return (
    <section
      id="about"
      className="scroll-mt-24 bg-gradient-to-b from-[#2d1b69] to-[#1a237e] px-4 py-20 sm:px-6 md:scroll-mt-28 lg:px-8"
      role="region"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2
            id="about-heading"
            className="font-display mb-8 text-4xl font-bold text-white md:text-5xl"
          >
            About <span className="text-brand-cyan">FundedPro</span>
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
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
          <h3 className="font-display mb-10 text-center text-2xl font-bold text-white sm:mb-12 sm:text-3xl">
            Our Core Values
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
            {values.map((value, index) => (
              <ValueItem key={`value-${index}`} value={value} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
