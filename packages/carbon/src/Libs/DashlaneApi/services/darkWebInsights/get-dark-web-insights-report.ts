import type {
  GetDarkWebInsightsReportDetailsBodyData,
  GetDarkWebInsightsReportDetailsBodyError,
  GetDarkWebInsightsReportDetailsPayload,
} from "@dashlane/server-sdk/v1";
import { StoreService } from "Store";
import {
  ApiAuthType,
  ApiEndpointGroups,
  ApiRequestMethod,
  ApiResponse,
  ApiVersion,
} from "Libs/DashlaneApi/types";
import { prepareApiEndpoint } from "Libs/DashlaneApi/endpoint";
export type DarkWebInsightsResponse = ApiResponse<
  GetDarkWebInsightsReportDetailsBodyData,
  GetDarkWebInsightsReportDetailsBodyError
>;
const endpointConfig = {
  group: ApiEndpointGroups.teams,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "GetDarkWebInsightsReportDetails",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getDarkWebInsightReport(
  storeService: StoreService,
  login: string,
  params: GetDarkWebInsightsReportDetailsPayload
): Promise<DarkWebInsightsResponse> {
  return makeRequest<
    GetDarkWebInsightsReportDetailsPayload,
    GetDarkWebInsightsReportDetailsBodyData,
    GetDarkWebInsightsReportDetailsBodyError
  >(storeService, { login, payload: params });
}
