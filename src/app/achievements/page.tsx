import { ComingSoon } from "@/components/layout/coming-soon";
import { Award } from "lucide-react";

export const metadata = {
  title: "Achievements | IfYouInvested.online",
};

export default function AchievementsPage() {
  return (
    <ComingSoon 
      title="Achievements" 
      description="Track your progress, earn badges by finding legendary investment opportunities, and level up your financial knowledge."
      icon={<Award className="w-10 h-10 text-blue-400 relative z-10" />}
    />
  );
}
