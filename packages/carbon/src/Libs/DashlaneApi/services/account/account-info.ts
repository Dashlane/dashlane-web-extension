import type {
  AccountInfoBodyData,
  AccountInfoPayload,
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
export type AccountInfoRequest = AccountInfoPayload;
export type AccountInfoSuccess = AccountInfoBodyData;
export type AccountInfoResponse = ApiResponse<AccountInfoSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.account,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "AccountInfo",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function accountInfo(
  storeService: StoreService,
  login: string
): Promise<AccountInfoResponse> {
  return makeRequest<AccountInfoRequest, AccountInfoSuccess>(storeService, {
    login,
    payload: {},
  });
}
