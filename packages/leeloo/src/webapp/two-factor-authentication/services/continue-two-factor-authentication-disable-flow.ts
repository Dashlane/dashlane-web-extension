import type { TwoFactorAuthenticationFlowStageRequest } from "@dashlane/communication";
import { carbonConnector } from "../../../libs/carbon/connector";
export const continueTwoFactorAuthenticationDisableFlow = async (
  params: TwoFactorAuthenticationFlowStageRequest = null
) => {
  const result =
    await carbonConnector.continueTwoFactorAuthenticationDisableFlow(params);
  return result;
};
