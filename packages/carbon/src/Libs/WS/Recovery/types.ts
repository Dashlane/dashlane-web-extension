import { MasterPasswordResetDemand } from "@dashlane/communication";
export interface BaseParams {
  login: string;
  uki: string;
}
export interface BaseResponse {
  code: number;
  message: string;
}
export interface GetSetupRequisitesParams extends BaseParams {
  teamId: number;
}
export interface Recipient {
  userId?: number;
  login: string;
  publicKey: string | null;
}
export interface GetSetupRequisitesData {
  recoveryServerKey: string;
  recipients: Recipient[];
  hash?: string;
}
export interface GetSetupRequisitesResponse extends BaseResponse {
  content: GetSetupRequisitesData;
}
export interface SetRecoveryClientKeysParams extends BaseParams {
  recoveryClientKeys: string;
  teamId: number;
}
export interface SetRecoveryClientKeysResponse extends BaseResponse {
  content: {
    userId: number;
    recoveryKey: string;
  };
}
export interface AccountRecoveryRequestParams extends BaseParams {
  publicKey?: string;
  teamId?: number;
}
export enum RequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REFUSED = "REFUSED",
  OVERRIDDEN = "OVERRIDDEN",
  CANCELED = "CANCELED",
}
export interface RequestResponse extends BaseResponse {
  content: {
    status: RequestStatus;
    payload?: string;
    recoveryServerKey?: string;
  };
}
export interface GetPendingRequestsParams extends BaseParams {
  teamId: number;
}
export interface GetPendingRequestsResponse {
  content: MasterPasswordResetDemand[];
}
export interface AcceptRequestsParams extends BaseParams {
  sourceLogin: string;
  payload: string;
}
export interface RefuseRequestsParams extends BaseParams {
  sourceLogin: string;
}
export type CancelRequestParams = BaseParams;
