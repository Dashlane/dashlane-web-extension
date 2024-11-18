import { LoginStepInfo } from "@dashlane/communication";
import { State } from "Store";
export const loginStepInfoSelector = (state: State): LoginStepInfo => {
  const loginStepInfo = state.userSession.localSettings.loginStepInfo;
  return loginStepInfo?.step ? loginStepInfo : null;
};
