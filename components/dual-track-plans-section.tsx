"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

// Types
type PlanType = "stellar-2step" | "stellar-1step" | "stellar-lite";

// Constants
const PLAN_TYPES = [
  { id: "stellar-2step", name: "Stellar 2-Step", isActive: true },
  { id: "stellar-1step", name: "Stellar 1-Step", isActive: false },
  { id: "stellar-lite", name: "Stellar Lite", isActive: false },
] as const;

// Plan data
const STELLAR_2STEP_PLANS = [
  { label: "$6,000", price: "$59" },
  { label: "$15,000", price: "$119" },
  { label: "$25,000", price: "$199" },
  { label: "$50,000", price: "$299" },
  { label: "$100,000", price: "$549" },
  { label: "$200,000", price: "$1099" },
] as const;

const STELLAR_1STEP_PLANS = [
  { label: "$6,000", price: "$65" },
  { label: "$15,000", price: "$129" },
  { label: "$25,000", price: "$219" },
  { label: "$50,000", price: "$329" },
  { label: "$100,000", price: "$569" },
  { label: "$200,000", price: "$1099" },
] as const;

const STELLAR_LITE_PLANS = [
  { label: "$5,000", price: "$32" },
  { label: "$10,000", price: "$59" },
  { label: "$25,000", price: "$139" },
  { label: "$50,000", price: "$229" },
  { label: "$100,000", price: "$399" },
  { label: "$200,000", price: "$798" },
] as const;

// Row data
const STELLAR_2STEP_ROWS = [
  { label: "Phase 1 Profit Target", values: ["8%", "8%", "8%", "8%", "8%", "8%"] },
  { label: "Phase 2 Profit Target", values: ["5%", "5%", "5%", "5%", "5%", "5%"] },
  {
    label: "Maximum Overall Loss",
    values: ["10% ($600)", "10% ($1,500)", "10% ($2,500)", "10% ($5,000)", "10% ($10,000)", "10% ($20,000)"],
  },
  {
    label: "Maximum Daily Loss",
    values: ["5% ($300)", "5% ($750)", "5% ($1,250)", "5% ($2,500)", "5% ($5,000)", "5% ($10,000)"],
  },
  { label: "News Trading", values: ["✔", "✔", "✔", "✔", "✔", "✔"] },
  { label: "Performance Reward Upto", values: ["95%", "95%", "95%", "95%", "95%", "95%"] },
  { label: "Minimum Trading Days", values: ["3 Days", "3 Days", "3 Days", "3 Days", "3 Days", "3 Days"] },
  { label: "First withdrawal", values: ["21 Days", "21 Days", "21 Days", "21 Days", "21 Days", "21 Days"] },
  { label: "Refundable Fee", values: ["$59", "$119", "$199", "$299", "$549", "$1099"] },
] as const;

const STELLAR_1STEP_ROWS = [
  { label: "Profit Target", values: ["10%", "10%", "10%", "10%", "10%", "10%"] },
  {
    label: "Maximum Overall Loss",
    values: ["6% ($360)", "6% ($900)", "6% ($1,500)", "6% ($3,000)", "6% ($6,000)", "6% ($12,000)"],
  },
  {
    label: "Maximum Daily Loss",
    values: ["3% ($180)", "3% ($450)", "3% ($750)", "3% ($1,500)", "3% ($3,000)", "3% ($6,000)"],
  },
  { label: "News Trading", values: ["✔", "✔", "✔", "✔", "✔", "✔"] },
  { label: "Performance Reward Upto", values: ["95%", "95%", "95%", "95%", "95%", "95%"] },
  { label: "Minimum Trading Days", values: ["2 Days", "2 Days", "2 Days", "2 Days", "2 Days", "2 Days"] },
  { label: "First withdrawal", values: ["3 Days", "3 Days", "3 Days", "3 Days", "3 Days", "3 Days"] },
  { label: "Refundable Fee", values: ["$65", "$129", "$219", "$329", "$569", "$1099"] },
] as const;

const STELLAR_LITE_ROWS = [
  { label: "Phase 1 Profit Target", values: ["8%", "8%", "8%", "8%", "8%", "8%"] },
  { label: "Phase 2 Profit Target", values: ["4%", "4%", "4%", "4%", "4%", "4%"] },
  {
    label: "Maximum Overall Loss",
    values: ["8% ($400)", "8% ($800)", "8% ($2,000)", "8% ($4,000)", "8% ($8,000)", "8% ($16,000)"],
  },
  {
    label: "Maximum Daily Loss",
    values: ["4% ($200)", "4% ($400)", "4% ($1,000)", "4% ($2,000)", "4% ($4,000)", "4% ($8,000)"],
  },
  { label: "News Trading", values: ["✔", "✔", "✔", "✔", "✔", "✔"] },
  { label: "Performance Reward Upto", values: ["95%", "95%", "95%", "95%", "95%", "95%"] },
  { label: "Minimum Trading Days", values: ["3 Days", "3 Days", "3 Days", "3 Days", "3 Days", "3 Days"] },
  { label: "First withdrawal", values: ["21 Days", "21 Days", "21 Days", "21 Days", "21 Days", "21 Days"] },
  { label: "Refundable Fee", values: ["$32", "$59", "$139", "$229", "$399", "$798"] },
] as const;

// Utility functions
const formatAccountSize = (label: string): string => {
  const amount = label.replace("$", "").replace(",", "");
  const num = parseInt(amount);
  return num >= 1000 ? `$${num / 1000}k` : label;
};

const openRegistrationPortal = (): void => {
  window.open("https://portal.thefundedpro.com/register", "_blank");
};

export function DualTrackPlansSection() {
  const [activePlanType, setActivePlanType] = useState<PlanType>("stellar-2step");
  const [activeMobilePlanIndex, setActiveMobilePlanIndex] = useState(0);
  const [clickFeedback, setClickFeedback] = useState<string>("");

  // Memoized data based on active plan type
  const { plans, rows } = useMemo(() => {
    switch (activePlanType) {
      case "stellar-1step":
        return { plans: STELLAR_1STEP_PLANS, rows: STELLAR_1STEP_ROWS };
      case "stellar-lite":
        return { plans: STELLAR_LITE_PLANS, rows: STELLAR_LITE_ROWS };
      default:
        return { plans: STELLAR_2STEP_PLANS, rows: STELLAR_2STEP_ROWS };
    }
  }, [activePlanType]);

  // Memoized plan details for mobile
  const selectedPlanDetails = useMemo(() => {
    return rows.map((row) => ({
      label: row.label,
      value: row.values[activeMobilePlanIndex],
    }));
  }, [rows, activeMobilePlanIndex]);

  // Callbacks
  const handlePlanTypeChange = useCallback((planType: PlanType) => {
    console.log('Plan type changed to:', planType);
    setClickFeedback(`Plan type changed to: ${planType}`);
    setActivePlanType(planType);
    setActiveMobilePlanIndex(0);
    setTimeout(() => setClickFeedback(""), 2000);
  }, []);

  const handleMobilePlanSelect = useCallback((index: number) => {
    console.log('Mobile plan selected:', index);
    setClickFeedback(`Plan selected: ${plans[index]?.label}`);
    setActiveMobilePlanIndex(index);
    setTimeout(() => setClickFeedback(""), 2000);
  }, [plans]);

  const handleGetPlanClick = useCallback(() => {
    console.log('Get Plan button clicked');
    setClickFeedback('Get Plan clicked!');
    openRegistrationPortal();
    setTimeout(() => setClickFeedback(""), 2000);
  }, []);

  // Renderers
  const renderPlanTypeSelector = () => (
    <div className="flex justify-center mb-8 relative z-10">
      <div
        className="inline-flex bg-white/10 backdrop-blur-md rounded-xl p-1 border border-white/20"
        style={{ touchAction: 'manipulation', userSelect: 'none' }}
      >
        {PLAN_TYPES.map((planType, index) => (
          <button
            key={planType.id}
            onClick={() => handlePlanTypeChange(planType.id as PlanType)}
            onTouchStart={() => handlePlanTypeChange(planType.id as PlanType)}
            className={`relative px-4 sm:px-6 py-3 font-semibold text-sm sm:text-base transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50 ${
              activePlanType === planType.id
                ? "bg-white text-[#1a237e] shadow-lg rounded-lg"
                : "text-gray-300 hover:text-white bg-transparent"
            } ${index === 0 ? "rounded-l-lg" : ""} ${index === PLAN_TYPES.length - 1 ? "rounded-r-lg" : ""}`}
            style={{
              minHeight: '48px',
              minWidth: '100px',
              flex: '1 1 auto',
              touchAction: 'manipulation',
              userSelect: 'none',
              pointerEvents: 'auto',
              maxWidth: '100%',
            }}
            aria-label={`Switch to ${planType.name}`}
          >
            {planType.name}
          </button>
        ))}
      </div>
    </div>
  );

  const renderMobileCards = () => (
    <div className="block xl:hidden mt-4">
      {/* Account size selector chips */}
      <div className="flex gap-3 overflow-x-auto pb-4 pt-2 px-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {plans.map((plan, idx) => {
          const isActive = idx === activeMobilePlanIndex;
          return (
            <button
              key={plan.label}
              onClick={() => handleMobilePlanSelect(idx)}
              onTouchStart={() => handleMobilePlanSelect(idx)}
              className={`shrink-0 w-14 h-14 rounded-full border-2 text-xs font-semibold flex items-center justify-center transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-br from-[#00f7ff] to-[#0072ff] text-white border-[#00f7ff] shadow-[0_4px_15px_rgba(0,247,255,0.4)] scale-110"
                  : "text-white border-white/40 bg-white/5 hover:bg-white/10 hover:border-white/60 hover:scale-105 active:scale-95"
              }`}
              style={{
                touchAction: 'manipulation',
                userSelect: 'none',
                pointerEvents: 'auto',
              }}
              aria-label={`Select ${plan.label} plan`}
            >
              {formatAccountSize(plan.label)}
            </button>
          );
        })}
      </div>

      {/* Selected plan card */}
      <div className="mt-2 bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5">
          <div className="text-center">
            <div className="text-sm text-gray-300 mb-1">Account Size</div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-4">
              {formatAccountSize(plans[activeMobilePlanIndex].label)}
            </div>
            <div className="flex flex-col items-center gap-2">
              <Button
                onClick={handleGetPlanClick}
                onTouchStart={handleGetPlanClick}
                className="w-full bg-gradient-to-r from-[#00f7ff] to-[#0072ff] hover:from-[#00e0ff] hover:to-[#005ce6] text-white font-bold py-3 rounded-xl leading-tight flex items-center justify-center shadow-[0_3px_12px_rgba(0,247,255,0.3)] hover:shadow-[0_5px_18px_rgba(0,247,255,0.45)] focus-visible:ring-2 focus-visible:ring-[#00f7ff]/40 min-h-[55px] text-center cursor-pointer transition-all duration-200"
              >
                <div className="flex flex-col items-center justify-center text-center">
                  <span className="text-base sm:text-lg font-semibold tracking-wide">Get Plan</span>
                  <span className="text-xs sm:text-sm text-white/80 font-medium">
                    {plans[activeMobilePlanIndex].price}
                  </span>
                </div>
              </Button>
            </div>
          </div>

          <div className="mt-6 divide-y divide-white/10">
            {selectedPlanDetails.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 text-gray-200 font-medium">
                  <Info className="w-4 h-4 text-brand-cyan" />
                  <span className="text-sm">{item.label}</span>
                </div>
                <div className="text-white font-semibold text-sm">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderDesktopTable = () => (
    <div className="hidden xl:block mt-8">
      <div className="w-full max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto rounded-2xl overflow-hidden border border-white/20 bg-gradient-to-br from-white/8 via-white/6 to-white/4 backdrop-blur-md shadow-2xl">
        {/* Header Row */}
        <div className="grid grid-cols-7">
          <div className="p-4 xl:p-5 text-sm xl:text-base font-semibold text-gray-300 bg-[rgba(30,41,59,0.85)] backdrop-blur-md">
            Account Size
          </div>
          {plans.map((plan) => (
            <div
              key={plan.label}
              className="p-4 xl:p-5 text-center text-white bg-gradient-to-br from-brand-cyan/30 via-brand-cyan/20 to-[#1a237e]/70"
            >
              <div className="text-sm xl:text-base font-bold whitespace-nowrap">{plan.label}</div>
              <div className="mt-3 xl:mt-4 flex flex-col items-center gap-2">
                <Button
                  onClick={handleGetPlanClick}
                  onTouchStart={handleGetPlanClick}
                  className="w-4/5 xl:w-3/4 mx-auto bg-gradient-to-r from-[#00f7ff] to-[#0072ff] hover:from-[#00e0ff] hover:to-[#005ce6] text-white font-bold py-2 xl:py-2.5 rounded-lg leading-tight flex items-center justify-center shadow-[0_2px_8px_rgba(0,247,255,0.3)] hover:shadow-[0_3px_12px_rgba(0,247,255,0.45)] focus-visible:ring-2 focus-visible:ring-[#00f7ff]/40 min-h-[40px] xl:min-h-[45px] text-center cursor-pointer transition-all duration-200"
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <span className="text-xs xl:text-sm font-semibold tracking-wide">Get Plan</span>
                    <span className="text-xs text-white/80 font-medium">{plan.price}</span>
                  </div>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Data Rows */}
        {rows.map((row, idx) => (
          <div
            key={row.label}
            className={`grid grid-cols-7 ${idx === 0 ? "" : "border-t border-white/10"}`}
          >
            <div className="p-3 xl:p-4 text-sm xl:text-base font-medium text-gray-200 bg-[rgba(30,41,59,0.85)] backdrop-blur-md text-left">
              {row.label}
              {row.label === "Refundable Fee" && (
                <div className="text-xs text-gray-400 font-normal mt-1">(We refund the full price)</div>
              )}
            </div>
            {row.values.map((value, i) => (
              <div
                key={i}
                className="p-3 xl:p-4 text-center text-white text-sm xl:text-base whitespace-nowrap bg-transparent"
              >
                {value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderPlanContent = () => {
    const planTitles = {
      "stellar-2step": { title: "Stellar 2-Step Challenge", subtitle: "Two-phase evaluation process" },
      "stellar-1step": { title: "Stellar 1-Step Challenge", subtitle: "Single-phase evaluation process" },
      "stellar-lite": { title: "Stellar Lite Challenge", subtitle: "Simplified evaluation process" },
    };

    const { title, subtitle } = planTitles[activePlanType];

    return (
      <div className="track-section active">
        <div className="track-header">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        {renderMobileCards()}
        {renderDesktopTable()}
      </div>
    );
  };

  return (
    <section
      id="plans"
      className="py-20 bg-brand-gradient relative overflow-hidden scroll-mt-24 md:scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display text-white mb-4">
            Choose Your <span className="text-brand-cyan">Trading Track</span>
          </h2>
          <p className="text-sm sm:text-base md:text-base lg:text-xl xl:text-2xl text-gray-300 max-w-sm sm:max-w-lg md:max-w-4xl lg:max-w-4xl xl:max-w-5xl mx-auto px-2 sm:px-4 md:px-4 leading-relaxed">
            Multiple flexible funding models designed for different trader profiles and experience levels
          </p>
        </div>

        {renderPlanTypeSelector()}
        {clickFeedback && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse pointer-events-none">
            {clickFeedback}
          </div>
        )}
        {renderPlanContent()}
      </div>
    </section>
  );
}