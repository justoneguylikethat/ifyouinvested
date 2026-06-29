import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import React from "react";

export function KineticTypographyTemplate({ dataset, isDark }: { dataset: any; isDark: boolean }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!dataset) return null;

  const startPrincipal = dataset.startPrincipal || 10000;
  const cagr = dataset.cagr || 0.20; // 20% CAGR

  const simStart = 45;
  const simEnd = useVideoConfig().durationInFrames - 90;
  
  // Normalized progress between 0 and 10 (representing 10 years)
  const yearsProgress = interpolate(frame, [simStart, simEnd], [0, 10], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  // Calculate compounded value
  const currentValue = startPrincipal * Math.pow(1 + cagr, yearsProgress);

  // Milestone check for text pulse
  const milestones = [10000, 20000, 50000, 100000, 250000, 500000, 1000000];
  let currentMilestone = startPrincipal;
  for (const m of milestones) {
    if (currentValue >= m) {
      currentMilestone = m;
    }
  }

  // Calculate progress since passing the milestone to trigger a bounce/pulse effect
  const timeCrossing = Math.log(currentMilestone / startPrincipal) / Math.log(1 + cagr);
  const yearsSinceCrossing = Math.max(0, yearsProgress - timeCrossing);
  
  // Convert years back to frame scale for a spring pulse
  const framesSinceCrossing = yearsSinceCrossing * ( (simEnd - simStart) / 10 );

  const pulse = spring({
    frame: framesSinceCrossing,
    fps,
    config: { damping: 10, mass: 0.5 }
  });

  const scale = 1.0 + (pulse * 0.15); // Scales up to 1.15x when milestone is hit

  return (
    <AbsoluteFill className="flex flex-col items-center justify-center bg-slate-950 text-white font-sans overflow-hidden">
      {/* Background radial glow */}
      <div 
        className="absolute w-[800px] h-[800px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #10b981 0%, transparent 70%)',
          transform: `scale(${scale})`
        }}
      />

      <div className="z-10 text-center space-y-6">
        {/* Title / Year */}
        <h3 className="text-4xl font-black uppercase tracking-widest text-slate-500">
          Year {yearsProgress.toFixed(1)}
        </h3>

        {/* Massive Neon Counter */}
        <h1 
          className="text-8xl font-black tracking-tight transition-transform"
          style={{
            transform: `scale(${scale})`,
            color: '#10b981',
            textShadow: '0 0 40px rgba(16, 185, 129, 0.6), 0 0 80px rgba(16, 185, 129, 0.3)'
          }}
        >
          ${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </h1>

        {/* Milestone Indicator */}
        {yearsSinceCrossing < 1.0 && currentMilestone > startPrincipal && (
          <div 
            className="text-2xl font-black uppercase tracking-wider text-amber-400 animate-pulse mt-4"
            style={{
              textShadow: '0 0 15px rgba(245, 158, 11, 0.5)'
            }}
          >
            🔥 MILESTONE PASSED: ${currentMilestone.toLocaleString()}!
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}
