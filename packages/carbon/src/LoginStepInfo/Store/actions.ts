import { AllowedOngoingLoginStep } from "@dashlane/communication";
import { Action } from "Store";
export const UPDATE_LOGIN_STEP_INFO_LOGIN = "UPDATE_LOGIN_STEP_INFO_LOGIN";
export const UPDATE_LOGIN_STEP_INFO_STEP = "UPDATE_LOGIN_STEP_INFO_STEP";
export const RESET_LOGIN_STEP_INFO = "RESET_LOGIN_STEP_INFO";
export interface UpdateLoginStepInfoLoginAction extends Action {
  type: typeof UPDATE_LOGIN_STEP_INFO_LOGIN;
  login: string;
}
export interface UpdateLoginStepInfoStepAction extends Action {
  type: typeof UPDATE_LOGIN_STEP_INFO_STEP;
  step: AllowedOngoingLoginStep;
}
export interface ResetLoginStepInfoAction extends Action {
  type: typeof RESET_LOGIN_STEP_INFO;
}
export const updateLoginStepInfoLogin = (
  login: string
): UpdateLoginStepInfoLoginAction => ({
  type: UPDATE_LOGIN_STEP_INFO_LOGIN,
  login,
});
export const updateLoginStepInfoStep = (
  step: AllowedOngoingLoginStep
): UpdateLoginStepInfoStepAction => ({
  type: UPDATE_LOGIN_STEP_INFO_STEP,
  step,
});
export const resetLoginStepInfo = (): ResetLoginStepInfoAction => ({
  type: RESET_LOGIN_STEP_INFO,
});
export type LoginStepInfoAction =
  | UpdateLoginStepInfoLoginAction
  | UpdateLoginStepInfoStepAction
  | ResetLoginStepInfoAction;
