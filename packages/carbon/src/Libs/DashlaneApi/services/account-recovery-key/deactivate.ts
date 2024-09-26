import type {
  DeactivateBodyData,
  DeactivatePayload,
} from "@dashlane/server-sdk/v1";
import { StoreService } from "Store";
import { ApiResponse } from "Libs/DashlaneApi";
import {
  ApiAuthType,
  ApiEndpointGroups,
  ApiRequestMethod,
  ApiVersion,
} from "Libs/DashlaneApi/types";
import { prepareApiEndpoint } from "Libs/DashlaneApi/endpoint";
type DeactivateAccountRecoveryKeyRequest = DeactivatePayload;
export type DeactivateAccountRecoveryKeyResponse =
  ApiResponse<DeactivateBodyData>;
const endpointConfig = {
  group: ApiEndpointGroups.accountRecovery,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "Deactivate",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export function deactivateAccountRecoveryKey(
  storeService: StoreService,
  login: string,
  params: DeactivateAccountRecoveryKeyRequest
): Promise<DeactivateAccountRecoveryKeyResponse> {
  return makeRequest<DeactivateAccountRecoveryKeyRequest, DeactivateBodyData>(
    storeService,
    { login, payload: params }
  );
}
