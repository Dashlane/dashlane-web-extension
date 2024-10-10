import {
  TwoFactorAuthenticationEnableFlowStoreState,
  TwoFactorAuthenticationEnableUpdateStageAction,
} from "Authentication/TwoFactorAuthentication/Flow/Enable/Store/types";
import { UPDATE_TWO_FACTOR_AUTHENTICATION_ENABLE_STAGE } from "Authentication/TwoFactorAuthentication/Flow/Enable/Store/actions";
export const getEmptyTwoFactorAuthenticationEnable =
  (): TwoFactorAuthenticationEnableFlowStoreState => ({
    stage: undefined,
  });
export const twoFactorAuthenticationEnableFlow = (
  state = getEmptyTwoFactorAuthenticationEnable(),
  action: TwoFactorAuthenticationEnableUpdateStageAction
) => {
  switch (action.type) {
    case UPDATE_TWO_FACTOR_AUTHENTICATION_ENABLE_STAGE:
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
};
