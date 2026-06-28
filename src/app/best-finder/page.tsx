import { constructMetadata } from "@/lib/seo";
import { FinderCore } from "@/components/best-finder/finder-core";
import { ToolLayout } from "@/components/layout/tool-layout";

export const metadata = constructMetadata({
  title: "Best Investment Finder | Find Top Performing Stocks & Crypto | IfYouInvested.online",
  description: "Discover the highest returning assets for any given time period. Find out exactly what you should have invested in to maximize your returns.",
});

export default function BestFinderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Best Investment Finder",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Discover the highest returning stocks, ETFs, and cryptocurrencies over any historical time period."
  };

  const seoContent = [
    {
      heading: "Find the Best Performing Assets in History",
      body: (
        <>
          <p>
            Have you ever wondered what the best investment would have been over the last 5 years? Or the last 10 years? 
            Our Best Investment Finder scans historical market data across top stocks, cryptocurrencies, and ETFs to find the absolute highest returning assets for any specific time period.
          </p>
        </>
      )
    },
    {
      heading: "How to use the Investment Finder",
      body: (
        <>
          <p>
            Simply select a start date and an end date. The tool will instantly calculate the total Return on Investment (ROI) and Compound Annual Growth Rate (CAGR) for dozens of popular assets and rank them from best to worst.
          </p>
          <p>
            This is an excellent tool for understanding market cycles, identifying which sectors out-performed during certain macroeconomic environments, and finding historical patterns.
          </p>
        </>
      )
    }
  ];

  return (
    <ToolLayout 
      title="Best Investment Finder"
      subtitle="Discover the highest returning assets for any given time period in history."
      jsonLd={jsonLd}
      seoContent={seoContent}
    >
      <div className="bg-[#0B1220] border border-white/5 rounded-3xl p-4 md:p-8 shadow-2xl max-w-5xl mx-auto">
        <FinderCore />
      </div>
    </ToolLayout>
  );
}
