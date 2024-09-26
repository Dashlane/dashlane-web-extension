import type {
  CompleteRememberMeRegistrationBodyData,
  CompleteRememberMeRegistrationBodyError,
  CompleteRememberMeRegistrationPayload,
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
export type CompleteWebauthnRegistrationRequest =
  CompleteRememberMeRegistrationPayload;
export type CompleteRememberMeRegistrationError =
  CompleteRememberMeRegistrationBodyError;
export type CompleteRememberMeRegistrationSuccess =
  CompleteRememberMeRegistrationBodyData;
export type CompleteRememberMeRegistrationResponse = ApiResponse<
  CompleteRememberMeRegistrationSuccess,
  CompleteRememberMeRegistrationError
>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "CompleteRememberMeRegistration",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function completeRememberMeRegistration(
  storeService: StoreService,
  login: string,
  params: CompleteWebauthnRegistrationRequest
): Promise<CompleteRememberMeRegistrationResponse> {
  return makeRequest<
    CompleteWebauthnRegistrationRequest,
    CompleteRememberMeRegistrationSuccess,
    CompleteRememberMeRegistrationError
  >(storeService, { login, payload: params });
}
