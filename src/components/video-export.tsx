"use client";

import { useState } from "react";
import { Player } from "@remotion/player";
import { VideoComposition, VideoLayout, VideoTheme } from "../remotion/Composition";
import { InvestmentResult } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Download, Monitor, Smartphone, Square, Loader2, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export function VideoExportView({ results }: { results: InvestmentResult[] }) {
  const [layout, setLayout] = useState<VideoLayout>('vertical');
  const [theme, setTheme] = useState<VideoTheme>('dark');
  const [isRendering, setIsRendering] = useState(false);

  if (!results || results.length === 0) return null;

  const durationInFrames = results.length > 1 ? 600 + (results.length * 90) : 600; // 20s base + 3s per asset if multiple
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
    const toastId = toast.loading("Rendering your video... This might take a minute.");
    try {
      setIsRendering(true);
      const res = await fetch('/api/render-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ results, layout, theme }),
      });

      if (!res.ok) throw new Error('Render failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `investment-simulation-${layout}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Your video is ready and has been downloaded!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to render video. Please try again.", { id: toastId });
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight mb-2">Export Animation</h3>
          <p className="text-slate-400 font-medium text-sm">Download a video to share on social media.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
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
              Rendering...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Render & Download MP4
            </>
          )}
        </Button>
      </div>
      
      <div className="flex justify-center items-center bg-black/50 border border-white/5 rounded-2xl p-4 md:p-8 min-h-[400px] md:min-h-[600px] relative">
        <motion.div 
          key={`${layout}-${theme}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-4 border-white/10 bg-[#020617] w-full mx-auto relative"
          style={{ maxWidth: pProps.styleWidth }}
        >
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
        </motion.div>
      </div>
    </div>
  );
}
