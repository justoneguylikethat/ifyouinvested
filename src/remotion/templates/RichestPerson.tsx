import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import React from "react";

export function RichestPersonTemplate({ dataset, isDark }: { dataset: any; isDark: boolean }) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  if (!dataset || !dataset.series) return null;

  const { series, timeline, unit } = dataset;
  const numYears = timeline.length;
  
  // Total frames for simulation is duration minus intro/outro
  // Assume intro is 45 frames, outro is 90 frames
  const simStart = 45;
  const simEnd = useVideoConfig().durationInFrames - 90;
  const simDuration = simEnd - simStart;

  // Calculate year interpolation progress
  const progress = interpolate(frame, [simStart, simEnd], [0, numYears - 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  const yearIndex = Math.floor(progress);
  const nextYearIndex = Math.min(yearIndex + 1, numYears - 1);
  const yearProgress = progress - yearIndex;
  
  const currentYear = timeline[yearIndex];

  // Calculate current interpolated values for each billionaire
  const activeBillionaires = series.map((b: any) => {
    const val1 = b.values[yearIndex];
    const val2 = b.values[nextYearIndex];
    const currentVal = val1 + (val2 - val1) * yearProgress;
    return {
      name: b.name,
      color: b.color || '#3b82f6',
      val: currentVal
    };
  });

  // Sort by value descending
  const sorted = [...activeBillionaires].sort((a, b) => b.val - a.val);
  const maxVal = Math.max(...activeBillionaires.map((b: any) => b.val), 1);

  return (
    <AbsoluteFill className="flex flex-col justify-center px-12 py-16">
      {/* Visual Title / Year Header */}
      <div className="text-center mb-10 z-10">
        <h2 className="text-7xl font-black tracking-tight" style={{ color: isDark ? '#fff' : '#020617' }}>
          Year: <span className="text-indigo-400 font-extrabold">{currentYear}</span>
        </h2>
      </div>

      {/* Leaderboard Bars */}
      <div className="flex-1 flex flex-col justify-center gap-8 z-10">
        {sorted.map((b, idx) => {
          // Scale width proportional to value compared to max
          const targetWidthRatio = b.val / maxVal;
          // Apply a spring physics animation for bar expansions
          const barWidthPercent = interpolate(targetWidthRatio, [0, 1], [15, 100]) * spring({
            frame: frame - simStart,
            fps,
            config: { damping: 12 }
          });

          return (
            <div key={b.name} className="space-y-2.5">
              <div className="flex justify-between items-end text-3xl font-black">
                <span style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>{b.name}</span>
                <span className="text-indigo-400 font-black">
                  ${b.val.toFixed(1)}{unit}
                </span>
              </div>
              <div className="w-full h-14 bg-slate-900/30 border border-white/5 rounded-2xl overflow-hidden p-1">
                <div 
                  className="h-full rounded-xl transition-all duration-300 relative"
                  style={{
                    width: `${barWidthPercent}%`,
                    background: `linear-gradient(90deg, ${b.color}80 0%, ${b.color} 100%)`,
                    boxShadow: `0 0 20px ${b.color}50`
                  }}
                >
                  {/* Subtle highlight sheen */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
