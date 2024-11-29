import { carbonConnector } from "../../../libs/carbon/connector";
export const startTwoFactorAuthenticationEnableFlow = async () => {
  const result = await carbonConnector.startTwoFactorAuthenticationEnableFlow(
    null
  );
  return result;
};
