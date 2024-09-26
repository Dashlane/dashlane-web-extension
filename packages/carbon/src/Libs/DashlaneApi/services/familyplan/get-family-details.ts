import type {
  GetFamilyDetailsBodyData,
  GetFamilyDetailsBodyError,
  GetFamilyDetailsPayload,
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
export type GetFamilyDetailsSuccess = GetFamilyDetailsBodyData;
export type GetFamilyDetailsError = GetFamilyDetailsBodyError;
export type GetFamilyDetailsResponse = ApiResponse<
  GetFamilyDetailsSuccess,
  GetFamilyDetailsError
>;
const endpointConfig = {
  group: ApiEndpointGroups.familyplan,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "GetFamilyDetails",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getFamilyDetails(
  storeService: StoreService,
  login: string
): Promise<GetFamilyDetailsResponse> {
  return makeRequest<
    GetFamilyDetailsPayload,
    GetFamilyDetailsSuccess,
    GetFamilyDetailsError
  >(storeService, { login, payload: {} });
}
