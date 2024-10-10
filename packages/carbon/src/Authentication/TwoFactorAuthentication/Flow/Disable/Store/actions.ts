import {
  TwoFactorAuthenticationDisableFlowStoreState,
  TwoFactorAuthenticationDisableUpdateStageAction,
} from "Authentication/TwoFactorAuthentication/Flow/Disable/Store/types";
import { UPDATE_TWO_FACTOR_AUTHENTICATION_DISABLE_STAGE } from "Authentication/TwoFactorAuthentication/Flow/Disable/Store/constants";
export const updateTwoFactorAuthenticationStage = (
  data: TwoFactorAuthenticationDisableFlowStoreState
): TwoFactorAuthenticationDisableUpdateStageAction => ({
  type: UPDATE_TWO_FACTOR_AUTHENTICATION_DISABLE_STAGE,
  data,
});
export const stopTwoFactorAuthenticationStage =
  (): TwoFactorAuthenticationDisableUpdateStageAction => ({
    type: UPDATE_TWO_FACTOR_AUTHENTICATION_DISABLE_STAGE,
    data: { stage: undefined },
  });
