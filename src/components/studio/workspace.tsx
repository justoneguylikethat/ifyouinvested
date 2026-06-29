"use client";

import { useStudioStore, VideoLayout } from "@/lib/use-studio-store";
import { Player, PlayerRef } from "@remotion/player";
import { StudioVideoComposition } from "@/remotion/StudioComposition";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, RefreshCw, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Workspace() {
  const state = useStudioStore();
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(50); // Default 50% scale preview

  // Calculate resolution
  const getResolution = (layout: VideoLayout) => {
    switch (layout) {
      case 'horizontal':
        return { w: 1920, h: 1080 };
      case 'square':
        return { w: 1080, h: 1080 };
      case 'vertical':
      default:
        return { w: 1080, h: 1920 };
    }
  };

  const res = getResolution(state.layout);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    player.addEventListener("play", onPlay);
    player.addEventListener("pause", onPause);

    return () => {
      player.removeEventListener("play", onPlay);
      player.removeEventListener("pause", onPause);
    };
  }, [state.templateId, state.layout]);

  const handleTogglePlay = () => {
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleRestart = () => {
    const player = playerRef.current;
    if (!player) return;
    player.seekTo(0);
    player.play();
  };

  return (
    <div className="flex-1 bg-slate-900 flex flex-col h-full relative overflow-hidden">
      {/* Top Workspace Bar */}
      <div className="h-14 border-b border-white/5 bg-slate-950/60 backdrop-blur flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-1 bg-white/5 border border-white/10 text-slate-400 rounded-md">
            Preview
          </span>
          <h2 className="text-sm font-bold text-white tracking-tight truncate max-w-xs md:max-w-md">
            {state.title || "Untitled Video"}
          </h2>
        </div>

        {/* Zoom & Helpers */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-white/5 p-1 rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 text-slate-400 hover:text-white"
              onClick={() => setZoom(Math.max(25, zoom - 10))}
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
            <span className="text-[10px] font-bold text-slate-400 w-9 text-center">
              {zoom}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 text-slate-400 hover:text-white"
              onClick={() => setZoom(Math.min(100, zoom + 10))}
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Video Canvas Area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <div 
          className="relative transition-all duration-300 rounded-2xl border-4 border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] bg-slate-950 overflow-hidden"
          style={{
            width: (res.w * zoom) / 100,
            height: (res.h * zoom) / 100,
            aspectRatio: `${res.w}/${res.h}`
          }}
        >
          <Player
            ref={playerRef}
            component={StudioVideoComposition}
            inputProps={{
              templateId: state.templateId,
              dataset: state.dataset,
              layout: state.layout,
              theme: state.theme,
              branding: state.branding,
              music: state.music,
              voiceover: state.voiceover,
              animationStyle: state.animationStyle,
              title: state.title,
              durationInFrames: state.durationInFrames
            }}
            durationInFrames={state.durationInFrames}
            compositionWidth={res.w}
            compositionHeight={res.h}
            fps={state.fps}
            controls={false}
            loop
            acknowledgeRemotionLicense
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>

      {/* Floating Preview Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-slate-950/80 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-full shadow-2xl z-10">
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-300 hover:text-white w-9 h-9 rounded-full"
          onClick={handleRestart}
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={handleTogglePlay}
          className="bg-indigo-500 hover:bg-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg border border-indigo-400/30"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-white text-white" />
          ) : (
            <Play className="w-5 h-5 fill-white text-white translate-x-0.5" />
          )}
        </Button>

        <span className="w-9"></span> {/* Spacer to keep play centered */}
      </div>
    </div>
  );
}
