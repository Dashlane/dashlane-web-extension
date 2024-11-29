import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../libs/carbon/connector";
import type { TwoFactorAuthenticationFlowStageData } from "@dashlane/communication";
export function useTwoFactorAuthenticationDisableFlow(): TwoFactorAuthenticationFlowStageData | null {
  const flowData = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getTwoFactorAuthenticationDisableStage,
      },
      liveConfig: {
        live: carbonConnector.liveTwoFactorAuthenticationDisableStage,
      },
    },
    []
  );
  return flowData.status === DataStatus.Success ? flowData.data : null;
}
