import { StoreService } from "Store";
import { prepareApiEndpoint } from "Libs/DashlaneApi/endpoint";
import {
  ApiAuthType,
  ApiEndpointGroups,
  ApiRequestMethod,
  ApiResponse,
  ApiVersion,
} from "Libs/DashlaneApi/types";
interface GetAndEvaluateForUserRequest {
  features: string[];
}
export interface GetAndEvaluateForUserSuccess {
  enabledFeatures: string[];
}
export type GetAndEvaluateForUserResponse =
  ApiResponse<GetAndEvaluateForUserSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.features,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "GetAndEvaluateForUser",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export function getFeatureFlip(
  storeService: StoreService,
  login: string,
  featureFlip: string
): Promise<GetAndEvaluateForUserResponse> {
  return makeRequest<
    GetAndEvaluateForUserRequest,
    GetAndEvaluateForUserSuccess
  >(storeService, {
    login,
    payload: { features: [featureFlip] },
  });
}
