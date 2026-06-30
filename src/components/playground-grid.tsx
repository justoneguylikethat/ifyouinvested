import Link from "next/link";
import { PieChart, DollarSign, Coffee, Search, AlertTriangle, Calculator, PiggyBank, Percent, Bot, TrendingUp, Newspaper, Trophy, Flame } from "lucide-react";

export const PLAYGROUND_TOOLS = [
  { 
    name: "Millionaire Challenge 🏆", 
    description: "Play the historical investment strategy game! Turn $10k into $1M.",
    href: "/millionaire-challenge", 
    icon: Trophy,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10"
  },
  { 
    name: "24h Memecoin Calculator 🔥", 
    description: "Calculate 24-hour returns for Pepe, Dogecoin, and minor altcoins.",
    href: "/memecoin-calculator", 
    icon: Flame,
    color: "text-amber-500",
    bg: "bg-amber-500/10"
  },
  { 
    name: "Investment Calculator", 
    description: "Calculate historical returns for any stock or cryptocurrency.",
    href: "/calculator", 
    icon: Calculator,
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  { 
    name: "Portfolio Builder", 
    description: "Construct and backtest a custom portfolio of stocks and crypto.",
    href: "/portfolio", 
    icon: PieChart,
    color: "text-purple-400",
    bg: "bg-purple-500/10"
  },
  { 
    name: "Dollar Cost Averaging", 
    description: "See what happens when you invest a little bit every week or month.",
    href: "/dca", 
    icon: DollarSign,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10"
  },
  { 
    name: "Lifestyle Calculator", 
    description: "What if you invested your coffee money instead of spending it?",
    href: "/lifestyle", 
    icon: Coffee,
    color: "text-amber-400",
    bg: "bg-amber-500/10"
  },
  { 
    name: "Best Investment Finder", 
    description: "Discover the highest returning assets for any given time period.",
    href: "/best-finder", 
    icon: Search,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10"
  },
  { 
    name: "Market Crash Simulator", 
    description: "Test how your investments would perform during major historical crashes.",
    href: "/crash-simulator", 
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-500/10"
  },
  { 
    name: "Retirement Calculator", 
    description: "Plan your future and see if you are on track to retire.",
    href: "/retirement", 
    icon: PiggyBank,
    color: "text-pink-400",
    bg: "bg-pink-500/10"
  },
  { 
    name: "Dividend Explorer", 
    description: "Explore the power of compound interest through dividend reinvestment.",
    href: "/dividend", 
    icon: Percent,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10"
  },
  { 
    name: "AI Investment Insights", 
    description: "Get AI-generated summaries and insights on your portfolio.",
    href: "/ai-insights", 
    icon: Bot,
    color: "text-rose-400",
    bg: "bg-rose-500/10"
  },
  { 
    name: "Trending Assets", 
    description: "See what assets are currently trending in the market.",
    href: "/trending", 
    icon: TrendingUp,
    color: "text-orange-400",
    bg: "bg-orange-500/10"
  },
  { 
    name: "Market News", 
    description: "Stay up-to-date with the latest financial news and events.",
    href: "/news", 
    icon: Newspaper,
    color: "text-teal-400",
    bg: "bg-teal-500/10"
  }
];

export function PlaygroundGrid() {
  return (
    <section className="my-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Explore Our Playgrounds</h2>
        <p className="text-slate-400">
          Try our interactive tools to backtest strategies and simulate historical returns.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PLAYGROUND_TOOLS.map((tool) => (
          <Link 
            key={tool.href}
            href={tool.href}
            className="flex flex-col p-6 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl ${tool.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <tool.icon className={`w-6 h-6 ${tool.color}`} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
              {tool.name}
            </h3>
            <p className="text-sm text-slate-400 flex-1">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
