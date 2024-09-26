import type {
  CreateUserWithSsoBodyData,
  CreateUserWithSsoBodyError,
  CreateUserWithSsoPayload,
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
export type CreateUserWithSSORequest = CreateUserWithSsoPayload;
type CreateUserWithSSOSuccess = CreateUserWithSsoBodyData;
export type CreateUserWithSSOError = CreateUserWithSsoBodyError;
export type CreateUserWithSSOResponse = ApiResponse<
  CreateUserWithSSOSuccess,
  CreateUserWithSSOError
>;
const endpointConfig = {
  authenticationType: ApiAuthType.App,
  endpoint: "CreateUserWithSSO",
  group: ApiEndpointGroups.account,
  method: ApiRequestMethod.POST,
  version: ApiVersion.v1,
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function createUserWithSSO(
  storeService: StoreService,
  params: CreateUserWithSSORequest
): Promise<CreateUserWithSSOResponse> {
  return makeRequest<
    CreateUserWithSSORequest,
    CreateUserWithSSOSuccess,
    CreateUserWithSSOError
  >(storeService, { payload: params });
}
