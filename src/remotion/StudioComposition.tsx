import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import React from "react";
import { RichestPersonTemplate } from "./templates/RichestPerson";
import { CountryWealthTemplate } from "./templates/CountryWealth";
import { LifestyleSpendingTemplate } from "./templates/LifestyleSpending";
import { KineticTypographyTemplate } from "./templates/KineticTypography";
import { LeaderboardRaceTemplate } from "./templates/LeaderboardRace";

export interface BrandingConfig {
  logoUrl: string;
  watermark: string;
  outroText: string;
  socialHandle: string;
  websiteUrl: string;
}

export interface VoiceoverConfig {
  enabled: boolean;
  gender: 'male' | 'female';
  accent: string;
  autoScript: boolean;
  scriptText: string;
}

export interface StudioCompositionProps extends Record<string, any> {
  templateId: 'richest-person' | 'country-wealth' | 'lifestyle-spending' | 'kinetic-typography' | 'leaderboard-race';
  dataset: any;
  layout: 'vertical' | 'horizontal' | 'square';
  theme: 'light' | 'dark';
  branding: BrandingConfig;
  music: string;
  voiceover: VoiceoverConfig;
  animationStyle: 'standard' | 'physics' | 'kinetic';
  title: string;
  durationInFrames?: number;
}

export const StudioVideoComposition: React.FC<StudioCompositionProps> = (props) => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();
  const { templateId, dataset, theme, branding } = props;

  const isDark = theme === 'dark';

  // Timings
  const introFrames = 45; // 1.5s
  const outroFrames = 90; // 3s

  // Opacity interpolations for transitions
  const introOpacity = interpolate(frame, [introFrames - 15, introFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  const outroOpacity = interpolate(frame, [durationInFrames - outroFrames, durationInFrames - outroFrames + 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp"
  });

  // Render correct sub-template
  const renderTemplate = () => {
    switch (templateId) {
      case 'country-wealth':
        return <CountryWealthTemplate dataset={dataset} isDark={isDark} />;
      case 'lifestyle-spending':
        return <LifestyleSpendingTemplate dataset={dataset} isDark={isDark} />;
      case 'kinetic-typography':
        return <KineticTypographyTemplate dataset={dataset} isDark={isDark} />;
      case 'leaderboard-race':
        return <LeaderboardRaceTemplate dataset={dataset} isDark={isDark} />;
      case 'richest-person':
      default:
        return <RichestPersonTemplate dataset={dataset} isDark={isDark} />;
    }
  };

  return (
    <AbsoluteFill style={{ backgroundColor: isDark ? "#090d16" : "#f8fafc", color: isDark ? "white" : "#0f172a", fontFamily: "sans-serif" }}>
      {/* Background Ambience */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: isDark 
            ? "radial-gradient(circle at center, rgba(99,102,241,0.2) 0%, transparent 80%)"
            : "radial-gradient(circle at center, rgba(99,102,241,0.05) 0%, transparent 80%)"
        }}
      />

      {/* Persistent Watermark */}
      {branding.watermark && (
        <div 
          className="absolute top-8 left-8 text-xs font-black uppercase tracking-widest z-30 select-none opacity-40"
          style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(15,23,42,0.4)" }}
        >
          {branding.watermark}
        </div>
      )}

      {/* Main Template Content */}
      <AbsoluteFill className="z-10">
        {renderTemplate()}
      </AbsoluteFill>

      {/* Intro Overlay Card */}
      {frame < introFrames && (
        <AbsoluteFill 
          style={{ opacity: introOpacity }}
          className="flex flex-col items-center justify-center z-40 bg-slate-950 p-12 text-center"
        >
          <div className="absolute w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl" />
          <h1 className="text-7xl font-black tracking-tight leading-tight max-w-4xl text-white drop-shadow-xl z-10 uppercase">
            {props.title}
          </h1>
          <p className="text-2xl text-slate-400 font-extrabold mt-6 z-10 tracking-wide">
            {dataset?.subtitle || "Wait for the results!"}
          </p>
        </AbsoluteFill>
      )}

      {/* Outro Overlay Card */}
      {frame >= durationInFrames - outroFrames && (
        <AbsoluteFill 
          style={{ opacity: outroOpacity }}
          className="flex flex-col items-center justify-center z-40 bg-slate-950 p-12 text-center text-white"
        >
          <div className="absolute w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl" />
          
          <h1 className="text-7xl font-black tracking-tight leading-tight max-w-4xl drop-shadow-xl z-10 uppercase mb-8">
            {branding.outroText || "Thanks for Watching!"}
          </h1>

          <div className="z-10 border-4 border-indigo-500 px-8 py-4 rounded-3xl bg-slate-900/50 shadow-2xl mb-6">
            <span className="text-3xl font-black text-indigo-400">{branding.socialHandle}</span>
          </div>

          <span className="text-xl text-slate-500 font-extrabold tracking-widest z-10 uppercase">
            {branding.websiteUrl}
          </span>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
