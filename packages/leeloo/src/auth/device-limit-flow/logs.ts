import { CallToAction, PageView, UserCallToActionEvent, } from '@dashlane/hermes';
import { logEvent, logPageView } from 'libs/logs/logEvent';
export const logPageViewPaywallDeviceSyncLimit = () => logPageView(PageView.PaywallDeviceSyncLimit);
export const dismissUnlinkDeviceLog = () => {
    logEvent(new UserCallToActionEvent({
        callToActionList: [CallToAction.Unlink],
        hasChosenNoAction: true,
    }));
};
export const unlinkPreiousDeviceLog = () => {
    logEvent(new UserCallToActionEvent({
        callToActionList: [CallToAction.Unlink, CallToAction.AllOffers],
        hasChosenNoAction: false,
        chosenAction: CallToAction.Unlink,
    }));
};
export const confirmUnlinkPreviousDeviceLog = () => {
    logEvent(new UserCallToActionEvent({
        callToActionList: [CallToAction.Unlink],
        hasChosenNoAction: false,
        chosenAction: CallToAction.Unlink,
    }));
};
export const logoutLogs = () => {
    logEvent(new UserCallToActionEvent({
        callToActionList: [CallToAction.Unlink, CallToAction.AllOffers],
        hasChosenNoAction: true,
    }));
};
export const upgradePremiumLog = () => {
    logEvent(new UserCallToActionEvent({
        callToActionList: [CallToAction.Unlink, CallToAction.AllOffers],
        hasChosenNoAction: false,
        chosenAction: CallToAction.AllOffers,
    }));
};
