"use client";

import { useState } from "react";
import { Player } from "@remotion/player";
import { VideoComposition, VideoLayout, VideoTheme } from "../remotion/Composition";
import { StudioVideoComposition } from "../remotion/StudioComposition";
import { InvestmentResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Download, Monitor, Smartphone, Square, Loader2, Moon, Sun, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

function convertResultsToRaceDataset(results: InvestmentResult[]) {
  if (!results || results.length === 0) return null;
  
  const timeline = results[0].history.map(pt => pt.date.split("-")[0]);
  const startYear = results[0].startDate.split("-")[0];
  const initialAmount = results[0].initialInvestment;
  
  const series = results.map(res => {
    let color = '#3b82f6';
    const symbol = res.asset.symbol.toUpperCase();
    if (symbol.includes('BTC') || symbol.includes('BITCOIN')) color = '#F7931A';
    else if (symbol.includes('TSLA') || symbol.includes('TESLA')) color = '#E82127';
    else if (symbol.includes('NVDA') || symbol.includes('NVIDIA')) color = '#76B900';
    else if (symbol.includes('AAPL') || symbol.includes('APPLE')) color = '#A2AAAD';
    else if (symbol.includes('AMZN') || symbol.includes('AMAZON')) color = '#FF9900';
    else if (symbol.includes('GLD') || symbol.includes('GOLD')) color = '#D4AF37';
    else if (symbol.includes('SPY') || symbol.includes('S&P') || symbol.includes('VOO')) color = '#0056b3';
    
    const values = res.history.map(pt => res.sharesPurchased * pt.price);
    
    return {
      name: res.asset.name,
      color,
      values
    };
  });

  return {
    title: 'WHICH INVESTMENT MADE YOU RICHER?',
    subtitle: `$${initialAmount.toLocaleString()} invested in ${startYear}`,
    series,
    timeline,
    unit: ''
  };
}

function convertResultsToLifestyleDataset(results: InvestmentResult[]) {
  if (!results || results.length === 0) return null;
  const res = results[0];
  
  const timeline = res.history.map(pt => pt.date.split("-")[0]);
  const uniqueYears = Array.from(new Set(timeline));
  
  const spentValues = uniqueYears.map((_, idx) => {
    return (res.initialInvestment / Math.max(1, uniqueYears.length - 1)) * idx;
  });
  
  const investedValues = uniqueYears.map(year => {
    const ptsInYear = res.history.filter(pt => pt.date.startsWith(year));
    if (ptsInYear.length > 0) {
      return ptsInYear[ptsInYear.length - 1].price;
    }
    return res.finalValue;
  });

  return {
    title: 'Daily Habits vs Investing',
    subtitle: res.asset.name,
    series: [
      {
        name: 'Total Spent on Habit',
        color: '#ef4444',
        values: spentValues
      },
      {
        name: 'Portfolio Value (Invested)',
        color: '#10b981',
        values: investedValues
      }
    ],
    timeline: uniqueYears,
    unit: ''
  };
}


export function VideoExportView({ results, mode = 'investment' }: { results: InvestmentResult[]; mode?: 'investment' | 'lifestyle' }) {
  const [layout, setLayout] = useState<VideoLayout>('vertical');
  const [theme, setTheme] = useState<VideoTheme>('dark');
  const [videoStyle, setVideoStyle] = useState<'chart' | 'race' | 'lifestyle'>(mode === 'lifestyle' ? 'lifestyle' : 'chart');
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState<number | null>(null);

  if (!results || results.length === 0) return null;

  // Determine duration based on style
  const durationInFrames = videoStyle === 'race' 
    ? 900 // 30s default for leaderboard race
    : videoStyle === 'lifestyle'
    ? 300 // 10s default for lifestyle compare
    : (results.length > 1 ? 600 + (results.length * 90) : 600); // legacy formula for line chart
  const fps = 30;

  // Determine Player dimensions based on layout
  const getPlayerProps = () => {
    switch (layout) {
      case 'horizontal':
        return { compWidth: 1920, compHeight: 1080, styleWidth: 640, styleHeight: 360 };
      case 'square':
        return { compWidth: 1080, compHeight: 1080, styleWidth: 400, styleHeight: 400 };
      case 'vertical':
      default:
        return { compWidth: 1080, compHeight: 1920, styleWidth: 300, styleHeight: 533 };
    }
  };

  const pProps = getPlayerProps();

  const handleRender = async () => {
    const toastId = toast.loading("Initiating render on AWS Lambda...");
    try {
      setIsRendering(true);
      setRenderProgress(0);

      let payload;
      if (videoStyle === 'race') {
        payload = {
          templateId: 'leaderboard-race',
          dataset: convertResultsToRaceDataset(results),
          layout,
          theme,
          branding: {
            logoUrl: '',
            watermark: 'ifyouinvested.online',
            outroText: 'Subscribe for daily content!',
            socialHandle: '@investednow',
            websiteUrl: 'ifyouinvested.online'
          },
          music: 'modern',
          voiceover: {
            enabled: false,
            gender: 'male',
            accent: 'US',
            autoScript: true,
            scriptText: ''
          },
          animationStyle: 'standard',
          title: 'WHICH INVESTMENT MADE YOU RICHER?',
          durationInFrames
        };
      } else if (videoStyle === 'lifestyle') {
        payload = {
          templateId: 'lifestyle-spending',
          dataset: convertResultsToLifestyleDataset(results),
          layout,
          theme,
          branding: {
            logoUrl: '',
            watermark: 'ifyouinvested.online',
            outroText: 'Subscribe for daily content!',
            socialHandle: '@investednow',
            websiteUrl: 'ifyouinvested.online'
          },
          music: 'modern',
          voiceover: {
            enabled: false,
            gender: 'male',
            accent: 'US',
            autoScript: true,
            scriptText: ''
          },
          animationStyle: 'standard',
          title: 'DAILY HABITS VS INVESTING',
          durationInFrames
        };
      } else {
        payload = { results, layout, theme };
      }

      const res = await fetch('/api/render-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errorMessage = 'Render failed. Please try again.';
        try {
          const errData = await res.json();
          if (errData?.error) errorMessage = errData.error;
        } catch {}
        if (res.status === 429) {
          toast.error(`⏳ ${errorMessage}`, { id: toastId });
        } else if (res.status === 503) {
          toast.error(`🔄 Server is busy rendering. Please wait a moment and try again.`, { id: toastId });
        } else {
          throw new Error(errorMessage);
        }
        return;
      }

      const contentType = res.headers.get('content-type');
      let downloadUrl = '';

      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.mode === 'aws') {
          const { renderId, bucketName } = data;
          let done = false;

          while (!done) {
            await new Promise(r => setTimeout(r, 2000));
            const statusRes = await fetch(`/api/render-video?renderId=${renderId}&bucketName=${bucketName}`);
            if (!statusRes.ok) {
              throw new Error('Failed to check render status.');
            }
            const statusData = await statusRes.json();
            if (statusData.fatal) {
              throw new Error(statusData.error || 'AWS Lambda render failed.');
            }

            const pct = Math.round((statusData.progress || 0) * 100);
            setRenderProgress(pct);
            toast.loading(`Rendering video: ${pct}% complete...`, { id: toastId });

            if (statusData.done) {
              done = true;
              downloadUrl = statusData.outputUrl;
            }
          }
        }
      }

      if (!downloadUrl) {
        // Fallback for local synchronous rendering
        const blob = await res.blob();
        downloadUrl = window.URL.createObjectURL(blob);
      }

      // Open the video directly in a new tab (bypasses S3 CORS and allows instant playback)
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.target = "_blank";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success("Your video is ready and has opened in a new tab!", { id: toastId });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to render video. Please try again.", { id: toastId });
    } finally {
      setIsRendering(false);
      setRenderProgress(null);
    }
  };

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-4 md:p-8 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row flex-wrap justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Export Animation</h3>
          <p className="text-slate-400 font-medium text-sm">Download a video to share on social media.</p>
        </div>
        
        {/* Style Selection */}
        <div className="flex items-center gap-2 bg-black/40 p-1.5 border border-white/10 rounded-xl">
          {mode === 'lifestyle' && (
            <button
              onClick={() => setVideoStyle('lifestyle')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                videoStyle === 'lifestyle' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Lifestyle Compare
            </button>
          )}
          <button
            onClick={() => setVideoStyle('chart')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              videoStyle === 'chart' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Line Chart
          </button>
          <button
            onClick={() => setVideoStyle('race')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              videoStyle === 'race' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Leaderboard Race
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1 md:justify-end">
          <div className="flex items-center gap-2 bg-black/40 p-1.5 border border-white/10 rounded-xl overflow-x-auto w-full md:w-auto shrink-0">
            <button
              onClick={() => setLayout('vertical')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                layout === 'vertical' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-4 h-4" /> TikTok / Reels
            </button>
            <button
              onClick={() => setLayout('horizontal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                layout === 'horizontal' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Monitor className="w-4 h-4" /> YouTube
            </button>
            <button
              onClick={() => setLayout('square')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                layout === 'square' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Square className="w-4 h-4" /> Instagram Post
            </button>
          </div>
          
          <div className="flex items-center gap-2 bg-black/40 p-1.5 border border-white/10 rounded-xl w-full md:w-auto shrink-0 justify-center">
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                theme === 'dark' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Dark Mode"
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                theme === 'light' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
              title="Light Mode"
            >
              <Sun className="w-4 h-4" />
            </button>
          </div>
        </div>

        <Button 
          variant="default"
          onClick={handleRender}
          disabled={isRendering}
          className="bg-white text-black hover:bg-slate-200 font-bold shrink-0 w-full md:w-auto shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          {isRendering ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {renderProgress !== null ? `Rendering ${renderProgress}%` : "Rendering..."}
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Render & Download MP4
            </>
          )}
        </Button>
      </div>
      
      <div className="flex justify-center items-center bg-black/50 border border-white/5 rounded-2xl p-2 md:p-8 min-h-[300px] md:min-h-[600px] relative">
        <motion.div 
          key={`${videoStyle}-${layout}-${theme}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-white/10 bg-[#020617] w-full mx-auto relative"
          style={{ maxWidth: pProps.styleWidth }}
        >
          {isRendering && (
            <div className="absolute inset-0 z-50 bg-[#0B1220]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-indigo-400" />
                </div>
              </div>
              <h4 className="text-white font-bold text-lg mb-2">Generating MP4 Video</h4>
              <p className="text-slate-400 text-xs mb-6 max-w-xs leading-normal">
                Synthesizing timeline points and compiling frames on AWS Lambda...
              </p>
              
              {/* Progress Bar (Loading Filler) */}
              <div className="w-full max-w-[220px] h-3 bg-white/5 border border-white/10 rounded-full overflow-hidden relative shadow-inner">
                <motion.div 
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_12px_rgba(99,102,241,0.6)] animate-pulse"
                  initial={{ width: 0 }}
                  animate={{ width: `${renderProgress || 0}%` }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </div>
              <span className="text-base font-black text-indigo-400 mt-3 font-mono leading-none tracking-wider">
                {renderProgress !== null ? `${renderProgress}%` : "0%"}
              </span>
            </div>
          )}
          {videoStyle === 'race' ? (
            <Player
              component={StudioVideoComposition}
              inputProps={{
                templateId: 'leaderboard-race',
                dataset: convertResultsToRaceDataset(results),
                layout,
                theme,
                branding: {
                  logoUrl: '',
                  watermark: 'ifyouinvested.online',
                  outroText: 'Subscribe for daily content!',
                  socialHandle: '@investednow',
                  websiteUrl: 'ifyouinvested.online'
                },
                music: 'modern',
                voiceover: {
                  enabled: false,
                  gender: 'male',
                  accent: 'US',
                  autoScript: true,
                  scriptText: ''
                },
                animationStyle: 'standard',
                title: 'WHICH INVESTMENT MADE YOU RICHER?',
                durationInFrames
              }}
              durationInFrames={durationInFrames}
              compositionWidth={pProps.compWidth}
              compositionHeight={pProps.compHeight}
              fps={fps}
              controls
              acknowledgeRemotionLicense
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: `${pProps.compWidth} / ${pProps.compHeight}`,
              }}
            />
          ) : videoStyle === 'lifestyle' ? (
            <Player
              component={StudioVideoComposition}
              inputProps={{
                templateId: 'lifestyle-spending',
                dataset: convertResultsToLifestyleDataset(results),
                layout,
                theme,
                branding: {
                  logoUrl: '',
                  watermark: 'ifyouinvested.online',
                  outroText: 'Subscribe for daily content!',
                  socialHandle: '@investednow',
                  websiteUrl: 'ifyouinvested.online'
                },
                music: 'modern',
                voiceover: {
                  enabled: false,
                  gender: 'male',
                  accent: 'US',
                  autoScript: true,
                  scriptText: ''
                },
                animationStyle: 'standard',
                title: 'DAILY HABITS VS INVESTING',
                durationInFrames
              }}
              durationInFrames={durationInFrames}
              compositionWidth={pProps.compWidth}
              compositionHeight={pProps.compHeight}
              fps={fps}
              controls
              acknowledgeRemotionLicense
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: `${pProps.compWidth} / ${pProps.compHeight}`,
              }}
            />
          ) : (
            <Player
              component={VideoComposition}
              inputProps={{ results, layout, theme }}
              durationInFrames={durationInFrames}
              compositionWidth={pProps.compWidth}
              compositionHeight={pProps.compHeight}
              fps={fps}
              controls
              acknowledgeRemotionLicense
              style={{
                width: '100%',
                height: 'auto',
                aspectRatio: `${pProps.compWidth} / ${pProps.compHeight}`,
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
