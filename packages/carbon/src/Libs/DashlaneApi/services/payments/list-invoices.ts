import type {
  ListInvoicesBodyData,
  ListInvoicesPayload,
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
export type ListInvoicesSuccess = ListInvoicesBodyData;
export type ListInvoicesResponse = ApiResponse<ListInvoicesSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.payments,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "ListInvoices",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function listInvoices(
  storeService: StoreService,
  login: string
): Promise<ListInvoicesResponse> {
  return makeRequest<ListInvoicesPayload, ListInvoicesSuccess>(storeService, {
    login,
    payload: {},
  });
}
