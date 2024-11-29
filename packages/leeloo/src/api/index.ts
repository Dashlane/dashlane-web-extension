import ApiMiddleware from "./ApiMiddleware";
import { FetchParams } from "./types";
const STRONG_AUTH_ROUTE_PARAMS: FetchParams = {
  apiVersion: 3,
  apiObject: "strongauth",
};
export class StrongAuth extends ApiMiddleware {
  protected _routeParams = STRONG_AUTH_ROUTE_PARAMS;
  public uploadDuoCsv = (file: File) =>
    this._api.fetch(this._routeParams, "importDuoUsernames", {
      data: { duoUsernamesCSV: file },
      noCache: true,
    });
}
