import {
  DarkWebInsightsApiErrorType,
  GetDarkWebInsightsParam,
  GetDarkWebInsightsReportResults,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { userLoginSelector } from "Session/selectors";
import { isApiError } from "Libs/DashlaneApi";
import { getDarkWebInsightReport } from "Libs/DashlaneApi/services/darkWebInsights/get-dark-web-insights-report";
export async function getDarkWebInsightsReportResults(
  services: CoreServices,
  getDarkWebInsightsParam: GetDarkWebInsightsParam
): Promise<GetDarkWebInsightsReportResults> {
  const { storeService } = services;
  const state = storeService.getState();
  const login = userLoginSelector(state);
  const requestResponse = await getDarkWebInsightReport(
    storeService,
    login,
    getDarkWebInsightsParam
  );
  if (isApiError(requestResponse)) {
    return {
      success: false,
      error: {
        code: DarkWebInsightsApiErrorType.GetDarkWebInsightsFailed,
        message: `get Dark Web Insights Report failed: ${requestResponse.message}`,
      },
    };
  }
  return {
    success: true,
    data: requestResponse,
  };
}
