import type {
  GetFileMetaV2BodyData,
  GetFileMetaV2Payload,
} from "@dashlane/server-sdk/v1";
import { StoreService } from "Store";
import { ApiResponse, ApiSuccess } from "Libs/DashlaneApi";
import { prepareApiEndpoint } from "Libs/DashlaneApi/endpoint";
import {
  ApiAuthType,
  ApiEndpointGroups,
  ApiRequestMethod,
  ApiVersion,
} from "Libs/DashlaneApi/types";
export const endpoint: Readonly<string> = "GetFileMetaV2" as const;
export type GetFilesMetaRequest = GetFileMetaV2Payload;
export type GetFilesMetaSuccess = GetFileMetaV2BodyData;
export type GetFilesMetaResponse = ApiResponse<GetFilesMetaSuccess>;
const endpointConfig = {
  group: ApiEndpointGroups.file,
  version: ApiVersion.v1,
  method: ApiRequestMethod.POST,
  authenticationType: ApiAuthType.UserDevice,
  endpoint,
};
const makeRequest = prepareApiEndpoint(endpointConfig);
export const getFilesMeta = (
  storeService: StoreService,
  login: string,
  params: GetFilesMetaRequest
): Promise<GetFilesMetaResponse> => {
  return makeRequest<GetFilesMetaRequest, GetFilesMetaSuccess>(storeService, {
    login,
    payload: params,
  });
};
export const isGetFilesMetaSuccess = (
  x: GetFilesMetaResponse
): x is ApiSuccess<GetFilesMetaSuccess> => x.code === "success";
