import type {
  CompleteRememberMeOpenSessionBodyData,
  CompleteRememberMeOpenSessionBodyError,
  CompleteRememberMeOpenSessionPayload,
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
export type CompleteRememberMeOpenSessionRequest =
  CompleteRememberMeOpenSessionPayload;
export type CompleteRememberMeOpenSessionError =
  CompleteRememberMeOpenSessionBodyError;
export type CompleteRememberMeOpenSessionSuccess =
  CompleteRememberMeOpenSessionBodyData;
export type CompleteRememberMeOpenSessionResponse = ApiResponse<
  CompleteRememberMeOpenSessionSuccess,
  CompleteRememberMeOpenSessionError
>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.Session,
  endpoint: "CompleteRememberMeOpenSession",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function completeRememberMeOpenSession(
  storeService: StoreService,
  login: string,
  params: CompleteRememberMeOpenSessionRequest
): Promise<CompleteRememberMeOpenSessionResponse> {
  return makeRequest<
    CompleteRememberMeOpenSessionRequest,
    CompleteRememberMeOpenSessionSuccess,
    CompleteRememberMeOpenSessionError
  >(storeService, { login, payload: params });
}
