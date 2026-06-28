import { Metadata } from "next";
import { GameLayout } from "@/components/millionaire/game-layout";
import { GameEngineRunner } from "@/components/millionaire/game-engine-runner";

export const metadata: Metadata = {
  title: "Millionaire Challenge | IfYouInvested.online",
  description: "Play the historical investment strategy game and try to turn $10,000 into $1,000,000.",
};

export default function MillionaireChallengePage() {
  return (
    <GameLayout>
      <GameEngineRunner />
    </GameLayout>
  );
}
