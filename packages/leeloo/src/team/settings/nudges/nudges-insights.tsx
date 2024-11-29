import { addDays, format as dateFormatter, subDays } from "date-fns";
import { useState } from "react";
import {
  Card,
  Flex,
  Heading,
  IconName,
  IndeterminateLoader,
  Tabs,
} from "@dashlane/design-system";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { nudgesApi } from "@dashlane/risk-mitigation-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import {
  InsightsGraph,
  InsightsGraphDataPoint,
} from "./components/insights-graph";
import {
  InsightMetricValue,
  InsightsMetric,
} from "./components/insights-metric";
const I18N_KEYS = {
  WEAK_PASSWORDS: "team_settings_nudges_insights_weak",
  COMPROMISED_PASSWORDS: "team_settings_nudges_insights_compromised",
  REUSED_PASSWORDS: "team_settings_nudges_insights_reused",
  CHANGE_SINCE_NUDGE: "team_settings_nudges_insights_change_since_nudge",
  NO_CHANGE_SINCE_NUDGE: "team_settings_nudges_insights_no_change_since_nudge",
  GRAPH_HEADING: "team_settings_nudges_insights_graph_heading",
  GRAPH_LAST_7_DAYS: "team_settings_nudges_insights_graph_7_days",
  GRAPH_LAST_30_DAYS: "team_settings_nudges_insights_graph_30_days",
  GRAPH_LAST_YEAR: "team_settings_nudges_insights_graph_year",
};
const VerticalDivider = () => (
  <div sx={{ borderLeft: "1px solid ds.border.neutral.quiet.idle" }} />
);
type MetricsData = Record<
  "weak" | "compromised" | "reused",
  {
    value: InsightMetricValue;
    percentChange?: number;
  }
>;
const metricsDataFromQueryResult = (
  queryResult: ReturnType<
    typeof useModuleQuery<typeof nudgesApi, "getHealthAndNudgeReport">
  >
): MetricsData => {
  switch (queryResult.status) {
    case DataStatus.Loading:
      return {
        weak: { value: "loading" },
        compromised: { value: "loading" },
        reused: { value: "loading" },
      };
    case DataStatus.Error:
      return {
        weak: { value: "unknown" },
        compromised: { value: "unknown" },
        reused: { value: "unknown" },
      };
    case DataStatus.Success: {
      const [...history] = queryResult.data.healthAndNudgeHistory;
      const lastReport = history.pop();
      if (lastReport === undefined) {
        return {
          weak: { value: "unknown" },
          compromised: { value: "unknown" },
          reused: { value: "unknown" },
        };
      }
      const lastNudgesReports = {
        weak: history.findLast((report) =>
          report.nudgesSent.includes("weak_passwords")
        ),
        compromised: history.findLast((report) =>
          report.nudgesSent.includes("compromised_passwords")
        ),
        reused: history.findLast((report) =>
          report.nudgesSent.includes("reused_passwords")
        ),
      };
      const percentChange = (newValue: number, oldValue: number | undefined) =>
        oldValue
          ? Math.round(((newValue - oldValue) * 100) / oldValue)
          : undefined;
      return {
        weak: {
          value: lastReport.weak,
          percentChange: percentChange(
            lastReport.weak,
            lastNudgesReports.weak?.weak
          ),
        },
        compromised: {
          value: lastReport.compromised,
          percentChange: percentChange(
            lastReport.compromised,
            lastNudgesReports.compromised?.compromised
          ),
        },
        reused: {
          value: lastReport.reused,
          percentChange: percentChange(
            lastReport.reused,
            lastNudgesReports.reused?.reused
          ),
        },
      };
    }
  }
};
const extractGraphData = (
  healthAndNudgeHistory: InsightsGraphDataPoint[],
  graphSpanDays: number
): InsightsGraphDataPoint[] => {
  const graphData: InsightsGraphDataPoint[] = [];
  let currentDate = subDays(new Date(), graphSpanDays);
  let lastValidData: (typeof healthAndNudgeHistory)[0] | {} =
    healthAndNudgeHistory.findLast(
      (elt) => new Date(elt.date) <= currentDate
    ) ?? {};
  if ("nudgesSent" in lastValidData) {
    lastValidData.nudgesSent = [];
  }
  while (graphData.length < graphSpanDays) {
    currentDate = addDays(currentDate, 1);
    const formattedDate = dateFormatter(currentDate, "yyyy-MM-dd");
    const data: InsightsGraphDataPoint = healthAndNudgeHistory.find(
      (elt) => elt.date === formattedDate
    ) ?? { ...lastValidData, date: formattedDate };
    graphData.push(data);
    lastValidData = { ...data, nudgesSent: [] };
  }
  return graphData;
};
export const NudgesInsights = () => {
  const { translate } = useTranslate();
  const getHealthAndNudgeReportResult = useModuleQuery(
    nudgesApi,
    "getHealthAndNudgeReport",
    { numberOfDays: 365 }
  );
  const [graphSpanDays, setGraphSpanDays] = useState(7);
  const metricsData = metricsDataFromQueryResult(getHealthAndNudgeReportResult);
  const ChangeToHighlight = (
    metrics: MetricsData,
    key: keyof MetricsData
  ):
    | {
        iconName?: IconName;
        label: string;
      }
    | undefined => {
    const { percentChange } = metrics[key];
    if (typeof percentChange !== "number") {
      return undefined;
    }
    const absChange = Math.abs(percentChange);
    if (absChange === 0) {
      return {
        label: translate(I18N_KEYS.NO_CHANGE_SINCE_NUDGE),
      };
    }
    return {
      iconName: percentChange > 0 ? "ArrowUpOutlined" : "ArrowDownOutlined",
      label: translate(I18N_KEYS.CHANGE_SINCE_NUDGE, { percent: absChange }),
    };
  };
  const healthAndNudgeHistory =
    getHealthAndNudgeReportResult.data?.healthAndNudgeHistory ?? [];
  const graphData = extractGraphData(healthAndNudgeHistory, graphSpanDays);
  return (
    <Flex flexDirection="column" gap="16px" sx={{ margin: "0 32px" }}>
      <Card
        sx={{
          display: "flex",
          flexDirection: "row",
          padding: "24px",
          gap: "24px",
          backgroundColor: "ds.container.agnostic.neutral.supershy",
          borderColor: "ds.border.neutral.quiet.idle",
        }}
      >
        <InsightsMetric
          title={translate(I18N_KEYS.WEAK_PASSWORDS)}
          mood="positive"
          value={metricsData.weak.value}
          highlight={ChangeToHighlight(metricsData, "weak")}
        />
        <VerticalDivider />
        <InsightsMetric
          title={translate(I18N_KEYS.COMPROMISED_PASSWORDS)}
          mood="danger"
          value={metricsData.compromised.value}
          highlight={ChangeToHighlight(metricsData, "compromised")}
        />
        <VerticalDivider />
        <InsightsMetric
          title={translate(I18N_KEYS.REUSED_PASSWORDS)}
          mood="warning"
          value={metricsData.reused.value}
          highlight={ChangeToHighlight(metricsData, "reused")}
        />
      </Card>
      <Card
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "24px",
          gap: "24px",
          backgroundColor: "ds.container.agnostic.neutral.supershy",
          borderColor: "ds.border.neutral.quiet.idle",
        }}
      >
        <Flex flexDirection="row" justifyContent="space-between">
          <Heading
            as="h5"
            color="ds.text.neutral.catchy"
            textStyle="ds.title.section.medium"
            sx={{ marginBottom: "1%" }}
          >
            {translate(I18N_KEYS.GRAPH_HEADING)}
          </Heading>
          <Tabs
            tabs={[
              {
                id: "tab-7-days",
                title: translate(I18N_KEYS.GRAPH_LAST_7_DAYS),
                contentId: "content-7-days",
                onSelect: () => {
                  setGraphSpanDays(7);
                },
              },
              {
                id: "tab-30-days",
                title: translate(I18N_KEYS.GRAPH_LAST_30_DAYS),
                contentId: "content-30-days",
                onSelect: () => {
                  setGraphSpanDays(30);
                },
              },
              {
                id: "tab-year",
                title: translate(I18N_KEYS.GRAPH_LAST_YEAR),
                contentId: "content-year",
                onSelect: () => {
                  setGraphSpanDays(365);
                },
              },
            ]}
          />
        </Flex>
        {getHealthAndNudgeReportResult.status !== DataStatus.Success ? (
          <IndeterminateLoader
            data-testid="insight-graph-loader"
            size="xlarge"
          />
        ) : (
          <InsightsGraph graphData={graphData} />
        )}
      </Card>
    </Flex>
  );
};
