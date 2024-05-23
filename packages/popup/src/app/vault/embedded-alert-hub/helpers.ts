import { PremiumStatus, UserMessage, UserMessageTypes, WebOnboardingLeelooStep, WebOnboardingModeEvent, WebOnboardingPopoverStep, } from '@dashlane/communication';
import { isPremiumTrialExpired } from 'libs/api';
import { PaymentFailureNotificationStatus } from 'libs/api/types';
import { GET_PREMIUM_URL } from 'libs/externalUrls';
import { getUrlGivenQuery } from 'libs/getUrlGivenQuery';
const hasTrialExpiredUserMessageDismissed = (messages: UserMessage[]): boolean => {
    return messages.some((message) => message.type === UserMessageTypes.TRIAL_EXPIRED && message.dismissedAt);
};
interface ShouldDisplayOnboardingAlertParams {
    webOnboardingMode: WebOnboardingModeEvent | null;
}
const shouldDisplayOnboardingAlert = ({ webOnboardingMode, }: ShouldDisplayOnboardingAlertParams): boolean => {
    if (!webOnboardingMode || !webOnboardingMode.flowLoginCredentialOnWeb) {
        return false;
    }
    if (webOnboardingMode.leelooStep ===
        WebOnboardingLeelooStep.SHOW_LOGIN_USING_EXTENSION_NOTIFICATION ||
        webOnboardingMode.popoverStep ===
            WebOnboardingPopoverStep.SHOW_LOGIN_NOTIFICATION) {
        return true;
    }
    return false;
};
export enum AlertName {
    None = 'none',
    MasterPasswordLeak = 'masterPasswordLeak',
    MasterPasswordWeak = 'masterPasswordWeak',
    Onboarding = 'onboarding',
    PaymentFailureChurned = 'paymentFailureChurned',
    PaymentFailureChurning = 'paymentFailureChurning',
    Premium = 'premium',
    PasswordLimit = 'passwordLimit',
    PasswordLimitAlmostReached = 'passwordLimitImpending'
}
export type Alert = AlertName | null;
interface GetAlertParams {
    messages: UserMessage[];
    paymentFailureNotification: PaymentFailureNotificationStatus;
    shouldDisplayMasterPasswordLeak: boolean;
    shouldDisplayMasterPasswordWeak: boolean;
    passwordLimit: {
        shouldDisplayPasswordLimitAlmostReachedBanner: boolean;
        shouldDisplayPasswordLimitBanner: boolean;
        passwordsLeft?: number;
    };
    webOnboardingMode: WebOnboardingModeEvent | null;
    premiumStatus: PremiumStatus;
}
export function getAlert({ messages, paymentFailureNotification, shouldDisplayMasterPasswordLeak, shouldDisplayMasterPasswordWeak, passwordLimit, webOnboardingMode, premiumStatus, }: GetAlertParams): Alert {
    if (shouldDisplayOnboardingAlert({ webOnboardingMode })) {
        return AlertName.Onboarding;
    }
    if (shouldDisplayMasterPasswordLeak) {
        return AlertName.MasterPasswordLeak;
    }
    if (shouldDisplayMasterPasswordWeak) {
        return AlertName.MasterPasswordWeak;
    }
    if (paymentFailureNotification === PaymentFailureNotificationStatus.Churning) {
        return AlertName.PaymentFailureChurning;
    }
    if (paymentFailureNotification === PaymentFailureNotificationStatus.Churned) {
        return AlertName.PaymentFailureChurned;
    }
    if (passwordLimit.shouldDisplayPasswordLimitBanner) {
        return AlertName.PasswordLimit;
    }
    if (passwordLimit.shouldDisplayPasswordLimitAlmostReachedBanner) {
        return AlertName.PasswordLimitAlmostReached;
    }
    if (isPremiumTrialExpired({ premiumStatus }) &&
        !hasTrialExpiredUserMessageDismissed(messages)) {
        return AlertName.Premium;
    }
    return AlertName.None;
}
export const getSubscriptionUrl = (subscriptionCode?: string | null): string => {
    const utmSource = 'webapp';
    if (subscriptionCode === null || subscriptionCode === undefined) {
        return getUrlGivenQuery(GET_PREMIUM_URL, { utm_source: utmSource });
    }
    return getUrlGivenQuery(GET_PREMIUM_URL, {
        subCode: subscriptionCode,
        utm_source: utmSource,
    });
};
