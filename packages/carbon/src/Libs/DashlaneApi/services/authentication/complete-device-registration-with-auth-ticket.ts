import type {
  CompleteDeviceRegistrationWithAuthTicketBodyData,
  CompleteDeviceRegistrationWithAuthTicketBodyError,
  CompleteDeviceRegistrationWithAuthTicketPayload,
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
export type CompleteDeviceRegistrationWithAuthTicketRequest =
  CompleteDeviceRegistrationWithAuthTicketPayload;
export type CompleteDeviceRegistrationWithAuthTicketError =
  CompleteDeviceRegistrationWithAuthTicketBodyError;
export type CompleteDeviceRegistrationWithAuthTicketResponse = ApiResponse<
  CompleteDeviceRegistrationWithAuthTicketBodyData,
  CompleteDeviceRegistrationWithAuthTicketError
>;
const endpointConfig = {
  group: ApiEndpointGroups.authentication,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.App,
  endpoint: "CompleteDeviceRegistrationWithAuthTicket",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function completeDeviceRegistrationWithAuthTicket(
  storeService: StoreService,
  params: CompleteDeviceRegistrationWithAuthTicketRequest
): Promise<CompleteDeviceRegistrationWithAuthTicketResponse> {
  return makeRequest<
    CompleteDeviceRegistrationWithAuthTicketRequest,
    CompleteDeviceRegistrationWithAuthTicketBodyData,
    CompleteDeviceRegistrationWithAuthTicketError
  >(storeService, { payload: params });
}
