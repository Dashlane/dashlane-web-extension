import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { LoginStepInfo } from "@dashlane/communication";
import { carbonConnector } from "../../../carbonConnector";
export function useLoginStepInfo(): LoginStepInfo | undefined {
  const result = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getLoginStepInfo,
      },
      liveConfig: {
        live: carbonConnector.liveLoginStepInfo,
      },
    },
    []
  );
  return result.status === DataStatus.Success ? result.data : undefined;
}
