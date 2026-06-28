import { ComingSoon } from "@/components/layout/coming-soon";
import { Settings } from "lucide-react";

export const metadata = {
  title: "Settings | IfYouInvested.online",
};

export default function SettingsPage() {
  return (
    <ComingSoon 
      title="Settings" 
      description="Manage your account preferences, notifications, default currencies, and application appearance."
      icon={<Settings className="w-10 h-10 text-blue-400 relative z-10" />}
    />
  );
}
