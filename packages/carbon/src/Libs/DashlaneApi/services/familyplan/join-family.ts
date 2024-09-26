import { ValuesType } from "@dashlane/framework-types";
import type {
  JoinFamilyBodyData,
  JoinFamilyBodyError,
  JoinFamilyPayload,
} from "@dashlane/server-sdk/v1";
import { StoreService } from "Store";
import { prepareApiEndpoint } from "Libs/DashlaneApi/endpoint";
import {
  ApiAuthType,
  ApiEndpointGroups,
  ApiRequestMethod,
  ApiResponse,
  ApiVersion,
} from "Libs/DashlaneApi/types";
export type JoinFamilyRequest = JoinFamilyPayload;
export const FamilyStopRenewalStates = Object.freeze({
  STOPPED: "stopped",
  NOT_STOPPED: "not_stopped",
});
export type FamilyStopRenewalState = ValuesType<typeof FamilyStopRenewalStates>;
export const FamilyStopRenewalPlatforms = Object.freeze({
  IOS_APP_STORE: "ios",
  MAC_STORE: "mac",
  PLAY_STORE: "playstore",
  PAYPAL: "paypal",
  STRIPE: "stripe",
  PROCESSOUT: "processout",
});
export type FamilyStopRenewalPlatform = ValuesType<
  typeof FamilyStopRenewalPlatforms
>;
export type FamilyStopRenewalResult = JoinFamilyBodyData["stopRenewalResult"];
export type JoinFamilySuccess = JoinFamilyBodyData;
export type JoinFamilyError = JoinFamilyBodyError;
export type JoinFamilyResponse = ApiResponse<
  JoinFamilySuccess,
  JoinFamilyError
>;
const endpointConfig = {
  group: ApiEndpointGroups.familyplan,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.App,
  endpoint: "JoinFamily",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function joinFamily(
  storeService: StoreService,
  params: JoinFamilyRequest
): Promise<JoinFamilyResponse> {
  return makeRequest<JoinFamilyRequest, JoinFamilySuccess, JoinFamilyError>(
    storeService,
    { payload: params }
  );
}
