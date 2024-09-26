import type {
  GetDataForMasterPasswordChangeBodyData,
  GetDataForMasterPasswordChangeBodyError,
  GetDataForMasterPasswordChangePayload,
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
type GetDataForMasterPasswordChangeRequest =
  GetDataForMasterPasswordChangePayload;
export type GetDataForMasterPasswordChangeError =
  GetDataForMasterPasswordChangeBodyError;
export type GetDataForMasterPasswordOtpStatus =
  GetDataForMasterPasswordChangeSuccess["otpStatus"];
export type GetDataForMasterPasswordChangeSuccess =
  GetDataForMasterPasswordChangeBodyData;
export type GetDataForMasterPasswordChangeResponse = ApiResponse<
  GetDataForMasterPasswordChangeSuccess,
  GetDataForMasterPasswordChangeError
>;
const endpointConfig = {
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "GetDataForMasterPasswordChange",
  group: ApiEndpointGroups.sync,
  method: ApiRequestMethod.POST,
  version: ApiVersion.v1,
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getDataForMasterPasswordChange(
  storeService: StoreService,
  login: string,
  params: GetDataForMasterPasswordChangeRequest
): Promise<GetDataForMasterPasswordChangeResponse> {
  return makeRequest<
    GetDataForMasterPasswordChangeRequest,
    GetDataForMasterPasswordChangeSuccess,
    GetDataForMasterPasswordChangeError
  >(storeService, { login, payload: params });
}
