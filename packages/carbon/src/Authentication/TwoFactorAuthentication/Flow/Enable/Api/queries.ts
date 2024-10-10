import { TwoFactorAuthenticationEnableFlowStageData } from "@dashlane/communication";
import { Query } from "Shared/Api";
export type TwoFactorAuthenticationEnableQueries = {
  getTwoFactorAuthenticationEnableStage: Query<
    void,
    TwoFactorAuthenticationEnableFlowStageData
  >;
};
