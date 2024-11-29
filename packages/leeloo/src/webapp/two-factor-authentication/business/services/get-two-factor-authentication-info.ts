import { TwoFactorAuthenticationInfo } from "@dashlane/communication";
import { carbonConnector } from "../../../../libs/carbon/connector";
export const getTwoFactorAuthenticationInfo =
  async (): Promise<TwoFactorAuthenticationInfo> => {
    return await carbonConnector.getTwoFactorAuthenticationInfo();
  };
