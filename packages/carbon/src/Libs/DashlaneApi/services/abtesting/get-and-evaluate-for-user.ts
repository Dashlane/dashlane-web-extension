import { ApiResponse } from "Libs/DashlaneApi";
import {
  ApiAuthType,
  ApiEndpointGroups,
  ApiRequestMethod,
  ApiVersion,
} from "Libs/DashlaneApi/types";
import { prepareApiEndpoint } from "Libs/DashlaneApi/endpoint";
import { StoreService } from "Store";
import { ABTest } from "Libs/DashlaneApi/services/abtesting/types";
interface GetAndEvaluateForUserRequest {
  abtests: string[];
}
export interface GetAndEvaluateForUserSuccess {
  abtests: ABTest[];
}
export type GetAndEvaluateForUserResponse =
  ApiResponse<GetAndEvaluateForUserSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.abtesting,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "GetAndEvaluateForUser",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getAndEvaluateForUser(
  storeService: StoreService,
  login: string,
  params: GetAndEvaluateForUserRequest
): Promise<GetAndEvaluateForUserResponse> {
  return makeRequest<
    GetAndEvaluateForUserRequest,
    GetAndEvaluateForUserSuccess
  >(storeService, { login, payload: params });
}
