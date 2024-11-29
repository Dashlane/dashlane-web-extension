import { ReactElement } from "react";
import {
  CartesianGrid,
  Dot,
  DotProps,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { Card, Flex, Paragraph } from "@dashlane/design-system";
import { GetHealthAndNudgeReportResult } from "@dashlane/risk-mitigation-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  LEGEND_NUDGE_WEAK: "team_settings_nudges_insights_legend_nudge_weak",
  LEGEND_WEAK_PASSWORDS: "team_settings_nudges_insights_legend_weak_passwords",
  LEGEND_NUDGE_COMPROMISED:
    "team_settings_nudges_insights_legend_nudge_compromised",
  LEGEND_COMPROMISED_PASSWORDS:
    "team_settings_nudges_insights_legend_compromised_passwords",
  LEGEND_NUDGE_REUSED: "team_settings_nudges_insights_legend_nudge_reused",
  LEGEND_REUSED_PASSWORDS:
    "team_settings_nudges_insights_legend_reused_passwords",
};
const graphColors = {
  weak: "#32A9B2",
  compromised: "#FF7385",
  reused: "#ED892D",
};
type HealthAndNudgeHistoryDataPoint =
  GetHealthAndNudgeReportResult["healthAndNudgeHistory"][0];
export type InsightsGraphDataPoint =
  | HealthAndNudgeHistoryDataPoint
  | {
      date: string;
    };
const NudgeLegendDotSvg = (props: { color: string }) => {
  const { color } = props;
  return (
    <div sx={{ width: "8px" }}>
      <svg viewBox="0 0 2 2" xmlns="__REDACTED__">
        <circle cx="1" cy="1" r="1" strokeWidth="0" fill={color} />
      </svg>
    </div>
  );
};
const NudgeLegendLineSvg = (props: { color: string }) => {
  const { color } = props;
  return (
    <div sx={{ width: "8px" }}>
      <svg viewBox={`0 0 2 2`} xmlns="__REDACTED__">
        <line x1="0" y1="1" x2="2" y2="1" stroke={color} strokeWidth="0.4" />
      </svg>
    </div>
  );
};
const NudgeSentDot = (props: unknown): ReactElement<SVGElement> => {
  const { cx, cy, stroke, payload, dataKey, r, strokeWidth, key } =
    props as DotProps & {
      payload: InsightsGraphDataPoint;
      dataKey: keyof HealthAndNudgeHistoryDataPoint;
    };
  if (
    "nudgesSent" in payload &&
    payload.nudgesSent.includes(`${dataKey}_passwords`)
  ) {
    return (
      <Dot
        id={`nudgeSentDot-${dataKey}`}
        cx={cx}
        cy={cy}
        r={r}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={stroke}
        key={key}
      />
    ) as ReactElement<SVGElement>;
  }
  return null as unknown as ReactElement<SVGElement>;
};
interface InsightsGraphProps {
  graphData: InsightsGraphDataPoint[];
}
export const InsightsGraph = ({ graphData }: InsightsGraphProps) => {
  const { translate } = useTranslate();
  const maxValue = graphData.reduce((max, payload) => {
    if ("compromised" in payload) {
      const { compromised, reused, weak } = payload;
      return Math.max(max, compromised, reused, weak);
    }
    return max;
  }, 0);
  const graphMaxY = Math.ceil(maxValue / 10) * 10;
  return (
    <>
      <div
        sx={{
          width: "100%",
          height: "211px",
          flexGrow: 1,
        }}
        data-testid="insight-graph"
      >
        <ResponsiveContainer sx={{ height: "100%", width: "100%" }}>
          <LineChart data={graphData}>
            <CartesianGrid vertical={false} />
            <YAxis domain={[0, graphMaxY]} fontSize="small" />
            <XAxis dataKey={"date"} fontSize="small" />
            <Line
              id="line-weak"
              dataKey="weak"
              type="linear"
              stroke={graphColors.weak}
              dot={NudgeSentDot}
              isAnimationActive={false}
            />
            <Line
              id="line-compromised"
              dataKey="compromised"
              type="linear"
              stroke={graphColors.compromised}
              dot={NudgeSentDot}
              isAnimationActive={false}
            />
            <Line
              id="line-reused"
              dataKey="reused"
              type="linear"
              stroke={graphColors.reused}
              dot={NudgeSentDot}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <Card
        sx={{
          display: "flex",
          flexDirection: "row",
          padding: "16px",
          gap: "32px",
          backgroundColor: "ds.container.agnostic.neutral.quiet",
          borderColor: "ds.border.neutral.quiet.idle",
        }}
      >
        {[
          [
            "weak",
            graphColors.weak,
            I18N_KEYS.LEGEND_NUDGE_WEAK,
            I18N_KEYS.LEGEND_WEAK_PASSWORDS,
          ],
          [
            "compromised",
            graphColors.compromised,
            I18N_KEYS.LEGEND_NUDGE_COMPROMISED,
            I18N_KEYS.LEGEND_COMPROMISED_PASSWORDS,
          ],
          [
            "reused",
            graphColors.reused,
            I18N_KEYS.LEGEND_NUDGE_REUSED,
            I18N_KEYS.LEGEND_REUSED_PASSWORDS,
          ],
        ].map(([key, color, legendDot, legendLine]) => {
          return (
            <Flex flexDirection="column" gap="8px" key={key}>
              <Flex flexDirection="row" gap="8px" alignItems="baseline">
                <NudgeLegendDotSvg color={color} />
                <Paragraph
                  textStyle="ds.body.helper.regular"
                  color="ds.text.neutral.quiet"
                >
                  {translate(legendDot)}
                </Paragraph>
              </Flex>
              <Flex flexDirection="row" gap="8px" alignItems="baseline">
                <NudgeLegendLineSvg color={color} />
                <Paragraph
                  textStyle="ds.body.helper.regular"
                  color="ds.text.neutral.quiet"
                >
                  {translate(legendLine)}
                </Paragraph>
              </Flex>
            </Flex>
          );
        })}
      </Card>
    </>
  );
};
