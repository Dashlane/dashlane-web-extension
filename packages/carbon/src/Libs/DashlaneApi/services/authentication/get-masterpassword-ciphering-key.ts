import type {
  GetMasterPasswordCipheringKeyBodyData,
  GetMasterPasswordCipheringKeyBodyError,
  GetMasterPasswordCipheringKeyPayload,
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
export type GetMasterPasswordCipheringKeyRequest =
  GetMasterPasswordCipheringKeyPayload;
export type GetMasterPasswordCipheringKeyError =
  GetMasterPasswordCipheringKeyBodyError;
export type GetMasterPasswordCipheringKeySuccess =
  GetMasterPasswordCipheringKeyBodyData;
export type GetMasterPasswordCipheringKeyResponse = ApiResponse<
  GetMasterPasswordCipheringKeySuccess,
  GetMasterPasswordCipheringKeyError
>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.Session,
  endpoint: "GetMasterPasswordCipheringKey",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getMasterPasswordCipheringKey(
  storeService: StoreService,
  login: string
): Promise<GetMasterPasswordCipheringKeyResponse> {
  return makeRequest<
    GetMasterPasswordCipheringKeyRequest,
    GetMasterPasswordCipheringKeySuccess,
    GetMasterPasswordCipheringKeyError
  >(storeService, { login, payload: {} });
}
