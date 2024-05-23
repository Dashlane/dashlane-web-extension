import Base from './Base';
import { v4 as uuid } from 'uuid';
import { Auth } from './types';
import dummyOkResponse from './fixtures/okResponse';
export default class SepcialOffer extends Base {
    protected WSVERSION = 1;
    protected WSNAME = 'specialoffer';
    public teamCoupon(params: {
        auth: Auth;
        coupon: string;
    }): Promise<any> {
        if (params.auth.login === 'dummy-login@example.com') {
            return dummyOkResponse();
        }
        return this._makeRequest('teamCoupon', {
            login: params.auth.login,
            uki: params.auth.uki,
            teamId: params.auth.teamId,
            coupon: params.coupon,
            browserUuid: uuid(),
        }) as any as Promise<any>;
    }
}
