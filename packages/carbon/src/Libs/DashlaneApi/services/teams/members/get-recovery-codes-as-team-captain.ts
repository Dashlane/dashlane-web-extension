import type {
  GetRecoveryCodesAsTeamCaptainBodyData,
  GetRecoveryCodesAsTeamCaptainBodyError,
  GetRecoveryCodesAsTeamCaptainPayload,
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
export type GetRecoveryCodesAsTeamCaptainSuccess =
  GetRecoveryCodesAsTeamCaptainBodyData;
export const GetRecoveryCodesAsTeamCaptainNotAdminErrorCode =
  "not_billing_admin";
export const GetRecoveryCodesAsTeamCaptainInternalErrorCode = "internal_error";
export type GetRecoveryCodesAsTeamCaptainError =
  GetRecoveryCodesAsTeamCaptainBodyError;
export type GetRecoveryCodesAsTeamCaptainResponse = ApiResponse<
  GetRecoveryCodesAsTeamCaptainSuccess,
  GetRecoveryCodesAsTeamCaptainError
>;
const endpointConfig = {
  group: ApiEndpointGroups.teams,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "GetRecoveryCodesAsTeamCaptain",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export type GetRecoveryCodesAsTeamCaptainRequest =
  GetRecoveryCodesAsTeamCaptainPayload;
export function getRecoveryCodesAsTeamCaptain(
  storeService: StoreService,
  login: string,
  params: GetRecoveryCodesAsTeamCaptainRequest
): Promise<GetRecoveryCodesAsTeamCaptainResponse> {
  return makeRequest<
    GetRecoveryCodesAsTeamCaptainRequest,
    GetRecoveryCodesAsTeamCaptainSuccess,
    GetRecoveryCodesAsTeamCaptainError
  >(storeService, { login, payload: params });
}
