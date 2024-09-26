import type {
  ResetJoinTokenBodyData,
  ResetJoinTokenBodyError,
  ResetJoinTokenPayload,
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
export type ResetFamilyJoinTokenSuccess = ResetJoinTokenBodyData;
export type ResetFamilyJoinTokenError = ResetJoinTokenBodyError;
export type ResetFamilyJoinTokenResponse = ApiResponse<
  ResetFamilyJoinTokenSuccess,
  ResetFamilyJoinTokenError
>;
const endpointConfig = {
  group: ApiEndpointGroups.familyplan,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "ResetJoinToken",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function resetFamilyJoinToken(
  storeService: StoreService,
  login: string
): Promise<ResetFamilyJoinTokenResponse> {
  return makeRequest<
    ResetJoinTokenPayload,
    ResetFamilyJoinTokenSuccess,
    ResetFamilyJoinTokenError
  >(storeService, { login, payload: {} });
}
