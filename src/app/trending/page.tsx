import { constructMetadata } from "@/lib/seo";
import { TrendingCore } from "@/components/trending/trending-core";

export const metadata = constructMetadata({
  title: "Trending Assets | Invested.today",
  description: "Discover what's hot in the stock market and crypto right now.",
});

export default function TrendingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <TrendingCore />
    </div>
  );
}
