import { constructMetadata } from "@/lib/seo";
import { Simulator } from "@/components/simulator";
import { ToolLayout } from "@/components/layout/tool-layout";

export const metadata = constructMetadata({
  title: "Free Historical Investment Calculator | IfYouInvested.online",
  description: "Calculate historical returns for stocks, crypto, and ETFs. See exactly how much your money would be worth today if you invested in the past.",
});

export default function CalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Historical Investment Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Calculate historical returns for stocks, cryptocurrencies, and ETFs to see exactly how much an investment would be worth today."
  };

  const seoContent = [
    {
      heading: "How to use the Historical Investment Calculator",
      body: (
        <>
          <p>
            Our historical investment calculator allows you to backtest any stock, ETF, or cryptocurrency to see exactly how it performed in the past. 
            Simply enter your hypothetical investment amount, choose a start date, and select up to 5 assets to compare.
          </p>
          <p>
            The calculator uses real historical market data adjusted for splits and dividends to provide 100% accurate historical returns. 
            You can visualize the growth of your portfolio over time through our interactive charts and performance leaderboards.
          </p>
        </>
      )
    },
    {
      heading: "Why backtest your investments?",
      body: (
        <>
          <p>
            While past performance does not guarantee future results, understanding how different asset classes behave during different market cycles is crucial for building a resilient portfolio. 
            By backtesting through historical events like the 2008 Financial Crisis or the 2020 Tech Boom, you can understand the true volatility and compound growth potential of your investments.
          </p>
        </>
      )
    }
  ];

  return (
    <ToolLayout 
      title="Historical Investment Calculator"
      subtitle="Simulate historical returns and see exactly what you would have made if you invested in the past."
      jsonLd={jsonLd}
      seoContent={seoContent}
    >
      <Simulator 
        title="Run the numbers"
        subtitle="Configure your hypothetical investment below."
      />
    </ToolLayout>
  );
}
