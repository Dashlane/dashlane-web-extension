import { jsx, Paragraph } from "@dashlane/design-system";
import { Gauge } from "./Gauge";
import { SX_STYLES } from "./PasswordHealth.styles";
const OUT_OF_100 = "/100";
const EMPTY_SCORE_PLACEHOLDER = "--";
export enum ScoreGaugeColorTresholds {
  RED_SCORE = 60,
  ORANGE_SCORE = 80,
}
export interface ScoreGaugeProps {
  score: number | null;
}
const scoreColor = (score: number | null) => {
  if (score === null) {
    return "ds.text.neutral.quiet";
  }
  if (score < ScoreGaugeColorTresholds.RED_SCORE) {
    return "ds.text.danger.quiet";
  }
  if (score < ScoreGaugeColorTresholds.ORANGE_SCORE) {
    return "ds.text.warning.quiet";
  }
  return "ds.text.positive.quiet";
};
const roundToFirstDecimalOrInt = (num: number | null) => {
  if (num === null) {
    return EMPTY_SCORE_PLACEHOLDER;
  }
  const numToOneDecimalPlace = num.toFixed(1);
  const numToInt = num.toFixed();
  return parseFloat(numToInt) - parseFloat(numToOneDecimalPlace) === 0
    ? numToInt
    : numToOneDecimalPlace;
};
export const ScoreGauge = ({ score }: ScoreGaugeProps) => {
  return (
    <div sx={SX_STYLES.GAUGE_WRAPPER}>
      <Gauge score={score ?? 0} />
      <div sx={SX_STYLES.GAUGE_LABELS}>
        <Paragraph
          textStyle="ds.specialty.spotlight.medium"
          as="span"
          sx={{
            color: scoreColor(score),
          }}
          data-testid="score-value"
        >
          {roundToFirstDecimalOrInt(score)}
        </Paragraph>

        <Paragraph as="span" sx={SX_STYLES.GAUGE_OUT_OF_100}>
          {OUT_OF_100}
        </Paragraph>
      </div>
    </div>
  );
};
