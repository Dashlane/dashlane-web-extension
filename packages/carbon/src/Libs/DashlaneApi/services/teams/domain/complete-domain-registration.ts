import type {
  CompleteDomainsRegistrationBodyData,
  CompleteDomainsRegistrationBodyError,
  CompleteDomainsRegistrationPayload,
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
export type CompleteDomainRegistrationSuccess =
  CompleteDomainsRegistrationBodyData;
export type CompleteDomainRegistrationError =
  CompleteDomainsRegistrationBodyError;
export type CompleteDomainRegistrationResponse = ApiResponse<
  CompleteDomainRegistrationSuccess,
  CompleteDomainRegistrationError
>;
const endpointConfig = {
  group: ApiEndpointGroups.teams,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "CompleteDomainsRegistration",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function completeDomainRegistration(
  storeService: StoreService,
  login: string
): Promise<CompleteDomainRegistrationResponse> {
  return makeRequest<
    CompleteDomainsRegistrationPayload,
    CompleteDomainRegistrationSuccess,
    CompleteDomainRegistrationError
  >(storeService, { login, payload: {} });
}
export const completeDomainRegistrationErrors: CompleteDomainRegistrationError[] =
  ["NOT_ADMIN"];
