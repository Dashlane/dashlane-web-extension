import { _makeRequest } from "Libs/WS/request";
import { WSResponse, WSResponseSuccess } from "Libs/WS/types";
const WSVERSION = 1;
const WSNAME = "country";
export interface WSCountry {
  getCurrentCountry: (
    params?: WSGetCountryParam
  ) => Promise<WSGetCountryResult>;
}
export const makeWSCountry = (): WSCountry => {
  return {
    getCurrentCountry: (params = {}) => getCountry(params),
  };
};
export interface WSGetCountryResult {
  country: string;
  isEu: boolean;
}
export interface WSGetCountryParam {
  ip?: string;
}
function getCountry(params: WSGetCountryParam): Promise<WSGetCountryResult> {
  return _makeRequest<WSResponse<WSGetCountryResult>, WSGetCountryParam>(
    WSNAME,
    WSVERSION,
    "get",
    params
  ).then((result: WSResponseSuccess<WSGetCountryResult>) => result.content);
}
