import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../libs/carbon/connector";
import type { TwoFactorAuthenticationEnableFlowStageData } from "@dashlane/communication";
export function useTwoFactorAuthenticationEnableFlow(): TwoFactorAuthenticationEnableFlowStageData | null {
  const flowData = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getTwoFactorAuthenticationEnableStage,
      },
      liveConfig: {
        live: carbonConnector.liveTwoFactorAuthenticationEnableStage,
      },
    },
    []
  );
  return flowData.status === DataStatus.Success ? flowData.data : null;
}
