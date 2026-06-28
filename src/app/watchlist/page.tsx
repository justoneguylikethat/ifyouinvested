import { ComingSoon } from "@/components/layout/coming-soon";
import { Star } from "lucide-react";

export const metadata = {
  title: "Watchlist | IfYouInvested.online",
};

export default function WatchlistPage() {
  return (
    <ComingSoon 
      title="Watchlist" 
      description="Keep an eye on assets you're interested in and get notifications when they hit key historical milestones or price targets."
      icon={<Star className="w-10 h-10 text-blue-400 relative z-10" />}
    />
  );
}
