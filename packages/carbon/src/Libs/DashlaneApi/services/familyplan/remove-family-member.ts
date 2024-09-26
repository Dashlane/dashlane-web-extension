import type {
  RemoveFamilyMemberBodyData,
  RemoveFamilyMemberBodyError,
  RemoveFamilyMemberPayload,
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
export type RemoveFamilyMemberRequest = RemoveFamilyMemberPayload;
export type RemoveFamilyMemberSuccess = RemoveFamilyMemberBodyData;
export type RemoveFamilyMemberError = RemoveFamilyMemberBodyError;
export type RemoveFamilyMemberResponse = ApiResponse<
  RemoveFamilyMemberSuccess,
  RemoveFamilyMemberError
>;
const endpointConfig = {
  group: ApiEndpointGroups.familyplan,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "RemoveFamilyMember",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function removeFamilyMember(
  storeService: StoreService,
  login: string,
  params: RemoveFamilyMemberRequest
): Promise<RemoveFamilyMemberResponse> {
  return makeRequest<
    RemoveFamilyMemberRequest,
    RemoveFamilyMemberSuccess,
    RemoveFamilyMemberError
  >(storeService, { login, payload: params });
}
