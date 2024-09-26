import type {
  ListDomainsBodyData,
  ListDomainsBodyError,
  ListDomainsPayload,
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
export type ListDomainsSuccess = ListDomainsBodyData;
export type ListDomainsError = ListDomainsBodyError;
export const listDomainErrors: ListDomainsError[] = ["NOT_ADMIN"];
export type ListDomainsResponse = ApiResponse<
  ListDomainsSuccess,
  ListDomainsError
>;
const endpointConfig = {
  group: ApiEndpointGroups.teams,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "ListDomains",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function listDomains(
  storeService: StoreService,
  login: string
): Promise<ListDomainsResponse> {
  return makeRequest<ListDomainsPayload, ListDomainsSuccess, ListDomainsError>(
    storeService,
    { login, payload: {} }
  );
}
