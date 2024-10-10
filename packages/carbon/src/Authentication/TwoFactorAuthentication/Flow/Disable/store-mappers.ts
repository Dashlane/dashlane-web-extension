import { StoreService } from "Store";
import { otpTypeSelector } from "Authentication/selectors";
import { TwoFactorAuthenticationDisableFlowStoreState } from "Authentication/TwoFactorAuthentication/Flow/Disable/Store";
export const startTwoFactorAuthenticationDisableStoreMapper = (
  storeService: StoreService
): TwoFactorAuthenticationDisableFlowStoreState => {
  const state = storeService.getState();
  return {
    stage: undefined,
    stageData: undefined,
    flowData: { otpType: otpTypeSelector(state) },
  };
};
export const endTwoFactorAuthenticationDisableStoreMapper =
  (): TwoFactorAuthenticationDisableFlowStoreState => {
    return { stage: undefined, stageData: undefined, flowData: undefined };
  };
