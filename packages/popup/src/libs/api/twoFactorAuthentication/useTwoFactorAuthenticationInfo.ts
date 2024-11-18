import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { carbonConnector } from "../../../carbonConnector";
export const useTwoFactorAuthenticationInfo = () => {
  const result = useCarbonEndpoint(
    {
      queryConfig: {
        query: carbonConnector.getTwoFactorAuthenticationInfo,
      },
      liveConfig: {
        live: carbonConnector.liveTwoFactorAuthenticationInfo,
      },
    },
    []
  );
  if (result.status === DataStatus.Success) {
    return result.data;
  }
  return undefined;
};
export const refreshTwoFactorAuthenticationInfo = async () => {
  const result = await carbonConnector.refreshTwoFactorAuthenticationInfo();
  return result;
};
