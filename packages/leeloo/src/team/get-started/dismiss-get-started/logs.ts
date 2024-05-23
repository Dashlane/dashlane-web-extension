import { CallToAction, OnboardingTask, UserCallToActionEvent, UserCompleteTacOnboardingTaskEvent, } from '@dashlane/hermes';
import { logEvent } from 'libs/logs/logEvent';
export const logDismissGetStartedPage = () => {
    logEvent(new UserCompleteTacOnboardingTaskEvent({
        onboardingTask: OnboardingTask.CloseGuide,
    }));
};
export const logCancelClick = () => {
    logEvent(new UserCallToActionEvent({
        callToActionList: [CallToAction.Cancel, CallToAction.Confirm],
        chosenAction: CallToAction.Cancel,
        hasChosenNoAction: false,
    }));
};
export const logNavigateAway = () => {
    logEvent(new UserCallToActionEvent({
        callToActionList: [CallToAction.Cancel, CallToAction.Confirm],
        hasChosenNoAction: true,
    }));
};
export const logDismissClick = () => {
    logEvent(new UserCallToActionEvent({
        callToActionList: [CallToAction.Cancel, CallToAction.Confirm],
        chosenAction: CallToAction.Confirm,
        hasChosenNoAction: false,
    }));
};
