import { constructMetadata } from "@/lib/seo";
import { GameBoard } from "@/components/game/game-board";
import { ToolLayout } from "@/components/layout/tool-layout";

export const metadata = constructMetadata({
  title: "Millionaire Challenge | Historical Investment Game | IfYouInvested.online",
  description: "Can you turn $10,000 into $1,000,000? Play the Millionaire Challenge, an educational investment game using real historical market data.",
});

export default function ChallengePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Millionaire Challenge",
    "applicationCategory": "GameApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "An educational investment strategy game where players use real historical market data to try and grow their portfolio to $1,000,000."
  };

  const seoContent = [
    {
      heading: "What is the Millionaire Challenge?",
      body: (
        <>
          <p>
            The Millionaire Challenge is a single-player educational game designed to teach you about historical market cycles, volatility, and the power of compound interest. 
            You start with a hypothetical $10,000 portfolio at a randomly generated point in history. 
            Your goal is to reach $1,000,000 by making the right investment decisions.
          </p>
          <p>
            You can choose from over 100 real-world assets, including stocks, ETFs, and cryptocurrencies. 
            Every single price movement in the game is based on 100% accurate historical data.
          </p>
        </>
      )
    },
    {
      heading: "Can you beat the market?",
      body: (
        <>
          <p>
            Surviving historical events like the 2008 Financial Crisis or the 2020 Tech Crash is not easy. 
            Will you diversify your portfolio to minimize risk, or will you go all-in on a high-growth asset like Bitcoin or Tesla? 
            Play the game to see if you have what it takes to become a millionaire.
          </p>
        </>
      )
    }
  ];

  return (
    <ToolLayout 
      title="The Millionaire Challenge"
      subtitle="Can you turn $10,000 into $1,000,000 using real historical market data?"
      jsonLd={jsonLd}
      seoContent={seoContent}
    >
      <div className="bg-[#0B1220] border border-white/5 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-5xl mx-auto min-h-[600px] flex flex-col relative">
        <GameBoard />
      </div>
    </ToolLayout>
  );
}
