import { TwoFactorAuthenticationFlowStageData } from "@dashlane/communication";
import { Query } from "Shared/Api";
export type TwoFactorAuthenticationDisableQueries = {
  getTwoFactorAuthenticationDisableStage: Query<
    void,
    TwoFactorAuthenticationFlowStageData
  >;
};
