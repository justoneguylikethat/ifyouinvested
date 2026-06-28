import { constructMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  // e.g., "coffee-vs-bitcoin"
  const title = `${params.slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")} | Lifestyle Calculator`;
  const description = `What if you invested that money instead? See the true cost of your lifestyle choices with our interactive calculator.`;

  return constructMetadata({ title, description });
}

export default function LifestylePage({ params }: { params: { slug: string } }) {
  const title = params.slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-slate-400 mb-8">
        Lifestyle comparison coming soon. This route highlights the opportunity cost of everyday purchases.
      </p>
      
      {/* Placeholder for actual lifestyle comparison UI */}
      <div className="h-96 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
        Lifestyle Opportunity Cost Chart Placeholder
      </div>
    </div>
  );
}
