import type {
  UploadDataForMasterPasswordChangeBodyData,
  UploadDataForMasterPasswordChangeBodyError,
  UploadDataForMasterPasswordChangePayload,
} from "@dashlane/server-sdk/v1";
import { StoreService } from "Store";
import {
  ApiAuthType,
  ApiEndpointGroups,
  ApiRequestMethod,
  ApiResponse,
  ApiVersion,
} from "Libs/DashlaneApi/types";
import { prepareApiEndpoint } from "Libs/DashlaneApi/endpoint";
export type UploadDataForMasterPasswordChangeRequest =
  UploadDataForMasterPasswordChangePayload;
export interface TOTPLogin {
  type: "totp_login";
  serverKey: string;
}
export interface SsoVerificationSetting {
  type: "sso";
  ssoServerKey: string;
}
export type UploadDataForMasterPasswordChangeSuccess =
  UploadDataForMasterPasswordChangeBodyData;
export type UploadDataForMasterPasswordChangeError =
  UploadDataForMasterPasswordChangeBodyError;
export type UploadDataForMasterPasswordChangeResponse = ApiResponse<
  UploadDataForMasterPasswordChangeSuccess,
  UploadDataForMasterPasswordChangeError
>;
const endpointConfig = {
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "UploadDataForMasterPasswordChange",
  group: ApiEndpointGroups.sync,
  method: ApiRequestMethod.POST,
  version: ApiVersion.v1,
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function uploadDataForMasterPasswordChange(
  storeService: StoreService,
  login: string,
  params: UploadDataForMasterPasswordChangeRequest
): Promise<UploadDataForMasterPasswordChangeResponse> {
  return makeRequest<
    UploadDataForMasterPasswordChangeRequest,
    UploadDataForMasterPasswordChangeSuccess,
    UploadDataForMasterPasswordChangeError
  >(storeService, { login, payload: params });
}
