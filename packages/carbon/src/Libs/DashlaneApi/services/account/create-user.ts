import type {
  CreateUserBodyData,
  CreateUserBodyError,
  CreateUserPayload,
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
export type CreateUserRequest = CreateUserPayload;
export type CreateUserSuccess = CreateUserBodyData;
export type CreateUserError = CreateUserBodyError;
export type CreateUserResponse = ApiResponse<CreateUserSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.account,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.App,
  endpoint: "CreateUser",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function createUser(
  storeService: StoreService,
  params: CreateUserRequest
): Promise<CreateUserResponse> {
  return makeRequest<CreateUserRequest, CreateUserSuccess>(storeService, {
    payload: params,
  });
}
