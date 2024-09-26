import type {
  LeaveFamilyBodyData,
  LeaveFamilyBodyError,
  LeaveFamilyPayload,
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
export type LeaveFamilySuccess = LeaveFamilyBodyData;
export type LeaveFamilyError = LeaveFamilyBodyError;
export type LeaveFamilyResponse = ApiResponse<
  LeaveFamilySuccess,
  LeaveFamilyError
>;
const endpointConfig = {
  group: ApiEndpointGroups.familyplan,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "LeaveFamily",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function leaveFamily(
  storeService: StoreService,
  login: string
): Promise<LeaveFamilyResponse> {
  return makeRequest<LeaveFamilyPayload, LeaveFamilySuccess, LeaveFamilyError>(
    storeService,
    { login, payload: {} }
  );
}
