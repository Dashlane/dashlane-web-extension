import { DataStatus, useCarbonEndpoint } from "@dashlane/carbon-api-consumers";
import { TwoFactorAuthenticationInfo } from "@dashlane/communication";
import { carbonConnector } from "../../../libs/carbon/connector";
export const useTwoFactorAuthenticationInfo = ():
  | TwoFactorAuthenticationInfo
  | undefined => {
  const twoFactorAuthenticationInfo = useCarbonEndpoint(
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
  if (twoFactorAuthenticationInfo.status === DataStatus.Success) {
    return twoFactorAuthenticationInfo.data;
  }
  return undefined;
};
