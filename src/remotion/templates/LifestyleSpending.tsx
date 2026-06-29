import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import React from "react";

export function LifestyleSpendingTemplate({ dataset, isDark }: { dataset: any; isDark: boolean }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (!dataset || !dataset.series) return null;

  const { series, timeline, unit } = dataset;
  const numYears = timeline.length;
  
  const simStart = 45;
  const simEnd = useVideoConfig().durationInFrames - 90;
  const simDuration = simEnd - simStart;

  const progress = interpolate(frame, [simStart, simEnd], [0, numYears - 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  const yearIndex = Math.floor(progress);
  const nextYearIndex = Math.min(yearIndex + 1, numYears - 1);
  const yearProgress = progress - yearIndex;
  
  const currentYear = timeline[yearIndex];

  const seriesA = series[0]; // Lifestyle spending (Spent)
  const seriesB = series[1]; // Investment value (Saved/Invested)

  if (!seriesA || !seriesB) return null;

  const valA = seriesA.values[yearIndex] + (seriesA.values[nextYearIndex] - seriesA.values[yearIndex]) * yearProgress;
  const valB = seriesB.values[yearIndex] + (seriesB.values[nextYearIndex] - seriesB.values[yearIndex]) * yearProgress;

  const maxVal = Math.max(valA, valB, 1);

  return (
    <AbsoluteFill className="flex flex-col px-12 py-16 justify-center">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-5xl font-black mb-2 uppercase tracking-wide" style={{ color: isDark ? '#fff' : '#0f172a' }}>
          Daily Habits Comparison
        </h2>
        <span className="text-3xl font-extrabold text-indigo-400">Timeline: {currentYear}</span>
      </div>

      <div className="flex-1 flex flex-col justify-center gap-12">
        {/* Lifestyle spending */}
        <div className="space-y-3">
          <div className="flex justify-between items-end text-3xl font-extrabold">
            <span style={{ color: isDark ? '#94a3b8' : '#64748b' }}>{seriesA.name}</span>
            <span className="text-red-500 font-black">${valA.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
          <div className="h-10 w-full bg-slate-900 border border-white/5 rounded-xl overflow-hidden">
            <div 
              className="h-full bg-red-500/80 rounded-xl"
              style={{
                width: `${(valA / maxVal) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Investment value */}
        <div className="space-y-3">
          <div className="flex justify-between items-end text-3xl font-extrabold">
            <span style={{ color: isDark ? '#f8fafc' : '#0f172a' }}>{seriesB.name}</span>
            <span className="text-emerald-400 font-black">${valB.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
          <div className="h-14 w-full bg-slate-900 border border-indigo-500/20 rounded-2xl p-1 overflow-hidden">
            <div 
              className="h-full bg-emerald-400 rounded-xl shadow-[0_0_20px_rgba(52,211,153,0.3)]"
              style={{
                width: `${(valB / maxVal) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
