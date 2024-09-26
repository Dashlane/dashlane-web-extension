import {
  ApiAuthType,
  ApiEndpointGroups,
  ApiRequestMethod,
  ApiVersion,
  MakeApiRequest,
} from "Libs/DashlaneApi/types";
import { getMakeApiRequest } from "Libs/DashlaneApi/request";
import { HttpRequestResponseTypes } from "Libs/Http/types";
export interface EndpointConfig<
  Method extends ApiRequestMethod,
  AuthType extends ApiAuthType
> {
  group: ApiEndpointGroups;
  version: ApiVersion;
  method: Method;
  authenticationType: AuthType;
  endpoint: string;
  accept?: string;
  responseType?: HttpRequestResponseTypes;
}
export function prepareApiEndpoint<
  Method extends ApiRequestMethod,
  AuthType extends ApiAuthType
>(
  endpointConfig: EndpointConfig<Method, AuthType>
): MakeApiRequest<Method, AuthType> {
  const {
    authenticationType,
    endpoint,
    group,
    method,
    version,
    accept,
    responseType,
  } = endpointConfig;
  const pathname = `/${ApiVersion[version]}` + `/${group}` + `/${endpoint}`;
  const makeApiRequest = getMakeApiRequest(
    pathname,
    authenticationType,
    method,
    responseType ?? "json",
    accept
  );
  return makeApiRequest;
}
