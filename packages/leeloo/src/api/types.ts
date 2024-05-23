import { AxiosResponse } from 'axios';
import { Auth as ApiAuth } from 'libs/api/types';
export * from './types/feedback';
export { ApiAuth };
export interface ApiResponse {
}
export interface ApiResponseError extends ApiResponse {
    code: string;
    isError: true;
    message?: string;
    subCode?: string;
}
export interface ApiTeamPlansGetTeamLastUpdateTs extends ApiResponse {
    timestamp: number;
}
export interface FetchOptions {
    data?: {};
    noCache?: boolean;
}
export interface FetchParams {
    apiVersion: number;
    apiObject: string;
}
export interface FetchRequest {
    params: FetchParams;
    apiMethod: string;
    data?: {};
}
export interface IsCacheUpToDateResponse extends ApiResponse {
    isUpToDate: boolean;
    remoteLastUpdateTimestamp: number;
}
export type PostResponse = AxiosResponse<{
    code: number;
    content?: {
        error?: ContentError;
        stripeError?: StripeError;
    };
    message: string;
}>;
type ContentError = 'payment_failed';
type StripeError = 'card_declined' | 'expired_card' | 'invalid_token_id';
