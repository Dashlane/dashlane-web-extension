import { useState } from "react";
import {
  CartesianGrid,
  Tooltip as GraphTooltip,
  Line,
  LineChart,
  ResponsiveContainer,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts";
import type {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent";
import { nextSunday } from "date-fns";
import { Card, Flex, Heading, Icon, Paragraph } from "@dashlane/design-system";
import {
  GetRiskDetectionInsightsQueryResult,
  TimeScale,
} from "@dashlane/risk-monitoring-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { LOCALE_FORMAT } from "../../../libs/i18n/helpers";
const MINIMUM_GRAPH_MAXYVALUE = 10;
const I18N_KEYS = {
  KEYS_HEADING: "team_risk_detection_insights_graph_keys",
  LEGEND_AT_RISK: "team_risk_detection_insights_graph_key_at_risk",
  LEGEND_WEAK_PASSWORDS: "team_risk_detection_insights_graph_key_weak",
  LEGEND_COMPROMISED_PASSWORDS:
    "team_risk_detection_insights_graph_key_compromised",
};
const graphColors = {
  logins: "#32A9B2",
  compromised: "#FF7385",
  weak: "#ED892D",
};
export type InsightsGraphDataPoint =
  GetRiskDetectionInsightsQueryResult["riskDetectionHistory"][0];
const LegendLineSvg = (props: { color: string }) => {
  const { color } = props;
  return (
    <div sx={{ width: "9px" }}>
      <svg viewBox={`0 0 2 2`} xmlns="__REDACTED__">
        <line x1="0" y1="1" x2="2" y2="1" stroke={color} strokeWidth="0.4" />
      </svg>
    </div>
  );
};
interface InsightsGraphProps {
  graphData: InsightsGraphDataPoint[];
  timeScale: TimeScale;
}
export const InsightsGraph = ({ graphData, timeScale }: InsightsGraphProps) => {
  const { translate } = useTranslate();
  const [keysCollapsed, setKeysCollapsed] = useState(true);
  const maxValue = graphData.reduce(
    (max, { nLogins, nWeak, nCompromised }) =>
      Math.max(max, nLogins, nWeak, nCompromised),
    MINIMUM_GRAPH_MAXYVALUE
  );
  const graphMaxY = Math.ceil(maxValue / 10) * 10;
  const tickFormatterFunction = (tick: number) => {
    const date = new Date(tick);
    switch (timeScale) {
      case "week":
        return translate.shortDate(date, LOCALE_FORMAT.L_M_D);
      case "month":
        return `${translate.shortDate(
          date,
          LOCALE_FORMAT.L_M_D
        )} - ${translate.shortDate(nextSunday(date), LOCALE_FORMAT.L_M_D)}`;
      case "year":
        return translate.shortDate(date, LOCALE_FORMAT.MMM);
    }
  };
  const TooltipMetricDot = ({ color }: { color: string }) => {
    return (
      <span
        sx={{
          background: color,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          alignsSelf: "center",
        }}
      />
    );
  };
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      return (
        <Flex
          flexDirection="column"
          gap="4px"
          sx={{
            padding: "8px",
            borderRadius: "4px",
            background: "ds.container.agnostic.neutral.quiet",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.16)",
          }}
        >
          <Heading
            as="h5"
            textStyle="ds.title.supporting.small"
            color="ds.text.neutral.catchy"
          >
            {tickFormatterFunction(label)}
          </Heading>
          <Flex flexDirection="row" gap="4px" alignItems="center">
            <TooltipMetricDot color={graphColors.logins} />
            <Paragraph
              textStyle="ds.body.helper.regular"
              color="ds.text.neutral.standard"
            >
              {`${payload[0].value?.toString() ?? "-"} ${translate(
                I18N_KEYS.LEGEND_AT_RISK
              )}`}
            </Paragraph>
          </Flex>
          <Flex flexDirection="row" gap="4px" alignItems="center">
            <TooltipMetricDot color={graphColors.weak} />
            <Paragraph
              textStyle="ds.body.helper.regular"
              color="ds.text.neutral.standard"
            >
              {`${payload[1].value?.toString() ?? "-"} ${translate(
                I18N_KEYS.LEGEND_WEAK_PASSWORDS
              )}`}
            </Paragraph>
          </Flex>
          <Flex flexDirection="row" gap="4px" alignItems="center">
            <TooltipMetricDot color={graphColors.compromised} />
            <Paragraph
              textStyle="ds.body.helper.regular"
              color="ds.text.neutral.standard"
            >
              {`${payload[2].value?.toString() ?? "-"} ${translate(
                I18N_KEYS.LEGEND_COMPROMISED_PASSWORDS
              )}`}
            </Paragraph>
          </Flex>
        </Flex>
      );
    }
    return null;
  };
  return (
    <>
      <ResponsiveContainer height={220}>
        <LineChart data={graphData}>
          <GraphTooltip content={CustomTooltip} />
          <CartesianGrid vertical={false} />
          <YAxis domain={[0, graphMaxY]} fontSize="small" />
          <XAxis
            dataKey={"startDate"}
            fontSize="small"
            tickFormatter={tickFormatterFunction}
          />
          <Line
            dataKey="nLogins"
            type="linear"
            stroke={graphColors.logins}
            strokeWidth="2"
            isAnimationActive={false}
          />
          <Line
            dataKey="nWeak"
            type="linear"
            stroke={graphColors.weak}
            strokeWidth="2"
            isAnimationActive={false}
          />
          <Line
            dataKey="nCompromised"
            type="linear"
            stroke={graphColors.compromised}
            strokeWidth="2"
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "16px",
          gap: "16px",
          backgroundColor: "ds.container.agnostic.neutral.quiet",
          borderColor: "ds.border.neutral.quiet.idle",
        }}
      >
        <Flex
          as="button"
          flexDirection="row"
          alignItems="center"
          gap="8px"
          onClick={() => setKeysCollapsed(!keysCollapsed)}
          sx={{ cursor: "pointer", background: "none", width: "fit-content" }}
        >
          <Heading
            as="h3"
            textStyle="ds.title.supporting.small"
            color="ds.text.neutral.quiet"
          >
            {translate(I18N_KEYS.KEYS_HEADING)}
          </Heading>
          <Icon
            name={keysCollapsed ? "CaretRightOutlined" : "CaretDownOutlined"}
            size="small"
            color="ds.text.neutral.quiet"
          />
        </Flex>
        {!keysCollapsed ? (
          <Flex flexDirection="row" gap="32px" sx={{ paddingLeft: "16px" }}>
            {[
              [
                "nLogins",
                graphColors.logins,
                translate(I18N_KEYS.LEGEND_AT_RISK),
              ],
              [
                "nWeak",
                graphColors.weak,
                translate(I18N_KEYS.LEGEND_WEAK_PASSWORDS),
              ],
              [
                "nCompromised",
                graphColors.compromised,
                translate(I18N_KEYS.LEGEND_COMPROMISED_PASSWORDS),
              ],
            ].map(([key, color, legendLine]) => {
              return (
                <Flex
                  flexDirection="row"
                  gap="8px"
                  alignItems="baseline"
                  key={key}
                >
                  <LegendLineSvg color={color} />
                  <Paragraph
                    textStyle="ds.body.helper.regular"
                    color="ds.text.neutral.quiet"
                  >
                    {legendLine}
                  </Paragraph>
                </Flex>
              );
            })}
          </Flex>
        ) : null}
      </Card>
    </>
  );
};
