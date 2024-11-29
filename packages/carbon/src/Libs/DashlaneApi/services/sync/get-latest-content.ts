import type {
  GetLatestContentBodyData,
  GetLatestContentBodyError,
  GetLatestContentPayload,
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
export type GetLatestContentRequest = GetLatestContentPayload;
export type GetLatestContentError = GetLatestContentBodyError;
export interface SharingKeys {
  publicKey: string;
  privateKey: string;
}
export type GetLatestContentSuccess = GetLatestContentBodyData;
export type GetLatestContentResponse = ApiResponse<
  GetLatestContentSuccess,
  GetLatestContentError
>;
const endpointConfig = {
  group: ApiEndpointGroups.sync,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint: "GetLatestContent",
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export async function getLatestContent(
  storeService: StoreService,
  login: string,
  params: GetLatestContentRequest
): Promise<GetLatestContentResponse> {
  return makeRequest<
    GetLatestContentRequest,
    GetLatestContentSuccess,
    GetLatestContentError
  >(storeService, { login, payload: params });
}
