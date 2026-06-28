import { constructMetadata } from "@/lib/seo";
import { AiInsightsCore } from "@/components/ai-insights/ai-insights-core";

export const metadata = constructMetadata({
  title: "AI Investment Insights | Invested.today",
  description: "Get real-time AI analysis on the stock market and your portfolio.",
});

export default function AiInsightsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <AiInsightsCore />
    </div>
  );
}
