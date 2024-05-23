import { CallToAction, UserCallToActionEvent } from '@dashlane/hermes';
import { logEvent } from 'libs/logs/logEvent';
export const logSkipNowEvent = () => {
    logEvent(new UserCallToActionEvent({
        callToActionList: [CallToAction.Skip, CallToAction.InstallExtension],
        chosenAction: CallToAction.Skip,
        hasChosenNoAction: false,
    }));
};
export const logInstallEvent = () => {
    logEvent(new UserCallToActionEvent({
        callToActionList: [CallToAction.Skip, CallToAction.InstallExtension],
        chosenAction: CallToAction.InstallExtension,
        hasChosenNoAction: false,
    }));
};
export const logNavigateAwayEvent = () => {
    logEvent(new UserCallToActionEvent({
        callToActionList: [CallToAction.Skip, CallToAction.InstallExtension],
        hasChosenNoAction: true,
    }));
};
