import { MasterPasswordResetDemand } from "@dashlane/communication";
import { _makeRequest } from "Libs/WS/request";
import {
  AcceptRequestsParams,
  AccountRecoveryRequestParams,
  CancelRequestParams,
  GetPendingRequestsParams,
  GetPendingRequestsResponse,
  GetSetupRequisitesParams,
  GetSetupRequisitesResponse,
  RefuseRequestsParams,
  RequestResponse,
  SetRecoveryClientKeysParams,
  SetRecoveryClientKeysResponse,
} from "Libs/WS/Recovery/types";
const WSVERSION = 1;
const WSNAME = "recovery";
export interface WSRecovery {
  getSetupRequisites: (
    params: GetSetupRequisitesParams
  ) => Promise<GetSetupRequisitesResponse>;
  setRecoveryClientKeys: (
    params: SetRecoveryClientKeysParams
  ) => Promise<SetRecoveryClientKeysResponse>;
  request: (params: AccountRecoveryRequestParams) => Promise<RequestResponse>;
  getPendingRequests: (
    params: GetPendingRequestsParams
  ) => Promise<MasterPasswordResetDemand[]>;
  acceptRequest: (params: AcceptRequestsParams) => Promise<{}>;
  refuseRequest: (params: RefuseRequestsParams) => Promise<{}>;
  cancelRequest: (params: CancelRequestParams) => Promise<{}>;
}
export const makeWSRecovery = (): WSRecovery => {
  return {
    getSetupRequisites: (params: GetPendingRequestsParams) =>
      getSetupRequisites(params),
    setRecoveryClientKeys: (params: SetRecoveryClientKeysParams) =>
      setRecoveryClientKeys(params),
    request: (params: AccountRecoveryRequestParams) => request(params),
    getPendingRequests: (params: GetPendingRequestsParams) =>
      getPendingRequests(params),
    acceptRequest: (params: AcceptRequestsParams) => acceptRequest(params),
    refuseRequest: (params: RefuseRequestsParams) => refuseRequest(params),
    cancelRequest: (params: CancelRequestParams) => cancelRequest(params),
  };
};
async function getSetupRequisites(params: GetSetupRequisitesParams) {
  return _makeRequest<GetSetupRequisitesResponse, GetSetupRequisitesParams>(
    WSNAME,
    WSVERSION,
    "getSetupRequisites",
    params
  );
}
async function setRecoveryClientKeys(params: SetRecoveryClientKeysParams) {
  return _makeRequest<
    SetRecoveryClientKeysResponse,
    SetRecoveryClientKeysParams
  >(WSNAME, WSVERSION, "setRecoveryClientKeys", params);
}
async function request(params: AccountRecoveryRequestParams) {
  return _makeRequest<RequestResponse, AccountRecoveryRequestParams>(
    WSNAME,
    WSVERSION,
    "request",
    params
  );
}
async function getPendingRequests(params: GetPendingRequestsParams) {
  const { content } = await _makeRequest<
    GetPendingRequestsResponse,
    GetPendingRequestsParams
  >(WSNAME, WSVERSION, "getPendingRequests", params);
  return content;
}
async function acceptRequest(params: AcceptRequestsParams) {
  return _makeRequest<{}, AcceptRequestsParams>(
    WSNAME,
    WSVERSION,
    "accept",
    params
  );
}
async function refuseRequest(params: RefuseRequestsParams) {
  return _makeRequest<{}, RefuseRequestsParams>(
    WSNAME,
    WSVERSION,
    "refuse",
    params
  );
}
async function cancelRequest(params: CancelRequestParams) {
  return _makeRequest<{}, CancelRequestParams>(
    WSNAME,
    WSVERSION,
    "cancel",
    params
  );
}
