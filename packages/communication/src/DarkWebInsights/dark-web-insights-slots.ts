import { slot } from "ts-event-bus";
import {
  GetDarkWebInsightsParam,
  GetDarkWebInsightsReportResults,
  GetDarkWebInsightsSummaryResponse,
} from "./types";
export const darkWebInsightsCommandsSlots = {
  getDarkWebInsightsReportResults: slot<
    GetDarkWebInsightsParam,
    GetDarkWebInsightsReportResults
  >(),
  getDarkWebInsightsSummary: slot<void, GetDarkWebInsightsSummaryResponse>(),
};
