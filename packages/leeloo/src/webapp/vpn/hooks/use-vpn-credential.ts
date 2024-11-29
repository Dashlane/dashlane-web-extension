import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { VpnAccountStatus } from "@dashlane/communication";
import { carbonConnector } from "../../../libs/carbon/connector";
export const useVpnCredential = (): VpnAccountStatus | null => {
  const result = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getVpnAccount,
      },
      liveConfig: {
        live: carbonConnector.liveVpnAccount,
      },
    },
    []
  );
  return result.status === DataStatus.Success ? result.data : null;
};
