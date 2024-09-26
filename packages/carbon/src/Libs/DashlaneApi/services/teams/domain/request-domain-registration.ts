import type {
  RequestDomainRegistrationBodyData,
  RequestDomainRegistrationBodyError,
  RequestDomainRegistrationPayload,
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
export type RequestDomainRegistrationSuccess =
  RequestDomainRegistrationBodyData;
export type RequestDomainRegistrationError = RequestDomainRegistrationBodyError;
export const requestDomainRegistrationErrors: RequestDomainRegistrationError[] =
  [
    "TEAM_DOES_NOT_EXIST",
    "DOMAIN_ALREADY_EXISTS",
    "NOT_ADMIN",
    "INVALID_PUBLIC_DOMAIN",
    "DOMAIN_NOT_VALID_FOR_TEAM",
    "DOMAIN_CANNOT_CONTAIN_UPPERCASE_LETTERS",
  ];
export type RequestDomainRegistrationResponse = ApiResponse<
  RequestDomainRegistrationSuccess,
  RequestDomainRegistrationError
>;
const endpointConfig = {
  group: ApiEndpointGroups.teams,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "RequestDomainRegistration",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export function requestDomainRegistration(
  storeService: StoreService,
  login: string,
  params: RequestDomainRegistrationPayload
): Promise<RequestDomainRegistrationResponse> {
  return makeRequest<
    RequestDomainRegistrationPayload,
    RequestDomainRegistrationSuccess,
    RequestDomainRegistrationError
  >(storeService, { login, payload: params });
}
