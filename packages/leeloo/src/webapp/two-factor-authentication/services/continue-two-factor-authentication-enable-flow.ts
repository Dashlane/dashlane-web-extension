import type { TwoFactorAuthenticationEnableFlowStageRequest, TwoFactorAuthenticationEnableFlowStageResult, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
export const continueTwoFactorAuthenticationEnableFlow = async (params: TwoFactorAuthenticationEnableFlowStageRequest = null): Promise<TwoFactorAuthenticationEnableFlowStageResult> => {
    const result = await carbonConnector.continueTwoFactorAuthenticationEnableFlow(params);
    return result;
};
