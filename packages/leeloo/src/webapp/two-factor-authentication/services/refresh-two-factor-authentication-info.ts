import { carbonConnector } from "../../../libs/carbon/connector";
export const refreshTwoFactorAuthenticationInfo = async () => {
  const result = await carbonConnector.refreshTwoFactorAuthenticationInfo();
  return result;
};
