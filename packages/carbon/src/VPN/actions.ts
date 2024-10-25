import { VpnAccountActivationErrorType } from "@dashlane/communication";
export const VPN_ACCOUNT_ACTIVATING = "VPN_ACCOUNT_ACTIVATING";
export const VPN_ACCOUNT_GENERATION_DONE = "VPN_ACCOUNT_GENERATION_DONE";
export const VPN_ACCOUNT_ACTIVATION_COMPLETE =
  "VPN_ACCOUNT_ACTIVATION_COMPLETE";
export const VPN_ACCOUNT_GENERATION_ERROR = "VPN_ACCOUNT_GENERATION_ERROR";
export const VPN_ACCOUNT_NOT_FOUND = "VPN_ACCOUNT_NOT_FOUND";
export interface VpnAccountActivatingAction {
  type: typeof VPN_ACCOUNT_ACTIVATING;
}
export const vpnAccountActivatingAction = (): VpnAccountActivatingAction => ({
  type: VPN_ACCOUNT_ACTIVATING,
});
export interface VpnAccountGenerationDoneAction {
  type: typeof VPN_ACCOUNT_GENERATION_DONE;
}
export const vpnAccountGenerationDoneAction =
  (): VpnAccountGenerationDoneAction => ({
    type: VPN_ACCOUNT_GENERATION_DONE,
  });
export interface VpnAccountGenerationErrorAction {
  type: typeof VPN_ACCOUNT_GENERATION_ERROR;
  error: VpnAccountActivationErrorType;
}
export const vpnAccountGenerationErrorAction = (
  error: VpnAccountActivationErrorType
): VpnAccountGenerationErrorAction => ({
  type: VPN_ACCOUNT_GENERATION_ERROR,
  error,
});
export interface VpnAccountActivationCompleteAction {
  type: typeof VPN_ACCOUNT_ACTIVATION_COMPLETE;
}
export const vpnAccountActivationCompleteAction =
  (): VpnAccountActivationCompleteAction => ({
    type: VPN_ACCOUNT_ACTIVATION_COMPLETE,
  });
export interface VpnAccountNotFoundAction {
  type: typeof VPN_ACCOUNT_NOT_FOUND;
}
export const vpnAccountNotFoundAction = (): VpnAccountNotFoundAction => ({
  type: VPN_ACCOUNT_NOT_FOUND,
});
export type VpnAccountAction =
  | VpnAccountActivatingAction
  | VpnAccountGenerationDoneAction
  | VpnAccountGenerationErrorAction
  | VpnAccountActivationCompleteAction
  | VpnAccountNotFoundAction;
