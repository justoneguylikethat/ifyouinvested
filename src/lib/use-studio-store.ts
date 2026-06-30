import { create } from 'zustand';

export type TemplateId = 'richest-person' | 'country-wealth' | 'lifestyle-spending' | 'kinetic-typography' | 'leaderboard-race';
export type VideoLayout = 'vertical' | 'horizontal' | 'square';
export type VideoTheme = 'light' | 'dark';
export type AnimationStyle = 'standard' | 'physics' | 'kinetic';

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

export interface StudioState {
  // Config
  templateId: TemplateId;
  datasetId: string;
  dataset: any;
  durationInFrames: number;
  fps: number;
  layout: VideoLayout;
  theme: VideoTheme;
  branding: BrandingConfig;
  music: string;
  voiceover: VoiceoverConfig;
  animationStyle: AnimationStyle;
  title: string;

  // Actions
  setTemplateId: (id: TemplateId) => void;
  setDatasetId: (id: string, dataset: any) => void;
  setDuration: (frames: number) => void;
  setLayout: (layout: VideoLayout) => void;
  setTheme: (theme: VideoTheme) => void;
  updateBranding: (branding: Partial<BrandingConfig>) => void;
  setMusic: (music: string) => void;
  updateVoiceover: (voiceover: Partial<VoiceoverConfig>) => void;
  setAnimationStyle: (style: AnimationStyle) => void;
  // Rendering states (for export progress overlay)
  isRendering: boolean;
  renderProgress: number | null;
  setIsRendering: (isRendering: boolean) => void;
  setRenderProgress: (progress: number | null) => void;
}

export const BUILTIN_DATASETS: Record<TemplateId, Array<{ id: string; label: string; data: any }>> = {
  'leaderboard-race': [
    {
      id: 'mockup-race',
      label: 'WHICH INVESTMENT MADE YOU RICHER? (2010-2024)',
      data: {
        title: 'WHICH INVESTMENT MADE YOU RICHER?',
        subtitle: '$100 invested in 2010',
        series: [
          { name: 'Bitcoin', color: '#F7931A', values: [100, 450, 1800, 2400, 5600, 8000, 10500, 12420] },
          { name: 'Tesla', color: '#E82127', values: [100, 180, 500, 1200, 1800, 3200, 4800, 6125] },
          { name: 'NVIDIA', color: '#76B900', values: [100, 140, 250, 500, 900, 1500, 2600, 3780] },
          { name: 'Amazon', color: '#FF9900', values: [100, 130, 280, 580, 850, 1200, 1600, 2190] },
          { name: 'Apple', color: '#A2AAAD', values: [100, 150, 280, 450, 720, 1100, 1450, 1845] },
          { name: 'Gold', color: '#D4AF37', values: [100, 110, 130, 180, 290, 480, 800, 1230] },
          { name: 'S&P 500', color: '#0056b3', values: [100, 120, 160, 220, 350, 520, 750, 980] },
          { name: 'Savings Account', color: '#008080', values: [100, 105, 112, 125, 145, 175, 240, 321] }
        ],
        timeline: ['2010', '2012', '2014', '2016', '2018', '2020', '2022', '2024'],
        unit: ''
      }
    }
  ],
  'richest-person': [
    {
      id: 'musk-vs-bezos',
      label: 'Musk vs Bezos Net Worth (2015-2025)',
      data: {
        title: 'Billionaire Net Worth Race',
        subtitle: 'The battle for the richest person on Earth',
        series: [
          { name: 'Elon Musk', color: '#3b82f6', values: [20, 35, 45, 80, 150, 185, 220, 250, 270, 300] },
          { name: 'Jeff Bezos', color: '#f59e0b', values: [35, 45, 60, 100, 115, 130, 170, 190, 200, 210] }
        ],
        timeline: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
        unit: 'B'
      }
    },
    {
      id: 'gates-vs-jobs',
      label: 'Bill Gates vs Steve Jobs (1995-2010)',
      data: {
        title: 'Tech Icons Legacy Wealth',
        subtitle: 'Bill Gates vs Steve Jobs',
        series: [
          { name: 'Bill Gates', color: '#10b981', values: [15, 20, 35, 50, 60, 54, 48, 52, 55, 60] },
          { name: 'Steve Jobs', color: '#ef4444', values: [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 6.0, 8.0] }
        ],
        timeline: ['1995', '1997', '1999', '2001', '2003', '2005', '2006', '2007', '2008', '2010'],
        unit: 'B'
      }
    }
  ],
  'country-wealth': [
    {
      id: 'us-vs-china-gdp',
      label: 'USA vs China GDP Growth (2000-2024)',
      data: {
        title: 'Superpower GDP Faceoff',
        subtitle: 'USA vs China',
        series: [
          { name: 'United States', color: '#3b82f6', values: [10.2, 11.5, 13.0, 14.5, 15.0, 16.2, 18.0, 21.4, 25.4, 27.9] },
          { name: 'China', color: '#ef4444', values: [1.2, 1.7, 2.5, 3.5, 5.1, 8.5, 11.0, 14.7, 17.9, 18.5] }
        ],
        timeline: ['2000', '2003', '2005', '2008', '2010', '2012', '2015', '2018', '2021', '2024'],
        unit: 'T'
      }
    }
  ],
  'lifestyle-spending': [
    {
      id: 'coffee-vs-bitcoin',
      label: '$5/day Coffee vs Buying Bitcoin (2013-2024)',
      data: {
        title: 'Daily Habits vs Investments',
        subtitle: '$5 Coffee vs Bitcoin',
        series: [
          { name: 'Coffee (Spent)', color: '#ef4444', values: [1825, 3650, 5475, 7300, 9125, 10950, 12775, 14600, 16425, 18250] },
          { name: 'Bitcoin (Invested)', color: '#f59e0b', values: [8500, 12000, 32000, 110000, 240000, 480000, 890000, 620000, 1200000, 2400000] }
        ],
        timeline: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'],
        unit: ''
      }
    }
  ],
  'kinetic-typography': [
    {
      id: 'nvidia-cagr',
      label: 'NVIDIA Growth Compound Simulation',
      data: {
        title: 'NVIDIA Compounding Momentum',
        subtitle: 'Visualizing massive CAGR',
        startPrincipal: 10000,
        cagr: 0.45, // 45% CAGR
        timeline: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10'],
        unit: ''
      }
    }
  ]
};

export const useStudioStore = create<StudioState>((set) => ({
  // Default values
  templateId: 'leaderboard-race',
  datasetId: 'mockup-race',
  dataset: BUILTIN_DATASETS['leaderboard-race'][0].data,
  durationInFrames: 900, // 30 seconds at 30 fps
  fps: 30,
  layout: 'vertical',
  theme: 'dark',
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
  isRendering: false,
  renderProgress: null,

  // Setters
  setTemplateId: (templateId) => set((state) => {
    const list = BUILTIN_DATASETS[templateId] || [];
    const firstDataset = list[0];
    return {
      templateId,
      datasetId: firstDataset?.id || '',
      dataset: firstDataset?.data || null,
      title: firstDataset?.data?.title || 'Data Storytelling'
    };
  }),
  setDatasetId: (datasetId, dataset) => set({ datasetId, dataset, title: dataset?.title || 'Data Storytelling' }),
  setDuration: (durationInFrames) => set({ durationInFrames }),
  setLayout: (layout) => set({ layout }),
  setTheme: (theme) => set({ theme }),
  updateBranding: (branding) => set((state) => ({ branding: { ...state.branding, ...branding } })),
  setMusic: (music) => set({ music }),
  updateVoiceover: (voiceover) => set((state) => ({ voiceover: { ...state.voiceover, ...voiceover } })),
  setAnimationStyle: (animationStyle) => set({ animationStyle }),
  setTitle: (title) => set({ title }),
  setIsRendering: (isRendering) => set({ isRendering }),
  setRenderProgress: (renderProgress) => set({ renderProgress })
}));
