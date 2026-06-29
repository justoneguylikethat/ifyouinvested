import { Metadata } from "next";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { TrendingLinks } from "@/components/trending-links";
import { PlaygroundGrid, PLAYGROUND_TOOLS } from "@/components/playground-grid";
import { JsonLd } from "@/components/json-ld";
export const metadata: Metadata = {
  title: "IfYouInvested.online | Premium Investment Intelligence",
  description: "Simulate historical returns across stocks and crypto. See what you missed out on, or what bullets you dodged.",
};

export default function Home() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
          Dashboard
        </h1>
        <p className="text-slate-400 max-w-3xl leading-relaxed">
          Welcome to IfYouInvested. Use our suite of tools to simulate historical returns, test investment strategies like Dollar-Cost Averaging, and discover how past decisions could have performed across stocks and crypto.
        </p>
      </div>
      
      <QuickActions />
      
      <PlaygroundGrid />

      <TrendingLinks />

      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": PLAYGROUND_TOOLS.map((tool, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": tool.name,
          "description": tool.description,
          "url": `https://ifyouinvested.online${tool.href}`
        }))
      }} />
    </div>
  );
}
