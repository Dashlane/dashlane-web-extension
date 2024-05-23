import { logEvent } from 'libs/logs/logEvent';
import { FlowStep, FlowType, TwoFactorAuthenticationError, UserChangeTwoFactorAuthenticationSettingEvent, } from '@dashlane/hermes';
export const logTwoFactorAuthenticationEvent = (step: FlowStep, type: FlowType, error?: TwoFactorAuthenticationError): void => logEvent(new UserChangeTwoFactorAuthenticationSettingEvent({
    flowStep: step,
    flowType: type,
    errorName: error,
}));
