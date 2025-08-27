'use client';

import { useMemo } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

// Types
interface FAQ {
  question: string;
  answer: string;
}

// Constants
const FAQ_DATA: FAQ[] = [
  {
    question: 'What is FundedPro?',
    answer:
      'FundedPro is a leading proprietary trading firm that provides funded trading accounts to skilled traders worldwide. We offer comprehensive evaluation programs with industry-leading benefits and transparent trading rules.',
  },
  {
    question: 'How long is the evaluation period?',
    answer:
      "Our challenge accounts offer a unlimited day evaluation period - that's 3x longer than most competitors who only provide 30-60 days. This extended timeframe gives you more confidence to develop and refine your trading strategy.",
  },
  {
    question: 'What profit splits do you offer?',
    answer:
      'We offer industry-leading profit splits of 70-80% for traders, which is 15% higher than most competitors who typically offer 50-70%. Higher tiers receive better profit splits, rewarding successful performance.',
  },
  {
    question: 'What are the account sizes available?',
    answer:
      'We offer three account tiers: $10,000 (Starter), $25,000 (Professional), and $50,000 (Expert) to suit different experience levels and trading styles. Each tier comes with progressively better benefits and profit splits.',
  },
  {
    question: 'What happens if I fail the challenge?',
    answer:
      "Don't worry! Our $10K challenge comes with a free 50% retry option. Plus, with our extended 100-day period and 10% drawdown allowance, you have much better chances of success compared to other firms.",
  },
  {
    question: 'How do withdrawals work?',
    answer:
      'Challenge account holders receive full fee refunds upon success, then move to funded status with regular withdrawal schedules. Funded traders can withdraw profits weekly with no minimum withdrawal amounts.',
  },
  {
    question: 'What trading platforms do you support?',
    answer:
      'We support MT4/MT5, TradingView, and cTrader through our API integrations, giving you the flexibility to trade on your preferred platform with seamless execution and real-time data.',
  },
  {
    question: 'What are the drawdown rules?',
    answer:
      'We use a standardized 10% maximum drawdown across all accounts, making our rules more predictable than competitors who vary their requirements. This includes both daily and overall drawdown limits.',
  },
  {
    question: 'What are the minimum trading days?',
    answer:
      'You need to complete 3 days of profitable trading with at least 0.50% of your total account balance in profits to meet the minimum trading days requirement. This ensures consistent trading activity.',
  },
  {
    question: 'How does account scaling work?',
    answer:
      'Challenge accounts can scale based on performance with faster scaling available for higher tier accounts. Successful traders can increase their account size and profit splits through consistent performance.',
  },
  {
    question: 'What makes FundedPro different from other prop firms?',
    answer:
      'We offer 67% longer evaluation periods, up to 50% lower fees, higher profit splits, and focus on empowering traders globally with transparent, fair rules. Our technology and support are unmatched in the industry.',
  },
  {
    question: 'Is there any real financial risk during the challenge?',
    answer:
      "No, challenge phases use simulated capital with full automation. There's no real financial risk until you're verified and move to a live funded account. Your challenge fee is fully refundable upon success.",
  },
  {
    question: 'What security measures do you have?',
    answer:
      'We use AI-powered monitoring, biometric ID verification for payouts, encrypted transactions, and anti-cheat detection to ensure a secure trading environment. All data is protected with bank-level security.',
  },
] as const;

export function FAQSection() {
  // Memoized accordion items to prevent unnecessary re-renders
  const accordionItems = useMemo(
    () =>
      FAQ_DATA.map(faq => (
        <AccordionItem
          key={faq.question}
          value={faq.question}
          className="focus-within:ring-brand-cyan/40 rounded-lg border border-white/10 bg-white/5 transition-colors duration-200 focus-within:ring-1 hover:bg-white/10 motion-safe:transition-all"
        >
          <AccordionTrigger
            aria-label={`Question: ${faq.question}`}
            className="hover:text-brand-cyan focus-visible:ring-brand-cyan/40 rounded-lg px-4 py-4 text-left text-white transition-colors duration-200 hover:no-underline focus-visible:ring-2 focus-visible:outline-none sm:px-6"
          >
            <span className="text-base font-semibold sm:text-lg">
              {faq.question}
            </span>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4 text-sm leading-relaxed text-gray-300 sm:px-6 sm:text-base">
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      )),
    []
  );

  return (
    <section
      id="faq"
      role="region"
      aria-labelledby="faq-heading"
      className="scroll-mt-24 scroll-smooth bg-gradient-to-b from-[#1a237e] to-[#0f1419] px-4 py-20 sm:px-6 md:scroll-mt-28 lg:px-8"
    >
      <div className="mx-auto max-w-4xl">
        {/* Section Header */}
        <div className="mb-10 text-center sm:mb-12">
          <h2
            id="faq-heading"
            className="font-display mb-4 text-4xl font-bold text-white md:text-5xl"
          >
            Frequently Asked <span className="text-brand-cyan">Questions</span>
          </h2>
          <p className="text-base text-gray-300 sm:text-lg">
            Get answers to the most common questions about FundedPro and our
            trading challenges.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-6 shadow-2xl backdrop-blur-md sm:p-8">
          <Accordion
            type="single"
            collapsible
            className="space-y-3 sm:space-y-4"
          >
            {accordionItems}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
