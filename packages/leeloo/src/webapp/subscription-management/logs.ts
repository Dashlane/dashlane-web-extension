import { PremiumStatus } from '@dashlane/communication';
import { CallToAction, CancelPlanStep, FlowStep, SurveyAnswer, UserCancelPlanEvent, UserOpenPricingPageEvent, UserRestartPlanEvent, UserUpdatePaymentMethodEvent, } from '@dashlane/hermes';
import { logEvent } from 'libs/logs/logEvent';
import { getPlanBillingPeriod, getPlanNameForLogs } from 'libs/account/helpers';
export const logCancellationEvent = (cancelPlanStep: CancelPlanStep, premiumStatus: PremiumStatus, surveyAnswer?: SurveyAnswer) => {
    const planBillingPeriod = getPlanBillingPeriod(premiumStatus);
    const event = new UserCancelPlanEvent({
        cancelPlanStep,
        plan: getPlanNameForLogs(premiumStatus),
        planBillingPeriod,
        surveyAnswer,
    });
    logEvent(event);
};
export const logPlansPageEvent = (callToAction: CallToAction) => {
    logEvent(new UserOpenPricingPageEvent({ callToAction }));
};
export const logPlanRestartEvent = (premiumStatus: PremiumStatus) => {
    const planBillingPeriod = getPlanBillingPeriod(premiumStatus);
    const event = new UserRestartPlanEvent({
        plan: getPlanNameForLogs(premiumStatus),
        planBillingPeriod,
    });
    logEvent(event);
};
export const logUserUpdatePaymentMethodEvent = (premiumStatus: PremiumStatus) => {
    const planBillingPeriod = getPlanBillingPeriod(premiumStatus);
    logEvent(new UserUpdatePaymentMethodEvent({
        flowStep: FlowStep.Start,
        plan: getPlanNameForLogs(premiumStatus),
        planBillingPeriod,
    }));
};
