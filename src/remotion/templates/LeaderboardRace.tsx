import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import React from "react";
import { TrendingUp, Clock } from "lucide-react";

export function LeaderboardRaceTemplate({ dataset, isDark }: { dataset: any; isDark: boolean }) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!dataset || !dataset.series) return null;

  const { series, timeline, unit } = dataset;
  const numYears = timeline.length;
  
  // Timing points
  const simStart = 45;
  const simEnd = useVideoConfig().durationInFrames - 90;

  // Eased timeline progression to avoid mechanical feel
  const progress = interpolate(frame, [simStart, simEnd], [0, numYears - 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  const yearIndex = Math.floor(progress);
  const nextYearIndex = Math.min(yearIndex + 1, numYears - 1);
  const yearProgress = progress - yearIndex;
  
  const currentYear = timeline[yearIndex];
  const startYear = timeline[0];
  const yearsElapsed = parseInt(currentYear) - parseInt(startYear);

  // Calculate values for each asset at current progress
  const activeSeries = series.map((s: any) => {
    const val1 = s.values[yearIndex];
    const val2 = s.values[nextYearIndex];
    const currentVal = val1 + (val2 - val1) * yearProgress;
    
    // Choose premium gradients based on asset names
    let gradient = "linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)";
    const nameLow = s.name.toLowerCase();
    if (nameLow.includes("bitcoin") || nameLow.includes("btc")) {
      gradient = "linear-gradient(90deg, #F7931A 0%, #FFB347 100%)";
    } else if (nameLow.includes("tesla") || nameLow.includes("tsla")) {
      gradient = "linear-gradient(90deg, #8c0000 0%, #E82127 100%)";
    } else if (nameLow.includes("nvidia") || nameLow.includes("nvda")) {
      gradient = "linear-gradient(90deg, #1b5e00 0%, #76B900 100%)";
    } else if (nameLow.includes("apple") || nameLow.includes("aapl")) {
      gradient = "linear-gradient(90deg, #555555 0%, #D2D2D2 100%)";
    } else if (nameLow.includes("amazon") || nameLow.includes("amzn")) {
      gradient = "linear-gradient(90deg, #cc7a00 0%, #FF9900 100%)";
    } else if (nameLow.includes("gold") || nameLow.includes("gld")) {
      gradient = "linear-gradient(90deg, #996515 0%, #D4AF37 100%)";
    } else if (nameLow.includes("s&p") || nameLow.includes("spy")) {
      gradient = "linear-gradient(90deg, #003366 0%, #0056b3 100%)";
    } else if (nameLow.includes("savings") || nameLow.includes("interest")) {
      gradient = "linear-gradient(90deg, #005f5f 0%, #00a3a3 100%)";
    }

    return {
      name: s.name,
      color: s.color || '#3b82f6',
      gradient,
      val: currentVal
    };
  });

  // Rank calculations to interpolate climbing
  const valuesAtYear1 = series.map((s: any) => ({ name: s.name, val: s.values[yearIndex] }));
  const sortedAtYear1 = [...valuesAtYear1].sort((a, b) => b.val - a.val);

  const valuesAtYear2 = series.map((s: any) => ({ name: s.name, val: s.values[nextYearIndex] }));
  const sortedAtYear2 = [...valuesAtYear2].sort((a, b) => b.val - a.val);

  const maxVal = Math.max(...activeSeries.map((s: any) => s.val), 1);
  
  // Sort current frame values
  const sortedCurrent = [...activeSeries].sort((a, b) => b.val - a.val);
  const winner = sortedCurrent[0];

  // Layout settings
  const isLandscape = width > height;
  const isSquare = width === height;
  
  let ROW_HEIGHT = 114; // Default vertical layout - generous vertical spacing
  if (isLandscape) {
    ROW_HEIGHT = 58;
  } else if (isSquare) {
    ROW_HEIGHT = 76;
  }

  // Formatting helper for ticks
  const formatTick = (val: number) => {
    if (val >= 1000) {
      return `$${(val / 1000).toFixed(0)}K`;
    }
    return `$${val.toFixed(0)}`;
  };

  // Helper to render asset icon with glass border and glow
  const renderAssetLogo = (name: string, color: string) => {
    const isBitcoin = name.toLowerCase().includes("bitcoin");
    const isTesla = name.toLowerCase().includes("tesla");
    const isNvidia = name.toLowerCase().includes("nvidia");
    const isApple = name.toLowerCase().includes("apple");
    const isSP = name.toLowerCase().includes("s&p");
    const isAmazon = name.toLowerCase().includes("amazon");
    const isGold = name.toLowerCase().includes("gold");

    let innerContent = name.charAt(0);
    if (isBitcoin) innerContent = "₿";
    else if (isTesla) innerContent = "T";
    else if (isNvidia) innerContent = "N";
    else if (isApple) innerContent = "";
    else if (isSP) innerContent = "S&P";
    else if (isAmazon) innerContent = "a";
    else if (isGold) innerContent = "G";

    return (
      <div 
        className="w-14 h-14 rounded-full flex items-center justify-center font-black text-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] border-2 border-white/20 shrink-0 relative overflow-hidden"
        style={{ 
          background: `radial-gradient(circle at 35% 35%, ${color} 0%, ${color}dd 100%)`,
          boxShadow: `0 0 15px ${color}40, inset 0 2px 4px rgba(255,255,255,0.2)`
        }}
      >
        <span className="text-white z-10 select-none leading-none pt-0.5">{innerContent}</span>
        {/* Mirror/Gloss Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent z-0" />
      </div>
    );
  };

  // Cinematic Entrance Animations
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const titleSlide = interpolate(frame, [0, 20], [-40, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const headerScale = interpolate(frame, [0, 30], [0.95, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Insight Card slide in from bottom animation
  const cardSlide = interpolate(frame, [simEnd - 15, simEnd + 15], [200, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const cardOpacity = interpolate(frame, [simEnd - 15, simEnd + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill 
      className="flex flex-col text-white font-sans px-12 py-16 justify-between select-none relative overflow-hidden"
      style={{
        background: 'radial-gradient(circle at 50% 45%, #0d1a30 0%, #030712 100%)',
      }}
    >
      {/* CSS Styles injection for Google Fonts and Sweep animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');
        
        .premium-text-title {
          font-family: 'Outfit', sans-serif;
        }
        .premium-text-body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        @keyframes light-sweep {
          0% { transform: translateX(-100%) skewX(-15deg); }
          30% { transform: translateX(200%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }
        
        .leader-glow-bar::after {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.15) 70%, transparent 100%);
          animation: light-sweep 4s infinite ease-in-out;
        }

        .ambient-noise {
          opacity: 0.015;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
        }
      `}} />

      {/* Brand Watermark Badge */}
      <div className="absolute top-6 left-12 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-4 py-1.5 z-20 flex items-center gap-1.5 shadow-lg">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-black tracking-widest text-slate-300 uppercase premium-text-body">
          ifyouinvested.online
        </span>
      </div>

      {/* Decorative Grid Lines Overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Subtle Noise Texture */}
      <div className="absolute inset-0 ambient-noise z-0 pointer-events-none" />

      {/* Radial spotlight behind the leaderboard */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 60%)',
        }}
      />

      {/* 1. Header Section */}
      <div 
        className="space-y-4 text-center mt-6 z-10"
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleSlide}px) scale(${headerScale})`,
        }}
      >
        <h1 className="text-[5.5rem] font-extrabold tracking-tight leading-[1.02] uppercase premium-text-title">
          WHICH INVESTMENT <br/>
          <span className="bg-gradient-to-r from-[#10b981] to-[#34d399] bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(52,211,153,0.35)]">
            MADE YOU RICHER?
          </span>
        </h1>
        <p className="text-3xl text-slate-400 font-bold tracking-wide premium-text-body">
          <span className="text-[#34d399] font-black">${startYear === '2010' ? '100' : '1,000'}</span> invested in <span className="text-white">{startYear}</span>
        </p>
        <div className="flex items-center justify-center gap-2 pt-1">
          <Clock className="w-5 h-5 text-indigo-400/80 animate-pulse" />
          <span className="text-slate-400/60 font-extrabold text-sm uppercase tracking-widest premium-text-body">
            Growth Over Time
          </span>
        </div>
      </div>

      {/* 2. Scale axis indicators */}
      <div className="mt-10 px-4 z-10">
        <div className="flex justify-between text-slate-500 text-lg font-bold border-b border-white/10 pb-3 relative premium-text-body">
          <span>$0</span>
          <span>{formatTick(maxVal / 3)}</span>
          <span>{formatTick((maxVal * 2) / 3)}</span>
          <span>{formatTick(maxVal)}</span>
          {/* Subtle axis glow line */}
          <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent blur-[0.5px]" />
        </div>
      </div>

      {/* 3. Competitive Climbing Leaderboard */}
      <div className="flex-1 relative w-full my-8 overflow-hidden z-10">
        {activeSeries.map((item: any) => {
          const rank1 = sortedAtYear1.findIndex((x) => x.name === item.name);
          const rank2 = sortedAtYear2.findIndex((x) => x.name === item.name);
          // Eased Rank position interpolation
          const interpolatedRank = rank1 + (rank2 - rank1) * yearProgress;

          const widthRatio = item.val / maxVal;
          // Apply a spring-based fluid bar expansion. Cap at 78% to avoid clipping the right label.
          const barWidthPercent = (15 + widthRatio * 63) * spring({
            frame: frame - simStart,
            fps,
            config: { damping: 15, stiffness: 90 }
          });

          const isLeader = winner.name === item.name;
          const rankChange = rank1 - rank2; // Positive means climbing

          return (
            <div 
              key={item.name} 
              className="absolute left-0 right-0 flex items-center gap-5 transition-all duration-300 ease-out"
              style={{
                transform: `translateY(${interpolatedRank * ROW_HEIGHT}px)`,
                height: `${ROW_HEIGHT - 16}px`,
              }}
            >
              {/* Logo with optional glow and overtaking indicators */}
              <div className="relative">
                {renderAssetLogo(item.name, item.color)}
                
                {/* Climbing Up indicator badge */}
                {rankChange > 0 && (
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-950 animate-bounce">
                    ▲
                  </div>
                )}
                
                {/* Dropping Down indicator badge */}
                {rankChange < 0 && (
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-rose-500 border border-slate-900 flex items-center justify-center text-[10px] font-black text-white opacity-90">
                    ▼
                  </div>
                )}

                {isLeader && (
                  <div 
                    className="absolute inset-0 rounded-full border border-white/30 blur-[2px] animate-ping"
                    style={{ animationDuration: '3s' }}
                  />
                )}
              </div>
              
              {/* Name Label outside the bar to prevent truncation */}
              <div className="w-44 shrink-0 text-left">
                <span className="text-white font-extrabold text-2xl truncate block premium-text-body">
                  {item.name}
                </span>
              </div>
              
              {/* Pill Bar Container */}
              <div className="flex-1 flex items-center relative min-w-0 pr-28 h-full">
                {/* Horizontal Growing Pill Bar */}
                <div 
                  className={`h-12 rounded-[20px] flex items-center px-5 relative overflow-hidden transition-all shrink-0 ${isLeader ? 'leader-glow-bar shadow-[0_0_20px_rgba(255,255,255,0.08)]' : ''}`}
                  style={{
                    width: `${barWidthPercent}%`,
                    background: item.gradient,
                    border: isLeader ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.03)',
                  }}
                >
                  {/* Sheen overlay for metallic effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent z-0" />
                </div>

                {/* Laser Tip Flare particle */}
                <div 
                  className="absolute w-3.5 h-3.5 rounded-full z-20 transition-all duration-75"
                  style={{
                    left: `calc(${barWidthPercent}% - 7px)`,
                    top: 'calc(50% - 7px)',
                    backgroundColor: '#ffffff',
                    boxShadow: `0 0 10px #ffffff, 0 0 20px ${item.color}`
                  }}
                />

                {/* Val Counter sit right beside the bar tip */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 font-black text-[1.65rem] pl-4 premium-text-body"
                  style={{
                    left: `${barWidthPercent}%`,
                    color: item.color,
                    whiteSpace: 'nowrap',
                    textShadow: isLeader ? `0 0 15px ${item.color}30` : 'none',
                    transition: 'left 0.1s linear'
                  }}
                >
                  ${item.val.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Insight Card & Dynamic Elapsed Time Footer */}
      <div className="flex items-end justify-between gap-6 border-t border-white/5 pt-8 mb-4 z-10 relative">
        
        {/* Glassmorphic Insight Card */}
        <div 
          className="flex-1 backdrop-blur-md bg-white/[0.03] border border-white/10 rounded-[24px] p-6 flex items-start gap-4 max-w-xl transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
          style={{
            transform: `translateY(${cardSlide}px)`,
            opacity: cardOpacity,
          }}
        >
          <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(251,191,36,0.3)]">
            <span className="text-2xl leading-none">💡</span>
          </div>
          <div>
            <h4 className="text-xl font-bold text-slate-200 leading-snug premium-text-body">
              <span className="text-emerald-400 font-extrabold">{winner.name}</span> turned <span className="text-white">${startYear === '2010' ? '100' : '1,000'}</span> into <span className="text-emerald-400 font-extrabold">${winner.val.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span> in just {yearsElapsed} years.
            </h4>
          </div>
        </div>

        {/* Floating Year / Timeline Indicators */}
        <div className="text-right shrink-0">
          <div className="text-[5.5rem] font-black text-slate-100 tracking-tight leading-none premium-text-title drop-shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            {currentYear}
          </div>
          <div className="text-sm font-bold text-slate-500 tracking-[0.2em] uppercase mt-2 premium-text-body">
            🕒 {yearsElapsed} Years Later
          </div>
        </div>
      </div>

      {/* 5. Minimal citation source text */}
      <div className="absolute bottom-2 left-12 opacity-30 text-xs font-bold uppercase tracking-wider text-slate-500 premium-text-body z-10">
        Source: Yahoo Finance, MacroTrends
      </div>
    </AbsoluteFill>
  );
}
