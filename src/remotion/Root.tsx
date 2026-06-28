import { Composition, CalculateMetadataFunction } from "remotion";
import { VideoComposition, VideoLayout } from "./Composition";
import { InvestmentResult } from "@/lib/types";

const defaultProps: { results: InvestmentResult[], layout: VideoLayout } = {
  results: [],
  layout: 'vertical'
};

const calculateMetadata: CalculateMetadataFunction<{ results: InvestmentResult[], layout: VideoLayout }> = ({ props }) => {
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
    </>
  );
};
