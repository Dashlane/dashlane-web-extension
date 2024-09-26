import type {
  RequestAccountCreationBodyData,
  RequestAccountCreationPayload,
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
export type RequestAccountCreationRequest = RequestAccountCreationPayload;
export enum AccountExistsStatus {
  AccountExists = "yes",
  AccountDoesntExist = "no",
  AccountDoesntExistInvalid = "no_invalid",
  AccountDoesntExistUnlikely = "no_unlikely",
}
export type RequestAccountCreationSuccess = RequestAccountCreationBodyData;
export type RequestAccountCreationResponse =
  ApiResponse<RequestAccountCreationSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.account,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.App,
  endpoint: "RequestAccountCreation",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export function requestAccountCreation(
  storeService: StoreService,
  params: RequestAccountCreationRequest
): Promise<RequestAccountCreationResponse> {
  return makeRequest<
    RequestAccountCreationRequest,
    RequestAccountCreationSuccess
  >(storeService, { payload: params });
}
