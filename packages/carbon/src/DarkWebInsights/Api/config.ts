import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { DarkWebInsightsCommands } from "DarkWebInsights/Api/commands";
import { getDarkWebInsightsReportResults } from "DarkWebInsights/services/getDarkWebInsightsReportResults";
import { getDarkWebInsightsSummary } from "DarkWebInsights/services/getDarkWebInsightsSummary";
export const config: CommandQueryBusConfig<DarkWebInsightsCommands> = {
  commands: {
    getDarkWebInsightsReportResults: {
      handler: getDarkWebInsightsReportResults,
    },
    getDarkWebInsightsSummary: {
      handler: getDarkWebInsightsSummary,
    },
  },
  queries: {},
  liveQueries: {},
};
