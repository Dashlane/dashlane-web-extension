import type { RequestPairingPayload } from "@dashlane/server-sdk/v1";
import { StoreService } from "Store";
import { prepareApiEndpoint } from "Libs/DashlaneApi/endpoint";
import {
  ApiAuthType,
  ApiEndpointGroups,
  ApiRequestMethod,
  ApiResponse,
  ApiVersion,
} from "Libs/DashlaneApi/types";
export type RequestPairingSuccess = RequestPairingPayload;
export type RequestPairingResponse = ApiResponse<RequestPairingSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.pairing,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "RequestPairing",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function requestPairing(
  storeService: StoreService,
  login: string
): Promise<RequestPairingResponse> {
  return makeRequest<RequestPairingPayload, RequestPairingSuccess>(
    storeService,
    {
      login,
      payload: {},
    }
  );
}
