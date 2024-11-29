import { keys, values, zipWith } from "lodash";
import ApiMiddleware from "../ApiMiddleware";
import { TeamPlansSettingsMap } from "./maps";
import { FetchParams } from "../types";
const camelToUnderscore = (str: string) => {
  return str.replace(/([A-Z])/g, (x, y) => `_${y.toLowerCase()}`);
};
const handleValueSetting = (key: string, value: any) => {
  return value !== null
    ? { type: `set_${camelToUnderscore(key)}`, value: value }
    : { type: `unset_${camelToUnderscore(key)}` };
};
const TEAM_PLANS_ROUTE_PARAMS: FetchParams = {
  apiVersion: 1,
  apiObject: "teamPlans",
};
export class TeamPlans extends ApiMiddleware {
  protected _routeParams = TEAM_PLANS_ROUTE_PARAMS;
  public computePlanPricing = (data: { seats: number }) => {
    return this._api.fetch(this._routeParams, "computePlanPricing", {
      data: data,
      noCache: true,
    });
  };
  public getADToken = () =>
    this._api.fetch(
      this._routeParams,
      TeamPlansSettingsMap.activeDirectoryToken
    );
  public setSettings = (settings: {}) =>
    this._api.fetch(this._routeParams, "editSettings", {
      data: {
        operations: JSON.stringify(
          zipWith(keys(settings), values(settings), handleValueSetting)
        ),
      },
      noCache: true,
    });
}
