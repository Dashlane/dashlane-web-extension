import { TwoFactorAuthenticationEnableFlowStageData } from "@dashlane/communication";
import { State } from "Store";
import { TwoFactorAuthenticationEnableFlowConfig } from "Authentication/TwoFactorAuthentication/Flow/Enable/config";
import { TwoFactorAuthenticationEnableFlowData } from "Authentication/TwoFactorAuthentication/Flow/Enable/Store/types";
export const getTwoFactorAuthenticationEnableStageData = (
  state: State
): TwoFactorAuthenticationEnableFlowStageData => {
  const { stage } = state.userSession.twoFactorAuthenticationEnableFlow;
  const viewMapper =
    TwoFactorAuthenticationEnableFlowConfig?.[stage]?.viewMapper;
  const savedValues =
    state.userSession.twoFactorAuthenticationEnableFlow?.flowData?.savedValues;
  return {
    stage,
    viewData: viewMapper ? viewMapper(state) : undefined,
    savedValues,
  };
};
export const getTwoFactorAuthenticationEnableFlowData = (
  state: State
): TwoFactorAuthenticationEnableFlowData => {
  const { flowData } = state.userSession.twoFactorAuthenticationEnableFlow;
  return flowData;
};
