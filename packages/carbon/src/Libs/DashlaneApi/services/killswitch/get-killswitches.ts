import type {
  GetKillSwitchesBodyData,
  GetKillSwitchesPayload,
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
export type GetKillSwitchesRequest = GetKillSwitchesPayload;
export type GetKillSwitchesSuccess = GetKillSwitchesBodyData;
export type GetKillSwitchesResponse = ApiResponse<GetKillSwitchesSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.killswitch,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.App,
  endpoint: "GetKillSwitches",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getKillSwitches(
  storeService: StoreService,
  requestedKillswitches: GetKillSwitchesPayload["requestedKillswitches"]
) {
  return makeRequest<GetKillSwitchesRequest, GetKillSwitchesSuccess>(
    storeService,
    { payload: { requestedKillswitches } }
  );
}
