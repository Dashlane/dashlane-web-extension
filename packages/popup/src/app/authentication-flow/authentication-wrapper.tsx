import React from "react";
import { useIsNewAuthenticationFlowDisabled } from "../../libs/api/killswitch/useIsNewAuthenticationFlowDisabled";
import { EXT_NG_AUTHENTICATION_FLOW_KEY } from "../../libs/local-storage-constants";
import { LegacyLoginWrapper } from "../login/legacy-login-wrapper";
import { useLoginDeviceLimitFlow } from "../login/DeviceLimitFlow";
import { AuthenticationFlowWrapper } from "./authentication-flow-wrapper";
export const AuthenticationWrapper = ({
  children,
}: React.PropsWithChildren<Record<never, never>>) => {
  const { loading, data: isKillSwitchOn } =
    useIsNewAuthenticationFlowDisabled();
  const deviceLimitFlow = useLoginDeviceLimitFlow();
  const extngLoginFlowOption = window.localStorage.getItem(
    EXT_NG_AUTHENTICATION_FLOW_KEY
  );
  const isForceLoginFlowFallbackOptionEnabled =
    extngLoginFlowOption && extngLoginFlowOption === "true";
  const isNewLoginFlowEnabled =
    !isForceLoginFlowFallbackOptionEnabled &&
    !isKillSwitchOn &&
    !deviceLimitFlow;
  React.useEffect(() => {
    console.log(
      "[popup] New authentication flow killswitch state",
      `(loading: ${String(loading)})`,
      `(state: ${JSON.stringify(isKillSwitchOn)})`
    );
  }, [loading, isKillSwitchOn]);
  React.useEffect(() => {
    console.log(
      "[popup] Device limit flow state",
      `(deviceLimitFlow: ${JSON.stringify(deviceLimitFlow)})`
    );
  }, [deviceLimitFlow]);
  React.useEffect(() => {
    console.log(
      "[popup] New login flow enabled",
      `(isNewLoginFlowEnabled: ${String(isNewLoginFlowEnabled)})`
    );
  }, [isNewLoginFlowEnabled]);
  if (loading) {
    return null;
  }
  const AuthenticationFlowComponent = isNewLoginFlowEnabled
    ? AuthenticationFlowWrapper
    : LegacyLoginWrapper;
  return <AuthenticationFlowComponent>{children}</AuthenticationFlowComponent>;
};
