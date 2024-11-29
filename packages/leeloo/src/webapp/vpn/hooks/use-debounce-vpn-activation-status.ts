import { useEffect, useState } from "react";
import {
  VpnAccountStatus,
  VpnAccountStatusType,
} from "@dashlane/communication";
import { VPN_ACTIVATING_ANIMATION_DURATION } from "../helpers/animation-constants";
export enum VpnCredentialActivationStatus {
  ACTIVATING = "activating",
  INITIAL = "initial",
  INTERMEDIATE = "intermediate",
  ACTIVATED = "activated",
}
export const useDebounceVpnActivationStatus = (
  vpnCredential?: VpnAccountStatus | null
) => {
  const [debouncedStatus, setDebouncedStatus] = useState(
    VpnCredentialActivationStatus.INITIAL
  );
  const [timerId, setTimerId] = useState<number>();
  useEffect(() => {
    if (
      vpnCredential?.status === VpnAccountStatusType.Activated &&
      debouncedStatus === VpnCredentialActivationStatus.INITIAL
    ) {
      setDebouncedStatus(VpnCredentialActivationStatus.ACTIVATED);
    } else if (vpnCredential?.status === VpnAccountStatusType.Activating) {
      setDebouncedStatus(VpnCredentialActivationStatus.ACTIVATING);
    } else if (vpnCredential?.status === VpnAccountStatusType.NotFound) {
      setDebouncedStatus(VpnCredentialActivationStatus.INITIAL);
    }
    return;
  }, [vpnCredential?.status, debouncedStatus]);
  useEffect(() => {
    if (
      vpnCredential?.status === VpnAccountStatusType.Ready &&
      debouncedStatus === VpnCredentialActivationStatus.ACTIVATING
    ) {
      setDebouncedStatus(VpnCredentialActivationStatus.INTERMEDIATE);
      const id = window.setTimeout(() => {
        setTimerId(id);
        setDebouncedStatus(VpnCredentialActivationStatus.ACTIVATED);
      }, VPN_ACTIVATING_ANIMATION_DURATION);
    }
  }, [vpnCredential?.status, debouncedStatus]);
  useEffect(() => {
    if (timerId) {
      window.clearTimeout(timerId);
    }
  }, [timerId]);
  return {
    isInitial: () => debouncedStatus === VpnCredentialActivationStatus.INITIAL,
    isActivating: () =>
      debouncedStatus === VpnCredentialActivationStatus.ACTIVATING,
    isActivated: () =>
      debouncedStatus === VpnCredentialActivationStatus.ACTIVATED,
    isIntermediate: () =>
      debouncedStatus === VpnCredentialActivationStatus.INTERMEDIATE,
  };
};
