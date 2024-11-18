import { dashlaneServerDeltaTimestampSelector, platformInfoSelector, } from "Authentication/selectors";
import { getAuthParams, getMethodParams, validateStatus, } from "Libs/DashlaneApi/request";
import { ApiAuthType, ApiRequestMethod, ApiRequestParams, MethodParams, } from "Libs/DashlaneApi/types";
import { StoreService } from "Store";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { config } from "config-service";
import { get as httpGet, post as httpPost, HttpRequestConfig, HttpResponse, } from "Libs/Http";
import { assertUnreachable } from "Helpers/assert-unreachable";
import { getStyxApiCredentials } from "./credentials";
import { *** } from "UserManagement/is-internal-test-user";
import { StyxApiResponse } from "./response";
import type { AnonymousBaseEvent, UserBaseEvent } from "@dashlane/hermes";
import { signRequest } from "Libs/DashlaneApi/signature";
import { ApiCredentials } from "Libs/DashlaneApi/credentials";
import { ApplicationBuildType, PlatformInfo } from "@dashlane/communication";
function userDetails() { }
function sendJSONLines(methodParams: MethodParams<string>, endpointUrl: string, headers: HeadersInit): Promise<HttpResponse<StyxApiResponse>> {
    const httpConfig: HttpRequestConfig = {
        headers,
        validateStatus,
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
export function getEventsPayload(events: Array<UserBaseEvent | AnonymousBaseEvent>) {
    return events.map((obj) => JSON.stringify(obj)).join("\n");
}
async function getAuthorizationHeader(storeService: StoreService, pathname: string, credentials: ApiCredentials, headers: {
    [name: string]: string;
}, headersToSign: string[], payload: string): Promise<{
    Authorization?: string;
}> {
    if (credentials.type === ApiAuthType.None) {
        return {};
    }
    const serverDeltaTimestamp = dashlaneServerDeltaTimestampSelector(storeService.getState()) || 0;
    const timestamp = Math.round(getUnixTimestamp() - serverDeltaTimestamp);
    const rawBody = payload;
    const method = "POST" as const;
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
        headersToSign,
    });
    return {
        Authorization: authorizationHeader,
    };
}
export function getMakeStyxApiRequest<AuthType extends ApiAuthType, Method extends ApiRequestMethod>(pathname: string, authenticationType: AuthType, method: Method) {
    const makeApiRequest = async <Payload extends {}>(storeService: StoreService, params?: ApiRequestParams<AuthType, Method, Payload>): Promise<StyxApiResponse> => {
        const defaults = {
            login: "",
            teamUuid: "",
            payload: "",
            ...(params || {}),
        };
        const methodParams = getMethodParams<string>(method, defaults.payload);
        const authParams = getAuthParams(authenticationType, {
            login: defaults.login,
            teamUuid: defaults.teamUuid,
        });
        const payload = methodParams.method === "POST" ? methodParams.payload : "";
        const serverDeltaTimestamp = dashlaneServerDeltaTimestampSelector(storeService.getState()) || 0;
        const timestamp = Math.round(getUnixTimestamp() - serverDeltaTimestamp);
        const credentials = getStyxApiCredentials(storeService.getState(), authParams);
        const platformInfo = platformInfoSelector(storeService.getState());
        const unsignedHeaders = {
            "Content-Type": "application/x-jsonlines",
            "X-TIMESTAMP": timestamp.toString(),
        };
        const signedHeaders = {
            "dashlane-client-agent": getApiClientAgentHeader(platformInfo),
        };
        const useTestHeader = userDetails(storeService);
        const headersToSign = Object.keys(signedHeaders);
        const authorizationHeader = await getAuthorizationHeader(storeService, pathname, credentials, { ...signedHeaders, ...unsignedHeaders }, headersToSign, payload);
        const headers = {
            ...signedHeaders,
            ...authorizationHeader,
            ...unsignedHeaders,
        };
        const apiHostname = config.DASHLANE_STYX_HOST_WITH_SCHEME;
        const endpointUrl = `${apiHostname}${pathname}`;
        const { data } = await sendJSONLines(methodParams, endpointUrl, headers);
        return data;
    };
    return makeApiRequest;
}
export function getApiClientAgentHeader(platformInfo: PlatformInfo): string {
    return JSON.stringify({
        platform: platformInfo.platformName,
        version: platformInfo.appVersion,
    });
}
