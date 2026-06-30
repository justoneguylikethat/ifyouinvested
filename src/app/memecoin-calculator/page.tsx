import Link from "next/link";
import { constructMetadata } from "@/lib/seo";
import { Simulator } from "@/components/simulator";
import { ToolLayout } from "@/components/layout/tool-layout";

export const metadata = constructMetadata({
  title: "24h Memecoin Calculator | IfYouInvested.online",
  description: "Calculate historical 24-hour returns for Pepe, Dogecoin, Shiba Inu, dogwifhat, and other minor altcoins.",
});

export default function MemecoinCalculatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "24h Memecoin Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Calculate 24-hour returns for popular meme tokens and minor coins to track recent market momentum."
  };

  const seoContent = [
    {
      heading: "How to use the 24h Memecoin Calculator",
      body: (
        <>
          <p>
            Meme tokens and minor altcoins move fast. Our 24-hour memecoin calculator is pre-configured to check historical returns over the last 24 hours.
          </p>
          <p>
            Simply modify the hypothetical investment amount or expand the asset selections to compare recent gains across top meme protocols.
          </p>
        </>
      )
    },
    {
      heading: "💡 Did You Know? Memecoin Statistics",
      body: (
        <div className="space-y-4">
          <p>
            <strong>The SHIB Phenomenon:</strong> An investment of just <strong>$100 in Shiba Inu (SHIB)</strong> at its launch in August 2020 would have grown to over <strong>$5,000,000</strong> at its peak in late 2021. You can test your own custom scenarios using our standard <Link href="/calculator" className="text-blue-400 hover:underline font-bold">Investment Calculator</Link> or try to beat the market in our <Link href="/millionaire-challenge" className="text-blue-400 hover:underline font-bold">Millionaire Challenge Game</Link>!
          </p>
          <p>
            <strong>Dogecoin's Market Cap:</strong> Dogecoin (DOGE) started as a joke in 2013 but reached a market capitalization of over <strong>$80 Billion</strong> in May 2021. To compare how a diversified group of assets would perform, try building a custom index with our <Link href="/portfolio" className="text-blue-400 hover:underline font-bold">Portfolio Builder</Link>.
          </p>
          <p>
            <strong>Dollar-Cost Averaging Volatility:</strong> The power of dollar-cost averaging is even more pronounced in highly volatile assets like memecoins. Find out what happens if you invest just $10 a week instead of buying a coffee using our <Link href="/dca" className="text-blue-400 hover:underline font-bold">Dollar Cost Averaging Tool</Link> or the <Link href="/lifestyle" className="text-blue-400 hover:underline font-bold">Lifestyle Investment Finder</Link>.
          </p>
        </div>
      )
    },
    {
      heading: "📊 Popular Asset Comparisons",
      body: (
        <div className="space-y-4">
          <p>
            <strong>Nvidia (NVDA) vs. PEPE:</strong> Nvidia has been one of the best-performing stocks of the decade, but top-tier memecoins like PEPE have occasionally outpaced NVDA's 1-year returns in a matter of weeks. Discover the highest-returning assets for any period using our <Link href="/best-finder" className="text-blue-400 hover:underline font-bold">Best Investment Finder</Link>.
          </p>
          <p>
            <strong>Market Crashes vs. Memecoin Dumps:</strong> Traditional stock index crashes (like the 2008 financial crisis) usually take months to resolve. Cryptocurrency and memecoin corrections of 50-80% can happen in days, but recover just as rapidly. Simulate major market panics with our <Link href="/crash-simulator" className="text-blue-400 hover:underline font-bold">Market Crash Simulator</Link>.
          </p>
          <p>
            <strong>Retiring on Memecoins:</strong> While traditional financial planners recommend index funds, some early altcoin adopters retired early. Calculate your standard target retirement age versus high-growth projections using our <Link href="/retirement" className="text-blue-400 hover:underline font-bold">Retirement Calculator</Link> or reinvest your compound payouts using the <Link href="/dividend" className="text-blue-400 hover:underline font-bold">Dividend Explorer</Link>.
          </p>
        </div>
      )
    }
  ];

  return (
    <ToolLayout 
      title="24h Memecoin Calculator"
      subtitle="Simulate 24-hour returns for PEPE, DOGE, SHIB, WIF, and other minor altcoins."
      jsonLd={jsonLd}
      seoContent={seoContent}
    >
      <Simulator 
        title="Track Memecoin Momentum"
        subtitle="Configure your 24h meme investment below."
        defaultDaysAgo={1}
        mode="memecoin"
      />
    </ToolLayout>
  );
}
