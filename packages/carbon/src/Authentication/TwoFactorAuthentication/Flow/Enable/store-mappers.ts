import { TwoFactorAuthenticationEnableFlowStoreState } from "Authentication/TwoFactorAuthentication/Flow/Enable/Store";
export const startTwoFactorAuthenticationEnableStoreMapper =
  (): TwoFactorAuthenticationEnableFlowStoreState => {
    return {
      stage: undefined,
      stageData: undefined,
      flowData: undefined,
    };
  };
export const endTwoFactorAuthenticationEnableStoreMapper =
  (): TwoFactorAuthenticationEnableFlowStoreState => {
    return { stage: undefined, stageData: undefined, flowData: undefined };
  };
