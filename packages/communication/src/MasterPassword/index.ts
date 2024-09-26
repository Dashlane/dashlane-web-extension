export interface CheckIfMasterPasswordIsValid {
  masterPassword: string;
}
export interface CheckIfMasterPasswordIsValidRequest {
  masterPassword: string;
}
export interface CheckIfMasterPasswordIsValidResponse {
  isMasterPasswordValid: boolean;
}
export interface MasterPasswordServerKeyResponse {
  password: string;
  serverKey?: string;
}
