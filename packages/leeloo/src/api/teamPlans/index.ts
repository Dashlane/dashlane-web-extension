import { keys, values, zipWith } from 'lodash';
import ApiMiddleware from 'api/ApiMiddleware';
import { TeamPlansSettingsMap } from './maps';
import { FetchParams } from 'api/types';
import { TeamPlansAddSeatsParams } from './types';
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
    apiObject: 'teamPlans',
};
export class TeamPlans extends ApiMiddleware {
    protected _routeParams = TEAM_PLANS_ROUTE_PARAMS;
    public addMembers = (emails: string[]) => this._api.fetch(this._routeParams, 'proposeMembers', {
        data: {
            force: true,
            proposedMemberLogins: JSON.stringify(emails),
        },
        noCache: true,
    });
    public addSeats = (params: TeamPlansAddSeatsParams) => this._api.fetch(this._routeParams, 'addSeats', {
        data: params,
        noCache: true,
    });
    public computePlanPricing = (data: {
        seats: number;
    }) => {
        return this._api.fetch(this._routeParams, 'computePlanPricing', {
            data: data,
            noCache: true,
        });
    };
    public getMembers = () => this._api.fetch(this._routeParams, 'members');
    public getADToken = () => this._api.fetch(this._routeParams, TeamPlansSettingsMap.activeDirectoryToken);
    public setSettings = (settings: {}) => this._api.fetch(this._routeParams, 'editSettings', {
        data: {
            operations: JSON.stringify(zipWith(keys(settings), values(settings), handleValueSetting)),
        },
        noCache: true,
    });
}
