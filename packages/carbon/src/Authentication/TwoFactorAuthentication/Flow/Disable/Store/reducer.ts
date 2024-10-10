import {
  TwoFactorAuthenticationDisableFlowStoreState,
  TwoFactorAuthenticationDisableUpdateStageAction,
} from "Authentication/TwoFactorAuthentication/Flow/Disable/Store/types";
import { UPDATE_TWO_FACTOR_AUTHENTICATION_DISABLE_STAGE } from "Authentication/TwoFactorAuthentication/Flow/Disable/Store/constants";
export const getEmptyTwoFactorAuthenticationDisable =
  (): TwoFactorAuthenticationDisableFlowStoreState => ({
    stage: undefined,
  });
export const twoFactorAuthenticationDisableFlow = (
  state = getEmptyTwoFactorAuthenticationDisable(),
  action: TwoFactorAuthenticationDisableUpdateStageAction
) => {
  switch (action.type) {
    case UPDATE_TWO_FACTOR_AUTHENTICATION_DISABLE_STAGE:
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
};
