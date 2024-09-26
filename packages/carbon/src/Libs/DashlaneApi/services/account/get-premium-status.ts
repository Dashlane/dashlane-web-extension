import {
  GetPremiumStatusBodyData,
  GetPremiumStatusPayload,
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
export type GetPremiumStatusRequestResponse =
  ApiResponse<PremiumStatusResponse>;
export type PremiumStatusResponse = GetPremiumStatusBodyData;
const endpointConfig = {
  group: ApiEndpointGroups.premium,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "GetPremiumStatus",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export function getPremiumStatus(
  storeService: StoreService,
  login: string
): Promise<GetPremiumStatusRequestResponse> {
  return makeRequest<GetPremiumStatusPayload, PremiumStatusResponse>(
    storeService,
    { login, payload: {} }
  );
}
