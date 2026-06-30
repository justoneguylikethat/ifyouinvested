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
