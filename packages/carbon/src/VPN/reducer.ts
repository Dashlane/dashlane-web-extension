import { VpnAccountStatusType } from "@dashlane/communication";
import {
  VPN_ACCOUNT_ACTIVATING,
  VPN_ACCOUNT_ACTIVATION_COMPLETE,
  VPN_ACCOUNT_GENERATION_DONE,
  VPN_ACCOUNT_GENERATION_ERROR,
  VPN_ACCOUNT_NOT_FOUND,
  VpnAccountAction,
} from "./actions";
import { VpnState } from "./vpnstate";
export const VPNReducers = (
  state: VpnState,
  action: VpnAccountAction
): VpnState => {
  switch (action.type) {
    case VPN_ACCOUNT_ACTIVATING:
      return {
        accountStatus: {
          status: VpnAccountStatusType.Activating,
        },
      };
    case VPN_ACCOUNT_GENERATION_DONE:
      return {
        accountStatus: {
          status: VpnAccountStatusType.Ready,
        },
      };
    case VPN_ACCOUNT_GENERATION_ERROR:
      return {
        accountStatus: {
          status: VpnAccountStatusType.Error,
          error: action.error,
        },
      };
    case VPN_ACCOUNT_ACTIVATION_COMPLETE:
      return {
        accountStatus: {
          status: VpnAccountStatusType.Activated,
        },
      };
    case VPN_ACCOUNT_NOT_FOUND:
      return {
        accountStatus: {
          status: VpnAccountStatusType.NotFound,
        },
      };
    default:
      return (
        state ?? {
          accountStatus: { status: VpnAccountStatusType.NotFound },
        }
      );
  }
};
