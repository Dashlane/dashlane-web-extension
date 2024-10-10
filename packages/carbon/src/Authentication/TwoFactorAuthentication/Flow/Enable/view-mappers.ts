import {
  CountryCode,
  TwoFactorAuthenticationEnableFlowViewMappers,
} from "@dashlane/communication";
import { State } from "Store";
import { TwoFactorAuthenticationEnableErrorResult } from "Authentication/TwoFactorAuthentication/Flow/Enable/Store/types";
import { makeSafeCountry } from "Libs/DashlaneApi";
const TOTAL_STEPS = 5;
export const enableTwoFactorAuthenticationTypeViewMapper =
  (): TwoFactorAuthenticationEnableFlowViewMappers => {
    return { currentStep: 1, totalSteps: TOTAL_STEPS };
  };
export const enableTwoFactorAuthenticationBackupPhoneViewMapper = (
  state: State
): TwoFactorAuthenticationEnableFlowViewMappers => {
  const countryCode = makeSafeCountry(
    state.device.platform.location.country
  ) as CountryCode;
  const { stageData } = state.userSession.twoFactorAuthenticationEnableFlow;
  return {
    currentStep: 2,
    totalSteps: TOTAL_STEPS,
    countryCode,
    ...stageData,
  };
};
export const enableTwoFactorAuthenticationQRCodeViewMapper = (
  state: State
): TwoFactorAuthenticationEnableFlowViewMappers => {
  const { uri, seed } =
    state.userSession.twoFactorAuthenticationEnableFlow.flowData;
  return {
    currentStep: 3,
    totalSteps: TOTAL_STEPS,
    uri,
    seed,
  };
};
export const enableTwoFactorAuthenticationCodeViewMapper = (
  state: State
): TwoFactorAuthenticationEnableFlowViewMappers => {
  const { stageData } = state.userSession.twoFactorAuthenticationEnableFlow;
  if (stageData) {
    const { error } = state.userSession.twoFactorAuthenticationEnableFlow
      .stageData as TwoFactorAuthenticationEnableErrorResult;
    return { currentStep: 4, totalSteps: TOTAL_STEPS, error };
  }
  return { currentStep: 4, totalSteps: TOTAL_STEPS };
};
export const enableTwoFactorAuthenticationBackupCodesViewMapper = (
  state: State
): TwoFactorAuthenticationEnableFlowViewMappers => {
  const { recoveryKeys } =
    state.userSession.twoFactorAuthenticationEnableFlow.flowData;
  return { currentStep: 5, totalSteps: TOTAL_STEPS, recoveryKeys };
};
