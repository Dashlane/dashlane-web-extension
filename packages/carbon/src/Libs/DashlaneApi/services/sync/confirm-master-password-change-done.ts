import type {
  ConfirmMasterPasswordChangeDoneBodyData,
  ConfirmMasterPasswordChangeDoneBodyError,
  ConfirmMasterPasswordChangeDonePayload,
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
export type ConfirmMasterPasswordChangeDoneRequest =
  ConfirmMasterPasswordChangeDonePayload;
export type ConfirmMasterPasswordChangeDoneSuccess =
  ConfirmMasterPasswordChangeDoneBodyData;
export type ConfirmMasterPasswordChangeDoneError =
  ConfirmMasterPasswordChangeDoneBodyError;
export type ConfirmMasterPasswordChangeDoneResponse = ApiResponse<
  ConfirmMasterPasswordChangeDoneSuccess,
  ConfirmMasterPasswordChangeDoneError
>;
const endpointConfig = {
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "ConfirmMasterPasswordChangeDone",
  group: ApiEndpointGroups.sync,
  method: ApiRequestMethod.POST,
  version: ApiVersion.v1,
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function confirmMasterPasswordChangeDone(
  storeService: StoreService,
  login: string,
  params: ConfirmMasterPasswordChangeDoneRequest
): Promise<ConfirmMasterPasswordChangeDoneResponse> {
  return makeRequest<
    ConfirmMasterPasswordChangeDoneRequest,
    ConfirmMasterPasswordChangeDoneSuccess,
    ConfirmMasterPasswordChangeDoneError
  >(storeService, { login, payload: params });
}
