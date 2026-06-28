import { ComingSoon } from "@/components/layout/coming-soon";
import { Video } from "lucide-react";

export const metadata = {
  title: "Video Studio | IfYouInvested.online",
};

export default function StudioPage() {
  return (
    <ComingSoon 
      title="Video Studio" 
      description="Create stunning, data-driven videos of historical investment races to share on TikTok, YouTube Shorts, and Instagram Reels."
      icon={<Video className="w-10 h-10 text-blue-400 relative z-10" />}
    />
  );
}
