import type {
  GrantFullRefundAndCancelSubscriptionBodyData,
  GrantFullRefundAndCancelSubscriptionBodyError,
  GrantFullRefundAndCancelSubscriptionPayload,
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
export type GrantFullRefundAndCancelSubscriptionRequest =
  GrantFullRefundAndCancelSubscriptionPayload;
export type GrantFullRefundAndCancelSubscriptionSuccess =
  GrantFullRefundAndCancelSubscriptionBodyData;
export type GrantFullRefundAndCancelSubscriptionError =
  GrantFullRefundAndCancelSubscriptionBodyError;
export type GrantFullRefundAndCancelSubscriptionResponse = ApiResponse<
  GrantFullRefundAndCancelSubscriptionSuccess,
  GrantFullRefundAndCancelSubscriptionError
>;
const endpointConfig = {
  group: ApiEndpointGroups.payments,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "GrantFullRefundAndCancelSubscription",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function grantFullRefundAndCancelSubscription(
  storeService: StoreService,
  login: string,
  payload: GrantFullRefundAndCancelSubscriptionRequest
): Promise<GrantFullRefundAndCancelSubscriptionResponse> {
  return makeRequest<
    GrantFullRefundAndCancelSubscriptionRequest,
    GrantFullRefundAndCancelSubscriptionSuccess,
    GrantFullRefundAndCancelSubscriptionError
  >(storeService, { login, payload });
}
