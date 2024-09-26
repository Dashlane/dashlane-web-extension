import type {
  UploadDataForCryptoUpdateBodyData,
  UploadDataForCryptoUpdateBodyError,
  UploadDataForCryptoUpdatePayload,
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
export type UploadDataForCryptoChangeRequest = UploadDataForCryptoUpdatePayload;
export type UploadDataForCryptoChangeSuccess =
  UploadDataForCryptoUpdateBodyData;
export type UploadDataForCryptoChangeError = UploadDataForCryptoUpdateBodyError;
export type UploadDataForCryptoChangeResponse = ApiResponse<
  UploadDataForCryptoChangeSuccess,
  UploadDataForCryptoChangeError
>;
const endpointConfig = {
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "UploadDataForCryptoUpdate",
  group: ApiEndpointGroups.sync,
  method: ApiRequestMethod.POST,
  version: ApiVersion.v1,
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function uploadDataForCryptoChange(
  storeService: StoreService,
  login: string,
  params: UploadDataForCryptoChangeRequest
): Promise<UploadDataForCryptoChangeResponse> {
  return await makeRequest<
    UploadDataForCryptoChangeRequest,
    UploadDataForCryptoChangeSuccess,
    UploadDataForCryptoChangeError
  >(storeService, { login, payload: params });
}
