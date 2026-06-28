import { constructMetadata } from "@/lib/seo";
import { DcaCore } from "@/components/dca/dca-core";
import { ToolLayout } from "@/components/layout/tool-layout";

export const metadata = constructMetadata({
  title: "Free Dollar Cost Averaging (DCA) Calculator | IfYouInvested.online",
  description: "Calculate how much you would have made by investing consistently over time. Backtest DCA strategies for Bitcoin, Stocks, and ETFs.",
});

export default function DcaPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Dollar Cost Averaging Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Calculate historical returns for dollar cost averaging strategies across stocks and crypto."
  };

  const seoContent = [
    {
      heading: "What is Dollar Cost Averaging (DCA)?",
      body: (
        <>
          <p>
            Dollar Cost Averaging (DCA) is an investment strategy where you divide your total investment amount across periodic purchases of a target asset in an effort to reduce the impact of volatility. 
            Instead of investing a lump sum all at once, you might invest $100 every week, or $500 every month, regardless of the asset's price.
          </p>
          <p>
            This strategy removes the emotion from investing and prevents you from attempting to "time the market"—which is notoriously difficult even for professional investors.
          </p>
        </>
      )
    },
    {
      heading: "How does the DCA Calculator work?",
      body: (
        <>
          <p>
            Our DCA Calculator uses real historical market data to backtest your consistent investment strategy. 
            Simply choose how much you want to invest, the frequency (daily, weekly, or monthly), and the asset you want to buy. 
            The calculator will simulate every single purchase you would have made over that time period and calculate your total return, average cost basis, and total profit.
          </p>
        </>
      )
    }
  ];

  return (
    <ToolLayout 
      title="Dollar Cost Averaging Calculator"
      subtitle="See how much wealth you could have built by investing a consistent amount over time."
      jsonLd={jsonLd}
      seoContent={seoContent}
    >
      <div className="bg-[#0B1220] border border-white/5 rounded-3xl p-4 md:p-8 shadow-2xl">
        <DcaCore />
      </div>
    </ToolLayout>
  );
}
