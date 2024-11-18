import { LoginStepInfo } from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type LoginStepInfoLiveQueries = {
  liveLoginStepInfo: LiveQuery<void, LoginStepInfo>;
};
