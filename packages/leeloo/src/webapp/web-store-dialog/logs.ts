import { CallToAction, PageView, UserCallToActionEvent, } from '@dashlane/hermes';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { RateFormResponse } from './types';
export const logRateFormPageView = () => logPageView(PageView.Review);
export const logRateUsChromeStorePageView = () => logPageView(PageView.ReviewRateUsChromeWebStore);
export const logRateFormResponse = (response: RateFormResponse) => {
    switch (response) {
        case RateFormResponse.Bad:
            logEvent(new UserCallToActionEvent({
                callToActionList: [
                    CallToAction.ReviewBad,
                    CallToAction.ReviewOk,
                    CallToAction.ReviewGreat,
                ],
                hasChosenNoAction: false,
                chosenAction: CallToAction.ReviewBad,
            }));
            break;
        case RateFormResponse.Great:
            logEvent(new UserCallToActionEvent({
                callToActionList: [
                    CallToAction.ReviewBad,
                    CallToAction.ReviewOk,
                    CallToAction.ReviewGreat,
                ],
                hasChosenNoAction: false,
                chosenAction: CallToAction.ReviewGreat,
            }));
            break;
        case RateFormResponse.Okay:
            logEvent(new UserCallToActionEvent({
                callToActionList: [
                    CallToAction.ReviewBad,
                    CallToAction.ReviewOk,
                    CallToAction.ReviewGreat,
                ],
                hasChosenNoAction: false,
                chosenAction: CallToAction.ReviewOk,
            }));
            break;
    }
};
export const logRateFormDismissAction = () => {
    logEvent(new UserCallToActionEvent({
        callToActionList: [
            CallToAction.ReviewBad,
            CallToAction.ReviewOk,
            CallToAction.ReviewGreat,
        ],
        hasChosenNoAction: true,
    }));
};
export const logG2RatingWebsiteOpen = () => logEvent(new UserCallToActionEvent({
    callToActionList: [CallToAction.OpenG2RatingWebsite],
    hasChosenNoAction: false,
    chosenAction: CallToAction.OpenG2RatingWebsite,
}));
export const logChromeStoreOpen = () => logEvent(new UserCallToActionEvent({
    callToActionList: [CallToAction.OpenChromeWebStore],
    hasChosenNoAction: false,
    chosenAction: CallToAction.OpenChromeWebStore,
}));
export const logChromeStoreDismissAction = () => {
    logEvent(new UserCallToActionEvent({
        callToActionList: [CallToAction.OpenChromeWebStore],
        hasChosenNoAction: true,
    }));
};
export const logG2RatingWebsiteDismissAction = () => {
    logEvent(new UserCallToActionEvent({
        callToActionList: [CallToAction.OpenG2RatingWebsite],
        hasChosenNoAction: true,
    }));
};
