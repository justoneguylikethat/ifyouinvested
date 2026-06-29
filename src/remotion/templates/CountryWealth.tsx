import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import React from "react";

export function CountryWealthTemplate({ dataset, isDark }: { dataset: any; isDark: boolean }) {
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

  // Extrapolate values for the two duelers
  const countryA = series[0];
  const countryB = series[1];

  if (!countryA || !countryB) return null;

  const valA = countryA.values[yearIndex] + (countryA.values[nextYearIndex] - countryA.values[yearIndex]) * yearProgress;
  const valB = countryB.values[yearIndex] + (countryB.values[nextYearIndex] - countryB.values[yearIndex]) * yearProgress;

  // Visual layout: Split Screen 50/50
  return (
    <AbsoluteFill className="flex flex-col">
      {/* Splits */}
      <div className="flex-1 flex w-full relative">
        {/* Left country: A */}
        <div 
          className="w-1/2 h-full flex flex-col justify-center items-center p-8 transition-all"
          style={{
            background: isDark ? 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)' : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            borderRight: '2px solid rgba(255,255,255,0.05)'
          }}
        >
          <div className="text-4xl font-black mb-6 uppercase tracking-wider text-center" style={{ color: countryA.color || '#3b82f6' }}>
            {countryA.name}
          </div>
          <div className="text-7xl font-extrabold text-white text-center drop-shadow-lg">
            ${valA.toFixed(1)}{unit}
          </div>
        </div>

        {/* Right country: B */}
        <div 
          className="w-1/2 h-full flex flex-col justify-center items-center p-8 transition-all"
          style={{
            background: isDark ? 'linear-gradient(135deg, #991b1b 0%, #0f172a 100%)' : 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)'
          }}
        >
          <div className="text-4xl font-black mb-6 uppercase tracking-wider text-center" style={{ color: countryB.color || '#ef4444' }}>
            {countryB.name}
          </div>
          <div className="text-7xl font-extrabold text-white text-center drop-shadow-lg">
            ${valB.toFixed(1)}{unit}
          </div>
        </div>

        {/* Floating Year badge */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-slate-950/80 border-4 border-indigo-500 text-white px-8 py-4 rounded-3xl shadow-2xl z-20 text-center font-black">
          <div className="text-xs text-slate-500 uppercase tracking-widest mb-0.5">TIMELINE</div>
          <div className="text-5xl">{currentYear}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
