import { constructMetadata } from "@/lib/seo";
import { NewsCore } from "@/components/news/news-core";

export const metadata = constructMetadata({
  title: "Market News | Invested.today",
  description: "Curated financial headlines and AI-driven sentiment analysis.",
});

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <NewsCore />
    </div>
  );
}
