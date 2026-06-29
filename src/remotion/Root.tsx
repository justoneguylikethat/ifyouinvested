import { Composition, CalculateMetadataFunction } from "remotion";
import { VideoComposition, VideoLayout } from "./Composition";
import { InvestmentResult } from "@/lib/types";
import { StudioVideoComposition, StudioCompositionProps } from "./StudioComposition";

import { VideoTheme } from "./Composition";

const defaultProps: { results: InvestmentResult[], layout?: VideoLayout, theme?: VideoTheme } = {
  results: [],
  layout: 'vertical',
  theme: 'dark'
};

const calculateMetadata: CalculateMetadataFunction<{ results: InvestmentResult[], layout?: VideoLayout, theme?: VideoTheme }> = ({ props }) => {
  const baseDuration = 600; // 20s
  const additionalFramesPerAsset = 90; // 3s per asset
  
  // Only add extra time if we are comparing multiple assets
  const totalDuration = props.results && props.results.length > 1 
    ? baseDuration + (props.results.length * additionalFramesPerAsset)
    : baseDuration;

  let width = 1080;
  let height = 1920;

  if (props.layout === 'horizontal') {
    width = 1920;
    height = 1080;
  } else if (props.layout === 'square') {
    width = 1080;
    height = 1080;
  }

  return {
    durationInFrames: totalDuration,
    width,
    height,
  };
};

const defaultStudioProps: StudioCompositionProps = {
  templateId: 'richest-person',
  dataset: {
    title: 'Billionaire Net Worth Race',
    subtitle: 'The battle for the richest person on Earth',
    series: [
      { name: 'Elon Musk', color: '#3b82f6', values: [20, 35, 45, 80, 150, 185, 220, 250, 270, 300] },
      { name: 'Jeff Bezos', color: '#f59e0b', values: [35, 45, 60, 100, 115, 130, 170, 190, 200, 210] }
    ],
    timeline: ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    unit: 'B'
  },
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
  title: 'Billionaire Net Worth Race'
};

const calculateStudioMetadata: CalculateMetadataFunction<StudioCompositionProps> = ({ props }) => {
  let width = 1080;
  let height = 1920;

  if (props.layout === 'horizontal') {
    width = 1920;
    height = 1080;
  } else if (props.layout === 'square') {
    width = 1080;
    height = 1080;
  }

  return {
    durationInFrames: props.durationInFrames || 300,
    width,
    height,
  };
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="SimulationVideo"
        component={VideoComposition}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultProps}
        calculateMetadata={calculateMetadata}
      />
      <Composition
        id="StudioVideo"
        component={StudioVideoComposition}
        durationInFrames={300}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={defaultStudioProps}
        calculateMetadata={calculateStudioMetadata}
      />
    </>
  );
};

