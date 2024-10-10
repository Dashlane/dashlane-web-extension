import { TwoFactorAuthenticationEnableFlowStageData } from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type TwoFactorAuthenticationEnableLiveQueries = {
  liveTwoFactorAuthenticationEnableStage: LiveQuery<
    void,
    TwoFactorAuthenticationEnableFlowStageData
  >;
};
