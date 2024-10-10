import { TwoFactorAuthenticationFlowStageData } from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type TwoFactorAuthenticationDisableLiveQueries = {
  liveTwoFactorAuthenticationDisableStage: LiveQuery<
    void,
    TwoFactorAuthenticationFlowStageData
  >;
};
