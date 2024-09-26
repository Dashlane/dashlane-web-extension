import { PlatformInfo } from "@dashlane/communication";
import { StoreService } from "Store";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { assertUnreachable } from "Helpers/assert-unreachable";
import { getPlatformInfo } from "Application/platform-info";
import {
  get as httpGet,
  post as httpPost,
  HttpRequestConfig,
  HttpResponse,
} from "Libs/Http";
import { dashlaneServerDeltaTimestampSelector } from "Authentication/selectors";
import {
  ApiAuthType,
  ApiError,
  ApiRequestMethod,
  ApiRequestParams,
  ApiResponse,
  ApiSuccess,
  AuthParams,
  MakeApiRequest,
  MethodParams,
} from "Libs/DashlaneApi/types";
import { signRequest } from "Libs/DashlaneApi/signature";
import {
  ApiCredentials,
  getApiCredentials,
} from "Libs/DashlaneApi/credentials";
import { config } from "config-service";
import { getHeaders } from "Libs/Http/cloudflare-headers";
import { HttpRequestResponseTypes } from "Libs/Http/types";
export function getMakeApiRequest<
  AuthType extends ApiAuthType,
  Method extends ApiRequestMethod
>(
  pathname: string,
  authenticationType: AuthType,
  method: Method,
  responseType: HttpRequestResponseTypes,
  accept?: string
): MakeApiRequest<Method, AuthType> {
  const makeApiRequest = async <
    Payload extends {},
    Success extends {},
    Err extends string
  >(
    storeService: StoreService,
    params?: ApiRequestParams<AuthType, Method, Payload>
  ): Promise<ApiResponse<Success, Err>> => {
    const defaults = {
      login: "",
      teamUuid: "",
      payload: {} as Payload,
      ...(params || {}),
    };
    const methodParams = getMethodParams<Payload>(method, defaults.payload);
    const authParams = getAuthParams(authenticationType, {
      login: defaults.login,
      teamUuid: defaults.teamUuid,
    });
    const credentials = getApiCredentials(storeService.getState(), authParams);
    const headers = {
      Accept: accept ?? "application/json",
      "Content-Type": "application/json; charset=UTF-8",
      "dashlane-client-agent": getApiClientAgentHeader(getPlatformInfo()),
    };
    const signedHeaders = {
      ...headers,
      Host: new URL(config.DASHLANE_API_HOST_WITH_SCHEME).hostname,
    };
    const authorizationHeader = await getAuthorizationHeader(
      storeService,
      pathname,
      credentials,
      signedHeaders,
      methodParams
    );
    const headersWithAuth = {
      ...headers,
      ...authorizationHeader,
      ...getHeaders(),
    };
    const endpointUrl = `${config.DASHLANE_API_HOST_WITH_SCHEME}${pathname}`;
    const { data } = await send<Payload, Success, Err>(
      methodParams,
      endpointUrl,
      headersWithAuth,
      responseType
    );
    return makeApiResponse(data);
  };
  return makeApiRequest as MakeApiRequest<Method, AuthType>;
}
export interface ApiRawResponse<T, E extends string> {
  requestId: string;
  errors?: ApiError<E>[];
  data: T;
}
interface GetAuthParams {
  login: string | null;
  teamUuid: string | null;
}
export function getAuthParams(
  authenticationType: ApiAuthType,
  { login, teamUuid }: GetAuthParams
): AuthParams {
  switch (authenticationType) {
    case ApiAuthType.App:
    case ApiAuthType.None:
      return { authenticationType };
    case ApiAuthType.UserDevice:
    case ApiAuthType.Session:
      return { authenticationType, login };
    case ApiAuthType.TeamDevice:
      return { authenticationType, teamUuid };
    default:
      assertUnreachable(authenticationType);
  }
}
export function getMethodParams<Payload extends {}>(
  method: ApiRequestMethod,
  payload: Payload
): MethodParams<Payload> {
  switch (method) {
    case ApiRequestMethod.GET:
      return { method };
    case ApiRequestMethod.POST:
      return { method, payload };
    default:
      assertUnreachable(method);
  }
}
export function makeApiResponse<Success extends {}, Err extends string>(
  response: ApiRawResponse<Success, Err>
) {
  const error = makeApiError(response);
  if (error) {
    return error;
  }
  return makeApiSuccess(response);
}
function makeApiSuccess<S extends {}, Err extends string>(
  response: ApiRawResponse<S, Err>
): ApiSuccess<S> {
  return {
    code: "success",
    data: !response.data ? response : null,
    ...response.data,
  };
}
function makeApiError<S extends {}, Err extends string>({
  errors,
}: ApiRawResponse<S, Err>): ApiError<Err> | null {
  if (Array.isArray(errors) && errors.length > 0) {
    return errors[0];
  }
  return null;
}
function getRawBody<Payload extends {}>(params: MethodParams<Payload>): string {
  switch (params.method) {
    case ApiRequestMethod.GET:
      return "";
    case ApiRequestMethod.POST:
      return JSON.stringify(params.payload);
    default:
      assertUnreachable(params);
  }
}
async function getAuthorizationHeader<Payload extends {}>(
  storeService: StoreService,
  pathname: string,
  credentials: ApiCredentials,
  headers: {
    [name: string]: string;
  },
  methodParams: MethodParams<Payload>
): Promise<{
  Authorization?: string;
}> {
  if (credentials.type === ApiAuthType.None) {
    return {};
  }
  const serverDeltaTimestamp =
    dashlaneServerDeltaTimestampSelector(storeService.getState()) || 0;
  const timestamp = Math.round(getUnixTimestamp() - serverDeltaTimestamp);
  const rawBody = getRawBody(methodParams);
  const { method } = methodParams;
  const request = {
    pathname,
    method,
    rawBody,
    headers,
  };
  const authorizationHeader = await signRequest({
    request,
    timestamp,
    credentials,
  });
  return {
    Authorization: authorizationHeader,
  };
}
export const validateStatus = (status: number) => {
  return status >= 100 && status <= 500;
};
function send<
  Payload extends Record<string, any>,
  Success extends {},
  Err extends string
>(
  methodParams: MethodParams<Payload>,
  endpointUrl: string,
  headers: HeadersInit,
  responseType: HttpRequestResponseTypes
): Promise<HttpResponse<ApiRawResponse<Success, Err>>> {
  const httpConfig: HttpRequestConfig = {
    headers,
    validateStatus,
    responseType,
  };
  switch (methodParams.method) {
    case ApiRequestMethod.GET:
      return httpGet(endpointUrl, httpConfig);
    case ApiRequestMethod.POST:
      return httpPost(endpointUrl, methodParams.payload, httpConfig);
    default:
      assertUnreachable(methodParams);
  }
}
export function getApiClientAgentHeader(platformInfo: PlatformInfo): string {
  return JSON.stringify({
    platform: platformInfo.platformName || "unknown",
    version: platformInfo.appVersion || "unknown",
    osversion: platformInfo.osVersion || "unknown",
    language: platformInfo.lang || "unknown",
  });
}
