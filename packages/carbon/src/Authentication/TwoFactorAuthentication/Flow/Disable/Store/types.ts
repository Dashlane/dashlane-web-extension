import { Action } from "Store";
import { AuthenticationCode as AuthenticationErrorCode } from "@dashlane/communication";
import { UPDATE_TWO_FACTOR_AUTHENTICATION_DISABLE_STAGE } from "Authentication/TwoFactorAuthentication/Flow/Disable/Store/constants";
export type TwoFactorAuthenticationDisableFlowData = {
  otpType: number;
  logoutRequired?: boolean;
};
interface TwoFactorAuthenticationDisableUpdateStageUpdateAction extends Action {
  type: typeof UPDATE_TWO_FACTOR_AUTHENTICATION_DISABLE_STAGE;
  data: TwoFactorAuthenticationDisableFlowStoreState;
}
interface TwoFactorAuthenticationDisableUpdateStageStopAction extends Action {
  type: typeof UPDATE_TWO_FACTOR_AUTHENTICATION_DISABLE_STAGE;
}
export type TwoFactorAuthenticationDisableUpdateStageAction =
  | TwoFactorAuthenticationDisableUpdateStageStopAction
  | TwoFactorAuthenticationDisableUpdateStageUpdateAction;
interface TwoFactorAuthenticationDisableBase {
  readonly success: boolean;
}
export interface TwoFactorAuthenticationDisableAuthenticationCode
  extends TwoFactorAuthenticationDisableBase {
  readonly error: {
    code: AuthenticationErrorCode;
    message?: string;
  };
}
export type TwoFactorAuthenticationDisableStageData =
  | TwoFactorAuthenticationDisableAuthenticationCode
  | TwoFactorAuthenticationDisableBase;
export interface TwoFactorAuthenticationDisableFlowStoreState {
  stage: string;
  stageData?: TwoFactorAuthenticationDisableStageData;
  flowData?: TwoFactorAuthenticationDisableFlowData;
}
