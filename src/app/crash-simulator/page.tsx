import { constructMetadata } from "@/lib/seo";
import { CrashCore } from "@/components/crash-simulator/crash-core";
import { ToolLayout } from "@/components/layout/tool-layout";

export const metadata = constructMetadata({
  title: "Market Crash Simulator | Backtest Historical Market Crashes | IfYouInvested.online",
  description: "Test how your investments would perform during major historical crashes like the 2008 Financial Crisis and the 2020 COVID Crash.",
});

export default function CrashSimulatorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Market Crash Simulator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Simulate the performance of investment portfolios during historical market crashes."
  };

  const seoContent = [
    {
      heading: "Surviving Market Crashes",
      body: (
        <>
          <p>
            It is easy to make money in a bull market, but true wealth is built by surviving bear markets. 
            Our Market Crash Simulator allows you to stress-test any stock or crypto portfolio against some of the worst financial disasters in modern history.
          </p>
        </>
      )
    },
    {
      heading: "How to use the Crash Simulator",
      body: (
        <>
          <p>
            Select a historical crash—like the 2000 Dot-com Bubble, the 2008 Global Financial Crisis, or the 2020 COVID-19 Crash. 
            Then, build your hypothetical portfolio. The simulator will calculate exactly how much your portfolio would have drawn down from the peak, and how long it would have taken to recover back to its original value.
          </p>
          <p>
            This tool is vital for understanding your own risk tolerance. If seeing your portfolio drop by 50% in the simulator makes you uncomfortable, you might want to consider adding more conservative assets like bonds or dividend ETFs to your real-life portfolio.
          </p>
        </>
      )
    }
  ];

  return (
    <ToolLayout 
      title="Market Crash Simulator"
      subtitle="Stress test your portfolio against the worst market crashes in history."
      jsonLd={jsonLd}
      seoContent={seoContent}
    >
      <div className="bg-[#0B1220] border border-white/5 rounded-3xl p-4 md:p-8 shadow-2xl max-w-4xl mx-auto">
        <CrashCore />
      </div>
    </ToolLayout>
  );
}
