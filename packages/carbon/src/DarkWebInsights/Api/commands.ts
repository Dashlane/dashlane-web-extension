import {
  GetDarkWebInsightsParam,
  GetDarkWebInsightsReportResults,
  GetDarkWebInsightsSummaryResponse,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type DarkWebInsightsCommands = {
  getDarkWebInsightsReportResults: Command<
    GetDarkWebInsightsParam,
    GetDarkWebInsightsReportResults
  >;
  getDarkWebInsightsSummary: Command<void, GetDarkWebInsightsSummaryResponse>;
};
