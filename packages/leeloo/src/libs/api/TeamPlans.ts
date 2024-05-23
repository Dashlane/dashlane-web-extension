import Base from './Base';
import { Auth, Team, TeamPlansCache, TeamPlansIsCacheUpdate, TeamPlansLastUpdateResult, TeamPlansProposeMembersResult, TeamPlansRevokeMembersRequest, TeamPlansRevokeMembersResult, TeamPlansStatusResult, } from './types';
import dummyOkResponse from './fixtures/okResponse';
import dummyTeamPlansRevokeMembersResponse from './fixtures/teamPlansRevokeMembersResponse';
import dummyTeamPlansStatusResponse from './fixtures/teamPlansStatusResponse';
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
    protected WSNAME = 'teamPlans';
    protected _isDummyLogin(auth: Auth): boolean {
        return auth.login === 'dummy-login@example.com';
    }
    protected _cache<ExpectedData extends Record<string, any>>(cacheKey: string, params: {
        auth: Auth;
    }, request: Function, transformResult?: Function): Promise<any> {
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
    protected _isCacheUpToDate(cacheKey: string, params: {
        auth: Auth;
    }): Promise<TeamPlansIsCacheUpdate> {
        cache.isCacheUpToDate.promise = this._makeRequest<TeamPlansLastUpdateResult, Auth>('getTeamLastUpdateTs', {
            login: params.auth.login,
            uki: params.auth.uki,
            teamId: params.auth.teamId,
        }).then((result: TeamPlansLastUpdateResult) => {
            delete cache.isCacheUpToDate.promise;
            return {
                isUpToDate: result.code === 200 &&
                    result.content &&
                    result.content.timestamp &&
                    cache[cacheKey].lastUpdateTimestamp === result.content.timestamp,
                remoteLastUpdateTimestamp: result.content.timestamp,
            };
        }) as Promise<TeamPlansIsCacheUpdate>;
        return cache.isCacheUpToDate.promise;
    }
    public status(params: {
        auth: Auth;
    }): Promise<TeamPlansStatusResult> {
        if (this._isDummyLogin(params.auth)) {
            return dummyTeamPlansStatusResponse();
        }
        return this._cache('status', params, () => this._makeRequest('status', {
            login: params.auth.login,
            uki: params.auth.uki,
            teamId: params.auth.teamId,
            members: 'false',
        })) as Promise<TeamPlansStatusResult>;
    }
    public revokeMembers(params: {
        auth: Auth;
        memberLogins: string[];
    }): Promise<TeamPlansRevokeMembersResult> {
        if (this._isDummyLogin(params.auth)) {
            return dummyTeamPlansRevokeMembersResponse(params);
        }
        return this._makeRequest<TeamPlansRevokeMembersResult, TeamPlansRevokeMembersRequest>('removeMembers', {
            login: params.auth.login,
            uki: params.auth.uki,
            teamId: params.auth.teamId,
            removedMemberLogins: JSON.stringify(params.memberLogins),
            members: 'false',
        });
    }
    public editSettings(params: {
        auth: Auth;
        operations: EditSettingOperation[];
    }): Promise<TeamPlansProposeMembersResult> {
        if (this._isDummyLogin(params.auth)) {
            return dummyOkResponse();
        }
        return this._makeRequest('editSettings', {
            login: params.auth.login,
            uki: params.auth.uki,
            teamId: params.auth.teamId,
            operations: JSON.stringify(params.operations),
        }) as Promise<TeamPlansProposeMembersResult>;
    }
    public addSeats(params: {
        auth: Auth;
        seats: number;
    }): Promise<{}> {
        if (this._isDummyLogin(params.auth)) {
            return dummyOkResponse();
        }
        return this._makeRequest('addSeats', {
            login: params.auth.login,
            uki: params.auth.uki,
            teamId: params.auth.teamId,
            seats: params.seats,
        }) as Promise<{}>;
    }
    public updateBillingAdmin(params: {
        auth: Auth;
        newAdminLogin: string;
        oldAdminLogin: string;
    }): Promise<any> {
        if (this._isDummyLogin(params.auth)) {
            return dummyOkResponse();
        }
        return this._makeRequest('updateBillingAdmin', {
            login: params.auth.login,
            uki: params.auth.uki,
            teamId: params.auth.teamId,
            newAdminLogin: params.newAdminLogin,
            oldAdminLogin: params.oldAdminLogin,
            updateTeamCaptain: false,
        }) as any as Promise<any>;
    }
    public invoiceTeamUpgrade(params: {
        auth: Auth;
        tokenId?: string;
        planId?: string;
        membersNumber?: number;
        amount?: number;
    }): Promise<{
        customerId: string;
        invoiceId: string;
    }> {
        return this._makeRequest('invoiceTeamUpgrade', {
            login: params.auth.login,
            planId: params.planId,
            tokenId: params.tokenId,
            membersNumber: params.membersNumber,
            amountToPay: params.amount,
        }).then((json) => json['content']);
    }
    public updatePaymentMean(params: {
        auth: Auth;
        tokenId: string;
        customerId?: string;
        stripeAccount: string;
    }): Promise<{
        team: Team;
    }> {
        if (this._isDummyLogin(params.auth)) {
            return dummyOkResponse();
        }
        return this._makeRequest('updatePaymentMean', {
            login: params.auth.login,
            uki: params.auth.uki,
            teamId: params.auth.teamId,
            tokenId: params.tokenId,
            customerId: params.customerId,
            stripeAccount: params.stripeAccount,
        }).then((json) => json['content']);
    }
    public upgrade(params: {
        login: string;
        planId: string;
        membersNumber: number;
        stripeAccount: string;
        tokenId: string;
        amountToPay: number;
    }): Promise<string> {
        if (params.login === 'dummy-login@example.com') {
            return dummyOkResponse();
        }
        return this._makeRequest('upgrade', params) as any as Promise<any>;
    }
    public acceptTeam(params: {
        token: string;
    }): Promise<any> {
        return this._makeRequest('acceptTeam', {
            token: params.token,
        }) as any as Promise<any>;
    }
    public getNewCardToken(params: {
        auth: Auth;
    }): Promise<{
        customerId: string;
        tokenId: string;
    }> {
        return this._makeRequest('getNewCardToken', {
            login: params.auth.login,
            uki: params.auth.uki,
            teamId: params.auth.teamId,
        }).then((json) => json['content']);
    }
}
