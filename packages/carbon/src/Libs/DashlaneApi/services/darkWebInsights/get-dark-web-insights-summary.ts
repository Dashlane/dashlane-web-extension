import type {
  GetDarkWebInsightsSummaryBodyData,
  GetDarkWebInsightsSummaryBodyError,
  GetDarkWebInsightsSummaryPayload,
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
export type DarkWebInsightsSummaryResponse = ApiResponse<
  GetDarkWebInsightsSummaryBodyData,
  GetDarkWebInsightsSummaryBodyError
>;
const endpointConfig = {
  group: ApiEndpointGroups.teams,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "GetDarkWebInsightsSummary",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getDarkWebInsightsSummaryRequest(
  storeService: StoreService,
  login: string
): Promise<DarkWebInsightsSummaryResponse> {
  return makeRequest<
    GetDarkWebInsightsSummaryPayload,
    GetDarkWebInsightsSummaryBodyData,
    GetDarkWebInsightsSummaryBodyError
  >(storeService, { login, payload: {} });
}
