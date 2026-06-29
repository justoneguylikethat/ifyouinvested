"use client";

import { useStudioStore, VideoLayout, VideoTheme, AnimationStyle } from "@/lib/use-studio-store";
import { useState } from "react";
import { Monitor, Smartphone, Square, Moon, Sun, Music, Mic, Zap, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Slider } from "@/components/ui/slider";

export function SettingsPanel() {
  const state = useStudioStore();
  const [isRendering, setIsRendering] = useState(false);

  const handleRender = async () => {
    const toastId = toast.loading("Synthesizing data & compiling video frames...");
    try {
      setIsRendering(true);
      const res = await fetch('/api/render-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        }),
      });

      if (!res.ok) throw new Error('Studio render failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${state.templateId}-render-${state.layout}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Studio render complete! Downloaded.", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Video rendering failed. Ensure local CLI is running.", { id: toastId });
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="w-80 border-l border-white/10 bg-slate-950 flex flex-col h-full shrink-0 select-none">
      {/* Panel Title */}
      <div className="h-14 border-b border-white/10 px-6 flex items-center bg-slate-900/30">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Video Options</h3>
      </div>

      {/* Settings Options */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Layout Format */}
        <div className="space-y-3">
          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Video Format</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'vertical', label: '9:16', icon: Smartphone, desc: 'TikTok' },
              { id: 'horizontal', label: '16:9', icon: Monitor, desc: 'YouTube' },
              { id: 'square', label: '1:1', icon: Square, desc: 'Social' }
            ].map((layoutItem) => {
              const Icon = layoutItem.icon;
              const isSel = state.layout === layoutItem.id;
              return (
                <button
                  key={layoutItem.id}
                  onClick={() => state.setLayout(layoutItem.id as VideoLayout)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    isSel 
                      ? 'bg-indigo-500/10 border-indigo-500 text-white' 
                      : 'border-white/5 bg-slate-900/30 text-slate-500 hover:border-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{layoutItem.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Video Duration */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Video Duration</span>
            <span className="text-indigo-400">{(state.durationInFrames / state.fps).toFixed(0)}s</span>
          </div>
          <Slider
            min={150}
            max={900}
            step={30}
            value={[state.durationInFrames]}
            onValueChange={(val) => state.setDuration(Array.isArray(val) ? val[0] : val)}
            className="w-full"
          />
        </div>

        {/* Color Palette */}
        <div className="space-y-3">
          <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Color Theme</label>
          <div className="flex items-center gap-2 bg-slate-900 border border-white/5 p-1 rounded-xl">
            <button
              onClick={() => state.setTheme('dark')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                state.theme === 'dark' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" /> Dark Mode
            </button>
            <button
              onClick={() => state.setTheme('light')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                state.theme === 'light' ? 'bg-indigo-500 text-white shadow-lg' : 'text-slate-500 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" /> Light Mode
            </button>
          </div>
        </div>

        {/* Audio Track Selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-xs">
            <Music className="w-3.5 h-3.5 text-indigo-400" />
            <span>Background Music</span>
          </div>
          <Select value={state.music} onValueChange={(val) => state.setMusic(val || "modern")}>
            <SelectTrigger className="bg-slate-900 border-white/10 text-white text-xs font-semibold rounded-xl">
              <SelectValue placeholder="Select music track" />
            </SelectTrigger>
            <SelectContent className="bg-slate-950 border-white/10 text-white">
              <SelectItem value="modern" className="hover:bg-white/5">Modern Beats (Lofi)</SelectItem>
              <SelectItem value="cinematic" className="hover:bg-white/5">Cinematic Strings</SelectItem>
              <SelectItem value="corporate" className="hover:bg-white/5">Corporate Upbeat</SelectItem>
              <SelectItem value="epic" className="hover:bg-white/5">Epic Orchestral</SelectItem>
              <SelectItem value="motivational" className="hover:bg-white/5">Motivational Pop</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Voiceover Synthesizer */}
        <div className="space-y-4 border-t border-white/10 pt-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-xs">
              <Mic className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI Voice Narration</span>
            </div>
            <Switch
              checked={state.voiceover.enabled}
              onCheckedChange={(checked) => state.updateVoiceover({ enabled: checked })}
            />
          </div>

          {state.voiceover.enabled && (
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 block">Voice Accent</label>
                <Select
                  value={state.voiceover.accent}
                  onValueChange={(val) => state.updateVoiceover({ accent: val || "US" })}
                >
                  <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-950 border-white/10 text-white">
                    <SelectItem value="US">American Accent</SelectItem>
                    <SelectItem value="UK">British Accent</SelectItem>
                    <SelectItem value="AU">Australian Accent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => state.updateVoiceover({ gender: 'male' })}
                  className={`flex-1 py-1.5 border text-xs font-semibold rounded-lg transition-all ${
                    state.voiceover.gender === 'male' ? 'bg-indigo-500/10 border-indigo-500 text-white' : 'border-white/5 text-slate-500'
                  }`}
                >
                  Male
                </button>
                <button
                  onClick={() => state.updateVoiceover({ gender: 'female' })}
                  className={`flex-1 py-1.5 border text-xs font-semibold rounded-lg transition-all ${
                    state.voiceover.gender === 'female' ? 'bg-indigo-500/10 border-indigo-500 text-white' : 'border-white/5 text-slate-500'
                  }`}
                >
                  Female
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Animation Engine */}
        <div className="space-y-3 border-t border-white/10 pt-5">
          <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider text-xs">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Animation Physics</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'standard', label: 'Standard Easing' },
              { id: 'physics', label: '2D Rigid Body' },
              { id: 'kinetic', label: 'Kinetic Motion' }
            ].map((style) => {
              const isSel = state.animationStyle === style.id;
              return (
                <button
                  key={style.id}
                  onClick={() => state.setAnimationStyle(style.id as AnimationStyle)}
                  className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                    isSel 
                      ? 'bg-indigo-500/10 border-indigo-500 text-white shadow' 
                      : 'border-white/5 bg-slate-900/30 text-slate-500 hover:border-white/10 hover:text-white'
                  }`}
                >
                  {style.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Export Action Bar */}
      <div className="p-5 border-t border-white/10 bg-slate-950">
        <Button
          onClick={handleRender}
          disabled={isRendering}
          className="w-full bg-white text-black hover:bg-slate-200 font-bold py-6 rounded-xl flex items-center justify-center gap-2 text-sm shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all"
        >
          {isRendering ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Compiling Video...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Render & Export MP4
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
