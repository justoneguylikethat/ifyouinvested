import { ComingSoon } from "@/components/layout/coming-soon";
import { Save } from "lucide-react";

export const metadata = {
  title: "Saved Comparisons | IfYouInvested.online",
};

export default function SavedPage() {
  return (
    <ComingSoon 
      title="Saved Comparisons" 
      description="Access all your previously saved hypothetical portfolios and asset comparisons in one convenient location."
      icon={<Save className="w-10 h-10 text-blue-400 relative z-10" />}
    />
  );
}
