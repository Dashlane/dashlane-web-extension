import { TwoFactorAuthenticationFlowStageData } from "@dashlane/communication";
import { State } from "Store";
import { TwoFactorAuthenticationDisableFlowConfig } from "Authentication/TwoFactorAuthentication/Flow/Disable/config";
import { TwoFactorAuthenticationDisableFlowData } from "./types";
export const getTwoFactorAuthenticationDisableStageData = (
  state: State
): TwoFactorAuthenticationFlowStageData => {
  const { stage } = state.userSession.twoFactorAuthenticationDisableFlow;
  const viewMapper =
    TwoFactorAuthenticationDisableFlowConfig?.[stage]?.viewMapper;
  return {
    stage,
    viewData: viewMapper ? viewMapper(state) : undefined,
  };
};
export const getTwoFactorAuthenticationDisableFlowData = (
  state: State
): TwoFactorAuthenticationDisableFlowData => {
  const { flowData } = state.userSession.twoFactorAuthenticationDisableFlow;
  return flowData;
};
