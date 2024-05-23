import ApiMiddleware from './ApiMiddleware';
import { FeedbackSendFeedbackParams, FetchParams } from './types';
const STRONG_AUTH_ROUTE_PARAMS: FetchParams = {
    apiVersion: 3,
    apiObject: 'strongauth',
};
export class StrongAuth extends ApiMiddleware {
    protected _routeParams = STRONG_AUTH_ROUTE_PARAMS;
    public uploadDuoCsv = (file: File) => this._api.fetch(this._routeParams, 'importDuoUsernames', {
        data: { duoUsernamesCSV: file },
        noCache: true,
    });
}
const FEEDBACK_ROUTE_PARAMS: FetchParams = {
    apiVersion: 1,
    apiObject: 'feedback',
};
export class Feedback extends ApiMiddleware {
    protected _routeParams = FEEDBACK_ROUTE_PARAMS;
    public send = ({ body }: FeedbackSendFeedbackParams) => this._api.fetch(this._routeParams, 'sendFeedback', {
        data: {
            body,
            source: 'TAC',
            title: 'A TAC Admin just wrote to us :',
        },
        noCache: true,
    });
}
