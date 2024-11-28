import { useEffect, useState } from "react";
import { jsx } from "@dashlane/design-system";
import { ScoreGaugeColorTresholds } from "./ScoreGauge";
const TOTAL_PATH_LENGTH = 394;
const MIN_SCORE = 0;
const MAX_SCORE = 100;
export interface GaugeProps {
  score: number;
}
const gaugeColor = (score: number) => {
  if (score < ScoreGaugeColorTresholds.RED_SCORE) {
    return "ds.border.danger.standard.idle";
  }
  if (score < ScoreGaugeColorTresholds.ORANGE_SCORE) {
    return "ds.border.warning.standard.idle";
  }
  return "ds.border.positive.standard.idle";
};
export const Gauge = ({ score }: GaugeProps) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(
      (TOTAL_PATH_LENGTH / (MAX_SCORE - MIN_SCORE)) *
        (MAX_SCORE - MIN_SCORE - score)
    );
  }, [score]);
  return (
    <svg
      xmlns="__REDACTED__"
      width="100"
      height="120"
      fill="none"
      viewBox="0 0 200 153"
    >
      <mask id="animatedMask">
        <path
          sx={{ transition: "stroke-dashoffset 1s ease-in-out" }}
          strokeDasharray={TOTAL_PATH_LENGTH}
          strokeDashoffset={progress}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="12"
          stroke="white"
          d="M18.594 147a94 94 0 11162.827-.025"
        />
      </mask>
      <path
        sx={{ stroke: "ds.border.neutral.quiet.idle" }}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
        d="M18.594 147a94 94 0 11162.827-.025"
      />

      <path
        sx={{
          stroke: gaugeColor(score),
          transition: "stroke-dashoffset 1s ease-in-out",
        }}
        opacity="1"
        strokeDasharray={TOTAL_PATH_LENGTH}
        strokeDashoffset={progress}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
        d="M18.594 147a94 94 0 11162.827-.025"
      />
    </svg>
  );
};
