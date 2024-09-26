import type {
  LastAdSyncDateBodyData,
  LastAdSyncDateBodyError,
  LastAdSyncDatePayload,
} from "@dashlane/server-sdk/v1";
import { StoreService } from "Store";
import { ApiResponse } from "Libs/DashlaneApi";
import { prepareApiEndpoint } from "Libs/DashlaneApi/endpoint";
import {
  ApiAuthType,
  ApiEndpointGroups,
  ApiRequestMethod,
  ApiVersion,
} from "Libs/DashlaneApi/types";
export type LastADSyncDateSuccess = LastAdSyncDateBodyData;
export type LastADSyncDateError = LastAdSyncDateBodyError;
export const lastADSyncDateErrors: LastADSyncDateError[] = [
  "NOT_ADMIN",
  "INSUFFICIENT_TIER",
];
export type LastADSyncDateResponse = ApiResponse<
  LastADSyncDateSuccess,
  LastADSyncDateError
>;
const endpointConfig = {
  group: ApiEndpointGroups.teams,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "LastADSyncDate",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export function lastADSyncDate(
  storeService: StoreService,
  login: string
): Promise<LastADSyncDateResponse> {
  return makeRequest<
    LastAdSyncDatePayload,
    LastADSyncDateSuccess,
    LastADSyncDateError
  >(storeService, { login, payload: {} });
}
