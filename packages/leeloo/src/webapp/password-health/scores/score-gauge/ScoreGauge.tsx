import { Paragraph } from "@dashlane/design-system";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { GridChild } from "@dashlane/ui-components";
import { useHasFeatureEnabled } from "../../../../libs/carbon/hooks/useHasFeature";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { Gauge } from "./components/Gauge";
import { AnimatedScore } from "./components/AnimatedScore";
import { ScoreGaugeColorTresholds } from "./score-gauge-colors";
const I18N_KEYS = {
  BOTTOM_LABEL: "webapp_password_health_score_out_of_100",
};
export interface ScoreGaugeProps {
  score: number | null;
  shouldAnimateText?: boolean;
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
const EMPTY_SCORE_PLACEHOLDER = "--";
interface ScoreValueProps {
  score: number | null;
  shouldAnimateText: boolean;
}
const ScoreValue = ({ score, shouldAnimateText }: ScoreValueProps) => {
  if (score === null) {
    return <>{EMPTY_SCORE_PLACEHOLDER}</>;
  }
  return shouldAnimateText ? <AnimatedScore score={score} /> : <>{score}</>;
};
export const ScoreGauge = ({
  score,
  shouldAnimateText = false,
}: ScoreGaugeProps) => {
  const { translate } = useTranslate();
  const prideColorsEnabled = useHasFeatureEnabled(
    FEATURE_FLIPS_WITHOUT_MODULE.WebplatformWebPrideColors
  );
  const scoreOrDefault = score ?? 0;
  return (
    <div
      sx={{
        display: "grid",
        gridTemplateAreas: "gauge",
        justifyItems: "center",
      }}
    >
      <div sx={{ gridArea: "gauge" }}>
        <Gauge score={scoreOrDefault} showQueerColors={prideColorsEnabled} />
      </div>
      <Paragraph
        textStyle="ds.specialty.spotlight.large"
        as="span"
        sx={{
          color: scoreColor(score),
          gridArea: "gauge",
          marginTop: "60px",
        }}
      >
        <ScoreValue score={score} shouldAnimateText={shouldAnimateText} />
      </Paragraph>
      <GridChild
        as={Paragraph}
        gridArea={"gauge"}
        size="medium"
        color="ds.text.neutral.quiet"
        sx={{
          marginTop: "136px",
          textTransform: "lowercase",
          variant: "ds.body.standard.regular",
        }}
      >
        {translate(I18N_KEYS.BOTTOM_LABEL)}
      </GridChild>
    </div>
  );
};
