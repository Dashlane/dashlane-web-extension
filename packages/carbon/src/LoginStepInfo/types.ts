import { LoginStepInfo } from "@dashlane/communication";
export interface LoginStepInfoState extends LoginStepInfo {
  validated: boolean;
}
