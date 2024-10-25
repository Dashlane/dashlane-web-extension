import {
  Credential,
  PremiumStatus,
  VpnAccountStatus,
  VpnAccountStatusType,
  VpnCapabilitySetting,
  VpnDisabledReason,
} from "@dashlane/communication";
import { credentialsSelector } from "DataManagement/Credentials/selectors/credentials.selector";
import { createSelector } from "reselect";
import { premiumStatusSelector } from "Session/selectors";
import { State } from "Store";
import { vpnCredentialMatcher } from "./helpers";
import { VpnState } from "./vpnstate";
const latestCredential = (a: Credential, b: Credential): number =>
  (b.CreationDatetime ?? 0) - (a.CreationDatetime ?? 0);
export const vpnCredentialSelector = (state: State): Credential | null => {
  const allCredentials = credentialsSelector(state);
  return (
    allCredentials
      .filter((cred) => vpnCredentialMatcher(cred))
      .sort(latestCredential)[0] ?? null
  );
};
const vpnDataSelector = (state: State): VpnState => {
  const { vpnData } = state.userSession;
  return vpnData
    ? vpnData
    : { accountStatus: { status: VpnAccountStatusType.NotFound } };
};
const vpnAccountStatusIntermediarySelector = (
  vpnData: VpnState,
  credential: Credential | undefined | null
): VpnAccountStatus => {
  switch (vpnData.accountStatus.status) {
    case VpnAccountStatusType.Error:
      return {
        status: VpnAccountStatusType.Error,
        error: vpnData.accountStatus.error,
      };
    case VpnAccountStatusType.Activating:
      return {
        status: VpnAccountStatusType.Activating,
      };
    case VpnAccountStatusType.Activated:
    case VpnAccountStatusType.NotFound: {
      if (!credential) {
        return {
          status: VpnAccountStatusType.NotFound,
        };
      }
      return {
        status: VpnAccountStatusType.Activated,
        email: credential.Email,
        password: credential.Password,
        credentialId: credential.Id,
      };
    }
    case VpnAccountStatusType.Ready: {
      if (!credential) {
        return {
          status: VpnAccountStatusType.NotFound,
        };
      }
      return {
        status: VpnAccountStatusType.Ready,
        email: credential.Email,
        password: credential.Password,
        credentialId: credential.Id,
      };
    }
  }
};
export const vpnAccountStatusSelector = createSelector(
  vpnDataSelector,
  vpnCredentialSelector,
  vpnAccountStatusIntermediarySelector
);
const enum ServerVpnCapabilityReason {
  IN_TEAM = "in_team",
  NOT_PREMIUM = "not_premium",
  NO_PAYMENT = "no_payment",
}
const VPN_DISABLED_REASON_MAP = {
  [ServerVpnCapabilityReason.IN_TEAM]: VpnDisabledReason.InTeam,
  [ServerVpnCapabilityReason.NOT_PREMIUM]: VpnDisabledReason.NotPremium,
  [ServerVpnCapabilityReason.NO_PAYMENT]: VpnDisabledReason.NoPayment,
};
export const getVpnCapabilitySetting = (
  premiumStatus: PremiumStatus
): VpnCapabilitySetting => {
  const vpnCapability = premiumStatus?.capabilities?.secureWiFi;
  if (vpnCapability.enabled) {
    return { hasVpnEnabled: true };
  } else {
    const vpnDisabledReason: VpnDisabledReason =
      VPN_DISABLED_REASON_MAP[vpnCapability.info.reason] ||
      VpnDisabledReason.Other;
    return { hasVpnEnabled: false, vpnDisabledReason: vpnDisabledReason };
  }
};
export const vpnCapabilitySettingSelector = createSelector(
  premiumStatusSelector,
  getVpnCapabilitySetting
);
