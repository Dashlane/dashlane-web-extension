import Base from "./Base";
import {
  Auth,
  TeamPlansCache,
  TeamPlansIsCacheUpdate,
  TeamPlansLastUpdateResult,
  TeamPlansRevokeMembersRequest,
  TeamPlansRevokeMembersResult,
} from "./types";
export type EditSettingOperation = {
  type: string;
  value?: string | number;
};
function getEmptyCache() {
  return {
    isCacheUpToDate: {},
    members: {
      lastUpdateTimestamp: 0,
    },
    status: {
      lastUpdateTimestamp: 0,
    },
  };
}
let cache: TeamPlansCache = getEmptyCache();
export function clearCache() {
  cache = getEmptyCache();
}
export default class TeamPlans extends Base {
  protected WSVERSION = 1;
  protected WSNAME = "teamPlans";
  protected _cache<ExpectedData extends Record<string, any>>(
    cacheKey: string,
    params: {
      auth: Auth;
    },
    request: Function,
    transformResult?: Function
  ): Promise<any> {
    if (cache[cacheKey].promise) {
      return cache[cacheKey].promise;
    }
    cache[cacheKey].promise = this._isCacheUpToDate(cacheKey, params)
      .then((cacheState: TeamPlansIsCacheUpdate) => {
        if (cacheState.isUpToDate) {
          delete cache[cacheKey].promise;
          return cache[cacheKey].data;
        }
        return request().then((result: ExpectedData) => {
          delete cache[cacheKey].promise;
          if (transformResult) {
            result = transformResult(result);
          }
          cache[cacheKey].data = result;
          cache[cacheKey].lastUpdateTimestamp =
            cacheState.remoteLastUpdateTimestamp;
          return result;
        }) as Promise<ExpectedData>;
      })
      .catch((e) => {
        delete cache[cacheKey].promise;
        throw e;
      });
    return cache[cacheKey].promise;
  }
  protected _isCacheUpToDate(
    cacheKey: string,
    params: {
      auth: Auth;
    }
  ): Promise<TeamPlansIsCacheUpdate> {
    cache.isCacheUpToDate.promise = this._makeRequest<
      TeamPlansLastUpdateResult,
      Auth
    >("getTeamLastUpdateTs", {
      login: params.auth.login,
      uki: params.auth.uki,
      teamId: params.auth.teamId,
    }).then((result: TeamPlansLastUpdateResult) => {
      delete cache.isCacheUpToDate.promise;
      return {
        isUpToDate:
          result.code === 200 &&
          result.content &&
          result.content.timestamp &&
          cache[cacheKey].lastUpdateTimestamp === result.content.timestamp,
        remoteLastUpdateTimestamp: result.content.timestamp,
      };
    }) as Promise<TeamPlansIsCacheUpdate>;
    return cache.isCacheUpToDate.promise;
  }
  public revokeMembers(params: {
    auth: Auth;
    memberLogins: string[];
  }): Promise<TeamPlansRevokeMembersResult> {
    return this._makeRequest<
      TeamPlansRevokeMembersResult,
      TeamPlansRevokeMembersRequest
    >("removeMembers", {
      login: params.auth.login,
      uki: params.auth.uki,
      teamId: params.auth.teamId,
      removedMemberLogins: JSON.stringify(params.memberLogins),
      members: "false",
    });
  }
  public acceptTeam(params: { token: string }): Promise<any> {
    return this._makeRequest("acceptTeam", {
      token: params.token,
    }) as any as Promise<any>;
  }
}
