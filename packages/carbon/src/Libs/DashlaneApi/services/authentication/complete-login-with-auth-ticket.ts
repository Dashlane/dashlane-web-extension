import type {
  CompleteLoginWithAuthTicketBodyData,
  CompleteLoginWithAuthTicketBodyError,
  CompleteLoginWithAuthTicketPayload,
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
export type CompleteLoginWithAuthTicketRequest =
  CompleteLoginWithAuthTicketPayload;
export type CompleteLoginWithAuthTicketSuccess =
  CompleteLoginWithAuthTicketBodyData;
export type CompleteLoginWithAuthTicketError =
  CompleteLoginWithAuthTicketBodyError;
export type CompleteLoginWithAuthTicketResponse = ApiResponse<
  CompleteLoginWithAuthTicketSuccess,
  CompleteLoginWithAuthTicketError
>;
const endpointConfig = {
  authenticationType: ApiAuthType.App,
  endpoint: "CompleteLoginWithAuthTicket",
  group: ApiEndpointGroups.authentication,
  method: ApiRequestMethod.POST,
  version: ApiVersion.v1,
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function completeLoginWithAuthTicket(
  storeService: StoreService,
  params: CompleteLoginWithAuthTicketRequest
): Promise<CompleteLoginWithAuthTicketResponse> {
  return makeRequest<
    CompleteLoginWithAuthTicketRequest,
    CompleteLoginWithAuthTicketSuccess,
    CompleteLoginWithAuthTicketError
  >(storeService, { payload: params });
}
