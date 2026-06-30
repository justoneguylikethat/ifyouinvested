"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Calculator,
  PieChart,
  DollarSign,
  Coffee,
  Search,
  BookOpen,
  AlertTriangle,
  PiggyBank,
  Percent,
  Bot,
  TrendingUp,
  Newspaper,
  Video,
  Save,
  Star,
  Award,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Gamepad2,
  X,
  Download,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const navGroups = [
  {
    title: "Core Tools",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Investment Calculator", href: "/calculator", icon: Calculator },
      { name: "24h Memecoin Calculator", href: "/memecoin-calculator", icon: Flame },
      { name: "Future Predictions", href: "/predict", icon: Bot },
    ]
  },
  {
    title: "Playgrounds",
    items: [
      { name: "Portfolio Builder", href: "/portfolio", icon: PieChart },
      { name: "Dollar Cost Averaging", href: "/dca", icon: DollarSign },
      { name: "Lifestyle Calculator", href: "/lifestyle", icon: Coffee },
      { name: "Best Investment Finder", href: "/best-finder", icon: Search },
      { name: "Millionaire Challenge", href: "/challenge", icon: Gamepad2 },
      { name: "Market Crash Simulator", href: "/crash-simulator", icon: AlertTriangle },
    ]
  },
  {
    title: "Insights",
    items: [
      { name: "Retirement Calculator", href: "/retirement", icon: PiggyBank },
      { name: "Dividend Explorer", href: "/dividend", icon: Percent },
      { name: "AI Investment Insights", href: "/ai-insights", icon: Bot },
      { name: "Trending Assets", href: "/trending", icon: TrendingUp },
      { name: "Market News", href: "/news", icon: Newspaper },
    ]
  },
  {
    title: "Platform",
    items: [
      { name: "Video Studio", href: "/studio", icon: Video },
      { name: "Saved Comparisons", href: "/saved", icon: Save },
      { name: "Watchlist", href: "/watchlist", icon: Star },
      { name: "Achievements", href: "/achievements", icon: Award },
      { name: "Settings", href: "/settings", icon: Settings },
    ]
  }
];

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ mobileOpen, setMobileOpen, collapsed, setCollapsed }: SidebarProps) {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  const toggleCollapsed = () => setCollapsed(!collapsed);

  useEffect(() => {
    // 1. Check if PWA is installable (Chrome / Android / Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 2. Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
    
    setIsIOS(isIOSDevice);
    setIsStandalone(isStandaloneMode);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (isInstallable && deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      toast("To install on iOS:", {
        description: "Tap the 'Share' icon in Safari and select 'Add to Home Screen' from the menu.",
        duration: 8000,
        action: {
          label: "Got it",
          onClick: () => {}
        }
      });
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out border-r border-white/10 bg-[#0B1220]/95 backdrop-blur-xl flex flex-col",
          collapsed ? "w-[80px]" : "w-[280px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <div className={cn("flex items-center gap-2", collapsed && "hidden lg:flex justify-center w-full")}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-500 to-emerald-400 flex items-center justify-center shrink-0">
              <TrendingUp className="text-white w-5 h-5" />
            </div>
            {!collapsed && (
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                IfYouInvested.online
              </span>
            )}
          </div>
          <button 
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 hide-scrollbar">
          {navGroups.map((group, i) => (
            <div key={i} className="mb-6">
              {!collapsed && (
                <div className="px-6 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {group.title}
                </div>
              )}
              <nav className="space-y-1 px-3">
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                        isActive 
                          ? "bg-blue-500/10 text-blue-400 font-medium" 
                          : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                      )}
                      title={collapsed ? item.name : undefined}
                    >
                      <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200")} />
                      {!collapsed && (
                        <span className="truncate">{item.name}</span>
                      )}
                      {isActive && collapsed && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* PWA Install Button */}
        {(isInstallable || (isIOS && !isStandalone)) && (
          <div className="px-4 py-2 border-t border-white/5">
            <button
              onClick={handleInstall}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all font-bold text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/10",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? "Install App" : undefined}
            >
              <Download className="w-5 h-5 shrink-0" />
              {!collapsed && <span>Install App</span>}
            </button>
          </div>
        )}

        <div className="p-4 border-t border-white/10">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleCollapsed}
            className="hidden lg:flex w-full justify-center text-slate-400 hover:text-white hover:bg-white/5"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </Button>
        </div>
      </aside>
    </>
  );
}
