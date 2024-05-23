import Api from './Api';
import { ApiResponse } from './types';
import { Feedback, StrongAuth } from '.';
import { TeamPlans } from './teamPlans';
import { TeamPlansAddSeatsParams } from './teamPlans/types';
import { GlobalState } from 'store/types';
import { getAuth } from 'user';
export interface ApiMiddlewareMethods {
    feedback?: {
        send: Function;
    };
    strongAuth?: {
        uploadDuoCsv: Function;
    };
    teamPlans?: {
        addMembers: Function;
        addSeats: (params: TeamPlansAddSeatsParams) => Promise<ApiResponse>;
        computePlanPricing: Function;
        getMembers: Function;
        getADToken: Function;
        setSettings: Function;
    };
}
export function makeApiMiddleware(globalState: GlobalState): ApiMiddlewareMethods {
    const auth = getAuth(globalState);
    if (!auth) {
        return {};
    }
    const api = new Api(auth);
    return {
        feedback: new Feedback(api),
        strongAuth: new StrongAuth(api),
        teamPlans: new TeamPlans(api),
    };
}
