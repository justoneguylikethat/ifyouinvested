import { constructMetadata } from "@/lib/seo";
import { DividendCore } from "@/components/dividend/dividend-core";
import { ToolLayout } from "@/components/layout/tool-layout";

export const metadata = constructMetadata({
  title: "Dividend Calculator & DRIP Backtester | IfYouInvested.online",
  description: "Calculate historical passive income and visualize the power of the dividend snowball effect and DRIP (Dividend Reinvestment Plan).",
});

export default function DividendPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Dividend Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Calculate historical dividend income and the effect of dividend reinvestment (DRIP)."
  };

  const seoContent = [
    {
      heading: "The Power of the Dividend Snowball",
      body: (
        <>
          <p>
            A "dividend snowball" occurs when you reinvest the dividends you receive back into the underlying stock or ETF. 
            Over time, those reinvested dividends buy more shares, which in turn generate even more dividends, creating an accelerating cycle of passive income.
          </p>
          <p>
            Our Dividend Calculator helps you visualize this powerful phenomenon using real historical data. Compare the difference between taking dividends as cash versus automatically reinvesting them (DRIP) over decades.
          </p>
        </>
      )
    },
    {
      heading: "Passive Income through Dividend Investing",
      body: (
        <>
          <p>
            Many investors prioritize building a portfolio of high-quality dividend-paying stocks and REITs (Real Estate Investment Trusts) to generate reliable cash flow. 
            By building a large enough dividend portfolio, it's possible to cover all of your living expenses with passive income without ever needing to sell a single share of stock.
          </p>
        </>
      )
    }
  ];

  return (
    <ToolLayout 
      title="Dividend Explorer"
      subtitle="Calculate passive income and see the true power of the dividend snowball over time."
      jsonLd={jsonLd}
      seoContent={seoContent}
    >
      <div className="bg-[#0B1220] border border-white/5 rounded-3xl p-4 md:p-8 shadow-2xl max-w-5xl mx-auto">
        <DividendCore />
      </div>
    </ToolLayout>
  );
}
