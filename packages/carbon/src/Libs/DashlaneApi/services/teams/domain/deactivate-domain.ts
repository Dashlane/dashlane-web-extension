import type {
  DeactivateDomainBodyData,
  DeactivateDomainBodyError,
  DeactivateDomainPayload,
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
export type DeactivateDomainSuccess = DeactivateDomainBodyData;
export type DeactivateDomainError = DeactivateDomainBodyError;
export const deactivateDomainErrors: DeactivateDomainError[] = [
  "NOT_ADMIN",
  "DOMAIN_NOT_FOUND",
  "DOMAIN_NOT_VALID_FOR_TEAM",
  "DOMAIN_CANNOT_BE_DEACTIVATED",
  "DOMAIN_DELETION_FAILED",
];
export type DeactiveDomainResponse = ApiResponse<
  DeactivateDomainSuccess,
  DeactivateDomainError
>;
const endpointConfig = {
  group: ApiEndpointGroups.teams,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "DeactivateDomain",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export type DeactivateDomainRequest = DeactivateDomainPayload;
export async function deactivateDomain(
  storeService: StoreService,
  login: string,
  params: DeactivateDomainRequest
): Promise<DeactiveDomainResponse> {
  return makeRequest<
    DeactivateDomainRequest,
    DeactivateDomainSuccess,
    DeactivateDomainError
  >(storeService, { login, payload: params });
}
