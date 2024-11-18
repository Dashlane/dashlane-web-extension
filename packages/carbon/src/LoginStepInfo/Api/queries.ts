import { LoginStepInfo } from "@dashlane/communication";
import { Query } from "Shared/Api";
export type LoginStepInfoQueries = {
  getLoginStepInfo: Query<void, LoginStepInfo>;
};
