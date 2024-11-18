import { postDataToUrl } from "Utils/index";
import { CarbonError } from "Libs/Error";
import { WSError, WSErrorCode } from "Libs/WS/Errors";
import { WSRequestParams, WSResponseBase } from "Libs/WS/types";
import { DataLeaksBreach, DataLeaksBreachContent, } from "DataManagement/Breaches/types";
import { config } from "config-service";
import { *** } from "Libs/Http/cloudflare-headers";
const WSNAME = "dataleak";
const WSVERSION = 1;
export interface WSDataLeaks {
    status: (params: WSDataLeaksStatusParams) => Promise<WSDataLeaksStatusResult>;
    leaks: (params: WSDataLeaksBreachesParams) => Promise<WSDataLeaksBreachesResult>;
}
export const makeWSDataLeaks = (): WSDataLeaks => {
    return {
        status: wsDataLeaksStatus,
        leaks: wsDataLeaksBreaches,
    };
};
export interface WSDataLeaksBaseResult extends WSResponseBase {
    code: number;
    status: string;
    error?: {
        code: number;
    };
}
export interface WSDataLeaksStatusParams extends WSRequestParams {
    wantsLeaks?: boolean;
    includeDisabled?: boolean;
}
export interface WSDataLeaksStatusResult extends WSDataLeaksBaseResult {
    content: {
        leaks: DataLeaksBreach[];
        lastUpdateDate: number;
    };
}
export interface WSDataLeaksBreachesParams extends WSRequestParams {
    includeDisabled?: boolean;
    wantsDetails?: boolean;
    lastUpdateDate?: number;
}
export interface WSDataLeaksBreachesResult extends WSDataLeaksBaseResult {
    content: {
        leaks: DataLeaksBreachContent[];
        details?: {
            cipheredKey: string;
            cipheredInfo: string;
        };
        lastUpdateDate: number;
    };
}
export interface WSDataLeaksConfirmParams {
    token: string;
}
export interface WSDataLeaksConfirmContentResult {
    email: string;
    requestedBy: string;
}
export interface WSDataLeaksConfirmResult extends WSDataLeaksBaseResult {
    content: WSDataLeaksConfirmContentResult;
}
function wsDataLeaksStatus(params: WSDataLeaksStatusParams): Promise<WSDataLeaksStatusResult> {
    return _makeDataLeaksRequest<WSDataLeaksStatusResult, WSDataLeaksStatusParams>(WSNAME, WSVERSION, "status", params);
}
function wsDataLeaksBreaches(params: WSDataLeaksBreachesParams): Promise<WSDataLeaksBreachesResult> {
    return _makeDataLeaksRequest<WSDataLeaksBreachesResult, WSDataLeaksBreachesParams>(WSNAME, WSVERSION, "leaks", params);
}
async function _makeDataLeaksRequest<RequestResult extends WSDataLeaksBaseResult, RequestData extends {}>(wsName: string, wsVersion: number, wsMethod: string, requestData: RequestData): Promise<RequestResult> {
    const url = `${config.DASHLANE_WS_HOST_WITH_SCHEME}/${wsVersion}/${wsName}/${wsMethod}`;
    const { data } = await postDataToUrl<RequestResult>(url, requestData, postDataOptions);
    return treatDataLeaksResponse(url, data);
}
function treatDataLeaksResponse<T extends WSDataLeaksBaseResult>(webServiceUrl: string, data: T) {
    if (data.code === 429 || (data.error && data.error.code === -32600)) {
        const error: WSError = new CarbonError(WSError, WSErrorCode.THROTTLED);
        throw error.addAdditionalInfo({ webService: webServiceUrl });
    }
    return data;
}
