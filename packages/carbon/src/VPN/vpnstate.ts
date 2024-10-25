import {
  VpnAccountActivationErrorType,
  VpnAccountStatusType,
} from "@dashlane/communication";
export interface VpnNoCredentialState {
  status: VpnAccountStatusType.NotFound;
}
export interface VpnHasCredentialState {
  status: VpnAccountStatusType.Ready;
}
export interface VpnIsActivatingState {
  status: VpnAccountStatusType.Activating;
}
export interface VpnAccountError {
  status: VpnAccountStatusType.Error;
  error: VpnAccountActivationErrorType;
}
export interface VpnAccountActivated {
  status: VpnAccountStatusType.Activated;
}
export interface VpnState {
  accountStatus:
    | VpnNoCredentialState
    | VpnHasCredentialState
    | VpnAccountError
    | VpnAccountActivated
    | VpnIsActivatingState;
}
