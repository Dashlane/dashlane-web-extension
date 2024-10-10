import {
  TwoFactorAuthenticationEnableFlowStoreState,
  TwoFactorAuthenticationEnableUpdateStageAction,
} from "Authentication/TwoFactorAuthentication/Flow/Enable/Store/types";
export const UPDATE_TWO_FACTOR_AUTHENTICATION_ENABLE_STAGE =
  "UPDATE_TWO_FACTOR_AUTHENTICATION_ENABLE_STAGE";
export const updateTwoFactorAuthenticationStage = (
  data: TwoFactorAuthenticationEnableFlowStoreState
): TwoFactorAuthenticationEnableUpdateStageAction => ({
  type: UPDATE_TWO_FACTOR_AUTHENTICATION_ENABLE_STAGE,
  data,
});
export const stopTwoFactorAuthenticationStage =
  (): TwoFactorAuthenticationEnableUpdateStageAction => ({
    type: UPDATE_TWO_FACTOR_AUTHENTICATION_ENABLE_STAGE,
    data: { stage: undefined },
  });
