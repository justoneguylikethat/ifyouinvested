import { constructMetadata } from "@/lib/seo";
import { PortfolioCore } from "@/components/portfolio/portfolio-core";
import { ToolLayout } from "@/components/layout/tool-layout";

export const metadata = constructMetadata({
  title: "Free Portfolio Backtesting Tool | IfYouInvested.online",
  description: "Construct a diversified portfolio of stocks, crypto, and ETFs and simulate its historical performance. Build your perfect asset allocation.",
});

export default function PortfolioPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Portfolio Backtesting Tool",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Construct and backtest a custom portfolio of assets to see historical returns."
  };

  const seoContent = [
    {
      heading: "How to use the Portfolio Builder",
      body: (
        <>
          <p>
            The Portfolio Builder allows you to construct a custom basket of assets (stocks, cryptocurrencies, ETFs) and backtest their combined historical performance. 
            Choose your initial investment amount, the start date, and assign a percentage weight to each asset in your portfolio (e.g., 60% Stocks, 40% Crypto).
          </p>
          <p>
            The tool will automatically calculate the historical returns, factoring in the exact weighting of each asset, to show you how a diversified portfolio would have performed compared to holding a single asset.
          </p>
        </>
      )
    },
    {
      heading: "The Importance of Asset Allocation",
      body: (
        <>
          <p>
            Asset allocation is the process of dividing your investment portfolio among different asset categories. 
            By diversifying your investments across assets that don't always move in the same direction, you can reduce the overall risk and volatility of your portfolio.
          </p>
          <p>
            For example, combining high-risk assets like Bitcoin with stable dividend ETFs can provide a balance of aggressive growth and downside protection during market crashes. 
            Use this tool to find your optimal risk-adjusted return.
          </p>
        </>
      )
    }
  ];

  return (
    <ToolLayout 
      title="Portfolio Builder"
      subtitle="Construct a diversified portfolio and simulate its historical performance across time."
      jsonLd={jsonLd}
      seoContent={seoContent}
    >
      <div className="bg-[#0B1220] border border-white/5 rounded-3xl p-4 md:p-8 shadow-2xl">
        <PortfolioCore />
      </div>
    </ToolLayout>
  );
}
