import {
  DarkWebInsightsApiErrorType,
  GetDarkWebInsightsSummaryResponse,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { userLoginSelector } from "Session/selectors";
import { isApiError } from "Libs/DashlaneApi";
import { getDarkWebInsightsSummaryRequest } from "Libs/DashlaneApi/services/darkWebInsights/get-dark-web-insights-summary";
export async function getDarkWebInsightsSummary(
  services: CoreServices
): Promise<GetDarkWebInsightsSummaryResponse> {
  const { storeService } = services;
  const state = storeService.getState();
  const login = userLoginSelector(state);
  const requestResponse = await getDarkWebInsightsSummaryRequest(
    storeService,
    login
  );
  if (isApiError(requestResponse)) {
    return {
      success: false,
      error: {
        code: DarkWebInsightsApiErrorType.GetDarkWebInsightsSummaryFailed,
        message: `get Dark Web Insights Summary failed: ${requestResponse.message}`,
      },
    };
  }
  return {
    success: true,
    data: requestResponse,
  };
}
