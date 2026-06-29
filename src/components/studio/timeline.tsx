"use client";

import { useStudioStore } from "@/lib/use-studio-store";
import { Music, Eye, Layers } from "lucide-react";

export function Timeline() {
  const { durationInFrames, fps } = useStudioStore();
  const durationSec = (durationInFrames / fps).toFixed(1);

  // Divide segments
  const introFrames = 45; // 1.5s
  const outroFrames = 90; // 3s
  const contentFrames = durationInFrames - introFrames - outroFrames;

  const introWidth = (introFrames / durationInFrames) * 100;
  const contentWidth = (contentFrames / durationInFrames) * 100;
  const outroWidth = (outroFrames / durationInFrames) * 100;

  return (
    <div className="h-32 border-t border-white/10 bg-slate-950 flex flex-col z-10 select-none">
      {/* Ticks and playhead track */}
      <div className="h-8 border-b border-white/5 px-6 flex items-center justify-between text-[10px] font-bold text-slate-500 bg-slate-900/20">
        <div className="flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span>TIMELINE LAYER PANEL</span>
        </div>
        <span>TOTAL DURATION: {durationSec}s ({durationInFrames} frames @ {fps}fps)</span>
      </div>

      {/* Visual Timeline Channels */}
      <div className="flex-1 p-4 flex flex-col justify-center gap-3">
        {/* Visual Blocks Track */}
        <div className="h-7 w-full bg-slate-900 border border-white/5 rounded-lg overflow-hidden flex text-[10px] font-bold">
          {/* Intro Segment */}
          <div 
            style={{ width: `${introWidth}%` }} 
            className="h-full bg-indigo-500/20 border-r border-indigo-500/30 flex items-center justify-center text-indigo-400 relative group hover:bg-indigo-500/30 transition-all"
            title="Hook / Intro Screen"
          >
            <span>INTRO (1.5s)</span>
          </div>

          {/* Content Segment */}
          <div 
            style={{ width: `${contentWidth}%` }} 
            className="h-full bg-emerald-500/10 border-r border-emerald-500/20 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/15 transition-all"
            title="Interactive Data Visualization Race"
          >
            <span>ANIMATED DATA SIMULATION</span>
          </div>

          {/* Outro Segment */}
          <div 
            style={{ width: `${outroWidth}%` }} 
            className="h-full bg-amber-500/15 flex items-center justify-center text-amber-400 hover:bg-amber-500/20 transition-all"
            title="Call to Action (CTA) & Outro"
          >
            <span>OUTRO / CTA (3.0s)</span>
          </div>
        </div>

        {/* Background Music Track */}
        <div className="h-6 w-full bg-slate-900/60 border border-white/5 rounded-lg overflow-hidden flex items-center px-3 text-[10px] text-slate-500 gap-2">
          <Music className="w-3 h-3 text-pink-500" />
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[9px]">Audio Track: Background Music (Auto-Ducked)</span>
          <div className="flex-1 flex gap-1 h-3 items-center justify-center opacity-30">
            {/* Waveform mimic */}
            {Array.from({ length: 48 }).map((_, i) => {
              const h = Math.sin(i * 0.5) * 8 + 10;
              return (
                <div 
                  key={i} 
                  style={{ height: `${h}px` }} 
                  className="w-[2px] bg-pink-500 rounded-full" 
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
