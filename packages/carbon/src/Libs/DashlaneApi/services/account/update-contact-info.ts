import {
  UpdateContactInfoBodyData,
  UpdateContactInfoBodyError,
  UpdateContactInfoPayload,
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
export type UpdateContactInfoRequest = UpdateContactInfoPayload;
export type UpdateContactInfoError = UpdateContactInfoBodyError;
export type UpdateContactInfoResponse = ApiResponse<
  UpdateContactInfoBodyData,
  UpdateContactInfoError
>;
const endpointConfig = {
  group: ApiEndpointGroups.account,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "UpdateContactInfo",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function updateContactInfo(
  storeService: StoreService,
  login: string,
  params: UpdateContactInfoRequest
): Promise<UpdateContactInfoResponse> {
  return makeRequest<
    UpdateContactInfoRequest,
    UpdateContactInfoBodyData,
    UpdateContactInfoError
  >(storeService, {
    login,
    payload: params,
  });
}
