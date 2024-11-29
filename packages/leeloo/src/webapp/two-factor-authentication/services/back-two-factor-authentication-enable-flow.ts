import { carbonConnector } from "../../../libs/carbon/connector";
export const backTwoFactorAuthenticationEnableFlow = async () => {
  const result = await carbonConnector.backTwoFactorAuthenticationEnableFlow(
    null
  );
  return result;
};
