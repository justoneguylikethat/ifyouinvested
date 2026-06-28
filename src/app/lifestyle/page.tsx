import { constructMetadata } from "@/lib/seo";
import { LifestyleCore } from "@/components/lifestyle/lifestyle-core";
import { ToolLayout } from "@/components/layout/tool-layout";

export const metadata = constructMetadata({
  title: "Lifestyle Opportunity Cost Calculator | IfYouInvested.online",
  description: "Calculate what your daily habits (like buying coffee or eating out) actually cost you in missed investments over time.",
});

export default function LifestylePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Lifestyle Opportunity Cost Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Calculate the opportunity cost of daily expenses if they were invested in the stock market or crypto instead."
  };

  const seoContent = [
    {
      heading: "What is the Opportunity Cost of your Lifestyle?",
      body: (
        <>
          <p>
            Every time you spend money on a daily habit—like a $5 coffee, a $15 lunch, or a $30 streaming subscription—you are not just losing that money, you are losing the <em>opportunity</em> to invest it. 
            Over time, thanks to the power of compound interest, small daily expenses can cost you hundreds of thousands of dollars in missed wealth.
          </p>
        </>
      )
    },
    {
      heading: "How to use the Lifestyle Calculator",
      body: (
        <>
          <p>
            Select a common daily or monthly expense (or enter a custom amount). Then, choose an asset like the S&P 500, Apple, or Bitcoin. 
            The calculator will show you exactly how much money you would have today if you had skipped that expense and invested the money instead over the last few years.
          </p>
          <p>
            This tool isn't meant to stop you from enjoying your life—but it is designed to help you understand the true cost of consumption versus the incredible power of consistent investing.
          </p>
        </>
      )
    }
  ];

  return (
    <ToolLayout 
      title="Lifestyle Opportunity Cost"
      subtitle="See the shocking truth about what your daily habits are really costing your future self."
      jsonLd={jsonLd}
      seoContent={seoContent}
    >
      <div className="bg-[#0B1220] border border-white/5 rounded-3xl p-4 md:p-8 shadow-2xl max-w-4xl mx-auto">
        <LifestyleCore />
      </div>
    </ToolLayout>
  );
}
