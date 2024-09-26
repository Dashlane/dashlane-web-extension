export enum VpnAccountStatusType {
  Activated = "Activated",
  Activating = "Activating",
  Error = "Error",
  NotFound = "NotFound",
  Ready = "Ready",
}
export enum VpnAccountActivationErrorType {
  ServerError = "ServerError",
  AccountAlreadyExistError = "AccountAlreadyExist",
}
interface VpnAccountExists {
  email: string;
  password: string;
  credentialId: string;
}
export interface ActivateVpnAccountRequest {
  email: string;
}
export interface VpnAccountStatusActivated extends VpnAccountExists {
  status: VpnAccountStatusType.Activated;
}
export interface VpnAccountStatusActivating {
  status: VpnAccountStatusType.Activating;
}
export interface VpnAccountStatusError {
  status: VpnAccountStatusType.Error;
  error: VpnAccountActivationErrorType;
}
export interface VpnAccountStatusNotFound {
  status: VpnAccountStatusType.NotFound;
}
export interface VpnAccountStatusReady extends VpnAccountExists {
  status: VpnAccountStatusType.Ready;
}
export type VpnAccountStatus =
  | VpnAccountStatusActivated
  | VpnAccountStatusActivating
  | VpnAccountStatusError
  | VpnAccountStatusNotFound
  | VpnAccountStatusReady;
export enum VpnDisabledReason {
  InTeam = "InTeam",
  NotPremium = "NotPremium",
  NoPayment = "NoPayment",
  Other = "Other",
}
type VpnCapabilitySettingEnabled = {
  hasVpnEnabled: true;
};
type VpnCapabilitySettingDisabled = {
  hasVpnEnabled: false;
  vpnDisabledReason: VpnDisabledReason;
};
export type VpnCapabilitySetting =
  | VpnCapabilitySettingEnabled
  | VpnCapabilitySettingDisabled;
