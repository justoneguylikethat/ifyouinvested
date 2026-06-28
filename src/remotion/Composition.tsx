"use client";

import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { InvestmentResult } from "@/lib/types";

export type VideoLayout = 'vertical' | 'horizontal' | 'square';
export type VideoTheme = 'light' | 'dark';

export const VideoComposition: React.FC<{ results: InvestmentResult[], layout?: VideoLayout, theme?: VideoTheme }> = ({ results, layout = 'vertical', theme = 'dark' }) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const isDark = theme === 'dark';

  if (!results || results.length === 0) return null;

  // Find the longest history
  const longestHistory = results.reduce((prev, current) => 
    (prev.history.length > current.history.length) ? prev : current
  ).history;

  let absoluteMax = 0;
  for (const result of results) {
    for (const point of result.history) {
      if (point.price > absoluteMax) absoluteMax = point.price;
    }
    if (result.initialInvestment > absoluteMax) absoluteMax = result.initialInvestment;
  }

  // Draw chart slowly over 17 seconds (510 frames)
  const drawingFrames = 510;
  const progress = interpolate(frame, [0, drawingFrames], [0, 1], { extrapolateRight: "clamp" });
  
  const currentDataIndex = Math.min(
    Math.floor(progress * (longestHistory.length - 1)),
    longestHistory.length - 1
  );

  const colors = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  // Default Vertical (TikTok/Reels) dimensions
  let chartX = 140;
  let chartY = 650;
  let chartW = 680;
  let chartH = 900;
  let titlePadding = "100px 60px 0 60px";
  let titleFontSize = "50px";

  if (layout === 'horizontal') {
    // YouTube dimensions (1920x1080)
    chartX = 200;
    chartY = 350;
    chartW = 1400;
    chartH = 600;
    titlePadding = "80px 100px 0 100px";
    titleFontSize = "70px";
  } else if (layout === 'square') {
    // Instagram dimensions (1080x1080)
    chartX = 140;
    chartY = 400;
    chartW = 680;
    chartH = 500;
    titlePadding = "60px 60px 0 60px";
    titleFontSize = "45px";
  }

  const startYear = longestHistory[0]?.date.split("-")[0];
  const initialAmount = results[0]?.initialInvestment.toLocaleString();
  const mainAsset = results[0]?.asset.symbol;

  const summaryOpacity = interpolate(frame, [drawingFrames + 5, drawingFrames + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const summaryY = interpolate(frame, [drawingFrames + 5, drawingFrames + 20], [50, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const introOpacity = interpolate(frame, [45, 60], [1, 0], { extrapolateRight: "clamp" });
  const outroOpacity = interpolate(frame, [durationInFrames - 60, durationInFrames - 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const sortedResults = [...results].sort((a, b) => b.finalValue - a.finalValue);
  const topPerformer = sortedResults[0];
  const runnersUp = sortedResults.slice(1);
  const topIsPositive = topPerformer.totalReturn >= 0;
  const topCagr = topPerformer.cagr;

  return (
    <AbsoluteFill style={{ backgroundColor: isDark ? "#020617" : "#f8fafc", color: isDark ? "white" : "#0f172a", fontFamily: "sans-serif" }}>
      
      {/* Background Ambience */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "100%", height: "100%", background: isDark ? "radial-gradient(ellipse at center, rgba(30,58,138,0.4) 0%, #020617 70%)" : "radial-gradient(ellipse at center, rgba(147,197,253,0.3) 0%, #f8fafc 70%)" }} />

      {/* Un-editable Background Watermark */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(-30deg)',
        fontSize: layout === 'horizontal' ? '140px' : '90px',
        fontWeight: 900,
        color: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
        zIndex: 1,
        whiteSpace: 'nowrap',
        pointerEvents: 'none',
        userSelect: 'none',
        letterSpacing: '-0.02em'
      }}>
        ifyouinvested.online
      </div>

      {/* Header */}
      <div style={{ padding: titlePadding, textAlign: "center", position: "relative", zIndex: 10 }}>
        <h1 style={{ fontSize: titleFontSize, margin: 0, fontWeight: 800, lineHeight: 1.2, textShadow: isDark ? "0 4px 20px rgba(0,0,0,0.5)" : "none" }}>
          {results.length > 1 ? (
            <>
              What if you invested <span style={{ color: isDark ? "#34d399" : "#059669" }}>${initialAmount}</span> in <span style={{ color: isDark ? "#60a5fa" : "#2563eb" }}>{results.length > 3 ? `${results.length} different assets` : results.map(r => r.asset.symbol).join(" vs ")}</span> in {startYear}?
            </>
          ) : (
            <>
              How much Money would you have made by investing just <span style={{ color: isDark ? "#34d399" : "#059669" }}>${initialAmount}</span> in <span style={{ color: isDark ? "#60a5fa" : "#2563eb" }}>{mainAsset}</span> in {startYear}?
            </>
          )}
        </h1>
      </div>

      {/* SVG Chart Area */}
      <AbsoluteFill>
        <svg width={width} height={height} style={{ position: "absolute", top: 0, left: 0 }}>
          
          {/* Axes */}
          <line x1={chartX} y1={chartY} x2={chartX} y2={chartY + chartH} stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"} strokeWidth="6" />
          <line x1={chartX} y1={chartY + chartH} x2={chartX + chartW} y2={chartY + chartH} stroke={isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"} strokeWidth="6" />

          {/* Y-axis Labels */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
            const y = chartY + chartH - (chartH * ratio);
            const val = absoluteMax * ratio;
            return (
              <g key={`y-${ratio}`}>
                <text x={chartX - 30} y={y + 15} fontSize="35" fontWeight="bold" fill={isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"} textAnchor="end">
                  ${val > 1000 ? (val/1000).toFixed(0) + 'k' : val.toFixed(0)}
                </text>
                <line x1={chartX - 15} y1={y} x2={chartX} y2={y} stroke={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"} strokeWidth="4" />
                <line x1={chartX} y1={y} x2={chartX + chartW} y2={y} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="2" strokeDasharray="10 10" />
              </g>
            );
          })}

          {/* Lines */}
          {results.map((result, i) => {
            const color = colors[i % colors.length];
            // Only take points up to current frame's progress
            const visiblePoints = result.history.slice(0, currentDataIndex + 1);
            
            if (visiblePoints.length === 0) return null;

            const pathData = visiblePoints.map((point, index) => {
              // Map index to X coordinate based on longest history to keep scale consistent
              const xRatio = index / Math.max(1, longestHistory.length - 1);
              const x = chartX + (xRatio * chartW);
              
              const yRatio = point.price / absoluteMax;
              const y = chartY + chartH - (yRatio * chartH);
              
              return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(" ");

            return (
              <path 
                key={result.asset.symbol} 
                d={pathData} 
                fill="none" 
                stroke={color} 
                strokeWidth="12" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                style={{ filter: `drop-shadow(0px 0px 15px ${color}80)` }}
              />
            );
          })}
        </svg>

        {/* Labels at the tip of each line */}
        {results.map((result, i) => {
            const color = colors[i % colors.length];
            const pointIndex = Math.min(currentDataIndex, result.history.length - 1);
            const currentPoint = result.history[pointIndex];
            if (!currentPoint) return null;

            const xRatio = pointIndex / Math.max(1, longestHistory.length - 1);
            const x = chartX + (xRatio * chartW);
            
            const yRatio = currentPoint.price / absoluteMax;
            const y = chartY + chartH - (yRatio * chartH);

            return (
              <div 
                key={`${result.asset.symbol}-label`}
                style={{
                  position: "absolute",
                  left: x + 20,
                  top: y - 50 + (i * 15), // stagger slightly to prevent total overlap
                  color: isDark ? "#fff" : "#0f172a",
                  fontWeight: "bold",
                  fontSize: layout === 'horizontal' ? "55px" : "45px",
                  display: "flex",
                  flexDirection: "column",
                  textShadow: isDark ? "0 4px 15px rgba(0,0,0,0.8)" : "0 4px 15px rgba(255,255,255,0.8)",
                  background: isDark ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.8)",
                  padding: "10px 20px",
                  borderRadius: "15px",
                  border: `3px solid ${color}`
                }}
              >
                <span>{result.asset.symbol}</span>
                <span style={{ color: isDark ? "#34d399" : "#059669" }}>${currentPoint.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
            );
        })}

        {/* X-axis year labels */}
        <div style={{ position: "absolute", top: chartY + chartH + 30, left: chartX, width: chartW, display: "flex", justifyContent: "space-between" }}>
          {/* Pick 5 evenly spaced dates */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
            const index = Math.floor(ratio * (longestHistory.length - 1));
            const dateStr = longestHistory[index]?.date;
            const year = dateStr ? dateStr.split("-")[0] : "";
            return (
              <span key={`x-${ratio}`} style={{ fontSize: "35px", fontWeight: "bold", transform: "translateX(-50%)", color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)" }}>
                {year}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>
      
      {/* Asset Summary Cards */}
      {results.length > 1 ? (
        (() => {
          const sequenceAssets = [...sortedResults].reverse();
          return sequenceAssets.map((assetResult, i) => {
            const isWinner = i === sequenceAssets.length - 1;
            const startFrame = drawingFrames + (i * 90);
            const fadeInStart = startFrame;
            const fadeInEnd = startFrame + 15;
            const fadeOutStart = startFrame + 90 - 15;
            const fadeOutEnd = startFrame + 90;

            const opacity = interpolate(frame, 
              [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd], 
              [0, 1, 1, isWinner ? 1 : 0], 
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            const yPos = interpolate(frame,
              [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd],
              [50, 0, 0, isWinner ? 0 : -50],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
            );

            if (frame < fadeInStart || (!isWinner && frame > fadeOutEnd)) return null;

            const isPos = assetResult.totalReturn >= 0;
            const cagr = assetResult.cagr;

            return (
              <AbsoluteFill key={assetResult.asset.symbol} style={{ opacity, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{
                  transform: `translateY(${yPos}px)`,
                  background: isDark ? "linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(2,6,23,0.95) 100%)" : "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(241,245,249,0.95) 100%)",
                  border: isDark ? "2px solid rgba(255,255,255,0.1)" : "2px solid rgba(0,0,0,0.1)",
                  borderRadius: layout === 'horizontal' ? "60px" : "50px",
                  padding: layout === 'horizontal' ? "80px 100px" : "60px 50px",
                  width: layout === 'horizontal' ? "1400px" : "900px",
                  boxShadow: isDark ? "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 100px 20px rgba(59, 130, 246, 0.15)" : "0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 0 100px 20px rgba(59, 130, 246, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center"
                }}>
                  {/* Badge */}
                  <div style={{ 
                    border: isWinner ? (isDark ? "2px solid rgba(245, 158, 11, 0.3)" : "2px solid rgba(217, 119, 6, 0.4)") : (isDark ? "2px solid rgba(255,255,255,0.2)" : "2px solid rgba(0,0,0,0.2)"), 
                    color: isWinner ? (isDark ? "#F59E0B" : "#D97706") : (isDark ? "#fff" : "#0f172a"), 
                    padding: "12px 30px", 
                    borderRadius: "40px", 
                    fontWeight: 800, 
                    fontSize: "24px",
                    letterSpacing: "0.1em",
                    marginBottom: "30px",
                    background: isWinner ? (isDark ? "rgba(245, 158, 11, 0.05)" : "rgba(217, 119, 6, 0.05)") : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)")
                  }}>
                    {isWinner ? "🏆 TOP PERFORMER" : `🏁 #${results.length - i} PLACE`}
                  </div>

                  {/* Title */}
                  <h2 style={{ fontSize: layout === 'horizontal' ? "65px" : "50px", margin: "0 0 40px 0", lineHeight: 1.2 }}>
                    <span style={{ color: isDark ? "#34d399" : "#059669" }}>${initialAmount}</span> Invested in <br/>
                    <span style={{ fontWeight: 900, color: isDark ? "#fff" : "#0f172a" }}>{assetResult.asset.name}</span> in {startYear}
                  </h2>

                  <div style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: "24px", fontWeight: 800, letterSpacing: "0.15em", marginBottom: "10px" }}>
                    WOULD NOW BE WORTH
                  </div>

                  <div style={{ fontSize: layout === 'horizontal' ? "160px" : "130px", fontWeight: 900, color: isDark ? "#fff" : "#0f172a", lineHeight: 1, marginBottom: "50px", textShadow: isDark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 5px 20px rgba(0,0,0,0.1)" }}>
                    ${assetResult.finalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>

                  <div style={{ width: "100%", height: "2px", background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", marginBottom: "40px" }} />

                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 20px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ color: isPos ? (isDark ? "#34d399" : "#059669") : (isDark ? "#EF4444" : "#DC2626"), fontSize: "38px", fontWeight: 800, marginBottom: "10px" }}>
                        {isPos ? "+" : "-"}${Math.abs(assetResult.totalReturn).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      <span style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: "20px", fontWeight: 600 }}>Total Profit</span>
                    </div>
                    
                    <div style={{ width: "2px", height: "60px", background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }} />

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ color: isPos ? (isDark ? "#34d399" : "#059669") : (isDark ? "#EF4444" : "#DC2626"), fontSize: "38px", fontWeight: 800, marginBottom: "10px" }}>
                        {isPos ? "+" : "-"}{Math.abs(assetResult.percentageReturn).toFixed(2)}%
                      </span>
                      <span style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: "20px", fontWeight: 600 }}>ROI</span>
                    </div>

                    <div style={{ width: "2px", height: "60px", background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }} />

                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                      <span style={{ color: cagr >= 0 ? (isDark ? "#60a5fa" : "#2563eb") : (isDark ? "#EF4444" : "#DC2626"), fontSize: "38px", fontWeight: 800, marginBottom: "10px" }}>
                        {cagr >= 0 ? "+" : "-"}{Math.abs(cagr).toFixed(2)}%
                      </span>
                      <span style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: "20px", fontWeight: 600 }}>Annualized (CAGR)</span>
                    </div>
                  </div>
                </div>
              </AbsoluteFill>
            );
          });
        })()
      ) : (
        <AbsoluteFill style={{ opacity: summaryOpacity, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            transform: `translateY(${summaryY}px)`,
            background: isDark ? "linear-gradient(180deg, rgba(15,23,42,0.95) 0%, rgba(2,6,23,0.95) 100%)" : "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(241,245,249,0.95) 100%)",
            border: isDark ? "2px solid rgba(255,255,255,0.1)" : "2px solid rgba(0,0,0,0.1)",
            borderRadius: layout === 'horizontal' ? "60px" : "50px",
            padding: layout === 'horizontal' ? "80px 100px" : "60px 50px",
            width: layout === 'horizontal' ? "1400px" : "900px",
            boxShadow: isDark ? "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 100px 20px rgba(59, 130, 246, 0.15)" : "0 25px 50px -12px rgba(0, 0, 0, 0.2), 0 0 100px 20px rgba(59, 130, 246, 0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center"
          }}>
            {/* Badge */}
            <div style={{ 
              border: isDark ? "2px solid rgba(245, 158, 11, 0.3)" : "2px solid rgba(217, 119, 6, 0.4)", 
              color: isDark ? "#F59E0B" : "#D97706", 
              padding: "12px 30px", 
              borderRadius: "40px", 
              fontWeight: 800, 
              fontSize: "24px",
              letterSpacing: "0.1em",
              marginBottom: "30px",
              background: isDark ? "rgba(245, 158, 11, 0.05)" : "rgba(217, 119, 6, 0.05)"
            }}>
              🏆 TOP PERFORMER
            </div>

            {/* Title */}
            <h2 style={{ fontSize: layout === 'horizontal' ? "65px" : "50px", margin: "0 0 40px 0", lineHeight: 1.2 }}>
              <span style={{ color: isDark ? "#34d399" : "#059669" }}>${initialAmount}</span> Invested in <br/>
              <span style={{ fontWeight: 900, color: isDark ? "#fff" : "#0f172a" }}>{topPerformer.asset.name}</span> in {startYear}
            </h2>

            <div style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: "24px", fontWeight: 800, letterSpacing: "0.15em", marginBottom: "10px" }}>
              WOULD NOW BE WORTH
            </div>

            <div style={{ fontSize: layout === 'horizontal' ? "160px" : "130px", fontWeight: 900, color: isDark ? "#fff" : "#0f172a", lineHeight: 1, marginBottom: "50px", textShadow: isDark ? "0 10px 30px rgba(0,0,0,0.5)" : "0 5px 20px rgba(0,0,0,0.1)" }}>
              ${topPerformer.finalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            <div style={{ width: "100%", height: "2px", background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", marginBottom: "40px" }} />

            <div style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "0 20px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ color: topIsPositive ? (isDark ? "#34d399" : "#059669") : (isDark ? "#EF4444" : "#DC2626"), fontSize: "38px", fontWeight: 800, marginBottom: "10px" }}>
                  {topIsPositive ? "+" : "-"}${Math.abs(topPerformer.totalReturn).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: "20px", fontWeight: 600 }}>Total Profit</span>
              </div>
              
              <div style={{ width: "2px", height: "60px", background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }} />

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ color: topIsPositive ? (isDark ? "#34d399" : "#059669") : (isDark ? "#EF4444" : "#DC2626"), fontSize: "38px", fontWeight: 800, marginBottom: "10px" }}>
                  {topIsPositive ? "+" : "-"}{Math.abs(topPerformer.percentageReturn).toFixed(2)}%
                </span>
                <span style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: "20px", fontWeight: 600 }}>ROI</span>
              </div>

              <div style={{ width: "2px", height: "60px", background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }} />

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span style={{ color: topCagr >= 0 ? (isDark ? "#60a5fa" : "#2563eb") : (isDark ? "#EF4444" : "#DC2626"), fontSize: "38px", fontWeight: 800, marginBottom: "10px" }}>
                  {topCagr >= 0 ? "+" : "-"}{Math.abs(topCagr).toFixed(2)}%
                </span>
                <span style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", fontSize: "20px", fontWeight: 600 }}>Annualized (CAGR)</span>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Intro Overlay */}
      {introOpacity > 0 && (
        <AbsoluteFill style={{ 
          opacity: introOpacity, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          backgroundColor: isDark ? "#020617" : "#f8fafc",
          zIndex: 100 
        }}>
          <h1 style={{ 
            fontSize: layout === 'horizontal' ? "100px" : "70px", 
            fontWeight: 900, 
            textAlign: "center", 
            padding: layout === 'horizontal' ? "0 100px" : "0 60px", 
            lineHeight: 1.2,
            color: isDark ? "white" : "#0f172a" 
          }}>
            What if you invested <span style={{ color: isDark ? "#34d399" : "#059669" }}>${initialAmount}</span> in <br/>
            <span style={{ color: isDark ? "#60a5fa" : "#2563eb" }}>{results.length > 1 ? (results.length > 3 ? `${results.length} assets` : results.map(r => r.asset.symbol).join(" vs ")) : topPerformer.asset.name}</span> in {startYear}?
          </h1>
        </AbsoluteFill>
      )}

      {/* Outro Overlay */}
      {outroOpacity > 0 && (
        <AbsoluteFill style={{ 
          opacity: outroOpacity, 
          display: "flex", 
          flexDirection: "column",
          alignItems: "center", 
          justifyContent: "center", 
          backgroundColor: isDark ? "rgba(2, 6, 23, 0.95)" : "rgba(248, 250, 252, 0.95)",
          zIndex: 100 
        }}>
          {results.length > 1 ? (
            <h1 style={{ 
              fontSize: layout === 'horizontal' ? "120px" : "85px", 
              fontWeight: 900, 
              textAlign: "center", 
              padding: layout === 'horizontal' ? "0 100px" : "0 60px", 
              lineHeight: 1.1,
              color: isDark ? "white" : "#0f172a",
              marginBottom: "40px"
            }}>
              <span style={{ color: isDark ? "#34d399" : "#059669" }}>{topPerformer.asset.symbol}</span> won the race!
            </h1>
          ) : (
            <h1 style={{ 
              fontSize: layout === 'horizontal' ? "120px" : "85px", 
              fontWeight: 900, 
              textAlign: "center", 
              padding: layout === 'horizontal' ? "0 100px" : "0 60px", 
              lineHeight: 1.1,
              color: isDark ? "white" : "#0f172a",
              marginBottom: "40px"
            }}>
              You missed out on <span style={{ color: isDark ? "#34d399" : "#059669" }}>${Math.abs(topPerformer.totalReturn).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>.
            </h1>
          )}
          <h2 style={{
            fontSize: layout === 'horizontal' ? "60px" : "50px", 
            fontWeight: 700, 
            textAlign: "center", 
            color: isDark ? "#ef4444" : "#dc2626"
          }}>
            Don't miss out again.
          </h2>
          <div style={{
            marginTop: "60px",
            fontSize: layout === 'horizontal' ? "40px" : "35px",
            fontWeight: 600,
            color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)",
            border: `2px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)"}`,
            padding: "20px 40px",
            borderRadius: "100px"
          }}>
            ifyouinvested.online
          </div>
        </AbsoluteFill>
      )}

    </AbsoluteFill>
  );
};
