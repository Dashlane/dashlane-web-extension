import type {
  ComputePlanPricingBodyData,
  ComputePlanPricingBodyError,
  ComputePlanPricingPayload,
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
export type ComputePlanPricingResponse = ApiResponse<
  ComputePlanPricingBodyData,
  ComputePlanPricingBodyError
>;
const endpointConfig = {
  group: ApiEndpointGroups.teams,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "ComputePlanPricing",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function computePlanPricingRequest(
  storeService: StoreService,
  login: string,
  seats: number
): Promise<ComputePlanPricingResponse> {
  const payload = { seats };
  return await makeRequest<
    ComputePlanPricingPayload,
    ComputePlanPricingBodyData,
    ComputePlanPricingBodyError
  >(storeService, { login, payload });
}
