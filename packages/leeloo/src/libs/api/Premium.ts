import Base from './Base';
import { Auth, ConfirmPaymentPendingResult, GetABTestingVersionDetailsResult, PremiumCache, PremiumStatusResult, Team, } from './types';
import dummyPremiumStatusResponse from './fixtures/premiumStatusResponse';
function getEmptyCache(): PremiumCache {
    return {
        status: null,
    };
}
let cache: PremiumCache = getEmptyCache();
export function clearCache() {
    cache = getEmptyCache();
}
export default class Premium extends Base {
    protected WSVERSION = 3;
    protected WSNAME = 'premium';
    public getABTestingVersionDetails(params: {
        capacity: string;
        language: string;
        platform: string;
    }): Promise<GetABTestingVersionDetailsResult> {
        return this._makeRequest<GetABTestingVersionDetailsResult, any>('getABTestingVersionDetails', {
            capacity: params.capacity,
            language: params.language,
            platform: params.platform,
        }).then((json) => ({
            common: json['common'],
            details: json['details'],
            version: json['version'],
        })) as Promise<GetABTestingVersionDetailsResult>;
    }
    public status(params: {
        auth: Auth;
        teamInformation?: boolean;
        autoRenewal?: boolean;
    }): Promise<PremiumStatusResult> {
        if (params.auth.login === 'dummy-login@example.com') {
            return dummyPremiumStatusResponse();
        }
        if (!cache.status) {
            cache.status = this._makeRequest<PremiumStatusResult, any>('status', {
                login: params.auth.login,
                uki: params.auth.uki,
                autoRenewal: params.autoRenewal,
                teamInformation: params.teamInformation,
            }).then((result: PremiumStatusResult) => result);
        }
        return cache.status;
    }
    public stripePublishableKeys(): Promise<{
        stripe_fr: {
            *****: string;
            *****: string;
        };
        stripe_us: {
            *****: string;
            *****: string;
        };
    }> {
        return this._makeRequest('stripePublishableKeys', {}).then((json) => json['content']);
    }
    public processoutPublishableKeys(): Promise<{
        *****: string;
        *****: string;
    }> {
        return this._makeRequest('processoutPublishableKey', {}).then((json) => json['content']);
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
        }).then((json) => json['content']);
    }
    public confirmPaymentPending(params: {
        auth: Auth;
        externalId: string;
    }): Promise<ConfirmPaymentPendingResult> {
        return this._makeRequest('confirmPaymentPending', {
            login: params.auth.login,
            externalId: params.externalId,
        });
    }
    public updateCardToken(params: {
        auth: Auth;
        tokenId: string;
        customerId?: string;
        stripeAccount: string;
    }): Promise<{
        team: Team;
    }> {
        return this._makeRequest('updateCardToken', {
            login: params.auth.login,
            uki: params.auth.uki,
            teamId: params.auth.teamId,
            tokenId: params.tokenId,
            customerId: params.customerId,
            stripeAccount: params.stripeAccount,
        }).then((json) => json['content']);
    }
}
