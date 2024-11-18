import { postDataToUrl } from "Utils/index";
import { CarbonError } from "Libs/Error";
import { _redacted_ } from "Libs/Http/cloudflare-headers";
import { HttpRequestResponseTypes } from "Libs/Http/types";
import { WSError, WSErrorCode } from "Libs/WS/Errors";
import { config } from "config-service";
export enum WsError {
  THROTTLED = -999,
}
export function _makeRequest<
  ExpectedData extends Object,
  RequestData extends Object
>(
  wsName: string,
  wsVersion: number,
  wsMethod: string,
  requestData: RequestData,
  options?: {
    responseType?: HttpRequestResponseTypes;
  }
): Promise<ExpectedData> {
  const url = `${config.DASHLANE_WS_HOST_WITH_SCHEME}/${wsVersion}/${wsName}/${wsMethod}`;
  return postDataToUrl<ExpectedData>(url, requestData, postDataOptions).then(
    (res) => {
      const data = typeof res === "string" ? res : res.data;
      return treatData(url, data);
    }
  );
}
function treatData(webService: string, data: any) {
  if (typeof data === "string") {
    return data;
  }
  if (data.code === 429 || (data.error && data.error.code === -32600)) {
    const error: WSError = new CarbonError(WSError, WSErrorCode.THROTTLED);
    throw error.addAdditionalInfo({ webService });
  }
  const requestFailed =
    ("code" in data && data["code"] !== 200) ||
    ("success" in data && !data["success"]) ||
    ("error" in data && data["error"]);
  if (requestFailed) {
    const error: WSError = new CarbonError(WSError, WSErrorCode.REQUEST_FAILED);
    throw error.addAdditionalInfo({
      webService,
      message: data.message,
      webServiceSubMessage:
        data.content?.message || data.content?.error || data.content,
      code: data.code,
    });
  }
  return data;
}
