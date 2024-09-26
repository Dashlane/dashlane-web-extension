import type { GetSubscriptionInfoBodyData } from "@dashlane/server-sdk/v1";
import { StoreService } from "Store";
import { prepareApiEndpoint } from "Libs/DashlaneApi/endpoint";
import {
  ApiAuthType,
  ApiEndpointGroups,
  ApiRequestMethod,
  ApiResponse,
  ApiVersion,
} from "Libs/DashlaneApi/types";
export type GetSubscriptionInformationRequestResponse =
  ApiResponse<GetSubscriptionInfoBodyData>;
const endpointConfig = {
  group: ApiEndpointGroups.premium,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "GetSubscriptionInfo",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export function getSubscriptionInformation(
  storeService: StoreService,
  login: string
): Promise<GetSubscriptionInformationRequestResponse> {
  return makeRequest<Record<string, never>, GetSubscriptionInfoBodyData>(
    storeService,
    { login, payload: {} }
  );
}
