export interface MasterPasswordResetError {
  message: string;
  action?: MasterPasswordResetRequest;
}
export interface MasterPasswordResetRequest {}
export interface MasterPasswordResetResult {
  error?: MasterPasswordResetError;
}
export interface ListMasterPasswordResetDemandsRequest
  extends MasterPasswordResetRequest {
  teamId: number;
}
export interface Device {
  deviceId: number;
  platform:
    | "server_android"
    | "server_ipad"
    | "server_iphone"
    | "server_macosx"
    | "server_win";
  remoteIp: string;
}
export interface MasterPasswordResetDemand {
  creationDateUnix: number;
  device: Device;
  login: string;
  publicKey: string;
  recoveryClientKey: string;
  status: string;
  updateDateUnix: number;
}
export interface ListMasterPasswordResetDemandsResponse
  extends MasterPasswordResetResult {
  demands: MasterPasswordResetDemand[];
}
export interface AcceptMasterPasswordResetDemandRequest
  extends MasterPasswordResetRequest {
  login: string;
  recoveryKey: string;
  userPublicKey: string;
}
export interface AcceptMasterPasswordResetDemandResult
  extends MasterPasswordResetResult {}
export interface DeclineMasterPasswordResetDemandRequest
  extends MasterPasswordResetRequest {
  login: string;
}
export interface DeclineMasterPasswordResetDemandResult
  extends MasterPasswordResetResult {}
