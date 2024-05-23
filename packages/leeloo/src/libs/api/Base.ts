import axios from 'axios';
import * as queryString from 'query-string';
interface RequestOptions {
    rawResult?: boolean;
}
export default class Base {
    protected WSURL = DASHLANE_WS_ADDRESS || WS_URL;
    protected WSVERSION = 0;
    protected WSNAME = '';
    protected CLOUDFLARE_ACCESS_KEY = CLOUDFLARE_ACCESS_KEY;
    protected CLOUDFLARE_SECRET_KEY = CLOUDFLARE_SECRET_KEY;
    protected _makeRequest<ExpectedData extends Record<string, any>, RequestData extends Record<string, any>>(wsMethod: string, options: RequestData, requestOptions: RequestOptions = {}): Promise<ExpectedData> {
        if (options['login'] === 'dummy-login@example.com') {
            if (this.WSNAME !== 'userlog') {
                throw new Error('API Base: A dummy login has reached actual API calling layer');
            }
        }
        return axios
            .post(`${this.WSURL}/${this.WSVERSION}/${this.WSNAME}/${wsMethod}`, options, {
            transformRequest: [
                (data: RequestData) => queryString.stringify(data),
            ],
            ...(CLOUDFLARE_ACCESS_KEY && CLOUDFLARE_SECRET_KEY
                ? {
                    headers: {
                        'cf-access-client-id': CLOUDFLARE_ACCESS_KEY,
                        'cf-access-client-secret': CLOUDFLARE_SECRET_KEY,
                    },
                }
                : {}),
        })
            .then((result: {
            data: any;
        }) => {
            if (requestOptions.rawResult) {
                return result.data;
            }
            if (typeof result.data !== 'object') {
                throw new Error('Invalid incoming data: ' + result);
            }
            const requestFailed = (result.data['code'] !== 200 &&
                !result.data['success'] &&
                ('code' in result.data || 'success' in result.data)) ||
                'error' in result.data;
            const requestHasBadAuthentication = result.data['content'] === 'Incorrect authentification';
            if (requestFailed || requestHasBadAuthentication) {
                if (result.data.content &&
                    [
                        'no_free_slot',
                        'no_free_slot_free_plan',
                        'not_authorized',
                        'cannot_remove_last_billing_admin',
                        'team_name_already_exists',
                    ].includes(result.data.content.error)) {
                    throw new Error(result.data.content.error);
                }
                throw new Error(result.data['message'] ||
                    result.data['content'] ||
                    result.data['error']['message']);
            }
            return result.data as ExpectedData;
        }) as Promise<ExpectedData>;
    }
}
