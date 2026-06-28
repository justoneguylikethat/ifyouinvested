import { constructMetadata } from "@/lib/seo";
import { RetirementCore } from "@/components/retirement/retirement-core";
import { ToolLayout } from "@/components/layout/tool-layout";

export const metadata = constructMetadata({
  title: "Free Retirement Calculator | FIRE Planner | IfYouInvested.online",
  description: "Plan your path to financial independence and early retirement (FIRE). See exactly when you can afford to retire based on historical market returns.",
});

export default function RetirementPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Retirement Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Calculate your retirement date and projected portfolio value using historical market data."
  };

  const seoContent = [
    {
      heading: "When can you retire?",
      body: (
        <>
          <p>
            Planning for retirement doesn't have to be complicated. Our Retirement Calculator helps you project exactly when you'll reach financial independence based on your current savings rate, target withdrawal rate (like the 4% rule), and the historical returns of your chosen asset allocation.
          </p>
        </>
      )
    },
    {
      heading: "Financial Independence, Retire Early (FIRE)",
      body: (
        <>
          <p>
            The FIRE movement is built on the mathematical principle that if you save a high percentage of your income and invest it in income-producing assets (like index funds or dividend stocks), you can retire decades earlier than the traditional retirement age of 65.
          </p>
          <p>
            Use this calculator to find your "FIRE Number"—the total portfolio value you need to safely withdraw enough money to cover your annual living expenses forever, without running out of money.
          </p>
        </>
      )
    }
  ];

  return (
    <ToolLayout 
      title="Retirement Calculator"
      subtitle="Plan your path to financial independence and early retirement."
      jsonLd={jsonLd}
      seoContent={seoContent}
    >
      <div className="bg-[#0B1220] border border-white/5 rounded-3xl p-4 md:p-8 shadow-2xl max-w-5xl mx-auto">
        <RetirementCore />
      </div>
    </ToolLayout>
  );
}
