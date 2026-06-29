"use client";

import { useStudioStore, BUILTIN_DATASETS, TemplateId } from "@/lib/use-studio-store";
import { useState } from "react";
import { LayoutTemplate, Database, Tag, Settings, Sparkles, Upload, Music, BarChart, Flag, Coffee, Type } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function Sidebar() {
  const { 
    templateId, setTemplateId, 
    datasetId, setDatasetId,
    branding, updateBranding 
  } = useStudioStore();

  const [activeTab, setActiveTab] = useState<'templates' | 'datasets' | 'branding' | 'settings'>('templates');

  const templatesList: Array<{ id: TemplateId; label: string; desc: string; icon: any }> = [
    { id: 'leaderboard-race', label: 'Investment Race', desc: 'Mockup-style multi-asset race', icon: BarChart },
    { id: 'richest-person', label: 'Billionaire Race', desc: 'Watch net worths grow over time', icon: LayoutTemplate },
    { id: 'country-wealth', label: 'GDP Duel', desc: 'Compare country GDP trends', icon: Flag },
    { id: 'lifestyle-spending', label: 'Coffee vs Bitcoin', desc: 'Lifestyle cost vs investing', icon: Coffee },
    { id: 'kinetic-typography', label: 'Kinetic Neon', desc: 'Fast fast-paced number growth', icon: Type }
  ];

  const handleCustomDataUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (!json.title || !json.series || !json.timeline) {
          throw new Error("Invalid structure. Must contain title, series array, and timeline array.");
        }
        setDatasetId("custom-upload", json);
        toast.success("Successfully imported custom dataset!");
      } catch (err: any) {
        toast.error(`Import failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-80 border-r border-white/10 bg-slate-950 flex flex-col h-full shrink-0">
      {/* Tab Navigation */}
      <div className="flex border-b border-white/10 p-2 bg-slate-900/50">
        <button
          onClick={() => setActiveTab('templates')}
          className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'templates' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutTemplate className="w-4 h-4" />
          Templates
        </button>
        <button
          onClick={() => setActiveTab('datasets')}
          className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'datasets' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          Data
        </button>
        <button
          onClick={() => setActiveTab('branding')}
          className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'branding' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" />
          Branding
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTab === 'settings' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Choose a Template</h3>
            <div className="grid gap-3">
              {templatesList.map((t) => {
                const Icon = t.icon;
                const isSelected = templateId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTemplateId(t.id)}
                    className={`flex items-start gap-4 p-3.5 rounded-xl border text-left transition-all ${
                      isSelected 
                        ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                        : 'border-white/5 bg-slate-900/40 text-slate-400 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    <div className={`p-2.5 rounded-lg ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-800'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white mb-0.5">{t.label}</h4>
                      <p className="text-xs text-slate-500 leading-normal">{t.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'datasets' && (
          <div className="space-y-5">
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Select Dataset</h3>
              <div className="space-y-2">
                {BUILTIN_DATASETS[templateId]?.map((d) => {
                  const isSelected = datasetId === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => setDatasetId(d.id, d.data)}
                      className={`w-full p-3 rounded-lg border text-left text-xs font-semibold transition-all ${
                        isSelected 
                          ? 'bg-indigo-500/15 border-indigo-500 text-white' 
                          : 'border-white/5 bg-slate-900/40 text-slate-400 hover:border-white/10 hover:text-white'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-white/10 pt-4 space-y-3">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Custom Dataset</h3>
              <div className="border-2 border-dashed border-white/10 rounded-xl p-4 text-center hover:border-indigo-500/50 transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleCustomDataUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <span className="text-xs font-semibold text-slate-400 block mb-1">Upload JSON Dataset</span>
                <span className="text-[10px] text-slate-600 block">Must match structural series/timeline format.</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'branding' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Branding & Watermark</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Watermark Text</label>
                <Input
                  value={branding.watermark}
                  onChange={(e) => updateBranding({ watermark: e.target.value })}
                  placeholder="e.g. ifyouinvested.online"
                  className="bg-slate-900 border-white/10 text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Social Handle</label>
                <Input
                  value={branding.socialHandle}
                  onChange={(e) => updateBranding({ socialHandle: e.target.value })}
                  placeholder="e.g. @investednow"
                  className="bg-slate-900 border-white/10 text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Website Link (Outro)</label>
                <Input
                  value={branding.websiteUrl}
                  onChange={(e) => updateBranding({ websiteUrl: e.target.value })}
                  placeholder="e.g. ifyouinvested.online"
                  className="bg-slate-900 border-white/10 text-white"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 font-semibold mb-1 block">Outro CTA Text</label>
                <Input
                  value={branding.outroText}
                  onChange={(e) => updateBranding({ outroText: e.target.value })}
                  placeholder="e.g. Subscribe for daily content!"
                  className="bg-slate-900 border-white/10 text-white"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Global Settings</h3>
            <p className="text-xs text-slate-500 leading-normal">
              These settings apply to the local rendering pipeline and playback configurations. Ensure hardware acceleration is enabled in Chrome settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
