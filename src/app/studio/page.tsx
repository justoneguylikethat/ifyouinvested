import React from "react";
import { Sparkles, Clock, Smartphone, Play, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Video Studio | IfYouInvested.online",
};

export default function StudioPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-950 text-white relative overflow-hidden px-6 py-12 select-none">
      {/* CSS Styles injection for Outfit & Plus Jakarta Fonts */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@500;700;800&display=swap');
        
        .studio-font-title {
          font-family: 'Outfit', sans-serif;
        }
        .studio-font-body {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
      `}} />

      {/* Decorative Grid Lines Overlay */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Ambient background glow spots */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Content Container */}
      <div className="max-w-2xl w-full text-center space-y-8 z-10">
        
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest studio-font-body animate-pulse">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Under Construction</span>
        </div>

        {/* Hero Headers */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05] studio-font-title">
            VIDEO STUDIO <br/>
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-[#34d399] bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(99,102,241,0.15)]">
              COMING SOON
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 font-medium max-w-lg mx-auto leading-relaxed studio-font-body">
            Automatically transform any investment timeline or structured dataset into premium, highly-engaging vertical videos optimized for TikTok, Reels, and Shorts.
          </p>
        </div>

        {/* Feature List (Glassmorphism) */}
        <div className="backdrop-blur-md bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 text-left space-y-4 shadow-xl">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest studio-font-body pb-2 border-b border-white/5">
            Key Features In Development
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {[
              { title: "Competitive Leaderboard Races", desc: "Dynamic overtaking animations based on chronological valuation changes." },
              { title: "Kinetic Compound Counters", desc: "Super-responsive number counting with neon mileston pulse triggers." },
              { title: "Dynamic Brand Customization", desc: "Upload logo watermarks, set brand colors, and add outro calls to action." },
              { title: "60 FPS Render Pipeline", desc: "Headless rendering utilizing Remotion templates for fluid MP4 generation." }
            ].map((f, i) => (
              <div key={i} className="space-y-1">
                <h4 className="text-white font-bold text-sm flex items-center gap-2 studio-font-body">
                  <span className="text-[#34d399] text-xs">●</span> {f.title}
                </h4>
                <p className="text-slate-400 text-xs leading-normal studio-font-body pl-3">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Back to Calculator CTA */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/calculator">
            <button className="flex items-center gap-2 bg-white text-black hover:bg-slate-200 font-bold px-6 py-3 rounded-xl shadow-lg transition-all studio-font-body">
              <span>Go to Investment Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium studio-font-body">
            <Clock className="w-3.5 h-3.5" />
            <span>Targeting Q3 Release</span>
          </div>
        </div>

      </div>
    </div>
  );
}
